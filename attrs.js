const speed = 0.75
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
console.log(rosetteType)

const radiaChange = rnd(0.01, 0.2)


const lines = chance(
  // [1, 'solid'],
  [1, 'glowing'],
)


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







export default {
  speed, rotation, rotationDirection, startHue, rosetteType, radiaChange, lines, bgColor
}