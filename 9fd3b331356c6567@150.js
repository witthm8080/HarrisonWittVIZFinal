function _1(md){return(
md`# American Natural Gas Citygate Basis Spread Visualization`
)}

function _harrisonwittDailysyntheticstatecitygatengprices(__query,FileAttachment,invalidation){return(
__query(FileAttachment("HarrisonWitt_DailySyntheticStateCitygateNGPrices_InflationAdjustedThru2024.csv"),{from:{table:"HarrisonWitt_DailySyntheticStateCitygateNGPrices_InflationAdjustedThru2024"},sort:[],slice:{to:null,from:null},filter:[],select:{columns:null}},invalidation)
)}

function _data(FileAttachment){return(
FileAttachment("HarrisonWitt.DailySyntheticStateCitygateNGPrices.csv").csv({ typed: true })
)}

function _stateNames(){return(
["Alabama","Arizona","Arkansas","California","Colorado",
  "Connecticut","Delaware","Florida","Georgia","Idaho","Illinois",
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
    "Arizona":        { lat: 34.3,  lon: -111.1 },
    "Arkansas":       { lat: 34.8,  lon: -92.2  },
    "California":     { lat: 37.2,  lon: -119.4 },
    "Colorado":       { lat: 38.9,  lon: -105.5 },
    "Connecticut":    { lat: 41.6,  lon: -72.7  },
    "Delaware":       { lat: 39.0,  lon: -75.5  },
    "Florida":        { lat: 27.8,  lon: -81.7  },
    "Georgia":        { lat: 32.7,  lon: -83.4  },
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
  const el = DOM.canvas(width, 400)
  el.style.borderRadius = "12px"
  el.style.cursor = "grab"
  el.style.display = "block"
  return el
}


function _sceneState(THREE,width,canvas,stateNames,stateCentroids,priceScale,invalidation)
{
  const scene    = new THREE.Scene()
  const camera   = new THREE.PerspectiveCamera(45, width / 400, 0.1, 1000)
  camera.position.set(0, 0, 2.5)

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(devicePixelRatio)
  renderer.setSize(width, 400)

  const texture = new THREE.TextureLoader().load(
    "https://unpkg.com/three-globe/example/img/earth-day.jpg"
  )
  const globe = new THREE.Mesh(
    new THREE.SphereGeometry(1, 64, 64),
    new THREE.MeshPhongMaterial({ map: texture })
  )
  globe.rotation.y = -1.9
  globe.rotation.x =  0.25
  scene.add(globe)

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

  const barMeshes = {}
  for (const state of stateNames) {
    const coords = stateCentroids[state]
    if (!coords) continue
    const geo = new THREE.BoxGeometry(0.012, 1, 0.012)
    const mat = new THREE.MeshPhongMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.72,
      emissive: 0x003344,
      emissiveIntensity: 0.4
    })
    
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
      // 5-color scale: deep blue to cyan to green to yellow to red
      const stops = [
        [0.0,  0x1a237e],  // deep navy
        [0.25, 0x00bcd4],  // cyan
        [0.5,  0x00e676],  // green
        [0.75, 0xffeb3b],  // yellow
        [1.0,  0xff1744],  // red
      ]
      let c1, c2, f
      for (let si = 0; si < stops.length - 1; si++) {
        if (t >= stops[si][0] && t <= stops[si+1][0]) {
          f  = (t - stops[si][0]) / (stops[si+1][0] - stops[si][0])
          c1 = new THREE.Color(stops[si][1])
          c2 = new THREE.Color(stops[si+1][1])
          break
        }
      }
      const blended = c1.lerp(c2, f)
      bar.material.color.set(blended)
      bar.material.emissive.set(blended)
      bar.material.emissiveIntensity = 0.25 + t * 0.35
      bar.material.opacity = 0.65 + t * 0.25
      
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
    
    const hits = raycaster.intersectObjects(barGroup.children, true)
    
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

  canvas.addEventListener("wheel", e => {
    e.preventDefault()
    const rect = canvas.getBoundingClientRect()
    mouse.x =  ((e.clientX - rect.left) / rect.width)  * 2 - 1
    mouse.y = -((e.clientY - rect.top)  / rect.height) * 2 + 1
    raycaster.setFromCamera(mouse, camera)
    const direction = raycaster.ray.direction.clone().normalize()
    const zoomAmount = e.deltaY * 0.002
    camera.position.addScaledVector(direction, zoomAmount)
  }, { passive: false })
    
  let lastMouse = { x: 0, y: 0 }
  canvas.addEventListener("mousemove", e => {
    lastMouse = { x: e.clientX, y: e.clientY }
  })

  ;(function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)

    // Update tooltip every frame so it stays current during autoplay
    const rect = canvas.getBoundingClientRect()
    mouse.x =  ((lastMouse.x - rect.left) / rect.width)  * 2 - 1
    mouse.y = -((lastMouse.y - rect.top)  / rect.height) * 2 + 1
    raycaster.setFromCamera(mouse, camera)
    const hits = raycaster.intersectObjects(barGroup.children, true)
    if (hits.length) {
      const { state, price } = hits[0].object.userData
      tooltip.style.display = "block"
      tooltip.style.left = (lastMouse.x - rect.left + 14) + "px"
      tooltip.style.top  = (lastMouse.y - rect.top  - 32) + "px"
      tooltip.textContent = `${state}: $${(price||0).toFixed(2)}/MMBtu`
    } else {
      tooltip.style.display = "none"
    }
  })()

  invalidation.then(() => { renderer.dispose(); tooltip.remove() })

  return { scene, globe, barGroup, drawBars, camera }
}


function _currentTime(){return(
0
)}

function _15(sceneState,parsed,currentTime)
{
  sceneState.drawBars(parsed[currentTime])
}


function _16(regimes,weatherEvents,dateToIndex,html,parsed,sceneState,stateNames,canvas)
{
  let isPlaying = false
  let intervalId = null

  // Build pause index set — pause at regime starts and event peaks
  const pauseIndices = new Set()
  ;[...regimes, ...weatherEvents].forEach(e => {
    const idx = dateToIndex.get(e.date)
    if (idx != null) pauseIndices.add(idx)
  })

  const playBtn = html`<button style="background:#1e293b;color:#fff;border:1px solid #334155;
    padding:6px 16px;border-radius:6px;cursor:pointer;font-size:13px">▶ Play</button>`
  const panUp = html`<button style="background:#1e293b;color:#fff;border:1px solid #334155;
    padding:6px 12px;border-radius:6px;cursor:pointer;font-size:16px">↑</button>`
  const panDown = html`<button style="background:#1e293b;color:#fff;border:1px solid #334155;
    padding:6px 12px;border-radius:6px;cursor:pointer;font-size:16px">↓</button>`

  const minDate = parsed[0].date.toISOString().slice(0,10)
  const maxDate = parsed[parsed.length-1].date.toISOString().slice(0,10)
  const slider = html`<input type="range" min="0" max="${parsed.length - 1}" 
    value="0" step="1" style="width:100%;accent-color:#f97316;flex:1">`
  const dateInput = html`<input type="text" placeholder="YYYY-MM-DD" value="${minDate}"
    style="background:#1e293b;color:#fff;border:1px solid #334155;border-radius:6px;
    padding:5px 10px;font-size:14px;width:120px">`

  const dateLabel = html`<span style="font-size:16px;color:#ccc;font-weight:bold">—</span>`
  const hubLabel  = html`<span style="font-size:15px;color:#aaa">—</span>`
  const eventLabel = html`<span style="font-size:14px;color:#fbbf24;font-weight:bold;min-height:20px;display:block"></span>`

  function getCurrentLabel(i) {
    // Find which regime we're in
    let regimeLabel = ""
    for (let r = regimes.length - 1; r >= 0; r--) {
      const ri = dateToIndex.get(regimes[r].date)
      if (ri != null && i >= ri) { regimeLabel = regimes[r].label; break }
    }
    // Check if we're on an event day
    const eventDay = weatherEvents.find(e => dateToIndex.get(e.date) === i)
    if (eventDay) return `⚡ ${eventDay.label} — ${regimeLabel}`
    return regimeLabel
  }

  function updateDisplay(i) {
    const row = parsed[i]
    sceneState.drawBars(row)
    dateInput.value = row.date.toISOString().slice(0,10)
    dateLabel.textContent = row.date.toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})
    eventLabel.textContent = getCurrentLabel(i)
    const hi = stateNames.reduce((a, s) => row[s] > row[a] ? s : a, stateNames[0])
    const lo = stateNames.reduce((a, s) => row[s] < row[a] ? s : a, stateNames[0])
    hubLabel.innerHTML = `<span style="color:#aaa;font-size:15px">Henry Hub: <b style="color:#fff">$${row.henry_hub.toFixed(2)}</b></span>
      &nbsp;&nbsp;
      <span style="font-size:15px">High: <b style="color:#f97316">${hi} $${row[hi].toFixed(2)}</b></span>
      &nbsp;&nbsp;
      <span style="font-size:15px">Low: <b style="color:#60a5fa">${lo} $${row[lo].toFixed(2)}</b></span>`
  }

  slider.oninput = () => {
    const row = parsed[+slider.value]
    dateInput.value = row.date.toISOString().slice(0,10)
    updateDisplay(+slider.value)
  }

  dateInput.onblur = () => {
    const target = new Date(dateInput.value)
    let closest = 0, minDiff = Infinity
    parsed.forEach((row, i) => {
      const diff = Math.abs(row.date - target)
      if (diff < minDiff) { minDiff = diff; closest = i }
    })
    slider.value = closest
    updateDisplay(closest)
  }

  dateInput.onkeydown = (e) => {
    if (e.key === "Enter") dateInput.blur()
  }

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
        // Pause at regime changes and weather events
        if (pauseIndices.has(next) || [...pauseIndices].some(p => Math.abs(p - next) <= 1)) {
          clearInterval(intervalId)
          isPlaying = false
          playBtn.textContent = "▶ Play"
        }
      }, 22)
    }
  }

  panUp.onclick   = () => { sceneState.camera.position.y += 0.15 }
  panDown.onclick = () => { sceneState.camera.position.y -= 0.15 }

  // Build the timeline markers SVG
  const total = parsed.length
  
  const svgMarkers = () => {
    const w = 800
    const regimeHeights = [14, 26, 14]    
      const regimeMarks = regimes.map((r, ri) => {
      const idx = dateToIndex.get(r.date) || 0
      const x = (idx / total) * w
      const y = regimeHeights[ri]
      return `<line x1="${x}" y1="0" x2="${x}" y2="38" stroke="${r.color}" stroke-width="2" opacity="0.9"/>
              <text x="${x+4}" y="${y}" fill="${r.color}" font-size="11" font-family="sans-serif" font-weight="bold">${r.label}</text>`
    }).join("")
    const eventHeights = [130, 110, 130, 105, 130, 110, 130]
    const eventMarks = weatherEvents.map((e, ei) => {
      const idx = dateToIndex.get(e.date) || 0
      const x = (idx / total) * w
      const lineEnd = eventHeights[ei]
      return `<line x1="${x}" y1="40" x2="${x}" y2="${lineEnd}" stroke="#fbbf24" stroke-width="1.5" stroke-dasharray="3,2"/>
              <text transform="translate(${x+4},${lineEnd}) rotate(-35)" fill="#fbbf24" font-size="11" font-family="sans-serif" font-weight="bold">${e.label}</text>`
    }).join("")
    return `<svg width="100%" height="160" viewBox="0 0 ${w} 160" style="display:block">
      <rect width="${w}" height="160" fill="#0f172a" rx="4"/>
      <line x1="0" y1="38" x2="${w}" y2="38" stroke="#334155" stroke-width="1"/>
      ${regimeMarks}
      ${eventMarks}
    </svg>`
  }

  updateDisplay(0)

  return html`<div style="display:flex;flex-direction:column;gap:10px;background:#0a0e1a;padding:20px;border-radius:12px">
    <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
      ${playBtn}
      ${panUp}
      ${panDown}
      ${dateLabel}
      ${hubLabel}
    </div>
    ${eventLabel}
    <div style="display:flex;align-items:center;gap:10px">
      ${dateInput}
      ${slider}
    </div>
    ${ html`<div>${svgMarkers()}</div>` }
    <div style="position:relative;border-radius:12px;height:400px;">${canvas}</div>
    <div style="display:flex;align-items:center;justify-content:space-between;margin-top:4px">
      <div style="display:flex;gap:16px;font-size:15px;color:#777;align-items:center">
        <span><span style="display:inline-block;width:10px;height:10px;background:#1a237e;border-radius:2px;margin-right:4px"></span>Low</span>
        <span><span style="display:inline-block;width:10px;height:10px;background:#00bcd4;border-radius:2px;margin-right:4px"></span></span>
        <span><span style="display:inline-block;width:10px;height:10px;background:#00e676;border-radius:2px;margin-right:4px"></span></span>
        <span><span style="display:inline-block;width:10px;height:10px;background:#ffeb3b;border-radius:2px;margin-right:4px"></span></span>
        <span><span style="display:inline-block;width:10px;height:10px;background:#ff1744;border-radius:2px;margin-right:4px"></span>High</span>
      </div>
      <div style="font-size:15px;color:#777">
        Drag to rotate &nbsp;·&nbsp; Two-finger scroll to zoom &nbsp;·&nbsp; ↑↓ to shift view &nbsp;·&nbsp; Hover bar for price
      </div>
    </div>
  </div>`
}


function _cpiFactors(){return(
{
  2000: 1.89, 2001: 1.84, 2002: 1.81, 2003: 1.77, 2004: 1.72,
  2005: 1.67, 2006: 1.61, 2007: 1.57, 2008: 1.51, 2009: 1.52,
  2010: 1.49, 2011: 1.45, 2012: 1.42, 2013: 1.40, 2014: 1.37,
  2015: 1.37, 2016: 1.35, 2017: 1.33, 2018: 1.29, 2019: 1.27,
  2020: 1.26
}
)}

function _parsedInflationAdjusted(parsed,cpiFactors,stateNames){return(
parsed.map(row => {
  const year = row.date.getFullYear()
  const factor = cpiFactors[year] || 1
  const adjusted = { date: row.date, henry_hub: +(row.henry_hub * factor).toFixed(4) }
  for (const s of stateNames) {
    adjusted[s] = +((row[s] || 0) * factor).toFixed(4)
  }
  return adjusted
})
)}

function _19(stateNames,parsedInflationAdjusted)
{
  const headers = ["Date", "henry_hub", ...stateNames]
  const rows = parsedInflationAdjusted.map(row => {
    const date = row.date.toISOString().slice(0,10)
    return [date, row.henry_hub, ...stateNames.map(s => row[s])].join(",")
  })
  const csv = [headers.join(","), ...rows].join("\n")
  const blob = new Blob([csv], {type: "text/csv"})
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "HarrisonWitt_DailySyntheticStateCitygateNGPrices_InflationAdjustedThru2024.csv"
  a.textContent = "Download Inflation-Adjusted CSV"
  a.style.cssText = "color:#f97316;font-size:15px"
  return a
}


function _regimes(){return(
[
  { date: "2009-01-06", label: "Shale Revolution",       color: "#00e676" },
  { date: "2014-01-02", label: "Polar Vortex Era",        color: "#00bcd4" },
  { date: "2019-01-02", label: "Post-Shale Low / COVID",  color: "#a78bfa" },
]
)}

function _weatherEvents(){return(
[
  { date: "2000-12-21", label: "Winter 2000 Spike" },
  { date: "2003-02-25", label: "Feb 2003 Cold Snap" },
  { date: "2005-09-22", label: "Hurricane Rita" },
  { date: "2005-12-13", label: "Post-Hurricane Winter" },
  { date: "2008-07-02", label: "Oil Supercycle Peak" },
  { date: "2014-02-10", label: "Polar Vortex" },
  { date: "2018-01-02", label: "Bomb Cyclone" },
]
)}

function _dateToIndex(parsed)
{
  const map = new Map()
  parsed.forEach((row, i) => map.set(row.date.toISOString().slice(0,10), i))
  return map
}


function _23(regimes,weatherEvents,dateToIndex,html)
{
  const checks = [...regimes, ...weatherEvents].map(e => {
    const idx = dateToIndex.get(e.date)
    return `${e.date} (${e.label}): index=${idx}`
  })
  return html`<pre>${checks.join("\n")}</pre>`
}


export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["HarrisonWitt.DailySyntheticStateCitygateNGPrices.csv", {url: new URL("./files/cf2891230fe710f074394d2855453c521ea3b865a74186e1676c275b37c35ee2f054afc5252e8d8a4e039d64dbbb14160e98ebdc69f1c0361504988207516cf2.csv", import.meta.url), mimeType: "text/csv", toString}],
    ["HarrisonWitt_DailySyntheticStateCitygateNGPrices_InflationAdjustedThru2024.csv", {url: new URL("./files/e1fd53aa29b9294362ac19ed219bd2c497390460d18189b46988686391b9cdc8ced199efe0b7645a45c2f59894379c5a95754b884ab36aae3c167876ddf8de39.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("harrisonwittDailysyntheticstatecitygatengprices")).define("harrisonwittDailysyntheticstatecitygatengprices", ["__query","FileAttachment","invalidation"], _harrisonwittDailysyntheticstatecitygatengprices);
  main.variable(observer("data")).define("data", ["FileAttachment"], _data);
  main.variable(observer("stateNames")).define("stateNames", _stateNames);
  main.variable(observer("stateCentroids")).define("stateCentroids", _stateCentroids);
  main.variable(observer("parsed")).define("parsed", ["data","stateNames"], _parsed);
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
  main.variable(observer()).define(["sceneState","parsed","currentTime"], _15);
  main.variable(observer()).define(["regimes","weatherEvents","dateToIndex","html","parsed","sceneState","stateNames","canvas"], _16);
  main.variable(observer("cpiFactors")).define("cpiFactors", _cpiFactors);
  main.variable(observer("parsedInflationAdjusted")).define("parsedInflationAdjusted", ["parsed","cpiFactors","stateNames"], _parsedInflationAdjusted);
  main.variable(observer()).define(["stateNames","parsedInflationAdjusted"], _19);
  main.variable(observer("regimes")).define("regimes", _regimes);
  main.variable(observer("weatherEvents")).define("weatherEvents", _weatherEvents);
  main.variable(observer("dateToIndex")).define("dateToIndex", ["parsed"], _dateToIndex);
  main.variable(observer()).define(["regimes","weatherEvents","dateToIndex","html"], _23);
  return main;
}
