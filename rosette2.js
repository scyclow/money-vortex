

const returnOne = () => 1
const wonkyStart = () => rnd(0, 1)
const evenStart = () => prb(0.5) ? 0 : 0.5
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

function getRosettePoints(rad, gears, cycles=1, spacing=0, startOffset=0, pointCount=900) {
  const spirographFn = createSpirographFn(rad, gears)

  return times(
    (cycles*pointCount+2),
    p => {
      const _p = p + (pointCount*startOffset)
      return spirographFn(
        _p/(pointCount+2),
        _p,
        spacing*_p/pointCount
      )
    }
  )
}

function getRosettePath(rad, gears, cycles=1, spacing=0, startOffset=0, pointCount=900, wavy=false, coords={x:0, y:0}) {
  const points = getRosettePoints(rad, gears, cycles, spacing, startOffset, pointCount, coords)

  const startIx = wavy ? points.length-1 : 0
  const x = coords.x ?? 0
  const y = coords.y ?? 0

  let d = `M ${points[startIx][0] + x} ${points[startIx][1] + y} ${wavy ? 'Q' : ''}`

  for (let i=0; i<points.length; i+=1) {
    d += ` ${points[i][0] + x},${points[i][1] + y}`
  }

  if (cycles === 1 && !wavy) d += ` ${points[0][0] + x},${points[0][1] + y}`


  return d
}

// function getRosettePath(rad, gears,x, cycles=1, spacing=0, startOffset=0, pointCount=900) {
//   const spirographFn = createSpirographFn(rad, gears)

//   const points = times(
//     (cycles*pointCount+2),
//     p => {
//       const _p = p + (pointCount*startOffset)
//       return spirographFn(
//         _p/(pointCount+2),
//         _p,
//         spacing*_p/pointCount
//       )
//     }
//   )

//   let d = `M ${points[0][0]} ${points[0][1]} `
//   // let d = `M ${points[points.length-1][0]} ${points[points.length-1][1]} Q`

//   for (let i=0; i<points.length; i+=1) {
//     d += ` ${points[i][0]},${points[i][1]}`
//   }
//   if (cycles === 1) d += ` ${points[0][0]},${points[0][1]}`


//   return d
// }

const shadowColor = '#000'

function drawRibbedRosette(x, y, minRad, layers, {gears, rosetteRadiaChange, rosetteRotation, dist, ...args}) {
  dist = dist || 15
  rosetteRadiaChange = rosetteRadiaChange || 0
  rosetteRotation = rosetteRotation || 0
  if (args.shadow) {
    drawRibbedRosette(x-2, y-2, minRad, layers, {
      gears,
      rosetteRadiaChange,
      rosetteRotation,
      ...args,
      shadow: false,
      stroke: shadowColor,
    })
  }

  times(layers, t => {
    const rad = t*dist + minRad
    const rosettePath = getRosettePath(
      rad,
      gears.map(g => ({ ...g, radia: g.radia - (t*rosetteRadiaChange)}))
    )

    svg.drawPath(x, y, rosettePath, {rotation: t*rosetteRotation, ...args })
  })
}

function drawLineRosette(x, y, minRad, maxRad, gears, args={}) {
  if (args.shadow) drawLineRosette(x, y, minRad, maxRad, gears, { stroke: shadowColor, ...args, shadow: false })
  const pointCount = args.pointCount || 100

  const im = args.innerGearModifier || (g => g)
  const om = args.outterGearModifier || (g => g)

  const innerSpirographFn = createSpirographFn(minRad, im(gears))
  const outterSpirographFn = createSpirographFn(maxRad, om(gears))
  const innerPoints = times(pointCount, p => innerSpirographFn(p/pointCount, p))
  const outterPoints = times(pointCount, p => outterSpirographFn(p/pointCount, p))
  innerPoints.forEach(([x1, y1], i) => {
    const [x2, y2] = outterPoints[i]
    svg.drawLine(x1+x, y1+y, x2+x, y2+y, args)
  })
}


