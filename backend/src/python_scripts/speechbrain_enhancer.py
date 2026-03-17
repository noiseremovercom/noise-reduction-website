# backend/src/python_scripts/speechbrain_enhancer.py
import os
import torch
import torchaudio
import numpy as np
import soundfile as sf
from pathlib import Path

class SpeechBrainEnhancer:
    def __init__(self, device=None):
        """
        Initialize SpeechBrain enhancer for voice quality improvement
        """
        self.device = device or ("cuda" if torch.cuda.is_available() else "cpu")
        self.initialized = False
        self.model = None
        self.model_name = None
        self.sample_rate = 16000  # SpeechBrain works at 16kHz
        
    def initialize(self, model_name="mtl-mimic"):
        """
        Load the selected SpeechBrain model
        Options: 'mtl-mimic', 'metricgan+', 'enhance-spectral-mask'
        """
        try:
            from speechbrain.inference.enhancement import WaveformEnhancement
            
            # Map model names to Hugging Face sources
            model_sources = {
                'mtl-mimic': 'speechbrain/mtl-mimic-voicebank',
                'metricgan+': 'speechbrain/metricgan-plus-voicebank',
                'enhance-spectral-mask': 'speechbrain/enhance-spectral-mask'
            }
            
            if model_name not in model_sources:
                print(f"[WARNING] Unknown model {model_name}, using mtl-mimic")
                model_name = 'mtl-mimic'
            
            source = model_sources[model_name]
            model_dir = os.path.join(os.path.dirname(__file__), "models", model_name.replace('+', '_'))
            
            print(f"[INFO] Loading SpeechBrain model: {model_name}")
            print(f"[INFO] This may take a moment on first run...")
            
            self.model = WaveformEnhancement.from_hparams(
                source=source,
                savedir=model_dir,
                run_opts={"device": self.device}
            )
            
            self.initialized = True
            self.model_name = model_name
            print(f"[SUCCESS] SpeechBrain model loaded: {model_name}")
            
        except ImportError:
            print("[ERROR] SpeechBrain not installed. Run: pip install speechbrain")
            raise
        except Exception as e:
            print(f"[ERROR] Failed to load SpeechBrain model: {e}")
            raise
    
    def enhance_audio_array(self, audio_array, sample_rate):
        """
        Enhance audio from numpy array
        
        Args:
            audio_array: numpy array of audio samples
            sample_rate: sample rate of the input audio
            
        Returns:
            enhanced audio as numpy array
        """
        if not self.initialized:
            raise RuntimeError("Model not initialized. Call initialize() first.")
        
        # Convert to mono if stereo
        if len(audio_array.shape) > 1:
            audio_array = np.mean(audio_array, axis=1)
        
        # Convert to torch tensor
        audio_tensor = torch.from_numpy(audio_array).float()
        
        # Add batch dimension if needed
        if audio_tensor.dim() == 1:
            audio_tensor = audio_tensor.unsqueeze(0)
        
        # Resample if needed to 16kHz
        if sample_rate != 16000:
            resampler = torchaudio.transforms.Resample(sample_rate, 16000)
            audio_tensor = resampler(audio_tensor)
        
        # Enhance
        with torch.no_grad():
            enhanced = self.model.enhance_batch(audio_tensor, lengths=torch.tensor([1.0]))
        
        # Remove batch dimension
        if enhanced.dim() == 2:
            enhanced = enhanced.squeeze(0)
        
        return enhanced.cpu().numpy()
    
    def enhance_file(self, input_path, output_path=None):
        """
        Enhance audio from file
        
        Args:
            input_path: path to input audio file
            output_path: optional path to save enhanced audio
            
        Returns:
            enhanced audio as numpy array
        """
        if not self.initialized:
            self.initialize()
        
        try:
            print(f"[INFO] Enhancing: {os.path.basename(input_path)}")
            
            # Read audio file
            audio_array, sample_rate = sf.read(input_path)
            print(f"[INFO] Audio loaded: shape={audio_array.shape}, sample_rate={sample_rate}")
            
            # Enhance
            enhanced = self.enhance_audio_array(audio_array, sample_rate)
            
            # Save if output path provided
            if output_path:
                # Save at 16kHz
                sf.write(output_path, enhanced, 16000)
                print(f"[SUCCESS] Enhanced audio saved to: {output_path}")
            
            return enhanced
            
        except Exception as e:
            print(f"[ERROR] Enhancement failed: {e}")
            raise
    
    def enhance_batch(self, input_paths, output_dir=None):
        """
        Enhance multiple audio files
        
        Args:
            input_paths: list of paths to audio files
            output_dir: directory to save enhanced files (optional)
            
        Returns:
            list of enhanced audio arrays
        """
        results = []
        for i, input_path in enumerate(input_paths):
            output_path = None
            if output_dir:
                os.makedirs(output_dir, exist_ok=True)
                filename = f"enhanced_{Path(input_path).stem}.wav"
                output_path = os.path.join(output_dir, filename)
            
            try:
                enhanced = self.enhance_file(input_path, output_path)
                results.append(enhanced)
                print(f"[INFO] Processed {i+1}/{len(input_paths)}: {Path(input_path).name}")
            except Exception as e:
                print(f"[ERROR] Failed to process {input_path}: {e}")
                results.append(None)
        
        return results
    
    def get_model_info(self):
        """Get information about the loaded model"""
        return {
            'initialized': self.initialized,
            'model_name': self.model_name,
            'device': self.device,
            'sample_rate': self.sample_rate
        }

# Example usage
if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python speechbrain_enhancer.py <input_file> [output_file]")
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else None
    
    enhancer = SpeechBrainEnhancer()
    enhancer.initialize('mtl-mimic')
    
    if output_file:
        enhancer.enhance_file(input_file, output_file)
        print(f"Enhanced audio saved to: {output_file}")
    else:
        enhanced = enhancer.enhance_file(input_file)
        print(f"Enhanced audio shape: {enhanced.shape}")