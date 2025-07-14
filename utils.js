const PI = Math.PI
const TWO_PI = Math.PI * 2
const HALF_PI = Math.PI / 2
const QUARTER_PI = Math.PI / 4
const int = parseInt
const min = Math.min
const max = Math.max
const sin = Math.sin
const cos = Math.cos
const abs = Math.abs
const atan2 = Math.atan2
const dist = (x1, y1, x2, y2) => Math.sqrt(Math.abs(x1 - x2) ** 2 + Math.abs(y1 - y2) ** 2)


let __randomSeed = int(tokenData.hash.slice(50, 58), 16)

function rnd(mn, mx) {
    __randomSeed ^= __randomSeed << 13
    __randomSeed ^= __randomSeed >> 17
    __randomSeed ^= __randomSeed << 5
    const out = (((__randomSeed < 0) ? ~__randomSeed + 1 : __randomSeed) % 1000) / 1000
    if (mx != null) return mn + out * (mx - mn)
    else if (mn != null) return out * mn
    else return out
}

const rndint = (mn, mx) => int(rnd(mn, mx))
const prb = x => rnd() < x
const posOrNeg = (x = 1) => x * (prb(0.5) ? 1 : -1)
const sample = (a, exclude = false) => {
    let population = exclude === false ?
        a :
        Array.isArray(exclude)
          ? a.filter(x => !exclude.includes(x))
          : a.filter(x => x !== exclude)

    return population[int(rnd(population.length))]
}
const exists = x => !!x
const last = a => a[a.length - 1]
const noop = () => {}
const iden = x => x

function times(t, fn) {
    const out = []
    for (let i = 0; i < t; i++) out.push(fn(i))
    return out
}

const lineStats = (x1, y1, x2, y2) => ({
    d: dist(x1, y1, x2, y2),
    angle: atan2(x2 - x1, y2 - y1)
})

function getXYRotation(deg, radius, cx = 0, cy = 0) {
    return [
        sin(deg) * radius + cx,
        cos(deg) * radius + cy,
    ]
}

function chance(...chances) {
    const total = chances.reduce((t, c) => t + c[0], 0)
    const seed = rnd()
    let sum = 0
    for (let i = 0; i < chances.length; i++) {
        const val =
            chances[i][0] === true ? 1 :
            chances[i][0] === false ? 0 :
            chances[i][0]
        sum += val / total
        if (seed <= sum && chances[i][0]) return chances[i][1]
    }
}

const rndChar = () => sample('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''))

function waitPromise(ms) {
    return new Promise(res => setTimeout(res, ms))
}


function hsvToRgb(h, s, v) {
  const c = v * s
  const hPrime = (h%360) / 60
  const x = c * (1 - Math.abs(hPrime % 2 - 1))
  let r = 0, g = 0, b = 0

  if (0 <= hPrime && hPrime < 1) {
    r = c; g = x; b = 0;
  } else if (1 <= hPrime && hPrime < 2) {
    r = x; g = c; b = 0;
  } else if (2 <= hPrime && hPrime < 3) {
    r = 0; g = c; b = x;
  } else if (3 <= hPrime && hPrime < 4) {
    r = 0; g = x; b = c;
  } else if (4 <= hPrime && hPrime < 5) {
    r = x; g = 0; b = c;
  } else if (5 <= hPrime && hPrime < 6) {
    r = c; g = 0; b = x;
  }

  const m = v - c
  return {
    r: r + m,
    g: g + m,
    b: b + m
  }
}

function hexToRgbNormalized(hex) {
  // Remove the hash if present
  hex = hex.replace(/^#/, '');

  // Expand shorthand (e.g., #f03) to full form (#ff0033)
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }

  if (hex.length !== 6) {
    throw new Error('Invalid hex color');
  }

  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;

  return { r, g, b };
}

function rgbNormalizedToHex({ r, g, b }) {
  const toHex = (value) => {
    const hex = Math.round(value * 255).toString(16);
    return hex.padStart(2, '0'); // Ensure two digits
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}