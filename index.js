import attrs from './attrs.js'

  import {coordsList, props} from './coordinates.js'
  import {createProgram} from './shaderBoilerplate.js'
  import {activateSound, muteSound} from './sound.js'
  import {CONTROL_STATE} from './controls.js'
  import {mountEmoji} from './emojis.js'
  import {displayPopup} from './sponsoredContent.js'
import {mantras} from './affirmations.js'




  const canvas = document.createElement('canvas');
  const gl = canvas.getContext("webgl")
  const dpr = window.devicePixelRatio || 1

  canvas.style.display = 'block';
  canvas.style.zIndex = '1';



  const { points, layers, radiaAdj, radiaChange, gearWaveAmplitude, gearWaveFrequency } = props



  const vsSource = `
    attribute vec2 a_position;
    uniform float u_time;
    uniform float u_animScale;
    uniform float u_aspect;
    uniform vec2 u_offset;
    uniform float u_rotation;


    void main() {
      float scale = mix(0.05, 1.0, u_animScale);

      float angle = u_rotation;
      float cosA = cos(angle);
      float sinA = sin(angle);
      vec2 rotatedPosition = vec2(
        a_position.x * cosA - a_position.y * sinA,
        a_position.x * sinA + a_position.y * cosA
      );

      vec2 pos = (rotatedPosition * scale) + u_offset * (u_animScale / 16.0);
      pos.x /= u_aspect;

      gl_Position = vec4(pos, 0.0, 1.0);
    }
  `;

  const fsSource = `
    precision mediump float;
    uniform vec4 u_color;
    uniform vec2 u_offset;

    void main() {
      gl_FragColor = u_color;
    }
  `;




function createPrograms(coordsList) {
  return coordsList.map(coords => {
    const program = createProgram(gl, vsSource, fsSource)
    gl.useProgram(program)


    const a_position = gl.getAttribLocation(program, "a_position")
    const u_time = gl.getUniformLocation(program, "u_time")
    const u_animScale = gl.getUniformLocation(program, "u_animScale")
    const u_aspect = gl.getUniformLocation(program, "u_aspect")
    const u_offset = gl.getUniformLocation(program, "u_offset")
    const u_color = gl.getUniformLocation(program, "u_color")
    const u_rotation = gl.getUniformLocation(program, "u_rotation")

    // Buffer setup
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coords), gl.STATIC_DRAW)

    gl.enableVertexAttribArray(a_position)
    gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0)


    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

    // BG color

    const bg = attrs.bgColor
    gl.clearColor(bg.r, bg.g, bg.b, 1)

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    return {
      a_position,
      u_time,
      u_animScale,
      u_rotation,
      u_aspect,
      u_offset,
      u_color,
      program,
      buffer,
      vertexCount: coords.length / 2
    }
  })
}

const programs = createPrograms(coordsList)






let ASPECT_RATIO = canvas.width / canvas.height


function resize() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  ASPECT_RATIO = canvas.width / canvas.height
  gl.viewport(0, 0, canvas.width, canvas.height)
}

resize()
window.onresize = resize










// let {r, g, b} = chance(
//   [1, {r: 1, g: 0.25, b: 0}],
//   [1, {r: 0, g: 1, b: 1}],
//   [1, {r: 1, g: 0.25, b: 1}],
// )

const rndVibrate = rnd() / 10




function colorAlternateHue (ix, thickness, offsets) {
  const offsetIx = Math.floor(ix/thickness) % offsets.length
  return offsets[offsetIx]
}



function colorStrategy(progress, ix, t) {
  if (attrs.colorStrategy === 'pure') return hsvToRgb(attrs.startHue, 0.65, 1)
  if (attrs.colorStrategy === 'rainbow') return hsvToRgb(attrs.startHue + (progress * 4000), 0.4  + 0.35 * progress, 1)
  if (attrs.colorStrategy === 'alternate') {

    const hueProgression = attrs.hasAura ? 1 : 10
    const h = attrs.startHue + colorAlternateHue(ix, attrs.alternateThickness, [0, ...attrs.alternateHues])
    return hsvToRgb(h % 360 + (progress * hueProgression), 0.4  + 0.35 * progress, 1)
  }
}


let frame = 0
function render(timeMs) {
  frame++
  gl.clear(gl.COLOR_BUFFER_BIT)

  const timeSec = timeMs * 0.001 * attrs.speed * CONTROL_STATE.speedModifer


  const drawProgram = (coords, i) => {
    const { a_position, u_time, u_animScale, u_aspect, u_offset, u_color, u_rotation, program, vertexCount, buffer } = coords
    gl.useProgram(program)
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.enableVertexAttribArray(a_position)
    gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0)
    gl.uniform1f(u_time, timeSec)
    gl.uniform1f(u_aspect, ASPECT_RATIO)



    // const animScale = (1 + (frame % 2 ? rndVibrate : 0)) * (0.3 * ((timeSec * 0.25 + (i + 1) * 5 / layers) % 10.0 )) ** 4.0
    // const animScale = (1 + (Math.random() / 100)) * (0.3 * ((timeSec * 0.25 + (i + 1) * 5 / layers) % 10.0 )) ** 4.0
    // const animScale = (0.3 * ((timeSec * 0.25 + (i + 1) * 5 / layers) % 10.0 )) ** 4.0
    const animScale = (0.2 * ((timeSec * 0.25 + (i + 1) * 5 / layers) % 10.0 )) ** 7.0
    const animScale2 = (0.3 * ((timeSec * 0.25 + (i + 1) * 5 / layers) % 10.0 )) ** 4.0


    // console.log(attrs.rotation, animScale2, (attrs.rotation * animScale2/81))


    function drawVertex(scale, animScale, r=1, g=1, b=1, a=1) {
      const progress = animScale/128 // btwn 0-1
      const alphaDetractor = Math.max(0, (progress - 0.6) * 5)

      gl.uniform1f(u_rotation, attrs.rotationDirection * (attrs.rotation * animScale2/81)**.8)
      gl.uniform1f(u_animScale, animScale * scale)
      gl.uniform4f(u_color, r, g, b, a - alphaDetractor)
      gl.drawArrays(gl.LINE_STRIP, 0, vertexCount)
    }


    const animProgress = 3*animScale/128; // btwn 0-3




    let {r, g, b} = colorStrategy(animProgress, i, frame)

    // ({r, g, b} = hsvToRgb(attrs.startHue + (animProgress * 130), 0.4  + 0.35 * animProgress, 1))

    // if (frame % 120 === 0 && i % 4 === 0) console.log(r, g, b)

    if (attrs.aura) drawVertex(25, animScale, 1, 1, 1, 0.5)
    // drawVertex(24.975 , animScale, 1, 1, 1, 0.5)

    const shadows = 12
    const lineSpace = 0.0025

    const sinProgress =  Math.PI * 2 * i / programs.length



    // const pumpFactor = getPumpFactor(i, frame)
    const phase = (frame - i * 10) / (programs.length * 5) // repeat every 5s

    const pumpFactor = Math.sin(
      // (frame - (i * attrs.brainwave * 4))
      2 * Math.PI * phase
    )


    // const pumpFactor = Math.sin((frame - (i * attrs.brainwave * 4)) / 60)

    // if (frame % 180 === 0 && (i === 0 || i === programs.length-1 || i === 1 || i === programs.length-2)) console.log(i, pumpFactor)

    // Math.sin((
    //   frame + sinProgress * i * 4
    // )/60)






    const aMod = ((pumpFactor + 1) / 2) * 0.9 + 0.1
    const scaleMod = attrs.hasPump
      ? 1 + pumpFactor/10
      : 1


    times(shadows, t => {
      const a = (0.4 - (t * (0.4/shadows))) * aMod
      drawVertex(1 * scaleMod - (t * lineSpace), animScale, r, g, b, a)
    })

    times(shadows, t => {
      const a = (0.4 - (t * (0.4/shadows))) * aMod
      drawVertex(1 * scaleMod + (t * lineSpace), animScale, r, g, b, a)
    })


    // TODO
    // rings should fade out instead of hard disappear


    drawVertex(1 * scaleMod, animScale, r, g, b, 0.8 * aMod)
    drawVertex(1.0025 * scaleMod, animScale, r, g, b, 0.8 * aMod)






    // drawVertex(1.005, 1, 0, 0, 1)

    if (attrs.hasAura) {
      const scaleMod2 = (Math.sin((frame - i)/60) + 10)
      const auraAMod = Math.min(0, Math.cos((frame - i)/60) + Math.PI * 0.1)
      drawVertex(1 * scaleMod2, animScale, r, g, b, 0.8 * aMod + auraAMod)
    }

    // drawVertex(1.0075, 1, 0, 0, 1)
  }

  programs.forEach(drawProgram)


  requestAnimationFrame(render)
}


requestAnimationFrame(render)



let soundActivated = false

canvas.style.cursor = 'pointer'
document.body.style.backgroundColor = rgbNormalizedToHex(attrs.bgColor)
canvas.style.backgroundColor = `hsl(${rnd(360)}deg, 100%, ${rnd(100)}%)`


canvas.onclick = () => {
  if (!soundActivated) {
    activateSound()
    soundActivated = true
  } else {
    muteSound()
    soundActivated = false
  }
}








//   .dollar {
//     position: absolute;
//     animation: blink 6s infinite;
//     pointer-events: none;
//     user-select: none;
//     z-index: 0;
//     font-family: sans-serif;
//     color: #fff;
//   }

//   @keyframes blink {
//     0%, 100% { opacity: 0.5; }
//     50% { opacity: 0; }
//   }

//   body {
//     margin: 0;
//     overflow: hidden;
//     background-color: black;
//   }
// `;

// const numDollars = 200;

// for (let i = 0; i < numDollars; i++) {
//   const dollar = document.createElement('div');
//   dollar.className = 'dollar';
//   dollar.innerText = '$';

//   const size = rnd() * 2 + 8; // font size between 12px and 36px
//   const x = rnd() * 100;
//   const y = rnd() * 100;

//   dollar.style.animationDelay = rnd(-6) + 's';
//   dollar.style.left = `${x}vw`;
//   dollar.style.top = `${y}vh`;
//   dollar.style.fontSize = `${size}px`;
//   dollar.style.opacity =rnd().toFixed(2); // random initial opacity

//   document.body.appendChild(dollar);
// }





const mantra = mantras[tokenData.tokenId]


const $html = document.getElementsByTagName('html')[0]
const addMetaTag = (args) => {
  const meta = document.createElement('meta')
  Object.keys(args).forEach(arg => {
    meta[arg] = args[arg]
  })

  document.head.appendChild(meta)
}


$html.translate = false
$html.lang = 'en'
$html.className = 'notranslate'

document.title = `Money Vortex #${tokenData.tokenId}: ${mantra}`

addMetaTag({ name: 'google', content: 'notranslate'})
addMetaTag({ charset: 'utf-8' })


  document.body.appendChild(canvas)
  mountEmoji()
  displayPopup()

  console.log('Enter the Money Vortex')
  console.log(`Controls:
    [Click]: Toggle sound
    "a": Affirmation toggle
    "s": Sponsored Content toggle
    "h": Hide/Display mantra
    "1": Speed: slow
    "2": Speed: normal
    "3": Speed: fast
    "4": Speed: very fast
    "5": Speed: dangerously fast
    "0": Speed: paused
    "H": Always display mantra
    "r": Reset all controls
    "←": Switch affirmation voice
    "→": Switch affirmation voice
    "↑": Increase affirmation speed
    "↓": Decrease affirmation speed
  `)