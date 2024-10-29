export type Intent = {
  id: string
  parameters: Record<string, string>
  text: string
}

export interface IntentService {
  detectIntent(text: string): Promise<Intent | null>
}

export async function detectIntent({
  text,
  intentService,
}: {
  text: string
  intentService: IntentService
}) {
  return intentService.detectIntent(text)
}
