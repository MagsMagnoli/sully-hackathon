export interface SpeechToTextService {
  generateText(text: string): Promise<string>
}

export function createTextFromAudio({
  text,
  speechToTextService,
}: {
  text: string
  speechToTextService: SpeechToTextService
}) {
  return speechToTextService.generateText(text)
}
