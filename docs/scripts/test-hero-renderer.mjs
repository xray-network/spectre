import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const heroDir = fileURLToPath(new URL('../src/theme/hero/', import.meta.url))

function harness() {
  let now = 0, nextId = 0, layoutReads = 0
  let rect = { left: 0, top: 0, width: 1000, height: 500 }
  let colors = { '--xr-fg-muted': '#55556d', '--xr-link': '#1940ed' }
  const frames = new Map(), timers = new Map(), events = new Map(), windowEvents = new Map(), documentEvents = new Map()
  const observers = [], extraCanvases = [], contexts = []
  const metric = { strokes: 0, fills: 0, images: 0, imagePixels: 0, clears: 0, clearPixels: 0 }
  const makeCanvas = () => {
    const ctx = {
      globalAlpha: 1, painted: new Map(), strokes: 0, fills: 0, strokeWidths: [],
      setTransform(...values) { this.transform = values },
      beginPath() { this.path = [] },
      moveTo(x, y) { this.path.push([x, y]) },
      lineTo(x, y) { this.path.push([x, y]) },
      stroke() { metric.strokes++; this.strokes++; this.strokeWidths.push(this.lineWidth) },
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
  math.random = () => .4
  const environment = {
    window: win, document: doc, Math: math, performance: { now: () => now },
    getComputedStyle: () => ({ getPropertyValue: k => colors[k] ?? '' }),
    requestAnimationFrame: fn => { const id = ++nextId; frames.set(id, fn); return id }, cancelAnimationFrame: id => frames.delete(id),
    IntersectionObserver: Observer, ResizeObserver: Observer, MutationObserver: Observer,
  }
  const modules = new Map()
  const load = filename => {
    if (modules.has(filename)) return modules.get(filename)
    const exports = {}; modules.set(filename, exports)
    const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText
    const require = name => {
      return load(path.join(heroDir, `${name}.ts`))
    }
    new Function('require', 'exports', ...Object.keys(environment), code)(require, exports, ...Object.values(environment))
    return exports
  }
  const cleanup = load(path.join(heroDir, 'heroRenderer.ts')).createHeroRenderer(foreground, background, hero)
  const advance = time => {
    now = time
    for (const [id, timer] of [...timers]) if (timer.at <= now) { timers.delete(id); timer.fn() }
    const jobs = [...frames.values()]; frames.clear(); jobs.forEach(fn => fn(now))
  }
  return {
    advance, cleanup, metric, contexts, foreground, background, extraCanvases, frames, timers, events, win,
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
h.setVisible(true)
h.resetMetric()
for (let i = 1; i <= 180; i++) h.advance(i * 1000 / 60)
assert.equal(h.frames.size, 1, 'Ambient wave animates without pointer movement')
assert(h.metric.images > 0, 'Ambient wave renders cached symbols')
assert([...h.contexts[0].painted.values()].some(mark => mark.sprite > 0), 'Wave replaces slashes with symbols')
assert.equal(h.metric.strokes, 0, 'Wave never rasterizes new paths')
h.resetMetric()
const reads = h.layoutReads
const symbols = new Set()
const atlas = h.extraCanvases[0]
const near = `${Math.round(104 * 2 - atlas.height / 4)},${Math.round(124 * 2 - atlas.height / 4)}`
for (let i = 1; i <= 60; i++) {
  h.events.get('pointermove')({ clientX: 104 + i % 2, clientY: 124 })
  h.advance(3000 + i * 1000 / 60)
  const mark = h.contexts[0].painted.get(near)
  if (mark) symbols.add(mark.sprite)
}
assert(symbols.size > 2, 'Actual pointer movement cycles through varied symbols')
assert([...symbols].some(symbol => symbol >= 12), 'Pointer movement includes blank cells')
assert(atlas.getContext('2d').strokeWidths.includes(2), 'Active symbols use a stronger 1 CSS pixel stroke')
assert.equal(h.layoutReads, reads, 'Pointer movement and frames do not read layout')
assert.equal(h.metric.strokes, 0, 'Active animation uses cached sprites only')
assert(h.metric.clearPixels < 60 * h.foreground.width * h.foreground.height * .08, 'Combined wave and pointer clear less than 8% of the surface per frame')
assert(h.contexts[0].painted.get(near).alpha > .95, 'Nearby symbols reach full blue contrast even on the left')
const stoppedSprite = h.contexts[0].painted.get(near).sprite
let previousAlpha = h.contexts[0].painted.get(near).alpha
for (let i = 1; i <= 120; i++) {
  // Repeated events at the same coordinates must not sustain the effect.
  h.events.get('pointermove')({ clientX: 104, clientY: 124 })
  h.advance(4000 + i * 1000 / 60)
  const mark = h.contexts[0].painted.get(near)
  if (mark && i > 8) {
    assert(mark.alpha <= previousAlpha + .001, 'Highlight eases out after movement stops')
    assert.equal(mark.sprite, stoppedSprite, 'Symbols stop cycling while fading')
  }
  previousAlpha = mark?.alpha || 0
}
assert.equal(h.contexts[0].painted.size, 0, 'Stationary pointer returns all marks to resting slashes')
assert.equal(h.frames.size, 0, 'Renderer sleeps between waves after pointer easing')
assert.equal(h.timers.size, 1, 'A single timer schedules the next wave')
h.resetMetric(); h.advance(6500)
assert.equal(h.metric.images + h.metric.clears, 0, 'No drawing during the quiet interval')
h.scroll({ top: -100 })
assert.equal(h.frames.size, 0, 'Scrolling alone does not activate the effect')
h.events.get('pointermove')({ clientX: 106, clientY: 24 }); h.advance(6516)
assert.equal(h.layoutReads, reads + 1, 'Next move refreshes scrolled bounds once')
h.setReduced(true); assert.equal(h.frames.size + h.timers.size, 0)
h.events.get('pointermove')({ clientX: 110, clientY: 24 })
assert.equal(h.frames.size, 0, 'Reduced motion suppresses pointer animation')
h.setTheme({ '--xr-fg-muted': '#9ca3af', '--xr-link': '#657ff3' })
assert.equal(h.contexts[1].strokeStyle, '#9ca3af', 'Static artwork updates with reduced motion')
const paints = h.contexts[1].strokes
h.setTheme({ '--xr-fg-muted': '#9ca3af', '--xr-link': '#657ff3' })
assert.equal(h.contexts[1].strokes, paints, 'Identical theme colors do not cause a redraw')
h.resize({ width: 360, height: 480 }); assert.equal(h.foreground.width, 720)
h.win.devicePixelRatio = 4; h.resize({}); assert.equal(h.foreground.width, 720, 'DPR stays capped at two')
h.setReduced(false); assert.equal(h.frames.size, 1, 'Ambient playback resumes when motion is allowed')
h.events.get('pointermove')({ clientX: 156, clientY: 24 }); h.advance(6532)
assert.equal(h.frames.size, 1)
h.setHidden(true); assert.equal(h.frames.size + h.timers.size, 0)
assert.equal(h.contexts[0].painted.size, 0, 'Hidden tab restores resting artwork')
h.setHidden(false); h.setVisible(false)
h.events.get('pointermove')({ clientX: 160, clientY: 24 })
assert.equal(h.frames.size, 0, 'Offscreen pointer events are ignored')
h.setVisible(true); assert.equal(h.frames.size, 1, 'Returning to view resumes ambient playback')
h.cleanup(); h.assertClean(); assert.equal(atlas.width + atlas.height, 0, 'Sprite memory is released')

// Grid coordinates, slash dimensions and cached sprites must not scale with the viewport.
const fixed = harness()
fixed.setReduced(true)
const fixedAtlas = fixed.extraCanvases[0]
const spritePaints = fixedAtlas.getContext('2d').strokes
const spriteSize = fixedAtlas.height
for (const [width, height] of [[320, 780], [1440, 560], [768, 1024]]) {
  const before = fixed.contexts[1].strokes
  fixed.resize({ width, height })
  const baseCtx = fixed.contexts[1]
  assert.deepEqual(baseCtx.transform, [2, 0, 0, 2, 0, 0], 'Only pixel density affects the canvas transform')
  assert.equal(baseCtx.path[1][0] - baseCtx.path[0][0], 3.75, 'Slash stays narrow at 3.75 CSS pixels')
  assert.equal(baseCtx.path[0][1] - baseCtx.path[1][1], 8.75, 'Slash height stays 8.75 CSS pixels')
  assert.equal(baseCtx.lineWidth, .75, 'Resting slash uses a thin stroke')
  const expectedColumns = Math.floor((width + 6) / 26) + 1
  const expectedRows = Math.floor((height + 6 - 20) / 26) + 1
  assert.equal(baseCtx.strokes - before, expectedColumns * expectedRows, 'Canvas size changes grid density, not mark size')
  assert.equal(fixedAtlas.height, spriteSize)
  assert.equal(fixedAtlas.getContext('2d').strokes, spritePaints, 'Viewport resize reuses existing symbol sprites')
}
for (const density of [1, 1.5, 2, 3]) {
  fixed.win.devicePixelRatio = density
  fixed.resize({})
  const ratio = Math.min(density, 2)
  assert.equal(fixed.contexts[1].transform[0], ratio)
  const spritePath = fixedAtlas.getContext('2d').path
  assert.equal((spritePath[1][0] - spritePath[0][0]) / ratio, 3.75, 'Cached slash width stays fixed across displays')
  assert.equal(fixedAtlas.getContext('2d').lineWidth / ratio, .75, 'Cached symbols keep thin strokes across displays')
}
fixed.cleanup(); fixed.assertClean()
console.log('Renderer checks passed: ambient waves, pointer symbol cycling, eased stop, sleep between waves, cached rendering, fixed size/density, theme, visibility and cleanup.')
