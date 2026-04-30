'use client'

import { useEffect, useRef } from 'react'
import 'leaflet/dist/leaflet.css'
import { getRoute, getNearestFree } from '@/lib/osrm'

// Calcul bearing entre deux points GPS
function getBearing(lat1, lng1, lat2, lng2) {
  const dLng = (lng2 - lng1) * Math.PI / 180
  const lat1R = lat1 * Math.PI / 180
  const lat2R = lat2 * Math.PI / 180
  const y = Math.sin(dLng) * Math.cos(lat2R)
  const x = Math.cos(lat1R) * Math.sin(lat2R) - Math.sin(lat1R) * Math.cos(lat2R) * Math.cos(dLng)
  return ((Math.atan2(y, x) * 180 / Math.PI) + 360) % 360
}

function getDistanceMeters(lat1, lng1, lat2, lng2) {
  const R = 6371000
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat/2) ** 2 + Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) * Math.sin(dLng/2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
}

// SVG flèche style Waze
function createArrowIcon(L, bearing = 0) {
  return L.divIcon({
    className: '',
    iconSize: [48, 48],
    iconAnchor: [24, 24],
    html: `
      <div style="
        width: 48px; height: 48px;
        transform: rotate(${bearing}deg);
        transition: transform 0.4s ease;
        filter: drop-shadow(0 4px 8px rgba(0,0,0,0.4));
      ">
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="24" r="22" fill="#3D2CD5" stroke="white" stroke-width="3"/>
          <path d="M24 10 L32 34 L24 28 L16 34 Z" fill="#00FF66"/>
        </svg>
      </div>
    `
  })
}

export default function Map({ sensors = [], onRouteFound, navMode, currentStep, onStepAdvance }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef({})
  const routeLayerRef = useRef(null)
  const destinationMarkerRef = useRef(null)
  const userMarkerRef = useRef(null)
  const watchIdRef = useRef(null)
  const stepsRef = useRef([])
  const currentStepRef = useRef(0)
  const lastPosRef = useRef(null)
  const streetLabelRef = useRef(null)

  useEffect(() => {
    if (mapInstanceRef.current) return
    const L = require('leaflet')

    mapInstanceRef.current = L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: true
    }).setView([48.860, 2.275], 14)

    // CartoDB Voyager
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap © CARTO',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(mapInstanceRef.current)

    // Géolocalisation initiale
    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude: lat, longitude: lng } = pos.coords
      window.__fyndzz_userpos = { lat, lng }
      lastPosRef.current = { lat, lng }

      userMarkerRef.current = L.marker([lat, lng], {
        icon: createArrowIcon(L, 0),
        zIndexOffset: 1000
      }).addTo(mapInstanceRef.current)

      mapInstanceRef.current.setView([lat, lng], 15)
    }, null, { enableHighAccuracy: true })

    // Exposer move_to pour SimulateGPS
    window.__fyndzz_move_to = (lat, lng) => {
      const L = require('leaflet')
      window.__fyndzz_userpos = { lat, lng }

      let bearing = 0
      if (lastPosRef.current) {
        bearing = getBearing(lastPosRef.current.lat, lastPosRef.current.lng, lat, lng)
      }
      lastPosRef.current = { lat, lng }

      if (userMarkerRef.current) {
        userMarkerRef.current.setLatLng([lat, lng])
        userMarkerRef.current.setIcon(createArrowIcon(L, bearing))
      } else {
        userMarkerRef.current = L.marker([lat, lng], {
          icon: createArrowIcon(L, bearing),
          zIndexOffset: 1000
        }).addTo(mapInstanceRef.current)
      }

      if (mapInstanceRef.current) {
        mapInstanceRef.current.setView([lat, lng], 17, { animate: true, duration: 0.6 })
      }
    }

    // Handler destination
    const handleDestination = async (destination) => {
      const L = require('leaflet')

      if (destinationMarkerRef.current) destinationMarkerRef.current.remove()

      // Marker destination style Waze — P vert
      const destIcon = L.divIcon({
        className: '',
        iconSize: [40, 50],
        iconAnchor: [20, 50],
        html: `
          <div style="filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));">
            <svg viewBox="0 0 40 50" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 0C9 0 0 9 0 20C0 33 20 50 20 50C20 50 40 33 40 20C40 9 31 0 20 0Z" fill="#00FF66"/>
              <circle cx="20" cy="20" r="10" fill="white"/>
              <text x="20" y="25" text-anchor="middle" font-size="12" font-weight="bold" fill="#160C6B">P</text>
            </svg>
          </div>
        `
      })

      destinationMarkerRef.current = L.marker(
        [destination.lat, destination.lng],
        { icon: destIcon }
      ).addTo(mapInstanceRef.current)

      const currentSensors = window.__fyndzz_sensors || []
      const nearest = await getNearestFree(currentSensors, destination)
      if (!nearest) return

      const from = window.__fyndzz_userpos || { lat: 48.860, lng: 2.275 }
      const route = await getRoute(from, nearest)
      if (!route) return

      // Route style Waze — trait épais avec contour
      if (routeLayerRef.current) routeLayerRef.current.remove()

      // Contour blanc
      L.geoJSON(route.geometry, {
        style: { color: '#fff', weight: 9, opacity: 0.6 }
      }).addTo(mapInstanceRef.current)

      // Route principale
      routeLayerRef.current = L.geoJSON(route.geometry, {
        style: { color: '#3D2CD5', weight: 6, opacity: 1 }
      }).addTo(mapInstanceRef.current)

      mapInstanceRef.current.fitBounds(routeLayerRef.current.getBounds(), { padding: [60, 60] })

      const steps = route.legs?.[0]?.steps || []
      stepsRef.current = steps

      const walkDist = Math.round(getDistanceMeters(
        nearest.lat, nearest.lng,
        destination.lat, destination.lng
      ))
      console.log('walkDist calculé:', walkDist)
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

    mapInstanceRef.current.on('click', async (e) => {
      await handleDestination({ lat: e.latlng.lat, lng: e.latlng.lng })
    })

    window.__fyndzz_search_trigger = async () => {
      const dest = window.__fyndzz_destination
      if (!dest || !mapInstanceRef.current) return
      await handleDestination(dest)
    }

  }, [])

  // Mode navigation — suivi GPS temps réel
  useEffect(() => {
    if (!mapInstanceRef.current) return
    const L = require('leaflet')

    if (navMode) {
      currentStepRef.current = currentStep

      watchIdRef.current = navigator.geolocation.watchPosition(pos => {
        const { latitude: lat, longitude: lng } = pos.coords
        window.__fyndzz_userpos = { lat, lng }

        // Calcul bearing pour orienter la flèche
        let bearing = 0
        if (lastPosRef.current) {
          bearing = getBearing(lastPosRef.current.lat, lastPosRef.current.lng, lat, lng)
        }
        lastPosRef.current = { lat, lng }

        if (userMarkerRef.current) {
          userMarkerRef.current.setLatLng([lat, lng])
          userMarkerRef.current.setIcon(createArrowIcon(L, bearing))
        } else {
          userMarkerRef.current = L.marker([lat, lng], {
            icon: createArrowIcon(L, bearing),
            zIndexOffset: 1000
          }).addTo(mapInstanceRef.current)
        }

        // Recentrage fluide
        mapInstanceRef.current.setView([lat, lng], 17, { animate: true, duration: 0.5 })

        // Avancement automatique des étapes
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
      }, (err) => console.warn('GPS error:', err), {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 5000
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

  useEffect(() => {
    currentStepRef.current = currentStep
  }, [currentStep])

  // Markers capteurs
  useEffect(() => {
    if (!mapInstanceRef.current || sensors.length === 0) return
    const L = require('leaflet')

    sensors.forEach(sensor => {
      const color = sensor.is_free ? '#00FF66' : '#FF4D6D'
      if (markersRef.current[sensor.id]) markersRef.current[sensor.id].remove()

      const sensorIcon = L.divIcon({
        className: '',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        html: `
          <div style="
            width: 20px; height: 20px; border-radius: 50%;
            background: ${color};
            border: 2.5px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3), 0 0 ${sensor.is_free ? '8px ' + color : 'none'};
          "></div>
        `
      })

      markersRef.current[sensor.id] = L.marker(
        [sensor.lat, sensor.lng],
        { icon: sensorIcon }
      )
        .bindTooltip(`${sensor.street} — ${sensor.is_free ? '🟢 Libre' : '🔴 Occupée'}`, {
          direction: 'top',
          offset: [0, -10]
        })
        .addTo(mapInstanceRef.current)
    })
  }, [sensors])

  useEffect(() => { window.__fyndzz_sensors = sensors }, [sensors])

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
      <style>{`
        .leaflet-attribution-flag { display: none; }
        .leaflet-control-attribution { font-size: 10px; opacity: 0.6; }
      `}</style>
    </div>
  )
}