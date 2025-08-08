

export const MAX_VOLUME = 0.08


export function createSource(waveType = 'sine', startingFreq=3000) {
  const AudioContext = window.AudioContext || window.webkitAudioContext
  const ctx = new AudioContext()

  const source = ctx.createOscillator()
  const gain = ctx.createGain()
  const panner = new StereoPannerNode(ctx)

  source.connect(gain)
  gain.connect(panner)
  panner.connect(ctx.destination)

  gain.gain.value = 0
  source.type = waveType
  source.frequency.value = startingFreq
  source.start()

  const smoothFreq = (value, timeInSeconds=0.001) => {
    source.frequency.exponentialRampToValueAtTime(
      value,
      ctx.currentTime + timeInSeconds
    )
  }

  const smoothPanner = (value, timeInSeconds=0.001) => {
    panner.pan.exponentialRampToValueAtTime(
      value,
      ctx.currentTime + timeInSeconds
    )
  }

  let volume = 0
  const smoothGain = (value, timeInSeconds=0.001) => {
    volume = value || 0

    gain.gain.setTargetAtTime(
      Math.min(value, MAX_VOLUME),
      ctx.currentTime,
      timeInSeconds
    )
  }

  // const mute = () => {
  //   gain.gain.setTargetAtTime(
  //     Math.min(0, MAX_VOLUME),
  //     ctx.currentTime,
  //     0.001
  //   )
  // }
  // const unmute = () => {
  //   gain.gain.setTargetAtTime(
  //     Math.min(volume, MAX_VOLUME),
  //     ctx.currentTime,
  //     0.001
  //   )
  // }

  const src = {
    source, gain, panner,smoothFreq, smoothGain, smoothPanner, originalSrcType: source.type, //mute, unmute,
    stop() {
      source.stop()
      this.isStopped = true
    }
  }

  return src
}




// EXPERIMENTAL


export class SoundSrc {
  static allSources = []
  constructor(waveType='sine', startingFreq=440) {
    Object.assign(this, createSource(waveType, startingFreq))
    SoundSrc.allSources.push(this)
  }

  max() {
    this.smoothGain(MAX_VOLUME)
  }

  silent() {
    this.smoothGain(0)
  }

  mute(ms) {
    this.lastVolume = this.gain.gain.value
    this.smoothGain(0, ms)
  }

  unmute(ms) {
    this.smoothGain(this.lastVolume || MAX_VOLUME, ms)
  }


  async note(freq, ms, vol) {
    this.smoothGain(vol || MAX_VOLUME)
    this.smoothFreq(freq)
    await waitPromise(ms)
    this.smoothGain(0)
  }
}