const speed = 0.75
// const speed = 2
// const speed = 0
const rotation = prb(.1) ? rnd(4) : 0
const aura = prb(0.1)

const rotationDirection = prb(.5) ? 1 : -1

const startHue = rnd(0, 360)

const bgColor = hsvToRgb(startHue+180, 1, 0.1)



const rosetteType = chance(
  [1, 'normal'],
  [1, 'pointy'],
  [1, 'wavey'],
  [1, 'numismatic'],
)


const radiaChange = rnd(0.01, 0.2)

const layerMult = rnd(1, 2)


const colorStrategy = chance(
  [2, 'pure'],
  [1, 'rainbow'],
  [7, 'alternate'],
)

const alternateThickness = rndint(1, 7)
const alternateHues = sample([
  // [180],
  [30, 60, 90, 120, 90, 60, 30],
  // [60, 120, 180, 120, 60],

  // [120, 240, 120],

  // [90, 180, 270],

  // [330, 30, 180],

  [40, 80, 40],
  [10, 20, 30, 40, 50, 60, 50, 40, 30, 20, 10],
  [30, 60, 90, 60, 30],
])

const brainwaves = {
  delta: rnd(0.5, 4),
  theta: rnd(4, 8),
  alpha: rnd(8, 13),
  // beta: rnd(14, 30),
  // gamma: rnd(30, 100),
}


const bw = sample(Object.keys(brainwaves))
const brainwave = brainwaves[bw]

const hasAura = prb(0.1) && !rotation

const hasPump = prb(0.1)
const adRate = chance(
  [1, rnd(1, 3)],
  [4, rnd(5, 10)],
  [25, rnd(30)],
)

const emojiStrategy = chance(
  [1, 'fadeDance'],
  [1, 'growShrink'],
  [1, 'float'],
)

const emoji = sample(['💸', '💰', '💎', '🪙', '🤑', '💷', '💴', '💵', '💶', '💲', '💰', '💹', '📈', '🍀'])

/*
  Color Strategy
    - pure
    - gradient
    - alternating

    - change over time


  Lines
    - solid
    - shadows


  Floating things
    - rosettes
    - lines


  - moirre
    - true
    - false

*/




const attrs = {
  speed, rotation, rotationDirection, startHue, rosetteType, radiaChange, bgColor, colorStrategy, layerMult,
  alternateThickness, alternateHues, brainwave, hasAura, hasPump, adRate, emoji, emojiStrategy
}

console.log(attrs)


export default attrs