// generateFiles.js
import { writeFileSync } from 'node:fs';


function generateAttrs(tokenData) {
  const int = parseInt

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


  const speed = 0.75
  // const speed = 2
  // const speed = 0
  const rotation = prb(.1) ? rnd(4) : 0
  const aura = prb(0.1)

  const rotationDirection = prb(.5) ? 1 : -1

  const startHue = rnd(0, 360)

  const bgColor = hsvToRgb(startHue+180, 1, 0.1)



  const rosetteType = chance(
    [12, 'normal'],
    [13, 'pointy'],
    [12, 'wavy'],
    [13, 'numismatic'],
  )


  const radiaChange = rnd(0.01, 0.2)

  const layerMult = rnd(1, 2)


  const colorStrategy = chance(
    [2, 'pure'],
    [1, 'rainbow'],
    [7, 'alternate'],
  )

  const alternateThickness = rndint(1, 7)
  const alternateHues = sample([
    // [180],
    // [60, 120, 180, 120, 60],
    // [120, 240, 120],
    // [90, 180, 270],
    // [330, 30, 180],
    [30, 60, 90, 120, 90, 60, 30],
    [40, 80, 40],
    [10, 20, 30, 40, 50, 60, 50, 40, 30, 20, 10],
    [30, 60, 90, 60, 30],
  ])

  const brainwaves = {
    delta: rnd(0.5, 4),
    theta: rnd(4, 8),
    alpha: rnd(8, 13),
    // beta: rnd(14, 30),
    // gamma: rnd(30, 100),
  }


  const bw = sample(Object.keys(brainwaves))
  const brainwave = brainwaves[bw]
  const toneAdj = rnd(0.5, 1.5) / 2


  const hasAura = prb(0.1) && !rotation

  const hasPump = prb(0.1)
  const adRate = chance(
    [1, [10, 30]],
    [4, [60, 150]],
    [44, [150,360]],
  )

  const emojiStrategy = chance(
    [1, 'dance'],
    [1, 'growShrink'],
  )


  const emoji = sample(['💸', '💰', '💎', '🪙', '🤑', '💷', '💴', '💵', '💶', '💲', '💰', '💹', '📈', '🍀', 'CGK'])
  const emojiInvert = prb(0.3)

  const defaultAffirmationSpeed = toneAdj < 0.35 ? 0.8 : 0.9


  const overrides = tokenData.attrOverrides || {}


  return {
    speed, rotation, rotationDirection, startHue, rosetteType, radiaChange, bgColor, colorStrategy, layerMult,
    alternateThickness, alternateHues, brainwave, bw, toneAdj, hasAura, hasPump, adRate, emoji, emojiStrategy, emojiInvert, defaultAffirmationSpeed,
    ...overrides
  }
}

// Example array of hashes
const hashes = [
  '0x900b3659952b8ed1dba65eb4859322aca9f9c03687947f89aff9886cb0261309',
  '0x8e2ec2e4f73e742511e065f0ac787a6e3db1a0a8198dd0150d8f76f179228b3f',
  '0x254a2872769b1e8053a116b0dc1b55ccedd0ae3f9f8f1c9f5c339060f417f06d',
  '0x39d4cceac5767ed511099a424698ddb6f73d4deda31d5207531eeda83488d0bd',
  '0x4d1e6f384783963dc82bb73498d235534aa9114d6f63546c8271b3e1e829f2ed',
  '0x54c694dd5102db07bfd24c7f5bc2b933e01c770d72724ce41c45eb847125a2ee',
  '0x99e1a3cd2e1d3881370445b6bd6b0764f8691200094e50da82375df631bebca6',
  '0x6d89a835a85d210a6d5fda21fef61865f072a26d805353d3931b19d5c7d1e485',
  '0x915ab560f4fc97f07b209570b115f83c64db4ad44f1d8cde3a7483ea1f796774',
  '0xabd9b5d8dedbd2ff75ba83cf087e00785f6616f30380e4eed7b39666c92ed3e9',
  '0x7e037ca532f7cfa6ff2b353fd5ee92eb3f753de23b55f584c1a64d1c48f3ce6a',
  '0x86503362f837cbfc45d85b46e33f671edbbfa5be5e0d25afc1005bcad553f41d',
  '0x20b9090dd20f17101dc712f5dc625aed0a5aa80aa0039cbc2781145a2b892094',
  '0xb7178f11cbbb50c47b4224a5554c6645ada404ca2828f74d0152d10e9e7a87f1',
  '0xfff319a8e81636ee0a0eb254536369725b969b919f5da5e130508cd249eed26b',
  '0x835487262f3f3a5f2a9081d333f8a8432d1b59f6fd73bdfb587cc3770d204b10',
  '0x395e8288f2975c19667552427491dd837f38fecc4069b098e32e3867aaf35974',
  '0x5d58350e975a18e4c1adadb1366dc94da4cf35904fbc00a328a69e45e86f6be7',
  '0x54126eeaa5413be0c76d06ad1836738f527a19dea4807dd3e7d70af7adfd72a0',
  '0x0629618e8bdac25b5634f047675423e4d6999310ee6d5a37c398dd6496aabe68',
  '0x737c6845c4031d592c15e01467f97e56dfe2b3da80cbcb5bb488f751fb656f54',
  '0x8e3a6644c64a50e1a1336a85b2d8483bbb81e563cf6e6936484b5f26237b28ba',
  '0xb39b3945d8e51acffb4cb8a37386a6e183b0f6d2c4ca2a8191ad6b06d2d265a4',
  '0xd1d273d97c4800dc8809b2f7f4740333b9e81386a220dcd364e9661c77b81a83',
  '0xadca39e64d98419acddca425ac91df56a786ce09a6a7de10e2053f83478a2220',
  '0x5e483cdb507ab50c8e9fb3ebfd76abff57f62ab609f351de01eb5605f3ecb32b',
  '0x3ff9f74630af2d8adcd84eb4f8910a31eefad6e4c41d2634c8e0149c1e62cca8',
  '0xaa5bac852d199745f0f1f90d4d985b6c00cf141226654a99d947d74f68bf96bf',
  '0x7e18e14756920b8d81cce790203b633dcecedd8661185cdcd4a033b87eb9b703',
  '0xff37c100f32574ff3024db323c4e694532e461ace39dca7ec0eba9816e94a327',
  '0xd6104436aa41b66483f0fde084454fcd25e36eae2adc2a1464cbf281e31a03f0',
  '0xc428cce1b1d329c78783e62cccb02b4f793fe5beb8ec4c2237f490f22221cb9c',
  '0x8e8f8f1a7194a3ccf650e6e955020422e6d68b457757b73b9c5d784cea674753',
  '0x646f52b4ac16f01d5e4c26ac08f62dbe199e9d857524c82f13ee7182ac6eff53',
  '0x7216f6331bc395bb35131707fab875e7dc4b15fbbfea482daec782daf8471d99',
  '0xfefc9987759c7b4e7354db5dc2105eb24fb0cedde6b632c46e3276acd345d918',
  '0x569903c4661e804d7f6c2e8d4099ba8ed9162bd4555f53f4113d2ed71f546602',
  '0xc829eaec700bd1c747d44df0d3c4add691433b5c7834add1726c9a041812c35d',
  '0x637a878ec37b93c48912ad1e3f92299bd5df6f585a8ed34c2442206b11d5d431',
  '0xab07ac6f884eafced603653e987aa59a75bb27fd7fe98c8a52018609258ae0fd',
  '0xcc07bb5c9e80e3c7d4d353383aa4e023390222e84774612606566594d8086d25',
  '0x1cd5be55b66d50cf9253d61d8f4275fb012ab46f59cce0294758d4cf2e132208',
  '0xaa64342e4c14c57540d2dc615c012ff84bec9f15c15cd5a1820e42256b7b5adc',
  '0xce0c3981cde8963af157bab1b9e53d312df1b8cf9450b4f8d28074fecf880491',
  '0x633da95c1e326285f088a082f9b58f34ea61c4d4881144073bdaf12270c409c6',
  '0x8e26ac98641f346af4dedc9f4135da61ce78302fadb1a6c0eda198800ecdddb2',
  '0x3c4d427254610dc2e8c1bdff4ecc792ed72c88ec59e4cba1e11abccca679f158',
  '0xe686690398ecad9a07f791e3ec1375b2b59877c4e44aa9901bccc2f68183d0ac',
  '0xc8b2d190ad45a785a60ad933973ee993f2381ec59f55cf47f1a8c146eebecd49',
  '0x600549008cd3a9f33dc22140924ded7d2faf0fda1beffc961caeb886edd20d2b',
]

const titles = [
  `Money Vortex: Binaural Beats for Wealth Manifestation [Subliminal Reprogramming]`,
  `Subliminal Wealth Reprogramming To Remove Money Blocks Deeply - Activate Abundance Mindset Now`,
  `(WARNING: POWERFUL) Manifest Infinite Wealth in 7 Minutes | 777Hz + 432Hz Miracle Frequency`,
  `Remove All Financial Blockages | 888Hz Abundance Pyramid | Magnetic Money Flow Meditation`,
  `888Hz Abundance Gateway – Remove Blocks, Receive Fortune`,
  `Divine Prosperity Download – Wealth Energy Reprogramming`,
  `Rich Life Activation | Fortune Alignment Sequence`,
  `[Magnetic Cash Flow] The Universe Has Chosen You`,
  `The Rich Timeline: Quantum Financial Upgrade ~ Listen for 15 Minutes to Attract Wealth`,
  `432Hz Abundance Reset Helps You Step Into Prosperity`,
  `888Hz Wealth Vortex – High Energy Money Magnetism`,
  `*Warning* (VERY STRONG), Prosperity Sequence to Remove All Wealth Barriers`,
  `Prosperity Field Expansion; Manifest Faster; Money Flows Easily to Me`,
  `Warning: Life-Changing Financial Alignment Trick`,
  `Golden Gate to ABUNDANCE (Step Through Now) 💸 Prosperity Sound Healing`,
  `Attract wealth: Manifest Like a Millionaire (Prosperity Session)`,
  `Instant Financial Breakthrough ~ Manifest Riches While You Sleep ~ Abundance Mindset Shift`,
  `Law of Attraction Money Flow | Attract Wealth in 7 Minutes`,
  `Jupiter’s Wealth Blessing + Manifest Luxury & Abundance`,
  `Miracle Manifestation | $100,000 Energy Shift Meditation`,
  `Reset Financial Karma: Infinite Money Flow Meditation`,
  `Attract Your First Million | Money Affirmation Sleep Track`,
  `Abundance DNA Repair 🔉 888Hz Prosperity Healing Session`,
  `Manifest Riches in 7 Days With Prosperity Sound Healing`,
  `*Warning* (VERY STRONG) Riches Flow to Me Easily; Abundance Frequency Music`,
  `[WARNING: POWERFUL] Quantum Wealth Activation | Prosperity Frequency Gateway`,
  `Millionaire Vibration Boost Divine Prosperity Sound Bath`,
  `Prosperity Codes Unlocked | Angel Number 77HZ`,
  `Attract Windfalls & Luck 🍀 Miracle Money Sound Healing`,
  `Financial Blessing Activation ~ Infinite Wealth Meditation ~ Unlock Abundance Now`,
  `Manifest $100,000 Fast 💵 432Hz + 777Hz Miracle Money Flow | Quantum Abundance Activation`,
  `Millionaire Vibration Shift 💸 Instant Wealth Energy | 432Hz Law of Attraction ~ Manifest Fortune Now`,
  `Financial Freedom 💰 888Hz + Angel Wealth Codes | Quantum Abundance Flow 💵 Instant Shift`,
  `Millionaire Vibration 💰 Wealth Mindset Reset | 432Hz + Angel Number 888Hz 💸 Abundance Portal`,
  `The Wealth Code 💸 Remove All Money Blocks | Infinite Abundance Gateway 💵 888Hz Meditation`,
  `Miracle Windfall $$$ Attract Luck, Fortune & Riches | Jupiter’s Prosperity Blessing`,
  `Cash Flow Activation Prosperity DNA Upgrade 888Hz Infinite Riches Receive Instantly`,
  `Instant Cash Magnet + Theta Mind Sync ~ Wealth Channel Open To Attract Now`,
  `Subliminal Prosperity Reset | Reprogram Your Wealth Frequency`,
  `[Warning] Very Powerful | Powerful Money Block Release Ahead | Listen Only If You Want Abundance`,
  `🧠 Subliminal Abundance Blueprint | Reprogram Your Financial Reality Unlock Prosperity Now`,
  `Erase Scarcity Beliefs + Manifest Wealth Effortlessly`,
  `Clear Limiting Ancestral Patterns To Align With The Effortless Flow of Wealth`,
  `Bring Positive Changes To Your Life | The Universe Will Help You Gain Abundance, Wealth & Prosperity`,
  `IMMEDIATE CASH ACTIVATION: Embrace Abundance Through Subliminal Ritual (777Hz)`,
  `(Warning) You Will Receive A Huge Amount Of Money | Unlimited Abundance Flow`,
  `Remove Limiting Beliefs And Attract Prosperity Now With Ease`,
  `Financial Energy Realignment 🤑 Unlock Riches Within 🤑 Manifest Abundance Naturally`,
  `Subliminal Wealth Reprogramming & Open the Gateway to Financial Freedom`,
  `Rewire Your Subconscious for Wealth | Remove Scarcity Patterns | Step Into Financial Freedom`,
]


const mantras = [
  'MONEY VORTEX',
  'ABUNDANCE GATEWAY',
  'ENDLESS PROSPERITY',
  'AFFLUENCE ZONE',
  'RICH FREQUENCY',
  'I AM A WEALTH CREATOR',
  'MILLIONAIRE MINDSET',
  'MONEY FINDS ME',
  'LAW OF ATTRACTION',
  'MONEY MULTIPLIER',
  'FORTUNE FOLLOWS ME',
  'WEALTH PORTAL',
  'PROSPERITY FINDS ME',
  'MONETARY VIBRATION',
  'WEALTH MAGNET',
  'INFINITE CASH',
  'UNLIMITED ABUNDANCE',
  'PROSPERITY MAGNET',
  'MONEY GATEWAY',
  'LIVE IN ABUNDANCE',
  'I DESERVE ABUNDANCE',
  'PROSPERITY FLOW',
  'PROSPERITY PATH',
  'I WILL SUCCEED',
  'DIVINE ABUNDANCE',
  'ABUNDANCE MINDSET',
  'UNLOCK WEALTH',
  'MONEY MAGNET',
  'WEALTH CHANNEL',
  'WEALTH GATEWAY',
  'MONEY FLOWS TO ME',
  'PROSPERITY RADIANCE',
  'FINANCIAL FREEDOM',
  'GOLDEN PROSPERITY',
  'PROSPERITY MINDSET',
  'LUCK FREQUENCY',
  'MY LIFE HAS VALUE',
  'I AM WEALTH',
  'WEALTH MANIFESTATION',
  'FINANCIAL SURPLUS',
  'GOLDEN ENERGY',
  'MONETARY EXPANSION',
  'THE UNIVERSE PROVIDES',
  'GOLDEN VORTEX',
  'I AM RICH',
  'INFINITE PROSPERITY',
  'WEALTH EXPANSION',
  'GOLDEN OPPORTUNITY',
  'INFINITE WEALTH',
  'I DESERVE TO BE RICH',
]

const HTML_IPFS_HASH = 'QmfLMCFvSpA4AKvgi17XTiAPXQn4M8fV6uEBqrJcyTfUqp'
const PNG_IPFS_HASH = 'QmcphLV3Ene1mf3xTTqVn5AEyMT8BarcoqGSSvMVP28WwZ'



// --- Create JSON ---
// const jsonContent = JSON.stringify(hashes, null, 2);

// --- Write files ---
// writeFileSync("hashes.json", jsonContent);



      // '[',
      //   string.concat('{ "trait_type": "Agreement Version", "value": "', agreementVersion, '" },'),
      //   string.concat('{ "trait_type": "Agreement Used", "value": "', agreementUsed ? 'True' : 'False', '" }'),
      // ']'



      // '{"name": "Burn Agreement v', agreementVersion,
      // '", "description": "By purchasing this token you implicitly agree to the terms of this agreement. Ownership of this NFT does not guarantee participation in a Burn Ceremony. Participation shall be left to the full discretion of the Burn Agent.'
      // '", "image": "', thumbnail,
      // '", "animation_url": "', agreement.agreementIdToMetadata(agreementVersion),
      // '", "attributes":', attrs,
      // '}'


function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function generateJSON(attrs, tokenData) {
  return JSON.stringify({
    name: titles[tokenData.tokenId],
    description: `
This is not a coincidence! You were meant to find this 🙏 Enter the Money Vortex to Manifest Wealth with Subliminal Reprogramming techniques. Tune In to the Millionaire Frequency and clear ALL of your Financial Blockages. This powerful Energy Session will help you attract Wealth and Abundance. Your Frequency determines your Fortune! You WILL receive a huge amount of Money

#BinauralBeats #MillionaireMediation #LawOfAttraction #ManifestMoney #GoldenOpportunity #CashFlowMindfulness #777Hz #888Hz #432Hz #AbundanceMindset #PositiveVibrations #SpiritualWealth #FinancialFreedom #MoneyVortex #VibrationalShift #Numisma #MiracleWindfall #LotteryJackpotWInner


Controls:
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

    `,
    image: `ipfs://${PNG_IPFS_HASH}/${tokenData.tokenId}.png`,
    animation_url: `ipfs://${HTML_IPFS_HASH}/${tokenData.tokenId}.html`,
    hash: tokenData.hash,
    tokenId: tokenData.tokenId,
    attributes: [
      {
        trait_type: 'Mantra',
        value: mantras[tokenData.tokenId]
      },
      {
        trait_type: 'Icon',
        value: attrs.emoji
      },
      {
        trait_type: 'Brain Wave',
        value: capitalize(attrs.bw)
      },
      {
        trait_type: 'Rosette Type',
        value: capitalize(attrs.rosetteType)
      },
      {
        trait_type: 'Spectrum',
        value: capitalize(attrs.colorStrategy)
      },
      {
        trait_type: 'Aura',
        value: attrs.hasAura ? 'true' : 'false'
      },
      {
        trait_type: 'Pump',
        value: attrs.hasPump ? 'true' : 'false'
      },
      {
        trait_type: 'Rotation',
        value: attrs.rotation > 0 ? 'true' : 'false'
      },
    ]
  }, null, 2)
}



for (let i = 0; i < hashes.length; i++) {
  const tokenData = { hash: hashes[i], tokenId: i }

  const attrs = generateAttrs(tokenData)
  const json = generateJSON(attrs, tokenData)

  writeFileSync(`./docs/metadata/json/${i}.json`, json);
}

console.log("✅ json created.");