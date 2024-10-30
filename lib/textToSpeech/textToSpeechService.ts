export interface TextToSpeechService {
  generateAudio(text: string): Promise<Blob>
}

export function createAudioFromText({
  text,
  textToSpeechService,
}: {
  text: string
  textToSpeechService: TextToSpeechService
}) {
  return textToSpeechService.generateAudio(text)
}
