import attrs from './attrs.js'
import {CONTROL_STATE} from './controls.js'


const style = document.createElement('style');
document.body.appendChild(style);

style.textContent = `
  .emoji {
    animation: DancingFading 12s linear infinite;
    font-size: 10vmin;
  }




  @keyframes DancingFading {
    0%, 100% {
      opacity: 0;
    }

    22% {
      transform: rotate(30deg);
    }
    33% {
      opacity: 0;
      transform: rotate(-30deg);
    }
    40% {
      opacity: 1;
    }
    44% {
      transform: rotate(30deg);
    }
    55% {
      transform: rotate(-30deg);
    }
    60% {
      opacity: 1;
    }
    66% {
      opacity: 0;
      transform: rotate(30deg);
    }
    77% {
      transform: rotate(-30deg);
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
  transition: 250ms;
`


emojiLayer.innerHTML = `<div id="emojiView" class="emoji">${attrs.emoji}</div>`



export function displayEmojis() {
  document.body.appendChild(emojiLayer);


  if (CONTROL_STATE.emojis) {
    document.getElementById('emojiView').style.opacity = '1'
  } else {
    document.getElementById('emojiView').style.opacity = '0'
  }
}