# Easy speech

Easy speech contains openai whisper within a flask app that responds to a post request with an audio file, and an obsidian plugin that sends a transcription request to the flask app and updates the note. We take a different aproach to the openai whisper plugin by having the model run locally and offline, and by not adding any extra UI to the plugin. Instead we rely on the obsidian sound recorder plugin to record audio and send it to the plugin. (This is a default plugin inside core plugins but is disabled by default)

## Getting flask running

Quite simple, install the python dependencies and run the app. Wait for the model to load if you are not using the tiny model included in here.

## Getting the plugin running

To get a plugin working in obsidian you should
- Enable community plugins
- Copy the `obsidian-plugin/main.js` and `obsidian-plugin/manifest.json` files into your vault `VaultFolder/.obsidian/plugins/easyspeech/`.
- Reload the plugins within the settings of obsidian inside community plugins section.
- For better experience go to the hotkey settings and set a hotkey to toggle the plugins command. ("Process Audio Note")
- And then you just hit the record button on the ribbon and once you are done the sound file will appear on the notes automatically. (default obsidian behavior)
- At that point hit the hot key or run the command and the transcription will appear in the note.