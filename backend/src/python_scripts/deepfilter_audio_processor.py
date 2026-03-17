# backend/src/python_scripts/deepfilter_audio_processor.py
import torch
import torchaudio
import os
import sys
import numpy as np
from pathlib import Path
import warnings
warnings.filterwarnings('ignore')

class DeepFilterAudioProcessor:
    def __init__(self, device=None):
        """
        Initialize DeepFilterNet for professional audio noise reduction
        Now with version-specific processing (SE v1.0, NR v4.0, NR v2.4, NR v2.1.1)
        """
        self.device = device or ("cuda" if torch.cuda.is_available() else "cpu")
        self.initialized = False
        self.model = None
        self.df_state = None
        self.enhance_func = None
        self.sample_rate = 48000  # DeepFilterNet requires 48kHz
        
    def initialize(self):
        """Load DeepFilterNet model"""
        try:
            from df import enhance, init_df
            
            print("[INFO] Loading DeepFilterNet model...")
            
            # Load the model (this returns model, df_state, _)
            self.model, self.df_state, _ = init_df()
            
            # Store the enhance function for later use
            self.enhance_func = enhance
            
            self.initialized = True
            print("[SUCCESS] DeepFilterNet loaded successfully")
            
        except ImportError:
            print("[ERROR] deepfilternet not installed. Run: pip install --upgrade deepfilternet")
            raise
        except Exception as e:
            print(f"[ERROR] Failed to load DeepFilterNet: {e}")
            raise
    
    def apply_post_filter(self, audio, strength=1.0):
        """
        Apply post-filter to attenuate very noisy sections
        Used by SE v1.0 and NR v4.0 for extra clarity
        """
        # Simple spectral subtraction-like post-filter
        # Calculate energy in frequency bands
        spec = torch.stft(audio.squeeze(0), n_fft=512, hop_length=128, return_complex=True)
        mag = torch.abs(spec)
        
        # Estimate noise floor (lowest 20% of frames)
        noise_est = torch.quantile(mag, 0.2, dim=1, keepdim=True)
        
        # Apply soft mask
        mask = torch.sigmoid((mag - noise_est * 1.5) * strength)
        spec_clean = spec * mask
        
        # Invert back to time domain
        audio_clean = torch.istft(spec_clean, n_fft=512, hop_length=128)
        return audio_clean.unsqueeze(0)
    
    def process_file(self, input_path, output_path, strength=1.0, postfilter=False, passes=1, volume_boost=1.0):
        """
        Process a single audio file with version-specific parameters
        
        Args:
            input_path: path to input audio file
            output_path: path to save processed audio
            strength: processing strength (0.5-1.5)
            postfilter: whether to apply post-filter
            passes: number of enhancement passes
            volume_boost: final volume adjustment
        """
        if not self.initialized:
            self.initialize()
            
        try:
            print(f"[INFO] Processing: {os.path.basename(input_path)}")
            print(f"[INFO] Version settings: strength={strength}, postfilter={postfilter}, passes={passes}, boost={volume_boost}")
            
            # Check if input file exists
            if not os.path.exists(input_path):
                print(f"[ERROR] Input file not found: {input_path}")
                return False
            
            # Load audio
            waveform, sr = torchaudio.load(input_path)
            original_duration = waveform.shape[1] / sr
            print(f"[INFO] Loaded: {sr}Hz, shape={waveform.shape}")
            
            # Convert to mono if stereo
            if waveform.shape[0] > 1:
                print(f"[INFO] Converting stereo to mono")
                waveform = torch.mean(waveform, dim=0, keepdim=True)
            
            # Resample to 48kHz if needed
            if sr != self.sample_rate:
                print(f"[INFO] Resampling from {sr}Hz to {self.sample_rate}Hz")
                resampler = torchaudio.transforms.Resample(sr, self.sample_rate)
                waveform = resampler(waveform)
            
            # Apply DeepFilterNet enhancement
            print(f"[INFO] Applying DeepFilterNet noise reduction...")
            
            # Multiple passes for aggressive versions (SE v1.0)
            enhanced = waveform
            for i in range(passes):
                print(f"[INFO] Pass {i+1}/{passes}")
                enhanced = self.enhance_func(self.model, self.df_state, enhanced)
            
            # Apply post-filter if requested (SE v1.0 and NR v4.0)
            if postfilter:
                print(f"[INFO] Applying post-filter for extra clarity")
                enhanced = self.apply_post_filter(enhanced, strength=strength)
            
            # Apply volume boost
            if volume_boost != 1.0:
                print(f"[INFO] Applying volume boost: {volume_boost}x")
                enhanced = enhanced * volume_boost
            
            # Apply gentle fade to remove any clicks (5ms)
            fade_samples = int(0.005 * self.sample_rate)
            if enhanced.shape[1] > fade_samples * 2:
                fade_in = torch.linspace(0, 1, fade_samples).to(enhanced.device)
                fade_out = torch.linspace(1, 0, fade_samples).to(enhanced.device)
                enhanced[0, :fade_samples] *= fade_in
                enhanced[0, -fade_samples:] *= fade_out
            
            # Save processed audio
            torchaudio.save(output_path, enhanced.cpu(), self.sample_rate)
            
            # Verify output
            if os.path.exists(output_path):
                file_size = os.path.getsize(output_path)
                processed_duration = enhanced.shape[1] / self.sample_rate
                print(f"[SUCCESS] Processing complete!")
                print(f"[SUCCESS] Output: {os.path.basename(output_path)}")
                print(f"[SUCCESS] Duration: {processed_duration:.2f}s")
                print(f"[SUCCESS] Size: {file_size/1024:.1f}KB")
                return True
            else:
                print("[ERROR] Output file not created")
                return False
                
        except Exception as e:
            print(f"[ERROR] Processing failed: {e}")
            import traceback
            traceback.print_exc()
            return False

# Command-line interface
if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 3:
        print("\n" + "="*60)
        print("DEEPFILTERNET AUDIO PROCESSOR - VERSION SUPPORT")
        print("="*60)
        print("Usage: python deepfilter_audio_processor.py <input_file> <output_file> [strength] [postfilter] [passes] [volume_boost]")
        print("\nParameters:")
        print("  input_file    : Path to input audio file")
        print("  output_file   : Path for output audio file")
        print("  strength      : 0.5-1.5 (default: 1.0)")
        print("  postfilter    : true/false (default: false)")
        print("  passes        : number of enhancement passes (default: 1)")
        print("  volume_boost  : 0.8-1.5 (default: 1.0)")
        print("\nVersion Presets:")
        print("  SE v1.0    : strength=1.5, postfilter=true, passes=2, boost=1.2")
        print("  NR v4.0    : strength=1.2, postfilter=true, passes=1, boost=1.1")
        print("  NR v2.4    : strength=1.0, postfilter=false, passes=1, boost=1.0")
        print("  NR v2.1.1  : strength=0.8, postfilter=false, passes=1, boost=0.95")
        print("="*60 + "\n")
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    
    # Parse optional parameters
    strength = float(sys.argv[3]) if len(sys.argv) > 3 else 1.0
    postfilter = sys.argv[4].lower() == 'true' if len(sys.argv) > 4 else False
    passes = int(sys.argv[5]) if len(sys.argv) > 5 else 1
    volume_boost = float(sys.argv[6]) if len(sys.argv) > 6 else 1.0
    
    if not os.path.exists(input_file):
        print(f"\nERROR: Input file not found: {input_file}")
        sys.exit(1)
    
    # Create output directory if needed
    os.makedirs(os.path.dirname(os.path.abspath(output_file)), exist_ok=True)
    
    # Initialize and run processor
    processor = DeepFilterAudioProcessor()
    success = processor.process_file(input_file, output_file, strength, postfilter, passes, volume_boost)
    
    if success:
        print(f"\nSUCCESS! Output saved to: {output_file}")
        sys.exit(0)
    else:
        print(f"\nFAILED! Check error messages above")
        sys.exit(1)