import attrs from './attrs.js'


const returnOne = () => 1
const evenStart = () => prb(0.5) ? 0 : 0.5

const typeFunctions = {
  normal() {
    const points = 1800
    const gearWaveFrequency = 4
    const gearWaveAmplitude = 0

    return {
      points,
      gearWaveFrequency,
      gearWaveAmplitude,
      layers: Math.round(40 * attrs.layerMult),
      radiaChange: attrs.radiaChange,
      cycles: 1,
      radiaAdj: () => 1
    }
  },

  pointy() {
    const points = 1800
    const gearWaveFrequency = 64
    const gearWaveAmplitude = 0.05

    return {
      points,
      gearWaveFrequency,
      gearWaveAmplitude,
      layers: 40,
      radiaChange: attrs.radiaChange,
      cycles: 1,
      // radiaAdj: (p, i, _x, _y, baseRadius, prevRadius) => {
      radiaAdj: p => {
        const progress = 2 * Math.PI * p / points
        const frequency = progress * gearWaveFrequency
        return 1 + Math.abs(Math.cos(frequency) * gearWaveAmplitude) * -1

      }
    }
  },


  wavy() {
    const points = 900
    const gearWaveFrequency = Math.floor(rnd(30, 60))
    const gearWaveAmplitude = rnd(0.04, 0.08)

    return {
      points,
      gearWaveFrequency,
      gearWaveAmplitude,
      layers: 40,
      radiaChange: attrs.radiaChange / 20,
      cycles: 1,
      radiaAdj: p => {
        const progress = 2 * Math.PI * p / points
        const frequency = progress * gearWaveFrequency

        return 1 + Math.cos(frequency) * gearWaveAmplitude
      }
    }
  },

  numismatic() {
    const points = 900
    const gearWaveFrequency = 30
    const gearWaveAmplitude = 0.07
    const cycles = 3

    return {
      points,
      gearWaveFrequency,
      gearWaveAmplitude,
      layers: 40,
      radiaChange: attrs.radiaChange / 20,
      cycles,
      startOffset: gearWaveFrequency/cycles,
      radiaAdj: p => {
        const progress = 2 * Math.PI * p / points
        const frequency = progress * gearWaveFrequency

        return 1 + Math.cos(frequency) * gearWaveAmplitude
      }
    }
  }
}




const { points, layers, radiaAdj, radiaChange, gearWaveAmplitude, gearWaveFrequency, cycles, startOffset } = typeFunctions[attrs.rosetteType]()


function createGears() {
  const gears = generateGears(8, 15, .1, chance(
    [55, returnOne],
    [45, evenStart],
  ))

  gears[0].radiaAdj = radiaAdj



  return gears

}

const gearModifier = (gears, t, totalLayers) => gears.map(g => ({
  ...g,
  radia: g.radia - (t*radiaChange/totalLayers)
}))



const paths = []


const generatePath = (t, pathList, gears) => {
  const g = gearModifier(gears, t, layers)
  const p = getRosettePoints(
    200,
    g,
    cycles,
    0,
    0,
    points,
    startOffset
  )

  p.push(p[0].slice())
  pathList.push(p.flat())
}


const gears1 = createGears()


times(layers, t => generatePath(t, paths, gears1))
times(layers, t => generatePath(layers - t, paths, gears1))




const pathToCoords = path => {
  const coords = [];
  for (let i = 0; i < path.length; i += 2) {
    let x = path[i];
    let y = path[i + 1];
    x = (x / 3000) * 2 - 1;
    y = -((y / 3000) * 2 - 1);
    coords.push({ x, y });
  }

  // Center
  let xSum = 0, ySum = 0;
  for (const p of coords) {
    xSum += p.x;
    ySum += p.y;
  }
  const xMid = xSum / coords.length;
  const yMid = ySum / coords.length;

  const centered = [];
  for (const p of coords) {
    centered.push(p.x - xMid, p.y - yMid);
  }

  return centered
}



function generateGears(gearsN=8, rotationMax=15, radia=0.1, startFn=returnOne) {
  const gears = [
    {
      rotation: 1,
      radia: 1,
      radiaStart: 1,
      radiaAdj: returnOne//(p, i, _x, _y, baseRadius, prevRadius) => i ? 1 : (p%2 ? 1 : prevRadius/baseRadius),
    },
    ...times(gearsN - 1, g => ({
      rotation: int(rnd(-rotationMax, rotationMax)),
      radia: rnd(0, radia),
      radiaStart: startFn(),
      radiaAdj: returnOne//(p, i, _x, _y, baseRadius, prevRadius) => i ? 1 : (p%2 ? 1 : prevRadius/baseRadius),
    }))
  ]

  const totalRadia = gears.reduce((sum, g) => g.radia + sum, 0)
  return gears.map(g => ({
    ...g,
    radia: g.radia/totalRadia
  }))
}


function createSpirographFn(baseRadius, gears) {
  let c = 0
  return (progress, p, increase=0) => gears.reduce(([_x, _y], gear, i) => {
    let a = 0
    if (i===0) {
      c += increase
      a = c
    } else {
      a = c* 0.5
    }

    const angle = (progress + gear.radiaStart % 1) * gear.rotation
    const radius = (1+a)* baseRadius * gear.radia * gear.radiaAdj(p, i, _x, _y, baseRadius)
    return getXYRotation(
      angle * TWO_PI,
      radius,
      _x,
      _y
    )
  }
    ,
    [0, 0]
  )
}

function getRosettePoints(rad, gears, cycles=1, spacing=0, startOffset=0, pointCount=900, pointCountAddition=2) {
  const spirographFn = createSpirographFn(rad, gears)

  return times(
    (cycles*pointCount+pointCountAddition*cycles),
    p => {
      const _p = p + (pointCount*startOffset)
      return spirographFn(
        _p/(pointCount+pointCountAddition),
        _p,
        spacing*_p/pointCount
      )
    }
  )
}






export const coordsList = paths.map(pathToCoords)



export const props = { points, layers, radiaAdj, radiaChange, gearWaveAmplitude, gearWaveFrequency }