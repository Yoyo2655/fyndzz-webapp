'use client'

import { useEffect, useRef } from 'react'
import 'maplibre-gl/dist/maplibre-gl.css'
import { getRoute, getNearestFree } from '@/lib/osrm'

function getDistanceMeters(lat1, lng1, lat2, lng2) {
  const R = 6371000
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat/2) ** 2 + Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) * Math.sin(dLng/2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
}

function getBearing(lat1, lng1, lat2, lng2) {
  const dLng = (lng2 - lng1) * Math.PI / 180
  const lat1R = lat1 * Math.PI / 180
  const lat2R = lat2 * Math.PI / 180
  const y = Math.sin(dLng) * Math.cos(lat2R)
  const x = Math.cos(lat1R) * Math.sin(lat2R) - Math.sin(lat1R) * Math.cos(lat2R) * Math.cos(dLng)
  return ((Math.atan2(y, x) * 180 / Math.PI) + 360) % 360
}

export default function Map({ sensors = [], onRouteFound, navMode, currentStep, onStepAdvance }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const stepsRef = useRef([])
  const currentStepRef = useRef(0)
  const watchIdRef = useRef(null)
  const lastPosRef = useRef(null)
  const userMarkerRef = useRef(null)
  const destMarkerRef = useRef(null)
  const navModeRef = useRef(false)
  const fuelMarkersRef = useRef([])

  useEffect(() => {
    if (mapInstanceRef.current) return

    const loadFuelStations = async (lat, lng, showFuel, showElec) => {
      try {
        fuelMarkersRef.current.forEach(m => m.remove())
        fuelMarkersRef.current = []
        if (!showFuel && !showElec) return

        const latMin = (lat - 0.04).toFixed(6)
        const latMax = (lat + 0.04).toFixed(6)
        const lngMin = (lng - 0.06).toFixed(6)
        const lngMax = (lng + 0.06).toFixed(6)

        const url = `https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/prix-des-carburants-en-france-flux-instantane-v2/records?where=geom IS NOT NULL&geofilter.bbox=${latMin},${lngMin},${latMax},${lngMax}&limit=100&timezone=Europe/Paris`

        const res = await fetch(url)
        const data = await res.json()
        if (!data.results) return

        const maplibregl = (await import('maplibre-gl')).default

        data.results.forEach(station => {
          if (!station.geom?.lat || !station.geom?.lon) return

          const hasElec = station.services_service?.includes('Bornes électriques')
          const hasFuel = (station.carburants_disponibles?.length ?? 0) > 0

          if (hasElec && !showElec && !hasFuel) return
          if (!hasElec && !showFuel) return
          if (hasElec && !showElec && !showFuel) return
          if (!hasFuel && !hasElec) return

          const showAsElec = hasElec && showElec
          const showAsFuel = hasFuel && showFuel

          if (!showAsElec && !showAsFuel) return

          const stLat = station.geom.lat
          const stLng = station.geom.lon

          const el = document.createElement('div')
          el.innerHTML = showAsElec ? `
            <div style="width:30px;height:30px;background:#3D2CD5;border:2.5px solid white;border-radius:10px;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.3);cursor:pointer;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M13 2L4.5 13.5H11L10 22L19.5 10.5H13L13 2Z"/></svg>
            </div>
          ` : `
            <div style="width:30px;height:30px;background:#FFB800;border:2.5px solid white;border-radius:10px;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.3);cursor:pointer;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="2" width="12" height="16" rx="2" stroke="white" stroke-width="2"/>
                <path d="M15 8h2a2 2 0 012 2v4a2 2 0 01-2 2h-2" stroke="white" stroke-width="2"/>
                <line x1="6" y1="7" x2="12" y2="7" stroke="white" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
          `

          const prix = []
          if (station.gazole_prix) prix.push(`<div style="display:flex;justify-content:space-between;gap:16px"><span style="color:#666">Diesel</span><b style="color:#160C6B">${station.gazole_prix.toFixed(3)}€</b></div>`)
          if (station.sp95_prix) prix.push(`<div style="display:flex;justify-content:space-between;gap:16px"><span style="color:#666">SP95</span><b style="color:#160C6B">${station.sp95_prix.toFixed(3)}€</b></div>`)
          if (station.sp98_prix) prix.push(`<div style="display:flex;justify-content:space-between;gap:16px"><span style="color:#666">SP98</span><b style="color:#160C6B">${station.sp98_prix.toFixed(3)}€</b></div>`)
          if (station.e10_prix) prix.push(`<div style="display:flex;justify-content:space-between;gap:16px"><span style="color:#666">E10</span><b style="color:#160C6B">${station.e10_prix.toFixed(3)}€</b></div>`)
          if (station.e85_prix) prix.push(`<div style="display:flex;justify-content:space-between;gap:16px"><span style="color:#666">E85</span><b style="color:#160C6B">${station.e85_prix.toFixed(3)}€</b></div>`)
          if (station.gplc_prix) prix.push(`<div style="display:flex;justify-content:space-between;gap:16px"><span style="color:#666">GPLc</span><b style="color:#160C6B">${station.gplc_prix.toFixed(3)}€</b></div>`)

          const popupHTML = `
            <div style="font-family:sans-serif;min-width:210px;padding:4px">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
                <div style="width:28px;height:28px;background:${showAsElec ? '#3D2CD5' : '#FFB800'};border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0">
                  ${showAsElec
                    ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M13 2L4.5 13.5H11L10 22L19.5 10.5H13L13 2Z"/></svg>`
                    : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="2" width="12" height="16" rx="2" stroke="white" stroke-width="2"/><path d="M15 8h2a2 2 0 012 2v4a2 2 0 01-2 2h-2" stroke="white" stroke-width="2"/></svg>`
                  }
                </div>
                <div style="min-width:0">
                  <div style="font-weight:800;font-size:13px;color:#160C6B;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:160px">${station.adresse || 'Station'}</div>
                  <div style="font-size:11px;color:#999">${station.ville || ''} ${station.cp || ''}</div>
                </div>
              </div>
              ${hasElec ? `<div style="background:#3D2CD5;color:white;font-size:11px;font-weight:700;border-radius:6px;padding:4px 8px;margin-bottom:8px;display:inline-block">⚡ Borne électrique disponible</div>` : ''}
              ${prix.length > 0 ? `
                <div style="background:#f8f9fa;border-radius:8px;padding:8px;margin-bottom:10px;font-size:13px">
                  ${prix.join('')}
                </div>
              ` : '<div style="font-size:12px;color:#999;margin-bottom:10px">Prix non disponibles</div>'}
              <button
                onclick="window.__fyndzz_go_to_station(${stLat}, ${stLng})"
                style="width:100%;padding:8px;background:linear-gradient(135deg,#160C6B,#3D2CD5);color:white;border:none;border-radius:8px;font-weight:700;font-size:13px;cursor:pointer;"
              >
                Y aller
              </button>
            </div>
          `

          const marker = new maplibregl.Marker({ element: el })
            .setLngLat([stLng, stLat])
            .setPopup(new maplibregl.Popup({ offset: 20, maxWidth: '260px' }).setHTML(popupHTML))
            .addTo(mapInstanceRef.current)

          fuelMarkersRef.current.push(marker)
        })
      } catch (err) {
        console.error('Stations:', err)
      }
    }

    const handleDestination = async (destination) => {
      const maplibregl = (await import('maplibre-gl')).default

      if (destMarkerRef.current) destMarkerRef.current.remove()
      const destEl = document.createElement('div')
      destEl.innerHTML = `
        <div style="filter:drop-shadow(0 4px 8px rgba(0,0,0,0.3));">
          <svg viewBox="0 0 40 50" fill="none" xmlns="http://www.w3.org/2000/svg" width="40" height="50">
            <path d="M20 0C9 0 0 9 0 20C0 33 20 50 20 50C20 50 40 33 40 20C40 9 31 0 20 0Z" fill="#00FF66"/>
            <circle cx="20" cy="20" r="10" fill="white"/>
            <text x="20" y="25" text-anchor="middle" font-size="12" font-weight="bold" fill="#160C6B">P</text>
          </svg>
        </div>
      `
      destMarkerRef.current = new maplibregl.Marker({ element: destEl, anchor: 'bottom' })
        .setLngLat([destination.lng, destination.lat])
        .addTo(mapInstanceRef.current)

      const currentSensors = window.__fyndzz_sensors || []
      const nearest = await getNearestFree(currentSensors, destination)
      if (!nearest) return

      const from = window.__fyndzz_userpos || { lat: 48.860, lng: 2.275 }
      const route = await getRoute(from, nearest)
      if (!route) return

      const source = mapInstanceRef.current.getSource('route')
      if (source) source.setData(route.geometry)

      //const coords = route.geometry.coordinates
      //const bounds = coords.reduce((b, c) => b.extend(c), new maplibregl.LngLatBounds(coords[0], coords[0]))
      //mapInstanceRef.current.fitBounds(bounds, { padding: 80, duration: 800 })

      const steps = route.legs?.[0]?.steps || []
      stepsRef.current = steps

      const walkDist = Math.round(getDistanceMeters(nearest.lat, nearest.lng, destination.lat, destination.lng))

      if (onRouteFound) onRouteFound({
        street: nearest.street,
        mins: Math.round(route.duration / 60),
        dist: Math.round(route.distance),
        walkDist, steps, destination, nearest
      })
    }

    const initMap = async () => {
      const maplibregl = (await import('maplibre-gl')).default

      mapInstanceRef.current = new maplibregl.Map({
        container: mapRef.current,
        style: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
        center: [2.275, 48.860],
        zoom: 14, pitch: 0, bearing: 0,
        attributionControl: false
      })

      mapInstanceRef.current.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right')

      window.__fyndzz_go_to_station = (lat, lng) => {
        fuelMarkersRef.current.forEach(m => m.getPopup()?.remove())
        window.__fyndzz_destination = { lat, lng }
        window.__fyndzz_search_trigger?.()
      }

      window.__fyndzz_reload_stations = () => {
        const pos = window.__fyndzz_userpos
        if (!pos || !mapInstanceRef.current) return
        const s = window.__fyndzz_settings || {}
        loadFuelStations(pos.lat, pos.lng, s.show_fuel ?? false, s.show_elec ?? false)
      }

      mapInstanceRef.current.on('load', () => {
        if (!mapInstanceRef.current.getSource('route')) {
          mapInstanceRef.current.addSource('route', {
            type: 'geojson',
            data: { type: 'Feature', geometry: { type: 'LineString', coordinates: [] } }
          })
          mapInstanceRef.current.addLayer({
            id: 'route-outline', type: 'line', source: 'route',
            layout: { 'line-join': 'round', 'line-cap': 'round' },
            paint: { 'line-color': '#ffffff', 'line-width': 10, 'line-opacity': 0.6 }
          })
          mapInstanceRef.current.addLayer({
            id: 'route-line', type: 'line', source: 'route',
            layout: { 'line-join': 'round', 'line-cap': 'round' },
            paint: { 'line-color': '#3D2CD5', 'line-width': 7 }
          })
        }

        if (!mapInstanceRef.current.getSource('sensors')) {
          mapInstanceRef.current.addSource('sensors', {
            type: 'geojson', data: { type: 'FeatureCollection', features: [] }
          })
          mapInstanceRef.current.addLayer({
            id: 'sensors-circle', type: 'circle', source: 'sensors',
            paint: {
              'circle-radius': 8,
              'circle-color': ['get', 'color'],
              'circle-stroke-width': 2.5,
              'circle-stroke-color': '#ffffff',
              'circle-opacity': 0.9
            }
          })
        }

        navigator.geolocation.getCurrentPosition(pos => {
          const { latitude: lat, longitude: lng } = pos.coords
          window.__fyndzz_userpos = { lat, lng }
          lastPosRef.current = { lat, lng }

          const s = window.__fyndzz_settings || {}
          console.log('Settings au démarrage:', s)           // ← ajoute
          console.log('show_fuel:', s.show_fuel)             // ← ajoute
          console.log('show_elec:', s.show_elec)             // ← ajoute
          loadFuelStations(lat, lng, s.show_fuel ?? false, s.show_elec ?? false)

          const el = document.createElement('div')
          el.innerHTML = `
            <div style="width:48px;height:48px;filter:drop-shadow(0 4px 8px rgba(0,0,0,0.4));transition:transform 0.3s ease;">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="24" cy="24" r="22" fill="#3D2CD5" stroke="white" stroke-width="3"/>
                <path d="M24 10 L32 34 L24 28 L16 34 Z" fill="#00FF66"/>
              </svg>
            </div>
          `
          userMarkerRef.current = new maplibregl.Marker({ element: el, anchor: 'center' })
            .setLngLat([lng, lat])
            .addTo(mapInstanceRef.current)

          mapInstanceRef.current.flyTo({ center: [lng, lat], zoom: 15, duration: 1000 })
        }, null, { enableHighAccuracy: true })

        mapInstanceRef.current.on('click', async (e) => {
          await handleDestination({ lat: e.lngLat.lat, lng: e.lngLat.lng })
        })

        mapInstanceRef.current.on('moveend', () => {
          const zoom = mapInstanceRef.current.getZoom()
          if (zoom < 13) return
          const center = mapInstanceRef.current.getCenter()
          const s = window.__fyndzz_settings || {}
          loadFuelStations(center.lat, center.lng, s.show_fuel ?? false, s.show_elec ?? false)
        })
      })

      window.__fyndzz_move_to = (lat, lng) => {
        window.__fyndzz_userpos = { lat, lng }
        let bearing = 0
        if (lastPosRef.current) bearing = getBearing(lastPosRef.current.lat, lastPosRef.current.lng, lat, lng)
        lastPosRef.current = { lat, lng }
        if (userMarkerRef.current) {
          userMarkerRef.current.setLngLat([lng, lat])
          const inner = userMarkerRef.current.getElement().querySelector('div')
          if (inner) inner.style.transform = `rotate(${bearing}deg)`
        }
        if (mapInstanceRef.current) {
          mapInstanceRef.current.easeTo({
            center: [lng, lat],
            bearing: navModeRef.current ? bearing : 0,
            pitch: navModeRef.current ? 55 : 0,
            zoom: navModeRef.current ? 17 : 15,
            duration: 600
          })
        }
      }

      window.__fyndzz_clear_route = () => {
        const source = mapInstanceRef.current?.getSource('route')
        if (source) source.setData({ type: 'Feature', geometry: { type: 'LineString', coordinates: [] } })
        if (destMarkerRef.current) { destMarkerRef.current.remove(); destMarkerRef.current = null }
        mapInstanceRef.current?.easeTo({ pitch: 0, bearing: 0, zoom: 14, duration: 600 })
      }

      window.__fyndzz_search_trigger = async () => {
        const dest = window.__fyndzz_destination
        if (!dest) return
        await handleDestination(dest)
      }
    }

    initMap()
  }, [])

  useEffect(() => { navModeRef.current = navMode }, [navMode])

  useEffect(() => {
    if (!mapInstanceRef.current) return
    if (navMode) {
      mapInstanceRef.current.easeTo({ pitch: 55, zoom: 17, duration: 600 })
    } else {
      mapInstanceRef.current.easeTo({ pitch: 0, bearing: 0, duration: 600 })
    }
  }, [navMode])

  useEffect(() => {
    if (!mapInstanceRef.current) return
    if (navMode) {
      currentStepRef.current = currentStep
      let userInteracting = false
      let interactionTimeout
      mapInstanceRef.current.on('dragstart', () => { userInteracting = true; clearTimeout(interactionTimeout) })
      mapInstanceRef.current.on('zoomstart', () => { userInteracting = true; clearTimeout(interactionTimeout) })
      mapInstanceRef.current.on('dragend', () => { interactionTimeout = setTimeout(() => { userInteracting = false }, 5000) })
      mapInstanceRef.current.on('zoomend', () => { interactionTimeout = setTimeout(() => { userInteracting = false }, 5000) })

      watchIdRef.current = navigator.geolocation.watchPosition(pos => {
        const { latitude: lat, longitude: lng } = pos.coords
        window.__fyndzz_userpos = { lat, lng }
        let bearing = 0
        if (lastPosRef.current) bearing = getBearing(lastPosRef.current.lat, lastPosRef.current.lng, lat, lng)
        lastPosRef.current = { lat, lng }

        if (userMarkerRef.current) {
          userMarkerRef.current.setLngLat([lng, lat])
          const inner = userMarkerRef.current.getElement().querySelector('div')
          if (inner) inner.style.transform = `rotate(${bearing}deg)`
        }

        if (!userInteracting) {
          mapInstanceRef.current.easeTo({ center: [lng, lat], bearing, pitch: 55, zoom: 17, duration: 500 })
        }

        const steps = stepsRef.current
        const stepIdx = currentStepRef.current
        if (steps[stepIdx]) {
          const stepCoord = steps[stepIdx].maneuver?.location
          if (stepCoord) {
            const dist = getDistanceMeters(lat, lng, stepCoord[1], stepCoord[0])
            if (dist < 30 && stepIdx < steps.length - 1) {
              currentStepRef.current = stepIdx + 1
              if (onStepAdvance) onStepAdvance(stepIdx + 1)
            }
          }
        }
      }, err => console.warn('GPS:', err), { enableHighAccuracy: true, maximumAge: 1000, timeout: 5000 })

    } else {
      if (watchIdRef.current) { navigator.geolocation.clearWatch(watchIdRef.current); watchIdRef.current = null }
    }
    return () => { if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current) }
  }, [navMode])

  useEffect(() => { currentStepRef.current = currentStep }, [currentStep])

  useEffect(() => {
    if (!mapInstanceRef.current) return
    const updateSensors = () => {
      const source = mapInstanceRef.current?.getSource('sensors')
      if (!source) { setTimeout(updateSensors, 500); return }
      source.setData({
        type: 'FeatureCollection',
        features: sensors.map(s => ({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [s.lng, s.lat] },
          properties: { id: s.id, street: s.street, is_free: s.is_free, color: s.is_free ? '#00FF66' : '#FF4D6D' }
        }))
      })
    }
    updateSensors()
  }, [sensors])

  useEffect(() => { window.__fyndzz_sensors = sensors }, [sensors])

  useEffect(() => { window.__fyndzz_map = mapInstanceRef.current })

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
      <style>{`
        .maplibregl-ctrl-attrib { font-size: 10px; opacity: 0.6; }
        .maplibregl-ctrl-attrib-button { display: none; }
        .maplibregl-popup-content { border-radius: 14px !important; padding: 14px !important; box-shadow: 0 8px 30px rgba(0,0,0,0.15) !important; }
        .maplibregl-popup-close-button { font-size: 18px !important; color: #999 !important; }
      `}</style>
    </div>
  )
}