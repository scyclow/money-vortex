import attrs from './attrs.js'

import {CONTROL_STATE} from './controls.js'


const allAds = [
  { copy: `YOUR SHIP HAS FINALLY COME IN`, href: 'https://0ms.co/cruise-winner.html"'},
  { copy: `LEARN ABOUT THE MONEY-MAKING OPPORTUNITY OF A LIFETIME`, href: 'https://moneymakingopportunity.eth.limo/'},
  { copy: `WAKE UP TO A RICHER TOMORROW`, href: 'https://smarthome.steviep.xyz'},
  { copy: `MANIFESTING WEALTH HAS NEVER BEEN EASIER`, href: 'https:/steviep.xyz/cryptogodking'},
  { copy: `10X YOUR WEALTH WITH THIS ONE TRICK`, href: 'https://10eth.0ms.co/'},
  { copy: `MAKE YOUR FINANCIAL DREAMS COME TRUE`, href: 'https://finsexy.com/doms/VinceSlickson'},
  { copy: `CLICK HERE TO GET RICH QUICK`, href: 'http://0ms.co/fastcashmoneybiz.html'},

  { copy: `MAKE FAST CASH NOW`, href: 'https://fastcashmoneyplus.biz'},
  { copy: `THIS IS THE OPPORTUNITY YOU'VE BEEN LOOKING FOR`, href: 'https://fastcashmoneyplus.biz'},
  { copy: `LEARN THE SECRET TRICK MILLIONARES DON'T WANT YOU TO KNOW ABOUT`, href: 'https://fastcashmoneyplus.biz'},
  { copy: `YOU WOULDN'T BELIEVE THESE 3 SIMPLE THINGS MILLIONARES USE TO GET RICH`, href: 'https://fastcashmoneyplus.biz'},
]



const style = document.createElement('style')
document.body.appendChild(style)

style.textContent = `

  a:visited {
    color: #00e
  }


  @keyframes BorderBlink {
    0%, 100% {
      border-style: solid;
    }

    50% {
      border-style: dashed;
    }
  }

`



let adCount = 0



export function displaySinglePopup() {
  const adContent = sample(allAds)

  if (CONTROL_STATE.popups) {
    const newPopup = document.createElement('div')
    newPopup.id = `sc-window-${adCount}`
    newPopup.className = `sc-window`

    const borderBlink = prb(0.3) ? `animation: BorderBlink ${rnd(0.5, 2)}s steps(2, start) infinite;` : ''


    newPopup.style = `
      max-width: 200px;
      background: hsl(${attrs.startHue}deg, 50%, 90%);
      border: ${rnd(1, 6)}px solid #000;
      padding: 0.5em;
      padding-bottom: 0.75em;
      font-size: ${rnd(0.75, 2)}em;
      position: absolute;
      top: ${rnd(0, 85)}vh;
      left: calc(${rnd(15, 100)}vw - 200px);
      z-index: 2;
      font-family: sans-serif;
      text-align: center;
      box-shadow: 2px 2px 10px #888;
      ${borderBlink};
    `


    newPopup.innerHTML = `
    <div>
      <div style="cursor: pointer; text-align: right; font-size: 0.5em" id="sc-window-${adCount}-x">X</div>
      <a href="${adContent.href}" target="_blank">${adContent.copy}</a>
    </div>`



    document.body.appendChild(newPopup);
    document.getElementById(`sc-window-${adCount}-x`).onclick = () => {
      newPopup.remove()
    }
    adCount++
  }

}

export function displayPopup() {
  const nextAd = rnd(...attrs.adRate) * 1000

  setTimeout(() => {
    displaySinglePopup()
    displayPopup()
  }, nextAd)
}