import {voices} from './voices.js'

export const CONTROL_STATE = {
  affirmations: true,
  emojis: true,
  popups: false,
  affirmationVoiceIx: 0,
  affirmationSpeed: 0.9,
}

const popupStyle = document.createElement('style')
document.head.appendChild(popupStyle);

function keyEvent(key) {
  if (key === 'a') {
    CONTROL_STATE.affirmations = !CONTROL_STATE.affirmations
    // todo kill voice if stop, trigger voice if start
  } else if (key === 'e') {
    CONTROL_STATE.emojis = !CONTROL_STATE.emojis

    const $emojiView = document.getElementById('emojiView')
    if ($emojiView) {
      if (CONTROL_STATE.emojis) {
        $emojiView.style.display = 'initial'
      } else {
        $emojiView.style.display = 'none'
      }
    }

  } else if (key === 'p') {
    CONTROL_STATE.popups = !CONTROL_STATE.popups

    if (CONTROL_STATE.popups) {
      popupStyle.textContent = `.sc-window { display: inline-block }`
    } else {
      popupStyle.textContent = `.sc-window { display: none }`

    }
  } else if (key === 'ArrowRight') {
    voices.then(vs => {
      CONTROL_STATE.affirmationVoiceIx = (CONTROL_STATE.affirmationVoiceIx + 1) % vs.length
      console.log(vs.length, CONTROL_STATE.affirmationVoiceIx)
    })
  } else if (key === 'ArrowLeft') {
    voices.then(vs => {
      CONTROL_STATE.affirmationVoiceIx = (CONTROL_STATE.affirmationVoiceIx - 1 + vs.length )% vs.length
      console.log(vs.length, CONTROL_STATE.affirmationVoiceIx)
    })
  } else if (key === 'ArrowUp') {
    CONTROL_STATE.affirmationSpeed += 0.1
  } else if (key === 'ArrowDown') {
    CONTROL_STATE.affirmationSpeed = Math.max(0.1, CONTROL_STATE.affirmationSpeed - 0.1)
  }

  console.log(CONTROL_STATE)
}

document.onkeydown = e => keyEvent(e.key)
