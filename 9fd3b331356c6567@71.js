function _1(md){return(
md`# American Natural Gas Citygate Basis Spread Visualization`
)}

function _harrisonwittDailysyntheticstatecitygatengprices(__query,FileAttachment,invalidation){return(
__query(FileAttachment("HarrisonWitt.DailySyntheticStateCitygateNGPrices.csv"),{from:{table:"HarrisonWitt.DailySyntheticStateCitygateNGPrices"},sort:[],slice:{to:null,from:null},filter:[],select:{columns:null}},invalidation)
)}

function _data(FileAttachment){return(
FileAttachment("HarrisonWitt.DailySyntheticStateCitygateNGPrices.csv").csv({ typed: true })
)}

function _stateNames(){return(
["Alabama","Alaska","Arizona","Arkansas","California","Colorado",
  "Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois",
  "Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland",
  "Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana",
  "Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York",
  "North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania",
  "Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah",
  "Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"]
)}

function _stateCentroids()
{
  return {
    "Alabama":        { lat: 32.8,  lon: -86.8  },
    "Alaska":         { lat: 64.2,  lon: -153.4 },
    "Arizona":        { lat: 34.3,  lon: -111.1 },
    "Arkansas":       { lat: 34.8,  lon: -92.2  },
    "California":     { lat: 37.2,  lon: -119.4 },
    "Colorado":       { lat: 38.9,  lon: -105.5 },
    "Connecticut":    { lat: 41.6,  lon: -72.7  },
    "Delaware":       { lat: 39.0,  lon: -75.5  },
    "Florida":        { lat: 27.8,  lon: -81.7  },
    "Georgia":        { lat: 32.7,  lon: -83.4  },
    "Hawaii":         { lat: 20.3,  lon: -156.4 },
    "Idaho":          { lat: 44.4,  lon: -114.6 },
    "Illinois":       { lat: 40.0,  lon: -89.2  },
    "Indiana":        { lat: 39.9,  lon: -86.3  },
    "Iowa":           { lat: 42.1,  lon: -93.5  },
    "Kansas":         { lat: 38.5,  lon: -98.4  },
    "Kentucky":       { lat: 37.5,  lon: -85.3  },
    "Louisiana":      { lat: 31.1,  lon: -91.8  },
    "Maine":          { lat: 45.4,  lon: -69.2  },
    "Maryland":       { lat: 39.1,  lon: -76.8  },
    "Massachusetts":  { lat: 42.3,  lon: -71.8  },
    "Michigan":       { lat: 44.3,  lon: -84.5  },
    "Minnesota":      { lat: 46.4,  lon: -93.2  },
    "Mississippi":    { lat: 32.7,  lon: -89.7  },
    "Missouri":       { lat: 38.5,  lon: -92.5  },
    "Montana":        { lat: 47.0,  lon: -110.0 },
    "Nebraska":       { lat: 41.5,  lon: -99.8  },
    "Nevada":         { lat: 39.5,  lon: -116.9 },
    "New Hampshire":  { lat: 43.7,  lon: -71.6  },
    "New Jersey":     { lat: 40.1,  lon: -74.5  },
    "New Mexico":     { lat: 34.4,  lon: -106.1 },
    "New York":       { lat: 42.9,  lon: -75.6  },
    "North Carolina": { lat: 35.6,  lon: -79.4  },
    "North Dakota":   { lat: 47.5,  lon: -100.5 },
    "Ohio":           { lat: 40.4,  lon: -82.8  },
    "Oklahoma":       { lat: 35.6,  lon: -97.5  },
    "Oregon":         { lat: 44.1,  lon: -120.5 },
    "Pennsylvania":   { lat: 40.9,  lon: -77.8  },
    "Rhode Island":   { lat: 41.7,  lon: -71.5  },
    "South Carolina": { lat: 33.9,  lon: -80.9  },
    "South Dakota":   { lat: 44.4,  lon: -100.2 },
    "Tennessee":      { lat: 35.9,  lon: -86.4  },
    "Texas":          { lat: 31.5,  lon: -99.3  },
    "Utah":           { lat: 39.4,  lon: -111.1 },
    "Vermont":        { lat: 44.1,  lon: -72.7  },
    "Virginia":       { lat: 37.8,  lon: -79.5  },
    "Washington":     { lat: 47.4,  lon: -120.5 },
    "West Virginia":  { lat: 38.9,  lon: -80.5  },
    "Wisconsin":      { lat: 44.6,  lon: -89.8  },
    "Wyoming":        { lat: 43.0,  lon: -107.6 }
  }
}


function _parsed(data,stateNames){return(
data
  .filter(d => new Date(d.Date) >= new Date("2000-01-01"))
  .map(d => {
    const row = { date: new Date(d.Date), henry_hub: +d.henry_hub }
    for (const s of stateNames) row[s] = +d[s]
    return row
  })
  .sort((a, b) => a.date - b.date)
)}

function _timeSteps(parsed){return(
parsed.map(d => d.date.toISOString().slice(0, 10))
)}

function _allPrices(parsed,stateNames){return(
parsed.flatMap(d => stateNames.map(s => d[s]).filter(v => !isNaN(v)))
)}

function _priceMin(d3,allPrices){return(
d3.min(allPrices)
)}

function _priceMax(d3,allPrices){return(
d3.max(allPrices)
)}

function _priceScale(d3,priceMin,priceMax){return(
d3.scaleLinear().domain([priceMin, priceMax]).range([0, 1]).clamp(true)
)}

function _THREE(require){return(
require("three@0.128")
)}

function _canvas(DOM,width)
{
  const el = DOM.canvas(width, 580)
  el.style.borderRadius = "12px"
  el.style.cursor = "grab"
  el.style.display = "block"
  return el
}


function _sceneState(THREE,width,canvas,stateNames,stateCentroids,priceScale,invalidation)
{
  const scene    = new THREE.Scene()
  const camera   = new THREE.PerspectiveCamera(45, width / 580, 0.1, 1000)
  camera.position.set(0, 0, 2.5)

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(devicePixelRatio)
  renderer.setSize(width, 580)

  const texture = new THREE.TextureLoader().load(
    "https://unpkg.com/three-globe/example/img/earth-day.jpg"
  )
  const globe = new THREE.Mesh(
    new THREE.SphereGeometry(1, 64, 64),
    new THREE.MeshPhongMaterial({ map: texture })
  )
  globe.rotation.y = -1.65
  globe.rotation.x =  0.35
  scene.add(globe)

  // bars live inside globe so they rotate with it
  const barGroup = new THREE.Group()
  globe.add(barGroup)

  scene.add(new THREE.AmbientLight(0xffffff, 0.65))
  const sun = new THREE.DirectionalLight(0xffffff, 1.1)
  sun.position.set(5, 3, 5)
  scene.add(sun)

  function toXYZ(lat, lon, r = 1.012) {
    const phi   = (90 - lat) * Math.PI / 180
    const theta = (lon + 180) * Math.PI / 180
    return new THREE.Vector3(
      -r * Math.sin(phi) * Math.cos(theta),
       r * Math.cos(phi),
       r * Math.sin(phi) * Math.sin(theta)
    )
  }

  // pre-build one mesh per state, update in place instead of rebuilding
  const barMeshes = {}
  for (const state of stateNames) {
    const coords = stateCentroids[state]
    if (!coords) continue
    const geo = new THREE.BoxGeometry(0.022, 1, 0.022)
    const mat = new THREE.MeshPhongMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.88 })
    const bar = new THREE.Mesh(geo, mat)
    const base = toXYZ(coords.lat, coords.lon)
    const up   = base.clone().normalize()
    bar.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), up)
    bar.userData.base  = base
    bar.userData.up    = up
    bar.userData.state = state
    bar.userData.price = 0
    barGroup.add(bar)
    barMeshes[state] = bar
  }

  function drawBars(row) {
    for (const state of stateNames) {
      const bar = barMeshes[state]
      if (!bar) continue
      const price = row[state]
      if (isNaN(price)) continue
      const t = priceScale(price)
      const h = 0.04 + t * 0.42
      bar.scale.y = h
      bar.position.copy(bar.userData.base.clone().add(bar.userData.up.clone().multiplyScalar(h / 2)))
      const hue = 0.62 - t * 0.55
      bar.material.color.setHSL(hue, 0.88, 0.44 + t * 0.12)
      bar.userData.price = price
    }
  }

  let dragging = false, prev = { x: 0, y: 0 }
  canvas.addEventListener("mousedown", e => {
    dragging = true
    canvas.style.cursor = "grabbing"
    prev = { x: e.clientX, y: e.clientY }
  })
  window.addEventListener("mouseup", () => {
    dragging = false
    canvas.style.cursor = "grab"
  })
  window.addEventListener("mousemove", e => {
    if (!dragging) return
    globe.rotation.y += (e.clientX - prev.x) * 0.005
    globe.rotation.x += (e.clientY - prev.y) * 0.005
    globe.rotation.x  = Math.max(-1.1, Math.min(1.1, globe.rotation.x))
    prev = { x: e.clientX, y: e.clientY }
  })

  canvas.addEventListener("wheel", e => {
    camera.position.z = Math.max(1.3, Math.min(5.5, camera.position.z + e.deltaY * 0.002))
  }, { passive: true })

  const raycaster = new THREE.Raycaster()
  const mouse     = new THREE.Vector2()
  const tooltip   = Object.assign(document.createElement("div"), {
    style: `position:absolute;background:rgba(10,10,20,0.82);color:#fff;
            padding:5px 11px;border-radius:7px;font-size:12px;font-family:sans-serif;
            pointer-events:none;display:none;white-space:nowrap;`
  })
  setTimeout(() => canvas.parentElement?.appendChild(tooltip), 50)

  canvas.addEventListener("mousemove", e => {
    const rect = canvas.getBoundingClientRect()
    mouse.x =  ((e.clientX - rect.left) / rect.width)  * 2 - 1
    mouse.y = -((e.clientY - rect.top)  / rect.height) * 2 + 1
    raycaster.setFromCamera(mouse, camera)
    const hits = raycaster.intersectObjects(barGroup.children)
    if (hits.length) {
      const { state, price } = hits[0].object.userData
      tooltip.style.display = "block"
      tooltip.style.left = (e.clientX - rect.left + 14) + "px"
      tooltip.style.top  = (e.clientY - rect.top  - 32) + "px"
      tooltip.textContent = `${state}: $${(price||0).toFixed(2)}/MMBtu`
    } else {
      tooltip.style.display = "none"
    }
  })
  canvas.addEventListener("mouseleave", () => tooltip.style.display = "none")

  ;(function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
  })()

  invalidation.then(() => { renderer.dispose(); tooltip.remove() })

  return { scene, globe, barGroup, drawBars }
}


function _currentTime(){return(
0
)}

function _sliderTime(Inputs,parsed,width){return(
Inputs.range(
  [0, parsed.length - 1],
  { step: 1, value: 0, label: "Date", width: width }
)
)}

function _17($0,sliderTime)
{
  $0.value = sliderTime
}


function _18(sceneState,parsed,currentTime)
{
  sceneState.drawBars(parsed[currentTime])
}


function _playing(Inputs){return(
Inputs.toggle({ label: "▶ Auto-play", value: false })
)}

function _20(playing,$0,currentTime,parsed,invalidation)
{
  if (playing) {
    const id = setInterval(() => {
      $0.value = (currentTime + 1) % parsed.length
    }, 80)
    invalidation.then(() => clearInterval(id))
  }
}


function _21(parsed,currentTime,stateNames,html)
{
  const row = parsed[currentTime]
  const prices = stateNames.map(s => row[s]).filter(v => !isNaN(v))
  const hi = stateNames.reduce((a, s) => row[s] > row[a] ? s : a, stateNames[0])
  const lo = stateNames.reduce((a, s) => row[s] < row[a] ? s : a, stateNames[0])
  return html`<div style="display:flex;gap:24px;font-size:13px;color:#888;margin:4px 0 6px">
    <span>${row.date.toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"})}</span>
    <span>Henry Hub: <b style="color:#ccc">$${row.henry_hub.toFixed(2)}</b></span>
    <span>High: <b style="color:#f97316">${hi} $${row[hi].toFixed(2)}</b></span>
    <span>Low: <b style="color:#60a5fa">${lo} $${row[lo].toFixed(2)}</b></span>
  </div>`
}


function _22(html,width,canvas){return(
html`<div style="position:relative;width:${width}px;height:580px;border-radius:12px;overflow:hidden;background:#0a0e1a">
  ${canvas}
</div>`
)}

function _23(html){return(
html`<div style="display:flex;align-items:center;gap:20px;margin-top:10px;font-size:12px;color:#777">
  <span style="display:inline-flex;align-items:center;gap:5px">
    <span style="display:inline-block;width:12px;height:12px;border-radius:2px;background:#3b82f6"></span>Low price
  </span>
  <span style="display:inline-flex;align-items:center;gap:5px">
    <span style="display:inline-block;width:12px;height:12px;border-radius:2px;background:#f97316"></span>High price
  </span>
  <span style="margin-left:auto">Drag to rotate · Scroll to zoom · Hover bar for price</span>
</div>`
)}

function _24(html,parsed,sceneState,canvas)
{
  let isPlaying = false
  let intervalId = null

  const playBtn = html`<button style="background:#1e293b;color:#fff;border:1px solid #334155;
    padding:6px 16px;border-radius:6px;cursor:pointer;font-size:13px">▶ Play</button>`

  const slider = html`<input type="range" min="0" max="${parsed.length - 1}" 
    value="0" step="1" style="width:100%;accent-color:#f97316">`

  const dateLabel = html`<span style="font-size:13px;color:#888">—</span>`
  const hubLabel  = html`<span style="font-size:13px;color:#888">—</span>`

  function updateDisplay(i) {
    const row = parsed[i]
    sceneState.drawBars(row)
    dateLabel.textContent = row.date.toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"})
    hubLabel.textContent  = `Henry Hub: $${row.henry_hub.toFixed(2)}`
  }

  slider.oninput = () => updateDisplay(+slider.value)

  playBtn.onclick = () => {
    if (isPlaying) {
      clearInterval(intervalId)
      isPlaying = false
      playBtn.textContent = "▶ Play"
    } else {
      isPlaying = true
      playBtn.textContent = "⏹ Stop"
      intervalId = setInterval(() => {
        const next = (+slider.value + 1) % parsed.length
        slider.value = next
        updateDisplay(next)
      }, 80)
    }
  }

  updateDisplay(0)

  return html`<div style="display:flex;flex-direction:column;gap:10px;background:#0a0e1a;padding:20px;border-radius:12px">
    <div style="display:flex;align-items:center;gap:12px">
      ${playBtn}
      ${dateLabel}
      ${hubLabel}
    </div>
    ${slider}
    <div style="position:relative;border-radius:12px;">${canvas}</div>
    <div style="display:flex;gap:20px;font-size:12px;color:#777">
      <span><span style="display:inline-block;width:10px;height:10px;background:#3b82f6;border-radius:2px;margin-right:4px"></span>Low</span>
      <span><span style="display:inline-block;width:10px;height:10px;background:#f97316;border-radius:2px;margin-right:4px"></span>High</span>
      <span style="margin-left:auto">Drag to rotate · Scroll to zoom · Hover for price</span>
    </div>
  </div>`
}


export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["HarrisonWitt.DailySyntheticStateCitygateNGPrices.csv", {url: new URL("./files/cf2891230fe710f074394d2855453c521ea3b865a74186e1676c275b37c35ee2f054afc5252e8d8a4e039d64dbbb14160e98ebdc69f1c0361504988207516cf2.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("harrisonwittDailysyntheticstatecitygatengprices")).define("harrisonwittDailysyntheticstatecitygatengprices", ["__query","FileAttachment","invalidation"], _harrisonwittDailysyntheticstatecitygatengprices);
  main.variable(observer("data")).define("data", ["FileAttachment"], _data);
  main.variable(observer("stateNames")).define("stateNames", _stateNames);
  main.variable(observer("stateCentroids")).define("stateCentroids", _stateCentroids);
  main.variable(observer("parsed")).define("parsed", ["data","stateNames"], _parsed);
  main.variable(observer("timeSteps")).define("timeSteps", ["parsed"], _timeSteps);
  main.variable(observer("allPrices")).define("allPrices", ["parsed","stateNames"], _allPrices);
  main.variable(observer("priceMin")).define("priceMin", ["d3","allPrices"], _priceMin);
  main.variable(observer("priceMax")).define("priceMax", ["d3","allPrices"], _priceMax);
  main.variable(observer("priceScale")).define("priceScale", ["d3","priceMin","priceMax"], _priceScale);
  main.variable(observer("THREE")).define("THREE", ["require"], _THREE);
  main.variable(observer("canvas")).define("canvas", ["DOM","width"], _canvas);
  main.variable(observer("sceneState")).define("sceneState", ["THREE","width","canvas","stateNames","stateCentroids","priceScale","invalidation"], _sceneState);
  main.define("initial currentTime", _currentTime);
  main.variable(observer("mutable currentTime")).define("mutable currentTime", ["Mutable", "initial currentTime"], (M, _) => new M(_));
  main.variable(observer("currentTime")).define("currentTime", ["mutable currentTime"], _ => _.generator);
  main.variable(observer("viewof sliderTime")).define("viewof sliderTime", ["Inputs","parsed","width"], _sliderTime);
  main.variable(observer("sliderTime")).define("sliderTime", ["Generators", "viewof sliderTime"], (G, _) => G.input(_));
  main.variable(observer()).define(["mutable currentTime","sliderTime"], _17);
  main.variable(observer()).define(["sceneState","parsed","currentTime"], _18);
  main.variable(observer("viewof playing")).define("viewof playing", ["Inputs"], _playing);
  main.variable(observer("playing")).define("playing", ["Generators", "viewof playing"], (G, _) => G.input(_));
  main.variable(observer()).define(["playing","mutable currentTime","currentTime","parsed","invalidation"], _20);
  main.variable(observer()).define(["parsed","currentTime","stateNames","html"], _21);
  main.variable(observer()).define(["html","width","canvas"], _22);
  main.variable(observer()).define(["html"], _23);
  main.variable(observer()).define(["html","parsed","sceneState","canvas"], _24);
  return main;
}
