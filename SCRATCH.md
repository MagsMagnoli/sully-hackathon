# Scratchpad

## Stack Thoughts

- NextJS: combines react frontend with server, easily hosted on vercel
- Database: Drizzle ORM, most SQL like interface

## Deliverable Thoughts

- Hands-free experience
  - Need voice start / stop detection after initial permission grant: VAD library
- Support 3 languages
  - Can't use locale header since same machine, need to detect incoming language
  - Spanish, Chinese, Tagalog top 3 non english languages in US
- Repeat that command
  - Issue an out of band text to speech call for previous message
- Summary of the full conversation in english
  - Use AI to summarize
  - Need to know when over. End conversation command or button. Similarly need start conversation command or button
    - conversation history list
- Text-to-speech output for each utterance
- Barge in command
  - Needs to be able to cancel current text to speech sequence

## Out of Scope

- Knowledge of specific person as doctor based on voice learning
  - prevents the patient from adversarial commands that mess with the conversation (intents)
- Streaming text feedback and translations while speaking
- Authentication, user scoped conversations

## Data Model

- Conversation
  - languages
  - messages[]
  - summary

- Message
  - text (untranslated)
  - language (untranslated)
  - translations[]

## UX

- left panel conversation history
- main window shows conversation view with staggered bubbles for speech
  - separate by language
- speaking by either party
  - detect start and stop
  - send to translation service to the other output language
  - send translation to text-to-speech service
  - display translated language as message in UI with audio
  - detect intent and take action if needed
- end conversation button
  - send full conversation for summarization and display

## Nice to Haves

- pause button to suspend auto listen
- conversation history
- store audio files in cloud storage for future replay