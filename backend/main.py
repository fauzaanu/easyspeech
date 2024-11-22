import whisper

model = whisper.load_model("tiny")
result = model.transcribe("output.wav")
print(result["text"])