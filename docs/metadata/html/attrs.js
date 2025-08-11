const speed = 0.75
const rotation = prb(.1) ? rnd(4) : 0
const aura = prb(0.1)

const rotationDirection = prb(.5) ? 1 : -1

const startHue = rnd(0, 360)

const bgColor = hsvToRgb(startHue+180, 1, 0.1)



const rosetteType = chance(
  [12, 'normal'],
  [13, 'pointy'],
  [12, 'wavy'],
  [13, 'numismatic'],
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
  [30, 60, 90, 120, 90, 60, 30],
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
const toneAdj = rnd(0.5, 1.5) / 2


const hasAura = prb(0.1) && !rotation

const hasPump = prb(0.1)
const adRate = chance(
  [1, [10, 30]],
  [4, [60, 150]],
  [44, [150,360]],
)

const emojiStrategy = chance(
  [1, 'dance'],
  [1, 'growShrink'],
)


const emoji = sample(['💸', '💰', '💎', '🪙', '🤑', '💷', '💴', '💵', '💶', '💲', '💰', '💹', '📈', '🍀', 'CGK'])
const emojiInvert = prb(0.3)

const defaultAffirmationSpeed = toneAdj < 0.35 ? 0.8 : 0.9





const overrides = tokenData.attrOverrides || {}


const attrs = {
  speed, rotation, rotationDirection, startHue, rosetteType, radiaChange, bgColor, colorStrategy, layerMult,
  alternateThickness, alternateHues, bw, brainwave, toneAdj, hasAura, hasPump, adRate, emoji, emojiStrategy, emojiInvert, defaultAffirmationSpeed,
  ...overrides
}


export default attrs