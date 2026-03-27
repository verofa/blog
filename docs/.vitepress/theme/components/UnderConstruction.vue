<template>
  <div class="pt-root">
    <div class="pt-titlebar">
      <span class="pt-dot" style="background:#ff5f57" />
      <span class="pt-dot" style="background:#ffbd2e" />
      <span class="pt-dot" style="background:#28c841" />
      <span class="pt-title-label">👾 The Purple Terminal ~/</span>
    </div>
    <div ref="screenRef" class="pt-screen">
      <div ref="contentRef" class="pt-content" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const screenRef  = ref(null)
const contentRef = ref(null)

// -- Colors — same tptty config palette ----------------------------
const C = {
  fg:  '#C0C0C0', cursor: '#f95470',
  p1:  '#ef919b', p2:  '#00E676',
  p3:  '#FFD600', p4:  '#88E8E0',
  p5:  '#E040FB', p7:  '#C9D1E8',
  p8:  '#3B4560', p9:  '#FF6B82',
  p11: '#FFE44D', p12: '#6EA6FF',
  p13: '#EA80FC', p15: '#FFFFFF',
  dim: '#3B4560', diamond: '#f5a623',
}

const SWATCHES = ['#1C2333', C.p9, C.p2, C.p3, C.p12, C.p5, C.p4, C.p15]

// -- tpt frames — spooked by the TODO list --------------------------
const TPT_FRAMES = [
  { eyes: '◉       ◉', mouth: '   ╰---╯  ', bottom: '▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀' },
  { eyes: '◕       ◕', mouth: '   ╰---╯  ', bottom: '▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀' },
  { eyes: '○       ○', mouth: '   ▄▄▄▄▄  ', bottom: '▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄' },
  { eyes: '◉       ◉', mouth: '   ▄▄▄▄▄  ', bottom: '▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄' },
  { eyes: '-       -', mouth: '          ', bottom: '▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀' },
]
const tpt_COLS = [C.p5, C.p13, C.p9, C.p12, C.p1, C.p13, C.p5, C.p4]

// -- The TODO items that "break" the tpt ---------------------------
const TODO_LINES = [
  { t: '  # TODO: write the intro section',          c: C.dim  },
  { t: '  # TODO: add code examples',                c: C.dim  },
  { t: '  # TODO: insert diagrams',                  c: C.dim  },
  { t: '  # TODO: actually understand this topic',   c: C.p9   },
  { t: '  # TODO: coffee first ☕',                  c: C.p3   },
  { t: '  # TODO: fix typos (add typos first)',       c: C.dim  },
  { t: '  # TODO: pretend this is done',              c: C.p9   },
]

// -- Cleanup handles --------------------------------------------------
let tptInterval = null
let loopTimeout   = null
let destroyed     = false

// -- Helpers ----------------------------------------------------------
const sleep = ms => new Promise(r => setTimeout(r, ms))

function sp(text, color, style = '') {
  return `<span style="color:${color};${style}">${text}</span>`
}

function promptRow1() {
  return (
    sp('[', C.p13) + ' ' + sp('~', C.p15) + '  ' +
    sp('on', C.fg) + ' ' + sp('🦄', C.diamond) + ' ' +
    sp(']', C.p13)
  )
}

function promptRow2(cmdId) {
  return sp('╰)', C.p5) + ' ' + `<span id="${cmdId}" style="color:${C.p7}"></span>`
}

function addLine(parent, html, marginTop = null) {
  const d = document.createElement('div')
  d.className = 'pt-line'
  if (marginTop) d.style.marginTop = marginTop
  d.innerHTML = html
  parent.appendChild(d)
  return d
}

function makeCursor(blink = false) {
  const c = document.createElement('span')
  c.className = 'pt-cursor' + (blink ? ' blink' : '')
  return c
}

async function typeInto(id, text, delay) {
  const el = document.getElementById(id)
  if (!el) return
  for (let i = 0; i <= text.length; i++) {
    if (destroyed) return
    el.textContent = text.slice(0, i)
    await sleep(delay + Math.random() * 22)
  }
}

function makeSwatchRow(indent) {
  const d = document.createElement('div')
  d.className = 'pt-line'
  d.style.marginTop = '8px'
  d.innerHTML = indent
  SWATCHES.forEach(c => {
    const s = document.createElement('span')
    s.className = 'pt-swatch'
    s.style.background = c
    d.appendChild(s)
  })
  return d
}

function maketptFull(parent, frameIdx = 0) {
  const col   = tpt_COLS[frameIdx % tpt_COLS.length]
  const frame = TPT_FRAMES[frameIdx % TPT_FRAMES.length]
  const rows  = [
    '      ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄',
    `      █ ${frame.eyes}     █`,
    '      █               █',
    `      █ ${frame.mouth}    █`,
    `      ${frame.bottom}`,
  ]
  const body = document.createElement('div')
  body.className = 'pt-tpt-body'
  body.innerHTML = rows.map(r => `<span class="pt-tpt-frame" style="color:${col}">${r}</span>`).join('')
  parent.appendChild(body)

  const info = document.createElement('div')
  info.className = 'pt-tpt-info pt-line'
  info.innerHTML =
    '\n' +
    `      ${sp('status  ', C.p4, 'font-weight:bold')} ${sp('under construction 🚧', C.p3)}\n` +
    `      ${sp('frame   ', C.p4, 'font-weight:bold')} ${sp('000', C.p3)}\n` +
    `      ${sp('color   ', C.p4, 'font-weight:bold')} ${sp(col, col)}\n` +
    `      ${sp('eta     ', C.p4, 'font-weight:bold')} ${sp('soon™', C.fg)}\n` +
    `      ${sp('mood    ', C.p4, 'font-weight:bold')} ${sp('haunted by TODOs', C.p9)}\n`
  parent.appendChild(info)
  parent.appendChild(makeSwatchRow('      '))
}

// -- Measure final height ----------------------------------------------
function measureFinalHeight() {
  const content = contentRef.value
  const probe   = content.cloneNode(false)
  probe.style.cssText =
    'visibility:hidden;position:fixed;top:-9999px;left:-9999px;' +
    'width:' + content.offsetWidth + 'px;padding:1rem 1.4rem 1.8rem;'
  document.body.appendChild(probe)

  // Scene 1 — cat the file
  addLine(probe, promptRow1())
  const l1 = document.createElement('div')
  l1.className = 'pt-line'
  l1.innerHTML = promptRow2('probe-cmd1')
  const cs1 = document.createElement('span')
  cs1.style.color = C.p7
  cs1.textContent = 'cat ./content.md'
  l1.appendChild(cs1)
  probe.appendChild(l1)

  for (const { t, c } of TODO_LINES) {
    const d = document.createElement('div')
    d.className = 'pt-line'
    d.style.color = c
    d.textContent = t
    probe.appendChild(d)
  }

  // error line
  addLine(probe,
    sp('tpt: ', C.p9, 'font-weight:bold') +
    sp('error: ', C.p9) +
    sp('content.md is 97% TODO', C.fg),
    '6px'
  )

  // Scene 2 — tpt reacts
  addLine(probe, promptRow1(), '6px')
  const l2 = document.createElement('div')
  l2.className = 'pt-line'
  l2.innerHTML = promptRow2('probe-cmd2')
  const cs2 = document.createElement('span')
  cs2.style.color = C.p7
  cs2.textContent = 'tpt +boo --mood=haunted'
  l2.appendChild(cs2)
  probe.appendChild(l2)

  const tpt = document.createElement('div')
  tpt.style.marginTop = '8px'
  maketptFull(tpt, 0)
  probe.appendChild(tpt)

  // Scene 3 — reassurance
  addLine(probe, promptRow1(), '6px')
  const l3 = document.createElement('div')
  l3.className = 'pt-line'
  l3.innerHTML = promptRow2('probe-cmd3')
  const cs3 = document.createElement('span')
  cs3.style.color = C.p7
  cs3.textContent = 'echo "coming soon, promise 💜"'
  l3.appendChild(cs3)
  probe.appendChild(l3)

  addLine(probe,
    '  ' + sp('coming soon, promise 💜', C.p13),
    '2px'
  )

  const h = probe.offsetHeight
  document.body.removeChild(probe)
  return h
}

// -- Main animation ----------------------------------------------------
async function run() {
  if (destroyed) return

  const S      = contentRef.value
  const screen = screenRef.value
  S.innerHTML  = ''

  let tptEl = null
  let gf      = 0

  function drawtpt() {
    if (!tptEl) return
    const col   = tpt_COLS[gf % tpt_COLS.length]
    const frame = TPT_FRAMES[gf % TPT_FRAMES.length]
    const rows  = [
      '      ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄',
      `      █ ${frame.eyes}     █`,
      '      █               █',
      `      █ ${frame.mouth}    █`,
      `      ${frame.bottom}`,
    ]
    tptEl.querySelector('.pt-tpt-body').innerHTML =
      rows.map(r => `<span class="pt-tpt-frame" style="color:${col}">${r}</span>`).join('')
    tptEl.querySelector('.pt-tpt-info').innerHTML =
      '\n' +
      `      ${sp('status  ', C.p4, 'font-weight:bold')} ${sp('under construction 🚧', C.p3)}\n` +
      `      ${sp('frame   ', C.p4, 'font-weight:bold')} ${sp(String(gf).padStart(3, '0'), C.p3)}\n` +
      `      ${sp('color   ', C.p4, 'font-weight:bold')} ${sp(col, col)}\n` +
      `      ${sp('eta     ', C.p4, 'font-weight:bold')} ${sp('soon™', C.fg)}\n` +
      `      ${sp('mood    ', C.p4, 'font-weight:bold')} ${sp('haunted by TODOs', C.p9)}\n`
    gf++
  }

  await sleep(400)
  if (destroyed) return

  // -- Scene 1: cat ./content.md → wall of TODOs ---------------------
  addLine(S, promptRow1())
  const l1   = addLine(S, promptRow2('cmd1'))
  const cur1 = makeCursor(true)
  l1.appendChild(cur1)
  await sleep(700)
  if (destroyed) return
  cur1.className = 'pt-cursor'
  await typeInto('cmd1', 'cat ./content.md', 72)
  if (destroyed) return
  cur1.remove()
  await sleep(300)

  // Reveal TODO lines one by one
  for (const { t, c } of TODO_LINES) {
    if (destroyed) return
    const d = document.createElement('div')
    d.className   = 'pt-line'
    d.style.color = c
    d.textContent = t
    S.appendChild(d)
    await sleep(80)
  }

  await sleep(200)
  if (destroyed) return

  // Error output
  addLine(S,
    sp('tpt: ', C.p9, 'font-weight:bold') +
    sp('error: ', C.p9) +
    sp('content.md is 97% TODO', C.fg),
    '6px'
  )

  await sleep(800)
  if (destroyed) return

  // -- Scene 2: tpt reacts -----------------------------------------
  addLine(S, promptRow1(), '6px')
  const l2   = addLine(S, promptRow2('cmd2'))
  const cur2 = makeCursor(true)
  l2.appendChild(cur2)
  await sleep(700)
  if (destroyed) return
  cur2.className = 'pt-cursor'
  await typeInto('cmd2', 'tpt +boo --mood=haunted', 65)
  if (destroyed) return
  cur2.remove()
  await sleep(350)

  tptEl = document.createElement('div')
  tptEl.style.marginTop = '8px'
  const tptBody = document.createElement('div')
  tptBody.className = 'pt-tpt-body'
  tptEl.appendChild(tptBody)
  const tptInfo = document.createElement('div')
  tptInfo.className = 'pt-tpt-info pt-line'
  tptEl.appendChild(tptInfo)
  tptEl.appendChild(makeSwatchRow('      '))
  S.appendChild(tptEl)

  drawtpt()
  tptInterval = setInterval(drawtpt, 380)

  await sleep(5000)
  if (destroyed) return
  clearInterval(tptInterval)
  tptInterval = null

  // -- Scene 3: reassuring echo --------------------------------------
  addLine(S, promptRow1(), '6px')
  const l3   = addLine(S, promptRow2('cmd3'))
  const cur3 = makeCursor(true)
  l3.appendChild(cur3)
  await sleep(600)
  if (destroyed) return
  cur3.className = 'pt-cursor'
  await typeInto('cmd3', 'echo "coming soon, promise 💜"', 60)
  if (destroyed) return
  cur3.remove()
  await sleep(300)

  addLine(S,
    '  ' + sp('coming soon, promise 💜', C.p13),
    '2px'
  )

  await sleep(500)
  if (destroyed) return

  // Loop
  loopTimeout = setTimeout(() => {
    clearInterval(tptInterval)
    tptInterval = null
    run()
  }, 8000)
}

// -- Lifecycle ---------------------------------------------------------
onMounted(() => {
  destroyed = false
  const h = measureFinalHeight()
  screenRef.value.style.height = h + 'px'
  run()
})

onUnmounted(() => {
  destroyed = true
  clearInterval(tptInterval)
  clearTimeout(loopTimeout)
})
</script>

<style scoped>
.pt-root {
  width: 100%;
  max-width: 700px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(224, 64, 251, 0.25);
  box-shadow:
    0 0 0 1px rgba(224, 64, 251, 0.08),
    0 8px 40px rgba(38, 15, 72, 0.7),
    0 2px 8px rgba(0, 0, 0, 0.5);
  font-family: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', ui-monospace, monospace;
  font-size: 13px;
  line-height: 1.55;
  background: #260f48;
  position: relative;
  margin: 0 auto;
}

.pt-root::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: repeating-linear-gradient(
    to bottom,
    transparent 0px, transparent 2px,
    rgba(0, 0, 0, 0.04) 2px, rgba(0, 0, 0, 0.04) 4px
  );
  border-radius: 12px;
}

.pt-titlebar {
  background: #1a0b30;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid rgba(224, 64, 251, 0.15);
  user-select: none;
}

.pt-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.pt-title-label {
  flex: 1;
  text-align: center;
  font-size: 12px;
  color: #3b4560;
  letter-spacing: 0.04em;
}

.pt-screen {
  padding: 0;
  overflow: hidden;
  position: relative;
}

.pt-content {
  padding: 1rem 1.4rem 1.8rem;
  position: relative;
}

:deep(.pt-line) {
  white-space: pre;
  display: block;
  color: #c0c0c0;
}

:deep(.pt-gap) {
  height: 6px;
  display: block;
}

:deep(.pt-cursor) {
  display: inline-block;
  width: 2px;
  height: 1em;
  background: #f95470;
  vertical-align: text-bottom;
  margin-left: 1px;
}

:deep(.pt-cursor.blink) {
  animation: pt-blink 1s step-end infinite;
}

@keyframes pt-blink {
  50% { opacity: 0; }
}

:deep(.pt-tpt-frame) {
  display: block;
  white-space: pre;
  font-size: 14px;
  line-height: 1.4;
}

:deep(.pt-swatch) {
  width: 20px;
  height: 14px;
  border-radius: 3px;
  display: inline-block;
  margin-right: 3px;
  vertical-align: middle;
}
</style>
