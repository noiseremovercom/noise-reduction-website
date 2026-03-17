# backend/src/python_scripts/audio_utils.py
import torch
import torchaudio
import numpy as np
import soundfile as sf
from pathlib import Path
from scipy import signal
from scipy.ndimage import median_filter

class AudioUtils:
    @staticmethod
    def load_audio(file_path, target_sr=48000):
        """Load audio and convert to mono if needed"""
        waveform, orig_sr = torchaudio.load(file_path)
        
        # Convert to mono if stereo
        if waveform.shape[0] > 1:
            waveform = torch.mean(waveform, dim=0, keepdim=True)
        
        # Resample if needed
        if orig_sr != target_sr:
            resampler = torchaudio.transforms.Resample(orig_sr, target_sr)
            waveform = resampler(waveform)
        
        return waveform, target_sr
    
    @staticmethod
    def save_audio(waveform, file_path, sr=48000):
        """Save audio tensor to file"""
        torchaudio.save(file_path, waveform, sr)
    
    @staticmethod
    def tensor_to_numpy(tensor):
        """Convert torch tensor to numpy array"""
        return tensor.squeeze().cpu().numpy().copy()
    
    @staticmethod
    def numpy_to_tensor(array):
        """Convert numpy array to torch tensor"""
        array_copy = array.copy()
        if len(array_copy.shape) == 1:
            array_copy = array_copy[np.newaxis, :]
        return torch.from_numpy(array_copy).float()
    
    @staticmethod
    def calculate_snr(original, enhanced):
        """Calculate Signal-to-Noise Ratio improvement"""
        # Make sure arrays are the same length
        min_len = min(len(original), len(enhanced))
        original = original[:min_len]
        enhanced = enhanced[:min_len]
        
        # Calculate noise and SNR
        noise = original - enhanced
        snr = 10 * np.log10(np.sum(original**2) / (np.sum(noise**2) + 1e-10))
        return snr
    
    @staticmethod
    def apply_fade(audio_numpy, fade_duration_ms=5, sample_rate=48000):
        """Simple fade to remove clicks"""
        fade_samples = int(fade_duration_ms * sample_rate / 1000)
        audio_copy = audio_numpy.copy()
        
        if len(audio_copy) > fade_samples * 2:
            fade_in = np.linspace(0, 1, fade_samples)
            audio_copy[:fade_samples] *= fade_in
            fade_out = np.linspace(1, 0, fade_samples)
            audio_copy[-fade_samples:] *= fade_out
        
        return audio_copy
    
    @staticmethod
    def remove_dotted_artifacts(audio_numpy, threshold=0.01):
        """
        Specifically target and remove the "dotted glitch" sounds
        These are usually short, sharp spikes in the audio
        """
        audio_copy = audio_numpy.copy()
        
        # Detect spikes (sudden changes)
        diff = np.abs(np.diff(audio_copy))
        spike_indices = np.where(diff > threshold * np.max(np.abs(audio_copy)))[0]
        
        # Remove spikes by interpolation
        for idx in spike_indices:
            if idx > 0 and idx < len(audio_copy) - 1:
                audio_copy[idx] = (audio_copy[idx-1] + audio_copy[idx+1]) / 2
        
        # Apply light median filter to smooth remaining artifacts
        audio_copy = median_filter(audio_copy, size=3)
        
        return audio_copy
    
    @staticmethod
    def gentle_smoothing(audio_numpy, strength=0.3):
        """
        Very gentle smoothing that preserves voice while removing artifacts
        """
        # Create a smoothed version
        smoothed = median_filter(audio_numpy, size=5)
        
        # Blend original with smoothed (70% original, 30% smoothed)
        blended = audio_numpy * (1 - strength) + smoothed * strength
        
        return blended
    
    @staticmethod
    def adaptive_noise_gate(audio_numpy, threshold_multiplier=0.1):
        """
        Adaptive noise gate that only removes very low-level noise
        """
        audio_copy = audio_numpy.copy()
        
        # Calculate adaptive threshold based on audio level
        rms = np.sqrt(np.mean(audio_copy**2))
        threshold = rms * threshold_multiplier
        
        # Only apply gate to very quiet sections
        mask = np.abs(audio_copy) < threshold
        audio_copy[mask] = audio_copy[mask] * 0.3  # Reduce, not remove
        
        return audio_copy