import sys
import soundfile as sf
import noisereduce as nr
import numpy as np

def reduce_noise(input_file, output_file):
    # Read audio file
    data, samplerate = sf.read(input_file)
    
    # Convert to float if needed
    if data.dtype != np.float32 and data.dtype != np.float64:
        data = data.astype(np.float32) / 32768.0
    
    # Perform noise reduction
    # If stereo, process each channel separately
    if len(data.shape) > 1:
        processed = np.zeros_like(data)
        for channel in range(data.shape[1]):
            processed[:, channel] = nr.reduce_noise(
                y=data[:, channel], 
                sr=samplerate,
                prop_decrease=0.8,
                n_std_thresh_stationary=1.5,
                stationary=True
            )
    else:
        processed = nr.reduce_noise(
            y=data, 
            sr=samplerate,
            prop_decrease=0.8,
            n_std_thresh_stationary=1.5,
            stationary=True
        )
    
    # Save processed audio
    sf.write(output_file, processed, samplerate)
    print(f"✅ Processed: {input_file} -> {output_file}")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python python_denoise.py <input_file> <output_file>")
        sys.exit(1)
    
    reduce_noise(sys.argv[1], sys.argv[2])