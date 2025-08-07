export const CONTROL_STATE = {
  affirmations: true,
  emojis: false,
  popups: false,
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
      popupStyle.textContent = `.popup { display: initial }`
    } else {
      popupStyle.textContent = `.popup { display: none }`

    }
  }
}

document.onkeydown = e => keyEvent(e.key)
