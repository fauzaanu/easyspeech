import {Editor, Plugin, TFile} from 'obsidian';
import * as http from 'http';

interface WhisperResponse {
	text: string;
	error?: string;
}

class AudioTranscriptionPlugin extends Plugin {
	private static readonly AUDIO_REGEX = /!\[\[([^\]]+\.m4a)\]\]/;
	private static readonly API_HOST = '127.0.0.1';
	private static readonly API_PORT = 5000;
	private static readonly API_PATH = '/transcribe';

	async onload() {
		this.addCommand({
			id: 'process-audio-note',
			name: 'Process Audio Note',
			editorCallback: async (editor: Editor) => {
				try {
					await this.processAudioNote(editor);
				} catch (error) {
					console.error(error);
				}
			},
		});
	}

	private async processAudioNote(editor: Editor): Promise<void> {
		const content = editor.getValue();
		const match = content.match(AudioTranscriptionPlugin.AUDIO_REGEX);

		if (!match?.[1]) {
			throw new Error('No audio recording found');
		}

		const file = this.app.vault.getAbstractFileByPath(match[1]);
		if (!file || !(file instanceof TFile)) {
			throw new Error(`File not found: ${match[1]}`);
		}


		const audioData = await this.app.vault.readBinary(file);

		try {
			const response = await this.sendHttpRequest(audioData, file.name);


			if (response.error) {
				throw new Error(response.error);
			}

			if (!response.text) {
				throw new Error('No transcription received');
			}

			const updatedContent = content.replace(
				AudioTranscriptionPlugin.AUDIO_REGEX,
				(match) => `${match}\n\n${response.text.trim()}`
			);
			editor.setValue(updatedContent);


		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	private sendHttpRequest(audioData: ArrayBuffer, filename: string): Promise<WhisperResponse> {
		return new Promise((resolve, reject) => {
			const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);

			// Prepare the multipart form data
			const header = Buffer.from(
				`--${boundary}\r\n` +
				`Content-Disposition: form-data; name="file"; filename="${filename}"\r\n` +
				`Content-Type: audio/m4a\r\n\r\n`,
				'utf-8'
			);

			const footer = Buffer.from(`\r\n--${boundary}--\r\n`, 'utf-8');

			// Combine all parts into a single buffer
			const fileBuffer = Buffer.from(audioData);
			const dataBuffer = Buffer.concat([header, fileBuffer, footer]);

			const options = {
				hostname: AudioTranscriptionPlugin.API_HOST,
				port: AudioTranscriptionPlugin.API_PORT,
				path: AudioTranscriptionPlugin.API_PATH,
				method: 'POST',
				headers: {
					'Content-Type': `multipart/form-data; boundary=${boundary}`,
					'Content-Length': dataBuffer.length
				}
			};

			const req = http.request(options, (res) => {
				let data = '';

				res.on('data', (chunk) => {
					data += chunk;
				});

				res.on('end', () => {
					try {
						const parsedData = JSON.parse(data);
						resolve(parsedData);
					} catch (e) {
						reject(new Error(`Failed to parse response: ${e.message}`));
					}
				});
			});

			req.on('error', (e) => {
				reject(e);
			});
			req.write(dataBuffer);
			req.end();
		});
	}

	onunload() {
	}
}
