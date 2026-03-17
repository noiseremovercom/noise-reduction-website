# backend/src/python_scripts/speechbrain_processor.py
import torch
import torchaudio
import os
import sys
import soundfile as sf
import numpy as np
from pathlib import Path

class SpeechBrainProcessor:
    def __init__(self, device=None):
        """
        Initialize SpeechBrain processor for noise reduction and voice enhancement
        """
        self.device = device or ("cuda" if torch.cuda.is_available() else "cpu")
        self.initialized = False
        self.model = None
        self.sample_rate = 16000  # SpeechBrain works at 16kHz
        
    def initialize(self, model_name="mtl-mimic"):
        """
        Load the selected SpeechBrain model
        """
        try:
            from speechbrain.inference.enhancement import WaveformEnhancement
            
            print(f"[INFO] Loading SpeechBrain model: {model_name}")
            
            # Use a simple path for the model
            model_dir = os.path.join(os.path.dirname(__file__), "models", "mtl-mimic")
            
            # Load model directly from HuggingFace
            self.model = WaveformEnhancement.from_hparams(
                source="speechbrain/mtl-mimic-voicebank",
                savedir=model_dir,
                run_opts={"device": self.device}
            )
            
            self.initialized = True
            print(f"[SUCCESS] SpeechBrain model loaded")
            
        except Exception as e:
            print(f"[ERROR] Failed to load SpeechBrain: {e}")
            raise
    
    def process_file(self, input_path, output_path, model_name="mtl-mimic"):
        """
        Process a single audio file with SpeechBrain using in-memory processing
        """
        if not self.initialized:
            self.initialize(model_name)
            
        try:
            print(f"[INFO] Processing file using in-memory approach...")
            
            # Read the file directly into memory using soundfile
            print(f"[INFO] Reading file: {input_path}")
            
            # Check if file exists
            if not os.path.exists(input_path):
                print(f"[ERROR] File not found: {input_path}")
                # Try to extract filename and find in temp directory
                filename = os.path.basename(input_path)
                temp_dir = 'C:\\Users\\Raees\\Desktop\\Project Noise Reducer\\noise-reduction-website\\backend\\temp\\'
                alt_path = os.path.join(temp_dir, filename)
                if os.path.exists(alt_path):
                    print(f"[INFO] Found file at: {alt_path}")
                    input_path = alt_path
                else:
                    raise FileNotFoundError(f"Cannot find input file")
            
            # Read audio file
            data, samplerate = sf.read(input_path)
            print(f"[INFO] Audio loaded: shape={data.shape}, samplerate={samplerate}")
            
            # Convert to mono if stereo
            if len(data.shape) > 1 and data.shape[1] > 1:
                data = np.mean(data, axis=1)
                print(f"[INFO] Converted to mono")
            
            # Convert to torch tensor
            audio_tensor = torch.from_numpy(data).float()
            
            # Add batch dimension if needed
            if audio_tensor.dim() == 1:
                audio_tensor = audio_tensor.unsqueeze(0)  # [1, samples]
            
            print(f"[INFO] Tensor shape: {audio_tensor.shape}")
            
            # Resample if needed to 16kHz (SpeechBrain expects 16kHz)
            if samplerate != 16000:
                print(f"[INFO] Resampling from {samplerate}Hz to 16000Hz")
                resampler = torchaudio.transforms.Resample(samplerate, 16000)
                audio_tensor = resampler(audio_tensor)
            
            # Enhance using the tensor
            print(f"[INFO] Enhancing audio...")
            enhanced = self.model.enhance_batch(audio_tensor, lengths=torch.tensor([1.0]))
            
            # Remove batch dimension
            if enhanced.dim() == 2:
                enhanced = enhanced.squeeze(0)
            
            print(f"[INFO] Enhanced shape: {enhanced.shape}")
            
            # Save the enhanced audio
            torchaudio.save(output_path, enhanced.unsqueeze(0).cpu(), 16000)
            print(f"[INFO] Saved to: {output_path}")
            
            if os.path.exists(output_path):
                file_size = os.path.getsize(output_path)
                print(f"[SUCCESS] Output saved ({file_size/1024:.1f} KB)")
                return True
            else:
                print("[ERROR] Output file not created")
                return False
                
        except Exception as e:
            print(f"[ERROR] Processing failed: {e}")
            import traceback
            traceback.print_exc()
            return False