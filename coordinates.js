
function genPointyType() {
  return {
    gearWaveFrequency: 4,
    points: 1800-4,
    layers: 40,
    gearWaveAmplitude: 0.04,
    radiaChange: rnd(0.005, 0.1) * 2,
    radiaAdj: (p, i, _x, _y, baseRadius, prevRadius) => {
      const progress = p / points
      return 1 + Math.abs(Math.sin((p/gearWaveFrequency)) * gearWaveAmplitude) * -1
    }
  }
}


function genWavyType() {
  return {
    gearWaveFrequency: 4,
    points: 900+40,
    layers: 40,
    gearWaveAmplitude: 0.04,
    radiaChange: rnd(0.0005, 0.01),
    radiaAdj: (p, i, _x, _y, baseRadius, prevRadius) => {
      const progress = p / points
      return 1 + Math.sin((p/points)*(points/gearWaveFrequency)) * gearWaveAmplitude
    }
  }
}

function genNormalType() {
  return {
    gearWaveFrequency: 4,
    points: 900,
    layers: 40,
    gearWaveAmplitude: 0,
    radiaChange: rnd(0.005, 0.1) * 2,
    radiaAdj: (p, i, _x, _y, baseRadius, prevRadius) => {
      const progress = p / points
      return 1 + Math.sin((p/points)*(points/gearWaveFrequency)) * gearWaveAmplitude
    }
  }
}




const { points, layers, radiaAdj, radiaChange, gearWaveAmplitude, gearWaveFrequency } = chance(
  [1, genPointyType()],
  [1, genWavyType()],
  [1, genNormalType()],
)



const gears = generateGears(8, 15, .1, chance(
  [55, returnOne],
  [45, evenStart],
))

gears[0].radiaAdj = radiaAdj


const gearModifier = (gears, t, totalLayers) => gears.map(g => ({
  ...g,
  radia: g.radia - (t*radiaChange/totalLayers)
}))



const paths = []

const generatePath = (t) => {
  const g = gearModifier(gears, t, layers)
  const p = getRosettePoints(
    200,
    g,
    1,
    0,
    0,
    points,
  )

  p.push(p[0].slice())
  paths.push(p.flat())
}




times(layers, t => generatePath(t))
times(layers, t => generatePath(layers - t))


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

export const coordsList = paths.map(pathToCoords)


export const props = { points, layers, radiaAdj, radiaChange, gearWaveAmplitude, gearWaveFrequency }