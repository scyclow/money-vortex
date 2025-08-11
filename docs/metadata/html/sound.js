
import {MAX_VOLUME, SoundSrc} from './audio.js'
import {CONTROL_STATE} from './controls.js'
import {voices, say} from './voices.js'
import affirmations from './affirmations.js'
import attrs from './attrs.js'


const somberNotes = {
  b4: 493.88,
  b3: 493.88/2,
  b5: 493.88*2,

  gs4: 415.3,
  ds5: 622.25,
  e5: 659.25,
  fs5: 739.99,


  cs5: 554.37,
  // as5: 932.33
}


const hopefulNotes = {
  a4: 440,
  a3: 440/2,

  a5: 440*2,
  cs5: 554.37,
  d5: 587.33,
  e4: 329.63,
  fs4: 369.99,
  e5: 329.63*2,
  fs5: 369.99*2,
}




const notes = sample([
  {
    main: hopefulNotes.a4,
    secondary: Object.values(hopefulNotes)
  },
  {
    main: somberNotes.b4,
    secondary: Object.values(somberNotes)
  },
])






const tone = notes.main



function getTone(t) {
  const toneM = t * attrs.toneAdj

  const bwAdj = posOrNeg() * attrs.brainwave/2
  const toneL = toneM - bwAdj
  const toneR = toneL + bwAdj

  return { toneM, toneL, toneR }
}

function playTone(t, vol=MAX_VOLUME) {
  const {toneM, toneL, toneR} = getTone(t)
  const middle1Channel = new SoundSrc('sine', toneM)
  const middle2Channel = new SoundSrc('sine', toneM/2)
  const leftChannel = new SoundSrc('sine', toneL)
  const rightChannel = new SoundSrc('sine', toneR)

  leftChannel.smoothPanner(-1, 0)
  rightChannel.smoothPanner(1, 0)

  middle1Channel.smoothGain(vol, 1)
  middle2Channel.smoothGain(vol, 1)
  leftChannel.smoothGain(vol, 1)
  rightChannel.smoothGain(vol, 1)

  return {
    middle1Channel, middle2Channel, leftChannel, rightChannel
  }
}

let soundActivated, soundMuted




function playSecondaryNote(secondary, changeInterval, exclude=[], changeTimeout=0) {
  let i = 0

  function changeSound(s) {
    if (!soundMuted) {
      const vol = i % 2 ? MAX_VOLUME : 0

      if (vol) {
        const x = sample(notes.secondary, exclude)

        const newNote = getTone(x)

        secondary.leftChannel.smoothFreq(newNote.toneM/4, 0.25)
        secondary.rightChannel.smoothFreq(newNote.toneM*0.75, 0.25)
        secondary.middle1Channel.smoothFreq(newNote.toneM, 0.25)
        secondary.middle2Channel.smoothFreq(newNote.toneM/2, 0.25)
      }


      secondary.leftChannel.smoothGain(vol, 2)
      secondary.rightChannel.smoothGain(vol, 2)
      secondary.middle1Channel.smoothGain(vol, 2)
      secondary.middle2Channel.smoothGain(vol, 2)
      i++

    }
    const nextChange = changeInterval

    setTimeout(() => changeSound(nextChange/2000), nextChange)
  }

  setTimeout(() => {
    changeSound(changeInterval)
  }, changeTimeout)
}




function unmuteSound() {
  soundMuted = false
  SoundSrc.allSources.forEach(src => src.unmute(0.2))

}


export function muteSound() {
  soundMuted = true
  SoundSrc.allSources.forEach(src => src.mute(0.2))
  // window.speechSynthesis?.cancel?.()
}



export async function activateSound() {
  if (soundActivated) {
    unmuteSound()
    return
  }

  soundActivated = true
  const vs = await voices

  const main = playTone(notes.main)

  main.leftChannel.smoothGain(MAX_VOLUME/2, 0.2)
  main.rightChannel.smoothGain(MAX_VOLUME/2, 0.2)

  const secondary = playTone(sample(notes.secondary, main), MAX_VOLUME* 1.25)
  const tertiary = playTone(sample(notes.secondary, [main, secondary]), MAX_VOLUME* 1.25)


  playSecondaryNote(secondary, 4000, notes.main)
  playSecondaryNote(tertiary, 4500, notes.main, 3000)



  let lastAffirmation
  function triggerAffirmation() {
    if (soundMuted) return

    const affirmationList = CONTROL_STATE.affirmationOverride.length
      ? CONTROL_STATE.affirmationOverride
      : affirmations

    const aff = sample(affirmationList)

    if (aff === lastAffirmation && affirmationList.length > 1) {
      triggerAffirmation()
    } else {
      lastAffirmation = aff
      const voice = vs[CONTROL_STATE.affirmationVoiceIx || 0]
      say(voice, aff, { speed: CONTROL_STATE.affirmationSpeed || attrs.defaultAffirmationSpeed })
    }
  }

  setInterval(triggerAffirmation, 10000)


}



