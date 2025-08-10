import {CONTROL_STATE} from './controls.js'

window.speechSynthesis?.cancel?.()


export const voices = new Promise((res, rej) => {
  setTimeout(() => {
    let i = 0
    const getVoices = () => {
      i++
      try {
        if (i >= 50) return res([])
        const voices = window.speechSynthesis.getVoices()
        setTimeout(() => {
          if (!voices.length) getVoices()
          else {
            const englishVoices = voices.filter(v => v.lang === 'en-US' || v.lang === 'en_US')
            const defaultVoice = englishVoices.find(v => v.default)

            if (defaultVoice && defaultVoice !== englishVoices[0]) {
              englishVoices.unshift(defaultVoice)
            }

            res(englishVoices.length ? englishVoices : voices)
          }
        }, 200)
      } catch(e) {
        rej(e)
      }
    }
    getVoices()
  })
})


export function say(voice, txt, options={}) {
  if (!CONTROL_STATE.affirmations) return

  const v = voice

  const utterance = new window.SpeechSynthesisUtterance(txt)
  utterance.volume = options.volume || 0.7
  utterance.rate = options.speed || 1
  utterance.pitch = options.pitch || 1
  utterance.voice = v
  window.speechSynthesis.speak(utterance)
}