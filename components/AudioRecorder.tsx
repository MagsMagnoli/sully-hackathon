'use client'

import { useMicVAD } from '@ricky0123/vad-react'

export const AudioRecorder = () => {
  const vad = useMicVAD({
    ortConfig(ort) {
      ort.env.wasm.wasmPaths = '/vad/'
    },
    workletURL: '/vad/vad.worklet.bundle.min.js',
    modelURL: '/vad/silero_vad.onnx',
    startOnLoad: true,
    onSpeechEnd: (audio) => {
      console.log('User stopped talking', audio)
    },
  })

  return <div>{vad.userSpeaking && 'User is speaking'}</div>
}
