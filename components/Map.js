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

  useEffect(() => {
    if (mapInstanceRef.current) return

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

      const coords = route.geometry.coordinates
      const bounds = coords.reduce((b, c) => b.extend(c), new maplibregl.LngLatBounds(coords[0], coords[0]))
      mapInstanceRef.current.fitBounds(bounds, { padding: 80, duration: 800 })

      const steps = route.legs?.[0]?.steps || []
      stepsRef.current = steps

      const walkDist = Math.round(getDistanceMeters(
        nearest.lat, nearest.lng,
        destination.lat, destination.lng
      ))

      if (onRouteFound) onRouteFound({
        street: nearest.street,
        mins: Math.round(route.duration / 60),
        dist: Math.round(route.distance),
        walkDist,
        steps,
        destination,
        nearest
      })
    }

    const initMap = async () => {
      const maplibregl = (await import('maplibre-gl')).default

      mapInstanceRef.current = new maplibregl.Map({
        container: mapRef.current,
        style: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
        center: [2.275, 48.860],
        zoom: 14,
        pitch: 0,
        bearing: 0,
        attributionControl: false
      })

      mapInstanceRef.current.addControl(
        new maplibregl.AttributionControl({ compact: true }),
        'bottom-right'
      )

      mapInstanceRef.current.on('load', () => {
        if (!mapInstanceRef.current.getSource('route')) {
          mapInstanceRef.current.addSource('route', {
            type: 'geojson',
            data: { type: 'Feature', geometry: { type: 'LineString', coordinates: [] } }
          })
          mapInstanceRef.current.addLayer({
            id: 'route-outline',
            type: 'line',
            source: 'route',
            layout: { 'line-join': 'round', 'line-cap': 'round' },
            paint: { 'line-color': '#ffffff', 'line-width': 10, 'line-opacity': 0.6 }
          })
          mapInstanceRef.current.addLayer({
            id: 'route-line',
            type: 'line',
            source: 'route',
            layout: { 'line-join': 'round', 'line-cap': 'round' },
            paint: { 'line-color': '#3D2CD5', 'line-width': 7 }
          })
        }

        if (!mapInstanceRef.current.getSource('sensors')) {
          mapInstanceRef.current.addSource('sensors', {
            type: 'geojson',
            data: { type: 'FeatureCollection', features: [] }
          })
          mapInstanceRef.current.addLayer({
            id: 'sensors-circle',
            type: 'circle',
            source: 'sensors',
            paint: {
              'circle-radius': 8,
              'circle-color': ['get', 'color'],
              'circle-stroke-width': 2.5,
              'circle-stroke-color': '#ffffff',
              'circle-opacity': 0.9
            }
          })
        }

        // Géolocalisation initiale
        navigator.geolocation.getCurrentPosition(pos => {
          const { latitude: lat, longitude: lng } = pos.coords
          window.__fyndzz_userpos = { lat, lng }
          lastPosRef.current = { lat, lng }

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
      })

      // move_to pour SimulateGPS
      window.__fyndzz_move_to = (lat, lng) => {
        window.__fyndzz_userpos = { lat, lng }

        let bearing = 0
        if (lastPosRef.current) {
          bearing = getBearing(lastPosRef.current.lat, lastPosRef.current.lng, lat, lng)
        }
        lastPosRef.current = { lat, lng }

        // Toujours mettre à jour le marker existant, jamais en créer un nouveau
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
        if (source) {
          source.setData({
            type: 'Feature',
            geometry: { type: 'LineString', coordinates: [] }
          })
        }
        if (destMarkerRef.current) {
          destMarkerRef.current.remove()
          destMarkerRef.current = null
        }
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

  // Sync navModeRef pour window.__fyndzz_move_to
  useEffect(() => {
    navModeRef.current = navMode
  }, [navMode])

  // Vue inclinée — réagit immédiatement
  useEffect(() => {
    if (!mapInstanceRef.current) return
    if (navMode) {
      mapInstanceRef.current.easeTo({
        pitch: 55,
        zoom: 17,
        duration: 600
      })
    } else {
      mapInstanceRef.current.easeTo({
        pitch: 0,
        bearing: 0,
        duration: 600
      })
    }
  }, [navMode])

  // GPS watchPosition
  useEffect(() => {
    if (!mapInstanceRef.current) return

    if (navMode) {
      currentStepRef.current = currentStep

      let userInteracting = false
      mapInstanceRef.current.on('dragstart', () => { userInteracting = true })
      mapInstanceRef.current.on('zoomstart', () => { userInteracting = true })
      mapInstanceRef.current.on('touchstart', () => { userInteracting = true })

      // Reprendre le suivi après 5 secondes sans interaction
      let interactionTimeout
      mapInstanceRef.current.on('dragend', () => {
        clearTimeout(interactionTimeout)
        interactionTimeout = setTimeout(() => { userInteracting = false }, 5000)
      })
      mapInstanceRef.current.on('zoomend', () => {
        clearTimeout(interactionTimeout)
        interactionTimeout = setTimeout(() => { userInteracting = false }, 5000)
      })

      watchIdRef.current = navigator.geolocation.watchPosition(pos => {
        const { latitude: lat, longitude: lng } = pos.coords
        window.__fyndzz_userpos = { lat, lng }

        let bearing = 0
        if (lastPosRef.current) {
          bearing = getBearing(lastPosRef.current.lat, lastPosRef.current.lng, lat, lng)
        }
        lastPosRef.current = { lat, lng }

        if (userMarkerRef.current) {
          userMarkerRef.current.setLngLat([lng, lat])
          const inner = userMarkerRef.current.getElement().querySelector('div')
          if (inner) inner.style.transform = `rotate(${bearing}deg)`
        }

        // Ne recentrer que si l'utilisateur n'interagit pas
        if (!userInteracting) {
          mapInstanceRef.current.easeTo({
            center: [lng, lat],
            bearing,
            pitch: 55,
            zoom: 17,
            duration: 500
          })
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
      }, err => console.warn('GPS:', err), {
        enableHighAccuracy: true, maximumAge: 1000, timeout: 5000
      })

    } else {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current)
        watchIdRef.current = null
      }
    }

    return () => {
      if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current)
    }
  }, [navMode])

  useEffect(() => { currentStepRef.current = currentStep }, [currentStep])

  // Mise à jour capteurs
  useEffect(() => {
    if (!mapInstanceRef.current) return
    const source = mapInstanceRef.current.getSource('sensors')
    if (!source) return
    source.setData({
      type: 'FeatureCollection',
      features: sensors.map(s => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [s.lng, s.lat] },
        properties: {
          id: s.id,
          street: s.street,
          is_free: s.is_free,
          color: s.is_free ? '#00FF66' : '#FF4D6D'
        }
      }))
    })
  }, [sensors])

  useEffect(() => { window.__fyndzz_sensors = sensors }, [sensors])

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
      <style>{`
        .maplibregl-ctrl-attrib { font-size: 10px; opacity: 0.6; }
        .maplibregl-ctrl-attrib-button { display: none; }
      `}</style>
    </div>
  )
}