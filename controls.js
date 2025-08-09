import {voices} from './voices.js'
import attrs from './attrs.js'
import {hideEmoji, displayEmoji} from './emojis.js'
import {displaySinglePopup} from './sponsoredContent.js'


const defaultAffirmationSpeed = attrs.toneAdj < 0.35 ? 0.8 : 0.9


export const CONTROL_STATE = {
  affirmations: true,
  emojis: true,
  popups: true,
  affirmationVoiceIx: 0,
  speedModifer: 1,
  affirmationSpeed: defaultAffirmationSpeed,
}

const popupStyle = document.createElement('style')
document.head.appendChild(popupStyle);

function keyEvent(key) {
  if (key === 'a') {

    CONTROL_STATE.affirmations = !CONTROL_STATE.affirmations

    console.log(`Affirmations ${CONTROL_STATE.affirmations ? 'resumed' : 'paused'}`)

  } else if (key === 's') {
    CONTROL_STATE.popups = !CONTROL_STATE.popups

    if (CONTROL_STATE.popups) {
      displaySinglePopup()
      popupStyle.textContent = `.sc-window { display: inline-block }`
      console.log(`Sponsored Content resumed`)
    } else {
      popupStyle.textContent = `.sc-window { display: none }`
      console.log(`Sponsored Content paused`)
    }

  } else if (key === 'h') {
    CONTROL_STATE.emojis = !CONTROL_STATE.emojis

    if (CONTROL_STATE.emojis) {
      displayEmoji()
      setTimeout(() => hideEmoji(), 15000)
      console.log(`Mantra displayed`)
    } else {
      hideEmoji()
      console.log(`Mantra hidden`)
    }

  } else if (key === 'H') {
    CONTROL_STATE.emojis = true
    displayEmoji()
    console.log(`Emojis locked`)

  } else if (key === '1') {
    CONTROL_STATE.speedModifer = 0.5
  } else if (key === '2') {
    CONTROL_STATE.speedModifer = 1
  } else if (key === '3') {
    CONTROL_STATE.speedModifer = 2
  } else if (key === '4') {
    CONTROL_STATE.speedModifer = 5
  } else if (key === '5') {
    CONTROL_STATE.speedModifer = 12
  } else if (key === 'r') {
    CONTROL_STATE.affirmations = true
    CONTROL_STATE.emojis = true
    CONTROL_STATE.popups = true
    CONTROL_STATE.affirmationVoiceIx = 0
    CONTROL_STATE.affirmationVoiceSpeed = defaultAffirmationSpeed

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
}

document.onkeydown = e => keyEvent(e.key)
