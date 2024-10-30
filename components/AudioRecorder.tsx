'use client'

import { useMicVAD, utils } from '@ricky0123/vad-react'
import { Mic } from 'lucide-react'

export const AudioRecorder = ({
  disabled,
  onSpeechEnd,
}: {
  disabled: boolean
  onSpeechEnd: (audio: string) => void
}) => {
  const vad = useMicVAD({
    ortConfig(ort) {
      ort.env.wasm.wasmPaths = '/vad/'
    },
    workletURL: '/vad/vad.worklet.bundle.min.js',
    modelURL: '/vad/silero_vad.onnx',
    startOnLoad: true,
    onSpeechEnd: (audio) => {
      if (disabled) {
        return
      }

      const wavBuffer = utils.encodeWAV(audio)
      const base64 = utils.arrayBufferToBase64(wavBuffer)

      onSpeechEnd(base64)
    },
  })

  return (
    <div className="flex justify-center w-full">
      <Mic
        className={
          !disabled && vad.userSpeaking ? 'animate-pulse text-red-500' : ''
        }
        size={32}
      />
    </div>
  )
}
