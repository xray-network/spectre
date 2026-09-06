import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const heroDir = fileURLToPath(new URL('../src/theme/hero/', import.meta.url))

function harness({ random = .4, baseline } = {}) {
  let now = 0, nextId = 0, layoutReads = 0, effect
  let rect = { left: 0, top: 0, width: 1000, height: 500 }
  let colors = { '--xr-fg-muted': '#55556d', '--xr-link': '#1940ed' }
  const frames = new Map(), timers = new Map(), events = new Map(), windowEvents = new Map(), documentEvents = new Map()
  const observers = [], extraCanvases = [], createdWaves = [], contexts = []
  const metric = { strokes: 0, fills: 0, images: 0, imagePixels: 0, clears: 0, clearPixels: 0 }
  const makeCanvas = () => {
    const ctx = {
      globalAlpha: 1, painted: new Map(), strokes: 0, fills: 0,
      setTransform(...values) { this.transform = values },
      beginPath() { this.path = [] },
      moveTo(x, y) { this.path.push([x, y]) },
      lineTo(x, y) { this.path.push([x, y]) },
      stroke() { metric.strokes++; this.strokes++ },
      arc(x, y, radius, start, end) { this.path.push({ x, y, radius, start, end }) },
      fill() { metric.fills++; this.fills++ },
      clearRect(x, y, w, h) {
        metric.clears++; metric.clearPixels += w * h
        if (x === 0 && y === 0 && w === this.canvas.width && h === this.canvas.height) this.painted.clear()
        else this.painted.delete(`${x},${y}`)
      },
      drawImage(image, ...args) {
        metric.images++
        metric.imagePixels += args.length === 8 ? args[6] * args[7] : image.width * image.height
        if (args.length === 8) this.painted.set(`${args[4]},${args[5]}`, { alpha: this.globalAlpha, sprite: args[0] / args[2] })
      },
    }
    const c = { width: 300, height: 150, getContext: () => ctx, closest: () => hero, getBoundingClientRect: () => { layoutReads++; return rect } }
    ctx.canvas = c; contexts.push(ctx); return c
  }
  const hero = { addEventListener: (k, fn) => events.set(k, fn), removeEventListener: k => events.delete(k) }
  const foreground = makeCanvas(), background = makeCanvas()
  const media = [false, true].map(matches => ({ matches, addEventListener(_, fn) { this.fn = fn }, removeEventListener() { delete this.fn } }))
  const win = {
    devicePixelRatio: 2, matchMedia: q => media[q.includes('reduced') ? 0 : 1],
    addEventListener: (k, fn) => windowEvents.set(k, fn), removeEventListener: k => windowEvents.delete(k),
    setTimeout: (fn, delay) => { const id = ++nextId; timers.set(id, { fn, at: now + delay }); return id }, clearTimeout: id => timers.delete(id),
  }
  const doc = {
    hidden: false, documentElement: {},
    createElement: () => { const c = makeCanvas(); extraCanvases.push(c); return c },
    addEventListener: (k, fn) => documentEvents.set(k, fn), removeEventListener: k => documentEvents.delete(k),
  }
  class Observer {
    constructor(fn) { this.fn = fn; observers.push(this) }
    observe() {}
    disconnect() { this.disconnected = true }
  }
  const math = Object.create(Math)
  math.random = typeof random === 'function' ? random : () => random
  const environment = {
    window: win, document: doc, Math: math,
    getComputedStyle: () => ({ getPropertyValue: k => colors[k] }),
    requestAnimationFrame: fn => { const id = ++nextId; frames.set(id, fn); return id }, cancelAnimationFrame: id => frames.delete(id),
    IntersectionObserver: Observer, ResizeObserver: Observer, MutationObserver: Observer,
  }
  const modules = new Map()
  const load = filename => {
    if (modules.has(filename)) return modules.get(filename)
    const exports = {}; modules.set(filename, exports)
    const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText
    const require = name => {
      if (name === 'react') return { useRef: () => ({ current: foreground }), useEffect: fn => { effect = fn } }
      if (name === 'react/jsx-runtime') return { jsx: () => null, jsxs: () => null }
      return load(path.join(heroDir, `${name}.ts`))
    }
    new Function('require', 'exports', ...Object.keys(environment), code)(require, exports, ...Object.values(environment))
    if (filename.endsWith('heroWaves.ts')) {
      const create = exports.createWave
      exports.createWave = (...args) => { const wave = create(...args); createdWaves.push(wave); return wave }
    }
    return exports
  }
  let cleanup
  if (baseline) { load(baseline).HeroArtwork(); cleanup = effect() }
  else cleanup = load(path.join(heroDir, 'heroRenderer.ts')).createHeroRenderer(foreground, background, hero)
  const advance = time => {
    now = time
    for (const [id, timer] of [...timers]) if (timer.at <= now) { timers.delete(id); timer.fn() }
    const jobs = [...frames.values()]; frames.clear(); jobs.forEach(fn => fn(now))
  }
  return {
    advance, cleanup, metric, contexts, foreground, background, extraCanvases, frames, timers, events, createdWaves, win,
    get now() { return now }, get layoutReads() { return layoutReads },
    resetMetric() { for (const key in metric) metric[key] = 0 },
    setVisible(value) { observers[0].fn([{ isIntersecting: value }]) },
    resize(value) { rect = { ...rect, ...value }; observers[1].fn() },
    setReduced(value) { media[0].matches = value; media[0].fn() },
    setHidden(value) { doc.hidden = value; documentEvents.get('visibilitychange')() },
    setTheme(value) { colors = value; observers[2].fn() },
    scroll(value) { rect = { ...rect, ...value }; windowEvents.get('scroll')() },
    assertClean() { assert.equal(frames.size + timers.size + events.size + documentEvents.size + windowEvents.size, 0); assert(observers.every(o => o.disconnected)) },
  }
}

const h = harness()
assert.equal(h.frames.size, 0, 'Offscreen hero never starts RAF')
h.setVisible(true); assert.equal(h.frames.size, 1); h.advance(16.67); h.resetMetric()
const reads = h.layoutReads, staticFills = h.contexts[1].fills
for (let i = 2; i <= 180; i++) h.advance(i * 1000 / 60)
assert.equal(h.layoutReads, reads, 'No layout reads in regular animation frames')
assert.equal(h.contexts[1].fills, staticFills, 'Static canvas is not repainted during waves')
assert.equal(h.metric.fills, 0, 'Animation uses cached images, never new paths')
assert(h.metric.images > 0)
assert(h.metric.clearPixels < 179 * h.foreground.width * h.foreground.height * .03, 'Only small changed regions are cleared')
// Compare retained tile opacity against a full, uncropped reference evaluation.
const atlas = h.extraCanvases[0]
for (let row = 0; row < 12; row++) for (let col = 0; col < 26; col++) {
  const x = col * 40, y = 30 + row * 40
  let strength = 0
  for (const w of h.createdWaves) {
    const t = (h.now - w.start) / w.duration
    if (t <= 0 || t >= 1) continue
    const distance = x + Math.sin(y / 115 + w.phase) * w.bend + Math.sin(y / 57 - w.phase) * w.bend * .25
    const front = -220 + (1 - Math.cos(Math.PI * t)) * 720
    const band = Math.max(0, 1 - Math.abs(distance - front) / w.width)
    strength = Math.max(strength, band * band * (3 - 2 * band) * Math.sin(Math.PI * t))
  }
  const value = strength * (.06 + (x / 1000) ** 3 * .84)
  const expected = value < .002 ? 0 : value
  const key = `${Math.round(x * 2 - atlas.height / 2)},${Math.round(y * 2 - atlas.height / 2)}`
  const actual = h.contexts[0].painted.get(key)?.alpha || 0
  assert(Math.abs(actual - expected) < .00101, `Retained opacity at ${x},${y} matches reference`)
}
const waveCount = h.createdWaves.length
for (let i = 0; i < 30; i++) { h.events.get('pointermove')({ clientX: 80, clientY: 110 }); h.advance(3001 + i * 16.67) }
assert.equal(h.layoutReads, reads, 'Pointer movement does not read layout')
assert.equal(h.createdWaves.length, waveCount, 'Hover creates no waves')
const near = `${Math.round(80 * 2 - atlas.height / 2)},${Math.round(110 * 2 - atlas.height / 2)}`
assert(h.contexts[0].painted.get(near).sprite >= 15, 'Nearby dot enlarges')
h.events.get('pointerleave')()
for (let i = 0; i < 60; i++) h.advance(3501 + i * 16.67)
assert([...h.contexts[0].painted.values()].every(p => p.sprite === 0), 'Hover enlargement fully fades')
h.scroll({ top: -100 }); h.events.get('pointermove')({ clientX: 80, clientY: 10 }); h.advance(4600)
assert.equal(h.layoutReads, reads + 1)
h.setReduced(true); assert.equal(h.frames.size + h.timers.size, 0)
h.setTheme({ '--xr-fg-muted': '#9ca3af', '--xr-link': '#657ff3' })
assert.equal(h.contexts[1].fillStyle, '#9ca3af', 'Static artwork updates with reduced motion')
assert.equal(atlas.getContext('2d').fillStyle, '#657ff3')
const paints = h.contexts[1].fills
h.setTheme({ '--xr-fg-muted': '#9ca3af', '--xr-link': '#657ff3' })
assert.equal(h.contexts[1].fills, paints, 'Identical theme colors do not cause a redraw')
h.resize({ width: 360, height: 480 }); assert.equal(h.foreground.width, 720)
h.win.devicePixelRatio = 4; h.resize({}); assert.equal(h.foreground.width, 720, 'DPR stays capped at two')
h.setReduced(false); assert.equal(h.frames.size, 1)
h.setHidden(true); assert.equal(h.frames.size + h.timers.size, 0)
h.setHidden(false); h.setVisible(false); assert.equal(h.frames.size + h.timers.size, 0)
h.setVisible(true); assert.equal(h.frames.size, 1)
h.cleanup(); h.assertClean(); assert.equal(atlas.width + atlas.height, 0, 'Sprite memory is released')
// A short wave followed by a long gap must sleep, not poll with RAF.
let calls = 0
const idle = harness({ random: () => ++calls % 5 === 0 ? .99 : 0 })
idle.setVisible(true)
for (let i = 1; i <= 260; i++) idle.advance(i * 16.67)
assert.equal(idle.frames.size, 0, 'No animation frames during a quiet interval')
assert.equal(idle.timers.size, 1, 'One timer schedules the next wave')
idle.events.get('pointerenter')({ clientX: 500, clientY: 250 })
assert.equal(idle.frames.size, 1, 'Hover wakes a sleeping renderer')
assert.equal(idle.timers.size, 0)
idle.cleanup(); idle.assertClean()

// Grid coordinates, dot dimensions and cached sprites must not scale with the viewport.
const fixed = harness()
fixed.setReduced(true)
const fixedAtlas = fixed.extraCanvases[0]
const spritePaints = fixedAtlas.getContext('2d').fills
const spriteSize = fixedAtlas.height
for (const [width, height] of [[320, 780], [1440, 560], [768, 1024]]) {
  const before = fixed.contexts[1].fills
  fixed.resize({ width, height })
  const baseCtx = fixed.contexts[1]
  assert.deepEqual(baseCtx.transform, [2, 0, 0, 2, 0, 0], 'Only pixel density affects the canvas transform')
  assert.equal(baseCtx.path[0].radius * 2, 2, 'Dot diameter stays 2 CSS pixels')
  assert.equal(baseCtx.path[0].end - baseCtx.path[0].start, Math.PI * 2, 'Dot is a complete circle')
  const expectedColumns = Math.floor((width + 6) / 40) + 1
  const expectedRows = Math.floor((height + 6 - 30) / 40) + 1
  assert.equal(baseCtx.fills - before, expectedColumns * expectedRows, 'Canvas size changes grid density, not mark size')
  assert.equal(fixedAtlas.height, spriteSize)
  assert.equal(fixedAtlas.getContext('2d').fills, spritePaints, 'Viewport resize reuses existing dot sprites')
}
for (const density of [1, 1.5, 2, 3]) {
  fixed.win.devicePixelRatio = density
  fixed.resize({})
  const ratio = Math.min(density, 2)
  assert.equal(fixed.contexts[1].transform[0], ratio)
  const spritePath = fixedAtlas.getContext('2d').path
  assert(Math.abs(spritePath[0].radius * 2 / ratio - 2.6) < .00001, 'Enlarged hover sprite also keeps a fixed CSS size across displays')
}
fixed.cleanup(); fixed.assertClean()
console.log('Renderer checks passed: retained pixels, culling, static cache, hover, fixed dot size and spacing across viewports/DPR, theme, visibility, idle sleep and cleanup.')

const baselineIndex = process.argv.indexOf('--baseline')
if (baselineIndex !== -1) {
  function profile(baseline) {
    const p = harness({ baseline }); p.setVisible(true); p.resetMetric()
    for (let i = 1; i <= 600; i++) p.advance(i * 1000 / 60)
    const metric = { ...p.metric }; p.cleanup(); return metric
  }
  const before = profile(path.resolve(process.argv[baselineIndex + 1])), after = profile()
  console.log(JSON.stringify({ workload: '10 seconds at 60 Hz, deterministic ambient waves; instrumented Canvas calls, not browser FPS', before, after, clearPixelReductionPercent: +(100 * (1 - after.clearPixels / before.clearPixels)).toFixed(2), imagePixelReductionPercent: +(100 * (1 - after.imagePixels / before.imagePixels)).toFixed(2) }, null, 2))
}
