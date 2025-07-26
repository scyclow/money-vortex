export const CONTROL_STATE = {
  affirmations: true
}

function keyEvent(key) {
  if (key === 'a') {
    CONTROL_STATE.affirmations = !CONTROL_STATE.affirmations
    // todo kill voice if stop, trigger voice if start
  }
}

document.onkeydown = e => keyEvent(e.key)
