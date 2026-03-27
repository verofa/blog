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

// -- All colors from Ghostty config ----------------------------------
// https://github.com/verofa/dotfiles/blob/main/Library/Application%20Support/com.mitchellh.ghostty/config
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

const ASCII_LINES = [
  { t: '                              ████████╗██╗  ██╗███████╗',                    c: C.p13 },
  { t: '                                 ██╔══╝██║  ██║██╔════╝',                    c: C.p13 },
  { t: '                                 ██║   ███████║█████╗  ',                    c: C.p13 },
  { t: '                                 ██║   ██╔══██║██╔══╝  ',                    c: C.p13 },
  { t: '                                 ██║   ██║  ██║███████╗',                    c: C.p13 },
  { t: '                                 ╚═╝   ╚═╝  ╚═╝╚══════╝',                   c: C.p13 },
  { t: '',                                                          c: C.dim },
  { t: '                    ██████╗ ██╗   ██╗██████╗ ██████╗ ██╗     ███████╗',      c: C.p5  },
  { t: '                    ██╔══██╗██║   ██║██╔══██╗██╔══██╗██║     ██╔════╝',      c: C.p5  },
  { t: '                    ██████╔╝██║   ██║██████╔╝██████╔╝██║     █████╗  ',      c: C.p5  },
  { t: '                    ██╔═══╝ ██║   ██║██╔══██╗██╔═══╝ ██║     ██╔══╝  ',      c: C.p5  },
  { t: '                    ██║     ╚██████╔╝██║  ██║██║     ███████╗███████╗',      c: C.p5  },
  { t: '                    ╚═╝      ╚═════╝ ╚═╝  ╚═╝╚═╝     ╚══════╝╚══════╝',     c: C.p5  },
  { t: '',                                                          c: C.dim },
  { t: '                ████████╗███████╗██████╗ ███╗   ███╗██╗███╗  ██╗ █████╗ ██╗   ',  c: C.p4 },
  { t: '                ╚══██╔══╝██╔════╝██╔══██╗████╗ ████║██║████╗ ██║██╔══██╗██║   ',  c: C.p4 },
  { t: '                   ██║   █████╗  ██████╔╝██╔████╔██║██║██╔██╗██║███████║██║   ',  c: C.p4 },
  { t: '                   ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║██║██║╚████║██╔══██║██║   ',  c: C.p4 },
  { t: '                   ██║   ███████╗██║  ██║██║ ╚═╝ ██║██║██║ ╚███║██║  ██║█████╗',  c: C.p4 },
  { t: '                   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝╚═╝  ╚══╝╚═╝  ╚═╝╚════╝', c: C.p4 },
]

const TPT_FRAMES = [
  { eyes: '◉       ◉', mouth: '   ╰---╯  ', bottom: '▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀' },
  { eyes: '-       -', mouth: '          ', bottom: '▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀' },
  { eyes: '◉       ◉', mouth: '   ▄▄▄▄▄  ', bottom: '▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄' },
  { eyes: '◕       ◕', mouth: '   ▄▄▄▄▄  ', bottom: '▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄' },
  { eyes: '●       ●', mouth: '   ╰---╯  ', bottom: '▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀' },
]
const TPT_COLS = [C.p5, C.p13, C.p4, C.p12, C.p1, C.p13, C.p5, C.p4]

// -- Cleanup handles -------------------------------------------------
let tptInterval = null
let loopTimeout = null
let destroyed   = false

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

function makeGhostFull(parent) {
  const col   = TPT_COLS[0]
  const frame = TPT_FRAMES[0]
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
    `      ${sp('tpt   ', C.p4, 'font-weight:bold')} ${sp('The Purple Terminal', C.p15)}\n` +
    `      ${sp('Frame   ', C.p4, 'font-weight:bold')} ${sp('000', C.p3)}\n` +
    `      ${sp('Color   ', C.p4, 'font-weight:bold')} ${sp(col, col)}\n` +
    `      ${sp('Shell   ', C.p4, 'font-weight:bold')} ${sp('fish 3.7.1', C.fg)}\n` +
    `      ${sp('Cursor  ', C.p4, 'font-weight:bold')} ${sp('bar  ', C.fg)}${sp('█', C.cursor)}\n`
  parent.appendChild(info)
  parent.appendChild(makeSwatchRow('      '))
}

// -- Measure final height by rendering a hidden probe -----------------
function measureFinalHeight() {
  const content = contentRef.value
  const probe   = content.cloneNode(false)
  probe.style.cssText =
    'visibility:hidden;position:fixed;top:-9999px;left:-9999px;' +
    'width:' + content.offsetWidth + 'px;padding:1rem 1.4rem 1.8rem;'
  document.body.appendChild(probe)

  // Scene 1
  addLine(probe, promptRow1())
  const l1 = document.createElement('div')
  l1.className = 'pt-line'
  l1.innerHTML = promptRow2('probe-cmd1')
  const cs1 = document.createElement('span')
  cs1.style.color = C.p7
  cs1.textContent = 'tpt "The Purple Terminal"'
  l1.appendChild(cs1)
  probe.appendChild(l1)

  for (const { t, c } of ASCII_LINES) {
    const d = document.createElement('div')
    d.className = 'pt-line'
    d.style.fontSize   = '11px'
    d.style.lineHeight = '1.22'
    d.style.color = c
    d.textContent = t
    probe.appendChild(d)
  }

  addLine(
    probe,
    '\n  ' + '                 ' +
    sp('✦', C.p13) + ' ' +
    sp('A purplish geeky blog for curious minds', C.p7) + ' ' +
    sp('✦', C.p13),
    '6px',
  )

  // Scene 2
  addLine(probe, promptRow1(), '6px')
  const l2 = document.createElement('div')
  l2.className = 'pt-line'
  l2.innerHTML = promptRow2('probe-cmd2')
  const cs2 = document.createElement('span')
  cs2.style.color = C.p7
  cs2.textContent = 'tpt +easteregg'
  l2.appendChild(cs2)
  probe.appendChild(l2)

  const ghost = document.createElement('div')
  ghost.style.marginTop = '8px'
  makeGhostFull(ghost)
  probe.appendChild(ghost)

  const h = probe.offsetHeight
  document.body.removeChild(probe)
  return h
}

// -- Main animation loop -----------------------------------------------
async function run() {
  if (destroyed) return

  const S      = contentRef.value
  const screen = screenRef.value
  S.innerHTML  = ''

  let tptEl = null
  let gf    = 0

  function drawtpt() {
    if (!tptEl) return
    const col   = TPT_COLS[gf % TPT_COLS.length]
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
      `      ${sp('tpt   ', C.p4, 'font-weight:bold')} ${sp('The Purple Terminal', C.p15)}\n` +
      `      ${sp('Frame   ', C.p4, 'font-weight:bold')} ${sp(String(gf).padStart(3, '0'), C.p3)}\n` +
      `      ${sp('Color   ', C.p4, 'font-weight:bold')} ${sp(col, col)}\n` +
      `      ${sp('Shell   ', C.p4, 'font-weight:bold')} ${sp('fish 3.7.1', C.fg)}\n` +
      `      ${sp('Cursor  ', C.p4, 'font-weight:bold')} ${sp('bar  ', C.fg)}${sp('█', C.cursor)}\n`
    gf++
  }

  await sleep(400)
  if (destroyed) return

  // -- Scene 1: tpt "The Purple Terminal" → ASCII title --------------
  addLine(S, promptRow1())
  const l1   = addLine(S, promptRow2('cmd1'))
  const cur1 = makeCursor(true)
  l1.appendChild(cur1)
  await sleep(700)
  if (destroyed) return
  cur1.className = 'pt-cursor'
  await typeInto('cmd1', 'tpt "The Purple Terminal"', 68)
  if (destroyed) return
  cur1.remove()
  await sleep(320)

  for (const { t, c } of ASCII_LINES) {
    if (destroyed) return
    const d = document.createElement('div')
    d.className    = 'pt-line'
    d.style.fontSize   = '11px'
    d.style.lineHeight = '1.22'
    d.style.color  = c
    d.textContent  = t
    S.appendChild(d)
    await sleep(30)
  }

  await sleep(180)
  if (destroyed) return
  addLine(
    S,
    '\n  ' + '                 ' +
    sp('✦', C.p13) + ' ' +
    sp('A purplish geeky blog for curious minds', C.p7) + ' ' +
    sp('✦', C.p13),
    '6px',
  )

  await sleep(700)
  if (destroyed) return

  // -- Scene 2: tpt +easteregg ---------------------------------------
  addLine(S, promptRow1(), '6px')
  const l2   = addLine(S, promptRow2('cmd2'))
  const cur2 = makeCursor(true)
  l2.appendChild(cur2)
  await sleep(700)
  if (destroyed) return
  cur2.className = 'pt-cursor'
  await typeInto('cmd2', 'tpt +easteregg', 62)
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

  // -- Loop ----------------------------------------------------------
  loopTimeout = setTimeout(() => {
    clearInterval(tptInterval)
    tptInterval = null
    run()
  }, 13000)
}

// -- Lifecycle --------------------------------------------------------
onMounted(() => {
  destroyed = false
  // Measure after mount so the DOM has real dimensions
  const h = measureFinalHeight()
  screenRef.value.style.height = h + 'px'
  run()
})

onUnmounted(() => {
  // Clean up timers so they don't run after the component is gone
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

/* Subtle scanline overlay */
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

/* These classes are injected into innerHTML so they must not be scoped.      */
/* VitePress/Vue scoped styles only apply to elements in the template, not    */
/* to dynamically created DOM. We use :deep() to reach them.                  */
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
