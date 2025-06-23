

const pen = {
  black: '#000',
  white: '#fff',
  red: '#e21432',
  orange: '#ff6d07',
  yellow: '#fdb603',
  lime: '#81c616',
  green: '#047b41',
  teal: '#00b1d3',
  blue: '#0303a7',
  purple: '#8729cc',
  magenta: '#d31479',
  pink: '#f92c88',
}

const penColorsDark = [
  pen.blue,
  pen.green,
  pen.teal,
  pen.red,
]

const penColorsLight = [
  pen.pink,
  pen.orange,
]

const penColors = [...penColorsDark, ...penColorsLight]
const penColorsAll = [pen.black, ...penColors]
const penBase = chance(
  [80, pen.black],
  [5, pen.blue],
  [5, pen.green],
  [5, pen.teal],
  [5, pen.red],
)
