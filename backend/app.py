from flask import Flask, request, jsonify
import whisper

# Initialize the Flask app
app = Flask(__name__)

# Load the Whisper model (this can be 'tiny', 'base', 'small', 'medium', or 'large')
model = whisper.load_model("tiny")

@app.route('/transcribe', methods=['POST'])
def transcribe_audio():
    # Check if an audio file is provided
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400


    # remove existing file
    import os
    if os.path.exists("uploaded_audio.wav"):
        os.remove("uploaded_audio.wav")
    # Save the uploaded file to a temporary location
    file_path = "uploaded_audio.wav"
    file.save(file_path)

    # Use Whisper to transcribe the audio file
    result = model.transcribe(file_path)
    print(result["text"])

    # Return the transcribed text
    return jsonify({"text": result["text"]})

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=5000)
