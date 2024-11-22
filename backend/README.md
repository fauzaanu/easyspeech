# Easy speech

A very simple flask app that uses openai-whisper to transcribe audio files. Tiny model is included within the image to have everything setup once the container starts.

## Usage

Requests should be sent as a file to `/transcribe` and the response will be a JSON object containing the transcribed text.
```json
{
    "text": "The quick brown fox jumps over the lazy dog."
}
```

## Dependencies

- [openai-whisper](https://github.com/openai/whisper)
- [flask](https://flask.palletsprojects.com/en/2.3.x/)

## Usecase

I made this to improve my obsidian note taking workflow in a local way. Obsidian did not have a local first solution for this at the time I made this. Except for the openai whisper plugin but that adds a cost for transcribing a file. But most systems have a gpu that can process audio files locally and without running a huge cost.

The idea was to run the container and use a plugin to auto transcribe whenever the note gets an audio file added. The audio files are added using the core plugin of obsidian which is by default turned off. (sound recorder).

### Deeper Insights

I have often found that when you just talk the thoughts that come out of your mouth are very much more original than what you normally write on paper. There is no editing and no filter on it and it has given me quite a lot of ideas for many projects. I also think this is why meetings are somewhat useful even though they waste a lot of time over planning things without any action. Meetings can really get this sort of ideation flow going on in an unfiltered way. Just my opinion and experience.


### Larger model

Feel free to edit the app.py and the model name to another model will definitely trigger a download of the model when the container starts. But at that point you may want to add the new model to the Docker image as it would speed up future runs. (I have really bad internet)