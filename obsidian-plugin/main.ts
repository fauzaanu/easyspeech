import { App, Editor, MarkdownView, Notice, Plugin } from 'obsidian';

export default class MyPlugin extends Plugin {
	async onload() {
		// Add a command to process the audio note
		this.addCommand({
			id: 'process-audio-note',
			name: 'Process Audio Note',
			editorCallback: async (editor: Editor, view: MarkdownView) => {
				// Get the content of the current note
				const content = editor.getValue();

				// Find the audio link (![[Recording...]])
				const audioRegex = /!\[\[([^\]]+\.m4a)\]\]/;
				const match = content.match(audioRegex);
				if (!match || !match[1]) {
					new Notice('No audio recording found in the note.');
					return;
				}

				const audioFileName = match[1]; // Extracted file name
				const file = this.app.vault.getAbstractFileByPath(audioFileName);

				if (!file) {
					new Notice(`Audio file "${audioFileName}" not found in vault.`);
					return;
				}

				// Read the audio file as a binary blob
				const audioData = await this.app.vault.readBinary(file);

				// Create a POST request to the backend
				const formData = new FormData();
				formData.append('file', new Blob([audioData]), audioFileName);

				try {
					const response = await fetch('http://localhost:5000/your-endpoint', {
						method: 'POST',
						body: formData,
					});

					if (!response.ok) {
						throw new Error(`HTTP error! status: ${response.status}`);
					}

					const json = await response.json();
					if (!json.text) {
						throw new Error('No "text" field in response.');
					}

					// Append the returned text below the audio link
					const updatedContent = content.replace(
						audioRegex,
						(match) => `${match}\n\n${json.text}`
					);
					editor.setValue(updatedContent);
					new Notice('Audio note processed successfully!');
				} catch (error) {
					console.error('Error processing audio note:', error);
					new Notice('Failed to process the audio note.');
				}
			},
		});
	}

	onunload() {
		// Cleanup if needed
	}
}
