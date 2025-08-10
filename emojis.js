import attrs from './attrs.js'
import {mantras} from './affirmations.js'
import {CONTROL_STATE} from './controls.js'


const style = document.createElement('style')
document.body.appendChild(style)



const mantra = mantras[tokenData.tokenId]

const textShadow = (w, a) => [
  '0 0 0.05em #000',
  ...[attrs.startHue, ...attrs.alternateHues].map((hue, i) => `0 0 0.${w*(i+1)}em hsla(${hue + attrs.startHue}deg, 65%, 60%, ${a*100}%)`)
].join(',')


style.textContent = `

  :root {
    --shadow-width: 1;
  }

  .emoji {
    font-size: 15vmin;
    text-shadow: ${textShadow(1, 0.8)};
    opacity: 0.9;
    ${attrs.emojiInvert ? 'filter: invert(1)' : ''}
  }

  .dancing {
    animation: Dancing 4.5s ease-in-out infinite;
  }

  .growShrink {
    animation: GrowShrink 8s ease-in-out infinite;
  }




  #text {
    position: absolute;
    text-align: center;
    margin-top: 50vh;
    font-family: sans-serif;
    color: ${mantra.includes('GOLD') ? '#f8d35e' : '#fff'};
    font-size: 3.5em;
    font-size: 5vw;
    text-shadow: ${textShadow(1, 1)};
    opacity: 0.9;

  }



  @keyframes Dancing {
    0%, 100% {
      transform: rotate(-30deg);
    }

    50% {
      transform: rotate(30deg);
    }
  }

  @keyframes GrowShrink {
    0%, 100% {
      transform: scale(1);
    }

    50% {
      transform: scale(2);
    }
  }
`

const emojiLayer = document.createElement('div');

emojiLayer.style = `
  pointer-events: none;
  user-select: none;
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 1s;
`

let animationClass
if (attrs.emojiStrategy === 'dance') animationClass = 'dancing'
else if (attrs.emojiStrategy === 'growShrink') animationClass = 'growShrink'


emojiLayer.innerHTML = `
  ${attrs.emoji === 'CGK' ? '' : `<div id="emojiView" class="emoji ${animationClass}">${attrs.emoji}</div>`}
  <div id="text">${mantra}</div>
`


if (attrs.emoji === 'CGK') {
  const cgk = document.createElementNS('http://www.w3.org/2000/svg', 'svg')


  cgk.setAttribute('viewBox', '0 0 1713 1713')
  cgk.setAttribute('class', 'cgk')
  cgk.setAttribute('width', '1713')
  cgk.setAttribute('height', '1713')
  cgk.setAttribute('fill', 'none')
  cgk.xmlns = 'http://www.w3.org/2000/svg'
  cgk.style = `width: 35vmin; height: 35vmin; opacity: 0.9; filter: drop-shadow(0 0 1em hsl(${attrs.startHue}deg, 65%, 60%));`

  const cgkOutline = (w, c) => `
    <path d="M1464.02 1207.25L248.983 1207.25L856.5 155L1464.02 1207.25Z" stroke="${c}" fill="none" stroke-width="${w}"/>
    <circle cx="856.5" cy="856.5" r="${w/2}" fill="${c}"/>
    <path d="M469 856.443C657.5 530.945 1065 535.434 1244 856.443" stroke="${c}" fill="none" stroke-width="${w}"/>
    <path d="M1243 845.998C1054.5 1171.5 647 1167.01 468 845.999" stroke="${c}" fill="none" stroke-width="${w}"/>
  `



  cgk.innerHTML = [cgkOutline(155, '#000'), ...[attrs.startHue, attrs.alternateHues[0]].map((h, i) => {
    return cgkOutline(155 - (1 + i) * (155/(1 + attrs.alternateHues.length)), `hsl(${(h + attrs.startHue) % 360}deg, 65%, ${i % 2 ? 80 : 10}%)`)
  })].join('')

  emojiLayer.appendChild(cgk)
}


export function displayEmoji() {
  emojiLayer.style.opacity = 1
}

export function hideEmoji() {
  emojiLayer.style.opacity = 0
}

export function mountEmoji() {
  document.body.appendChild(emojiLayer);

  setTimeout(() => {
    hideEmoji()
    setInterval(() => {
      if (CONTROL_STATE.emojis) {
        displayEmoji()
        setTimeout(() => {
          hideEmoji()
        }, 30000) // every 30s
      }
    }, 300000) // every 5 min
  }, 15000)

}