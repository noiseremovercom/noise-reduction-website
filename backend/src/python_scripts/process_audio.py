# backend/src/python_scripts/process_audio.py
import sys
import os
import warnings
warnings.filterwarnings('ignore')

# Import the DeepFilterNet processor
from deepfilter_audio_processor import DeepFilterAudioProcessor

def main():
    """
    Process audio files using DeepFilterNet
    """
    if len(sys.argv) < 3:
        print("\n" + "="*60)
        print("DEEPFILTERNET AUDIO PROCESSOR")
        print("="*60)
        print("Usage: python process_audio.py <input_file> <output_file>")
        print("="*60 + "\n")
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    
    if not os.path.exists(input_file):
        print(f"\nERROR: Input file not found: {input_file}")
        sys.exit(1)
    
    # Create output directory if needed
    os.makedirs(os.path.dirname(os.path.abspath(output_file)), exist_ok=True)
    
    # Initialize and run processor
    processor = DeepFilterAudioProcessor()
    success = processor.process_file(input_file, output_file)
    
    if success:
        print(f"\nSUCCESS! Output saved to: {output_file}")
        sys.exit(0)
    else:
        print(f"\nFAILED! Check error messages above")
        sys.exit(1)

if __name__ == "__main__":
    main()