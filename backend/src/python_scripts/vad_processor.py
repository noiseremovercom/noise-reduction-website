# backend/src/python_scripts/vad_processor.py
import webrtcvad
import numpy as np
import torch
from audio_utils import AudioUtils

audio_utils = AudioUtils()

class VADProcessor:
    def __init__(self, aggressiveness=1, sample_rate=48000, frame_duration=30):
        """
        Perfect balance VAD - eliminates glitches without robotic voice
        aggressiveness: 1 (balanced)
        """
        self.vad = webrtcvad.Vad(aggressiveness)
        self.sample_rate = sample_rate
        self.frame_duration = frame_duration
        self.frame_size = int(sample_rate * frame_duration / 1000)
        
        # Optimal crossfade (15ms) - eliminates glitches but preserves transients
        self.crossfade_samples = int(0.015 * sample_rate)
        
        # Hangover to prevent rapid switching
        self.hangover_frames = 2
        self.speech_hangover = 0
        self.nonspeech_hangover = 0
        
    def is_speech(self, audio_chunk):
        if len(audio_chunk) != self.frame_size * 2:
            return False
        return self.vad.is_speech(audio_chunk, self.sample_rate)
    
    def process_with_vad(self, waveform_tensor, enhance_func, **kwargs):
        """Perfect balance VAD processing"""
        audio_numpy = audio_utils.tensor_to_numpy(waveform_tensor)
        audio_int16 = (audio_numpy * 32768).astype(np.int16)
        
        num_frames = len(audio_int16) // self.frame_size
        enhanced_frames = []
        speech_flags = []
        
        # First pass: detect speech with hangover
        for i in range(num_frames):
            start = i * self.frame_size
            end = start + self.frame_size
            frame = audio_int16[start:end]
            is_speech = self.is_speech(frame.tobytes())
            
            # Apply hangover to smooth transitions
            if is_speech:
                self.speech_hangover = self.hangover_frames
                self.nonspeech_hangover = 0
                speech_flags.append(True)
            else:
                if self.speech_hangover > 0:
                    self.speech_hangover -= 1
                    speech_flags.append(True)
                else:
                    self.nonspeech_hangover += 1
                    # Only mark as non-speech after consistent silence
                    speech_flags.append(self.nonspeech_hangover < 2)
        
        # Process frames with optimal blending
        for i in range(num_frames):
            start = i * self.frame_size
            end = start + self.frame_size
            frame = audio_int16[start:end]
            frame_float = frame.astype(np.float32) / 32768
            frame_tensor = torch.from_numpy(frame_float).unsqueeze(0)
            
            # Apply enhancement to all frames (single pass)
            enhanced_frame = enhance_func(frame_tensor, **kwargs)
            enhanced_numpy = audio_utils.tensor_to_numpy(enhanced_frame)
            
            # Optimal blending at transitions
            if i > 0 and speech_flags[i] != speech_flags[i-1]:
                # Gradual 15ms crossfade
                prev_frame = enhanced_frames[-1]
                blend_len = min(self.crossfade_samples, len(enhanced_numpy))
                
                # Raised cosine crossfade (smoother than linear)
                for j in range(blend_len):
                    # Raised cosine window
                    alpha = 0.5 * (1 - np.cos(np.pi * j / blend_len))
                    enhanced_numpy[j] = prev_frame[-blend_len + j] * (1 - alpha) + enhanced_numpy[j] * alpha
            
            enhanced_frames.append(enhanced_numpy)
        
        enhanced_audio = np.concatenate(enhanced_frames)
        return audio_utils.numpy_to_tensor(enhanced_audio)