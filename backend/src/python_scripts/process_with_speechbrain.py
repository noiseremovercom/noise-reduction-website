# backend/src/python_scripts/process_audio.py
import sys
import os
import warnings
warnings.filterwarnings('ignore')

# Import the DeepFilterNet3 processor
from deepfilter_audio_processor import DeepFilterAudioProcessor

def main():
    """
    Process audio files using DeepFilterNet3 for professional noise reduction
    DeepFilterNet3 achieves 3.22 PESQ - broadcast quality!
    """
    if len(sys.argv) < 3:
        print("\n" + "="*60)
        print("🎧 DEEPFILTERNET3 AUDIO PROCESSOR")
        print("="*60)
        print("Usage: python process_audio.py <input_file> <output_file> [strength]")
        print("\nParameters:")
        print("  input_file   : Path to input audio file (MP3, WAV, M4A, etc.)")
        print("  output_file  : Path for processed audio output")
        print("  strength     : Processing intensity (optional, default=1.0)")
        print("\nStrength values:")
        print("  0.5  : Light processing - for clean recordings")
        print("  1.0  : Standard processing - recommended for most files")
        print("  1.5  : Aggressive processing - for very noisy audio")
        print("="*60 + "\n")
        sys.exit(1)
    
    # Get command line arguments
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    strength = float(sys.argv[3]) if len(sys.argv) > 3 else 1.0
    
    # Validate input file
    if not os.path.exists(input_file):
        print(f"\n❌ ERROR: Input file not found: {input_file}")
        sys.exit(1)
    
    # Validate strength parameter
    if strength < 0.5 or strength > 2.0:
        print(f"\n⚠️ WARNING: Strength {strength} outside recommended range (0.5-2.0)")
        print("   Using value as-is, but results may vary.")
    
    # Create output directory if needed
    os.makedirs(os.path.dirname(os.path.abspath(output_file)), exist_ok=True)
    
    # Display processing info
    print("\n" + "="*60)
    print("🎧 DEEPFILTERNET3 AUDIO PROCESSING")
    print("="*60)
    print(f"📁 Input:  {os.path.basename(input_file)}")
    print(f"📁 Output: {os.path.basename(output_file)}")
    print(f"⚡ Strength: {strength}")
    print("="*60 + "\n")
    
    try:
        # Initialize and run DeepFilterNet3 processor
        processor = DeepFilterAudioProcessor()
        success = processor.process_file(input_file, output_file, strength)
        
        if success:
            print("\n" + "="*60)
            print("✅ PROCESSING COMPLETE!")
            print("="*60)
            print(f"📁 Output saved to: {output_file}")
            
            # Get file size
            if os.path.exists(output_file):
                size_kb = os.path.getsize(output_file) / 1024
                print(f"📊 File size: {size_kb:.1f} KB")
            
            print("="*60 + "\n")
            sys.exit(0)
        else:
            print("\n❌ PROCESSING FAILED")
            print("="*60)
            print("Check the error messages above for details.")
            print("="*60 + "\n")
            sys.exit(1)
            
    except Exception as e:
        print(f"\n❌ UNEXPECTED ERROR: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()