'use client'

import { useEffect, useRef } from 'react'
import 'leaflet/dist/leaflet.css'
import { getRoute, getNearestFree } from '@/lib/osrm'

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

  useEffect(() => {
    if (mapInstanceRef.current) return
    const L = require('leaflet')

    mapInstanceRef.current = L.map(mapRef.current, {
      zoomControl: true,
      attributionControl: true
    }).setView([48.860, 2.275], 14)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(mapInstanceRef.current)

    // Géolocalisation initiale
    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude: lat, longitude: lng } = pos.coords
      window.__fyndzz_userpos = { lat, lng }

      userMarkerRef.current = L.circleMarker([lat, lng], {
        radius: 10, fillColor: '#3D2CD5', color: '#fff',
        fillOpacity: 1, weight: 3
      }).bindTooltip('Vous').addTo(mapInstanceRef.current)

      mapInstanceRef.current.setView([lat, lng], 15)
    }, null, { enableHighAccuracy: true })

    // Exposer move_to pour SimulateGPS
    window.__fyndzz_move_to = (lat, lng) => {
      window.__fyndzz_userpos = { lat, lng }
      if (userMarkerRef.current) {
        userMarkerRef.current.setLatLng([lat, lng])
      } else {
        userMarkerRef.current = L.circleMarker([lat, lng], {
          radius: 10, fillColor: '#3D2CD5', color: '#fff',
          fillOpacity: 1, weight: 3
        }).addTo(mapInstanceRef.current)
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setView([lat, lng], 17, { animate: true, duration: 0.8 })
      }
    }

    // Handler destination
    const handleDestination = async (destination) => {
      const L = require('leaflet')

      if (destinationMarkerRef.current) destinationMarkerRef.current.remove()
      destinationMarkerRef.current = L.circleMarker(
        [destination.lat, destination.lng],
        { radius: 10, fillColor: '#FFD700', color: '#fff', fillOpacity: 1, weight: 2 }
      ).bindTooltip('Destination').addTo(mapInstanceRef.current)

      const currentSensors = window.__fyndzz_sensors || []
      const nearest = await getNearestFree(currentSensors, destination)
      if (!nearest) return

      const from = window.__fyndzz_userpos || { lat: 48.860, lng: 2.275 }
      const route = await getRoute(from, nearest)
      if (!route) return

      if (routeLayerRef.current) routeLayerRef.current.remove()
      routeLayerRef.current = L.geoJSON(route.geometry, {
        style: { color: '#A78BFA', weight: 5, opacity: 1 }
      }).addTo(mapInstanceRef.current)

      mapInstanceRef.current.fitBounds(routeLayerRef.current.getBounds(), { padding: [60, 60] })

      const steps = route.legs?.[0]?.steps || []
      stepsRef.current = steps

      if (onRouteFound) onRouteFound({
        street: nearest.street,
        mins: Math.round(route.duration / 60),
        dist: Math.round(route.distance),
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

        if (userMarkerRef.current) {
          userMarkerRef.current.setLatLng([lat, lng])
        } else {
          userMarkerRef.current = L.circleMarker([lat, lng], {
            radius: 10, fillColor: '#3D2CD5', color: '#fff',
            fillOpacity: 1, weight: 3
          }).addTo(mapInstanceRef.current)
        }

        mapInstanceRef.current.setView([lat, lng], 17, { animate: true, duration: 0.5 })

        const steps = stepsRef.current
        const stepIdx = currentStepRef.current
        if (steps[stepIdx]) {
          const stepCoord = steps[stepIdx].maneuver?.location
          if (stepCoord) {
            const stepLat = stepCoord[1]
            const stepLng = stepCoord[0]
            const dist = getDistanceMeters(lat, lng, stepLat, stepLng)
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

  useEffect(() => {
    if (!mapInstanceRef.current || sensors.length === 0) return
    const L = require('leaflet')
    sensors.forEach(sensor => {
      const color = sensor.is_free ? '#00FF66' : '#FF4D6D'
      if (markersRef.current[sensor.id]) markersRef.current[sensor.id].remove()
      markersRef.current[sensor.id] = L.circleMarker(
        [sensor.lat, sensor.lng],
        { radius: 8, fillColor: color, color: color, fillOpacity: 0.9, weight: 2 }
      )
        .bindTooltip(`${sensor.street} — ${sensor.is_free ? 'Libre' : 'Occupée'}`)
        .addTo(mapInstanceRef.current)
    })
  }, [sensors])

  useEffect(() => { window.__fyndzz_sensors = sensors }, [sensors])

  return <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
}

function getDistanceMeters(lat1, lng1, lat2, lng2) {
  const R = 6371000
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat/2) ** 2 + Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) * Math.sin(dLng/2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
}