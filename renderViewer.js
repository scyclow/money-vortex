const fs = require('fs')


function times(t, fn) {
  const out = []
  for (let i = 0; i < t; i++) out.push(fn(i))
  return out
}

function randomHash () {
  let hash = '0x'
  for (let i = 0; i < 64; i++) {
    hash += Math.floor(Math.random() * 16).toString(16)
  }
  return hash
}


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

const hashes = [
  '0xbb9429609acbc17710e0db852410859cdbe0318e0fbae64e0efaf9344c26b224',
  '0xab07ac6f884eafced603653e987aa59a75bb27fd7fe98c8a52018609258ae0fd',
  '0xdd96fa272e838cd45cdff95de2d6f39eb6069a6b3feb743704e2c1bd0efc4188',
  '0x88e6f676f2f2037e4a7922f2d0c97dc87529005a19d558e0edf498e12a86130f',
  '0x99e1a3cd2e1d3881370445b6bd6b0764f8691200094e50da82375df631bebca6',
  '0xc9a721881c9886d24e3ff92ab9216fee7ac796608cece1dd538c98ab424625f0',
  '0x6db387d43b0f4870d463baea5fc45fd473a84aa1d2cb0da54887ab96079cc36f',
  '0xcc07bb5c9e80e3c7d4d353383aa4e023390222e84774612606566594d8086d25',
  '0x8e2ec2e4f73e742511e065f0ac787a6e3db1a0a8198dd0150d8f76f179228b3f',
  '0x6d89a835a85d210a6d5fda21fef61865f072a26d805353d3931b19d5c7d1e485',
  '0x254a2872769b1e8053a116b0dc1b55ccedd0ae3f9f8f1c9f5c339060f417f06d',
  '0x7e7b300d8fd48e29432d2665e185725214d15bdd0ddf8dee2181c132750ce753',
  '0x39d4cceac5767ed511099a424698ddb6f73d4deda31d5207531eeda83488d0bd',
  '0x4d1e6f384783963dc82bb73498d235534aa9114d6f63546c8271b3e1e829f2ed',
  '0x54c694dd5102db07bfd24c7f5bc2b933e01c770d72724ce41c45eb847125a2ee',
  '0x9d2e95c42cac4ade1704735567f97467e69c30c9f7f9150a14f462a2d38551ee',
  '0xa2d9ebd1e66d95a251cca183229f8642e744101a45fd91094b82e6096623659d',
  '0x3780cd495367ab67269e34172975d4ae1fac0ed90e614affaab3712550a2bf04',
  '0x6305ec58d77a94eae235cfec4f5154b83ebb3c9ba645297605f41cf30bf8a70f',
  '0x285bf8c22511ed1ce33a0eaaecaffb4024f83170ada1c114fa64824fc779d2f8',
  '0xc34d1bb40bc41c69eb43c8cf77ec2a63399e1bdcd8cb6fc52256cc708ecee8ce',
  '0x915ab560f4fc97f07b209570b115f83c64db4ad44f1d8cde3a7483ea1f796774',
  '0x15e5d3db35d6e61d3c9e56c5dd6a65f1b3d4edae9938df6e91a2145809b70008',
  '0xe436e3767b5e3c36a5d194ecfeb0f8ee6f5f1e30e753394e86513319d3abed96',
  '0xabd9b5d8dedbd2ff75ba83cf087e00785f6616f30380e4eed7b39666c92ed3e9',
  '0x7e037ca532f7cfa6ff2b353fd5ee92eb3f753de23b55f584c1a64d1c48f3ce6a',
  '0x86503362f837cbfc45d85b46e33f671edbbfa5be5e0d25afc1005bcad553f41d',
  '0x20b9090dd20f17101dc712f5dc625aed0a5aa80aa0039cbc2781145a2b892094',
  '0xa020491c07053ddaa6477ddc7b579d2de4715cd4bb22f4f4e36f432359409e3e',
  '0x4eaaad27e0403089d47594cab170e8bd7b6922d72015bac52b552ad89776ade4',
  '0xb7178f11cbbb50c47b4224a5554c6645ada404ca2828f74d0152d10e9e7a87f1',
  '0x5c06bf8515e0ff4273fa6ec02ed0d3772d08f1e35f49be230333083b557cfe53',
  '0xfff319a8e81636ee0a0eb254536369725b969b919f5da5e130508cd249eed26b',
  '0xa53790961a7169cdf71b60cf5a3c865a614f7f2b5c74e8344cafb18d098831fa',
  '0x2f17277684ffd184a1a1df916f870cdc8d7194a138486316cd6d08b13f7a242b',
  '0x835487262f3f3a5f2a9081d333f8a8432d1b59f6fd73bdfb587cc3770d204b10',
  '0x877619b7ab545f229c9e19ff75f953c1c9ca34e114373ce9919abbfe715d5e4f',
  '0x71534a3c55182dec7a3e7aa5d5ce74687ec1fabf55ba67719785e5cedaed59ab',
  '0x5de33a06fd8d72f9f69536a8126bdc8fd256143545e620bb0c1abe91119d8259',
  '0x1cd5be55b66d50cf9253d61d8f4275fb012ab46f59cce0294758d4cf2e132208',
  '0xcacbd6949ff61b2b0814a565c0d8e9caeeaef7bfce9f7cf04a90b097fae1c004',
  '0x395e8288f2975c19667552427491dd837f38fecc4069b098e32e3867aaf35974',
  '0x5d58350e975a18e4c1adadb1366dc94da4cf35904fbc00a328a69e45e86f6be7',
  '0xfefc9987759c7b4e7354db5dc2105eb24fb0cedde6b632c46e3276acd345d918',
  '0x900b3659952b8ed1dba65eb4859322aca9f9c03687947f89aff9886cb0261309',
  '0xd817d585dd02a7e6e2460953e0a092732e67468690bae657afa3ba91e3e88cd4',
  '0x54126eeaa5413be0c76d06ad1836738f527a19dea4807dd3e7d70af7adfd72a0',
  '0x0629618e8bdac25b5634f047675423e4d6999310ee6d5a37c398dd6496aabe68',
  '0x7fc4b591ece8686e45877c14a5c583fc3233b576d4dfe447eef13c9169353ed2',
  '0x1b3e54758125dbd649877ea9d5f847db8860c40f5d4af6188fec90da9ec2dd75',
  '0x1c6d7c40ccf3dc43f7b3f33f8e5b6c0c6c44dec54a2c7e060a89ecbb5729dc25',
  '0xc05eb89708d2766f74fd34142ceeb9c2b2f0985642baef17cc7583e82d9f28b1',
  '0x737c6845c4031d592c15e01467f97e56dfe2b3da80cbcb5bb488f751fb656f54',
  '0x8e3a6644c64a50e1a1336a85b2d8483bbb81e563cf6e6936484b5f26237b28ba',
  '0xb39b3945d8e51acffb4cb8a37386a6e183b0f6d2c4ca2a8191ad6b06d2d265a4',
  '0xd9d8438ddd613f28d00459511addbdf6696f5273f3ddd39756d5eaf5b65b1825',
  '0xe9b1e85c4f411d035cd5b490f006d0da9dd2d062b8e43794195c52e7b17e824f',
  '0xd1d273d97c4800dc8809b2f7f4740333b9e81386a220dcd364e9661c77b81a83',
  '0x05d6845d52cc20d454c606da72bda277bb17f968ed28c424ac0fd71bcbda7f74',
  '0xf76ac6f4381e7a520b741d717d4ef3a215945facef2205ba676d13c484e4f6cc',
  '0xb4a9ac16e5fc650cae2fae98951fde2e39ecae2c2fb73fe6f694b58537b94ecd',
  '0xadca39e64d98419acddca425ac91df56a786ce09a6a7de10e2053f83478a2220',
  '0x420f88e61cddca497f782862cd368d64bd05d4f50fd81874621bf7c26057af7b',
  '0x5e483cdb507ab50c8e9fb3ebfd76abff57f62ab609f351de01eb5605f3ecb32b',
  '0x3ff9f74630af2d8adcd84eb4f8910a31eefad6e4c41d2634c8e0149c1e62cca8',
  '0xaa5bac852d199745f0f1f90d4d985b6c00cf141226654a99d947d74f68bf96bf',
  '0xd458d81522c4761c02556e9b5da29f55f1cb6058c0d2c2305fe721639e26731d',
  '0xa171e71dc07750c311d239f5e20e2cd53637d46802675fd45b9d878ef40cdedb',
  '0x312ce266778793807655aa8bafb22219003cb91824e339fbbe4e7ec65d6a34e6',
  '0x7e18e14756920b8d81cce790203b633dcecedd8661185cdcd4a033b87eb9b703',
  '0xd3c9ddb6eb3772b7f6cd522c22ef020dcadb5bca361303e9a8c370e61fabaadf',
  '0x9614ecdcc3756531423edda444b5436fd5df3136b336497dd0e1644eca147efd',
  '0xff37c100f32574ff3024db323c4e694532e461ace39dca7ec0eba9816e94a327',
  '0xfc6d5868a413edcd752cc7c708167370a47062b10320367afd69373bd8a635d1',
  '0xeabf732844d5b547b07ea55e206e94b0a231d580af6ed8a93d99052738456819',
  '0x8a13f249a272100278cb083974701e0c3ff19537ecd4a22d27eebca92c867cf3',
  '0x82f279d6452d3d05c91934f5188582efea6235429ddb19689f68d8b769fc4baf',
  '0xd6104436aa41b66483f0fde084454fcd25e36eae2adc2a1464cbf281e31a03f0',
  '0x4a753b9452d0dfb62b6a1feef26448952a4eb12bb39aab381fd543947a04b291',
  '0xc428cce1b1d329c78783e62cccb02b4f793fe5beb8ec4c2237f490f22221cb9c',
  '0xe9776f4b6efd8464256f2de3d1d9a0e57a6c4816ddba95b6c91deb2855c6b6be',
  '0xfb561319431428cd6c7b7b015391e3b1974147b07d986820efbb5b5382ab2fc3',
  '0x1b2d293bc3cf4d8de4399359d4613240e3a3c839de14002a2caa346f88317911',
  '0xc52a251e3643cf08697053b0c5f23e94f0037c62c16521de1493259902063ae7',
  '0x8e8f8f1a7194a3ccf650e6e955020422e6d68b457757b73b9c5d784cea674753',
  '0x7ef7935f164b536ed1046d86bded52c6b76327f8a804e8a33775a8ade51abd06',
  '0xf36dd12a68f9178ea5dd6663d7187e591eddbeee73bc29acdd1af384c07e4783',
  '0x883497b9602f5bfdcf45412731a8f5eba4a16edfe244a3bd34795ed35a90cb12',
  '0xd08c6bb72fd75e9ed7f214c0a1684eb05cbc2c6c08d7a19ff67d8a2c639138ef',
  '0x646f52b4ac16f01d5e4c26ac08f62dbe199e9d857524c82f13ee7182ac6eff53',
  '0x0f4891ee324132942db7a71bb5d4dcd411cfd5568951d1db58d6aadbc5857279',
  '0xffaeba99111ae4af9380ed0c5f188bf9d1637fa48d482e67cf10aaaab3bc2310',
  '0x8a10cf033942307b4b126d4e1a65071cdc6c2080c23f6f6ef937a52c2ceb36bc',
  '0x7216f6331bc395bb35131707fab875e7dc4b15fbbfea482daec782daf8471d99',
  '0xfe149c96244d78ab8ed11e33b9b26e47ec386291eb6038e7a2e8122bb6ddf55d',
  '0x569903c4661e804d7f6c2e8d4099ba8ed9162bd4555f53f4113d2ed71f546602',
  '0xc719777d0bfd410ed47965412085b219e3eae40443fbd0cdc5154d6bfcdb6167',
  '0xaa64342e4c14c57540d2dc615c012ff84bec9f15c15cd5a1820e42256b7b5adc',
  '0x013ae23c3dfb3f03a1d804798a9b90564dec5916be7955b439b0c93c40561496',
  '0xc829eaec700bd1c747d44df0d3c4add691433b5c7834add1726c9a041812c35d',
  '0x47956912943152dc882573361f111fba1d5c1590766e9b54cd1f9f8d8694a813',
  '0xce0c3981cde8963af157bab1b9e53d312df1b8cf9450b4f8d28074fecf880491',
  '0x637a878ec37b93c48912ad1e3f92299bd5df6f585a8ed34c2442206b11d5d431',
  '0xf29773018dcdfb4feb559eeb2134319a13fc3490f24f16df4f0a7555ea52c6d9',
  '0x501448f2f6a4ec43a78de9d952708e609f1dde7d8883ad184e4563973b7a44db',
  '0xd7f2ac9bef4c996e0b12f847d57c42e831f92aae0c052e8c8630594bab1e8ba1',
  '0x633da95c1e326285f088a082f9b58f34ea61c4d4881144073bdaf12270c409c6',
  '0x600549008cd3a9f33dc22140924ded7d2faf0fda1beffc961caeb886edd20d2b',
  '0xc8b2d190ad45a785a60ad933973ee993f2381ec59f55cf47f1a8c146eebecd49',
  '0x2a01d618a79961ad54927debaa29d89309984061f975e93cac954ec38294c5bb',
  '0xe686690398ecad9a07f791e3ec1375b2b59877c4e44aa9901bccc2f68183d0ac',
  '0x3c4d427254610dc2e8c1bdff4ecc792ed72c88ec59e4cba1e11abccca679f158',
  '0x8e26ac98641f346af4dedc9f4135da61ce78302fadb1a6c0eda198800ecdddb2',
  '0xa8b6b9a2c519cfcd85f16cbf0d6b36bc227c32283a06b870a945f6b8feac59fc',
  '0xdb4e83a09a221266675fc278d7bd76a329cd2890dbb48dcc7382ecadd1056374',
  '0xadd6c368dc79169e1fd83bd60695f3d49dff656a3017ec477b33d4a0a8162968',
  '0xeb33d01b038fb6db7ec0913041bfda8ec1ba54aab7bfca286c51c2e87ffe8bbb',
]


const data = hashes.map((hash, i) => {
  const tokenData = {
    hash,
    tokenId: i % 50
  }

  const attrs = generateAttrs(tokenData)

  return { attrs, tokenData }
})



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



fs.writeFileSync(`./viewer/index.html`, `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <title>Money Vortex Viewer</title>
      <style>
        img {
          max-width: 500px;
          height: auto
        }

        .selected {
          background: #0f0;
        }
      </style>
    </head>

    <body>
      <h1>Money Vortex Viewer</h1>

      <div style="display: flex">
        <div style="width: 250px">

          <div id="breakdown" style="position: fixed; height: 90vh; overflow: scroll"></div>
        </div>

        <div>
          ${data.map((d, i) => `
            <div style="border: 1px solid; padding: 0.25em; margin: 0.5em">
              <h2>#${i} ${titles[i % 50]}</h2>
              <label id="select-label-${i}" style="display: block; border: 1px solid; padding: 0.1em; cursor: pointer">
                <input id="select-${i}" type="checkbox" onclick="selectOutput(${i}, this.checked)">
              </label>
              <a href="http://localhost:54355?hash=${d.tokenData.hash}&tokenId=${d.tokenData.tokenId}" target="_blank">Preview</a>

              <div style="display: flex; justify-content: space-between">

                <table style="margin-right: 1em">
                  <tr>
                    <td>Rotation</td>
                    <td>${d.attrs.rotation > 0}</td>
                  </tr>
                  <tr>
                    <td>Hue</td>
                    <td>${d.attrs.startHue}</td>
                  </tr>
                  <tr>
                    <td>Rosette Type</td>
                    <td>${d.attrs.rosetteType}</td>
                  </tr>
                  <tr>
                    <td>Color Strat</td>
                    <td>${d.attrs.colorStrategy}</td>
                  </tr>
                  <tr>
                    <td>Brainwave</td>
                    <td>${d.attrs.bw}</td>
                  </tr>
                  <tr>
                    <td>Tone Adjustment</td>
                    <td>${d.attrs.toneAdj}</td>
                  </tr>
                  <tr>
                    <td>Pump</td>
                    <td>${d.attrs.hasPump}</td>
                  </tr>
                  <tr>
                    <td>Aura</td>
                    <td>${d.attrs.hasAura}</td>
                  </tr>
                  <tr>
                    <td>Ad Rate</td>
                    <td>${d.attrs.adRate}</td>
                  </tr>
                  <tr>
                    <td>Emoji</td>
                    <td>${d.attrs.emoji}</td>
                  </tr>
                </table>
                <a href="http://localhost:54355?hash=${d.tokenData.hash}&tokenId=${d.tokenData.tokenId}" target="_blank">
                  <img src="./thumbnails/${i}-${d.tokenData.hash}.png" alt="./thumbnails/${i}-${d.tokenData.hash}.png"></img>
                </a>
              </div>
              <textarea style="width: 200px; height: 100px" id="notes-${i}" onchange="saveNotes(${i}, this)"></textarea>
            </div>
          `).join('')}

        </div>
      </div>






      <script>

      const attributesArray = ${JSON.stringify(data.map(d => d.attrs))}
      const hashesArray = ${JSON.stringify(data.map(d => d.tokenData.hash))}




function saveNotes(id, textarea) {
  localStorage.setItem('notes-' + id, textarea.value);
}



const selectedOutputs = new Set(
  JSON.parse(localStorage.getItem('selectedOutputs') || '[]')
);


const aggregates = {
  selectedCount: 0,
  rotationCount: 0,
  hasAuraCount: 0,
  hasPumpCount: 0,
  startHueBuckets: {
    red: 0,
    yellow: 0,
    green: 0,
    cyan: 0,
    blue: 0,
    magenta: 0
  },
  colorStrategyCounts: { pure: 0, rainbow: 0, alternate: 0 },
  rosetteTypeCounts: { normal: 0, pointy: 0, wavy: 0, numismatic: 0 },
  brainwaveCounts: { delta: 0, theta: 0, alpha: 0 },
  adRateBuckets: { '10-30': 0, '60-150': 0, '150-360': 0 },
  toneAdjBuckets: { '0.5-0.8': 0, '0.8-1.1': 0, '1.1-1.5': 0 },
  emojiCounts: {},
  selectedHashes: new Set()
};

function bucketStartHue(h) {
  h = (h + 360) % 360;
  if (h >= 330 || h < 30) return 'red';
  if (h >= 30 && h < 90) return 'yellow';
  if (h >= 90 && h < 150) return 'green';
  if (h >= 150 && h < 210) return 'cyan';
  if (h >= 210 && h < 270) return 'blue';
  return 'magenta';
}

function bucketAdRate(adRate) {
  var min = adRate[0];
  var max = adRate[1];
  if (min === 10 && max === 30) return '10-30';
  if (min === 60 && max === 150) return '60-150';
  if (min === 150 && max === 360) return '150-360';
  return 'unknown';
}

function bucketToneAdj(toneAdj) {
  if (toneAdj < 0.8) return '0.5-0.8';
  if (toneAdj < 1.1) return '0.8-1.1';
  return '1.1-1.5';
}

function addAttributes(attr) {
  aggregates.selectedCount++;
  if (attr.rotation !== 0) aggregates.rotationCount++;
  if (attr.hasAura) aggregates.hasAuraCount++;
  if (attr.hasPump) aggregates.hasPumpCount++;

  var hueBucket = bucketStartHue(attr.startHue);
  aggregates.startHueBuckets[hueBucket]++;

  aggregates.colorStrategyCounts[attr.colorStrategy] = (aggregates.colorStrategyCounts[attr.colorStrategy] || 0) + 1;
  aggregates.rosetteTypeCounts[attr.rosetteType] = (aggregates.rosetteTypeCounts[attr.rosetteType] || 0) + 1;
  aggregates.brainwaveCounts[attr.bw] = (aggregates.brainwaveCounts[attr.bw] || 0) + 1;

  var adRateBucket = bucketAdRate(attr.adRate);
  aggregates.adRateBuckets[adRateBucket] = (aggregates.adRateBuckets[adRateBucket] || 0) + 1;

  var toneBucket = bucketToneAdj(attr.toneAdj);
  aggregates.toneAdjBuckets[toneBucket] = (aggregates.toneAdjBuckets[toneBucket] || 0) + 1;

  aggregates.emojiCounts[attr.emoji] = (aggregates.emojiCounts[attr.emoji] || 0) + 1;
}

function removeAttributes(attr) {
  aggregates.selectedCount--;
  if (attr.rotation !== 0) aggregates.rotationCount--;
  if (attr.hasAura) aggregates.hasAuraCount--;
  if (attr.hasPump) aggregates.hasPumpCount--;

  var hueBucket = bucketStartHue(attr.startHue);
  aggregates.startHueBuckets[hueBucket]--;

  aggregates.colorStrategyCounts[attr.colorStrategy]--;
  aggregates.rosetteTypeCounts[attr.rosetteType]--;
  aggregates.brainwaveCounts[attr.bw]--;

  var adRateBucket = bucketAdRate(attr.adRate);
  aggregates.adRateBuckets[adRateBucket]--;

  var toneBucket = bucketToneAdj(attr.toneAdj);
  aggregates.toneAdjBuckets[toneBucket]--;

  aggregates.emojiCounts[attr.emoji]--;
  if (aggregates.emojiCounts[attr.emoji] === 0) {
    delete aggregates.emojiCounts[attr.emoji];
  }
}

function updateBreakdownTable() {
  var breakdown = document.getElementById('breakdown');
  if (!breakdown) return;

  var tableRows = [];

  function renderCounts(title, counts) {
    var rows = '<tr><th colspan="2">' + title + '</th></tr>';
    for (var key in counts) {
      if (counts.hasOwnProperty(key)) {
        rows += '<tr><td>' + key + '</td><td>' + counts[key] + '</td></tr>';
      }
    }
    return rows;
  }

  tableRows.push('<tr><th>Property</th><th>Count</th></tr>');

  tableRows.push('<tr><td><strong>Total Selected Outputs</strong></td><td><strong>' + aggregates.selectedCount + '</strong></td></tr>');
  tableRows.push('<tr><td>Outputs with rotation ≠ 0</td><td>' + aggregates.rotationCount + '</td></tr>');
  tableRows.push('<tr><td>Outputs with hasAura</td><td>' + aggregates.hasAuraCount + '</td></tr>');
  tableRows.push('<tr><td>Outputs with hasPump</td><td>' + aggregates.hasPumpCount + '</td></tr>');

  tableRows.push(renderCounts('Start Hue Buckets', aggregates.startHueBuckets));
  tableRows.push(renderCounts('Color Strategies', aggregates.colorStrategyCounts));
  tableRows.push(renderCounts('Rosette Types', aggregates.rosetteTypeCounts));
  tableRows.push(renderCounts('Brainwaves', aggregates.brainwaveCounts));
  tableRows.push(renderCounts('Ad Rate Buckets', aggregates.adRateBuckets));
  tableRows.push(renderCounts('Tone Adj Buckets', aggregates.toneAdjBuckets));
  tableRows.push(renderCounts('Emojis', aggregates.emojiCounts));



  breakdown.innerHTML = '<table border="1" cellpadding="4" cellspacing="0">' + tableRows.join('') + '</table>' + \`<textarea style="background: black; color: white; font-family: monospace; width: 200px; overflow: scroll; height: 500px">\${Array.from(aggregates.selectedHashes).join('\\n')}</textarea>\`

}

/**
 * Call this with id and selected true/false to toggle
 * @param {number} id
 * @param {boolean} selected
 */
function selectOutput(id, selected) {
  var attr = attributesArray[id];
  if (!attr) {
    console.warn('No attributes for id ' + id);
    return;
  }

  if (selected) {
    if (!selectedOutputs.has(id)) {
      selectedOutputs.add(id);
      addAttributes(attr);
    }

    document.getElementById('select-label-' + id).classList.add('selected')

  } else {
    if (selectedOutputs.has(id)) {
      selectedOutputs.delete(id);
      removeAttributes(attr);
    }
    document.getElementById('select-label-' + id).classList.remove('selected')
  }

  localStorage.setItem('selectedOutputs', JSON.stringify(Array.from(selectedOutputs)));

  updateBreakdownTable();
}





(function initSelection() {
  for (var key in aggregates) {
    if (!aggregates.hasOwnProperty(key)) continue;
    if (typeof aggregates[key] === 'object') {
      for (var k in aggregates[key]) {
        if (aggregates[key].hasOwnProperty(k)) {
          aggregates[key][k] = 0;
        }
      }
    } else {
      aggregates[key] = 0;
    }
  }

  selectedOutputs.forEach(function(id) {
    var attr = attributesArray[id];
    if (attr) addAttributes(attr);

    aggregates.selectedHashes.add(hashesArray[id])

    document.getElementById('select-label-' + id).classList.add('selected')

  });

  updateBreakdownTable();
})();


window.addEventListener('DOMContentLoaded', function () {
  // Get selected IDs from localStorage
  var selected = JSON.parse(localStorage.getItem('selectedOutputs') || '[]');

  selected.forEach(function (id) {
    var checkbox = document.getElementById('select-' + id);
    if (checkbox) {
      checkbox.checked = true;
    }
  });


  var textareas = document.querySelectorAll('textarea[id^="notes-"]');
  textareas.forEach(function(textarea) {
    var saved = localStorage.getItem(textarea.id);
    if (saved !== null) {
      textarea.value = saved;
    }
  });
});
      </script>
    </body>
  </html>
`)
