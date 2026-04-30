'use client'

import { useEffect, useRef, useState } from 'react'
import 'leaflet/dist/leaflet.css'
import { getRoute, getNearestFree } from '@/lib/osrm'

export default function Map({ sensors = [], onRouteFound, onNavigationStart }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef({})
  const routeLayerRef = useRef(null)
  const destinationMarkerRef = useRef(null)
  const [userPos, setUserPos] = useState(null)

  useEffect(() => {
    if (mapInstanceRef.current) return
    const L = require('leaflet')

    mapInstanceRef.current = L.map(mapRef.current).setView([48.860, 2.275], 14)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(mapInstanceRef.current)

    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude, longitude } = pos.coords
      setUserPos({ lat: latitude, lng: longitude })
      window.__fyndzz_userpos = { lat: latitude, lng: longitude }
      L.circleMarker([latitude, longitude], {
        radius: 10, fillColor: '#3D2CD5', color: '#fff',
        fillOpacity: 1, weight: 2
      }).bindTooltip('Vous êtes ici').addTo(mapInstanceRef.current)
    })

    const handleDestination = async (destination) => {
      if (destinationMarkerRef.current) destinationMarkerRef.current.remove()
      destinationMarkerRef.current = require('leaflet').circleMarker(
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

      const mins = Math.round(route.duration / 60)
      const dist = Math.round(route.distance)

      // Remonter les infos au parent
      if (onRouteFound) onRouteFound({
        street: nearest.street,
        mins,
        dist,
        steps: route.legs?.[0]?.steps || [],
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
      mapInstanceRef.current.setView([dest.lat, dest.lng], 15)
      await handleDestination(dest)
    }

  }, [])

  useEffect(() => { window.__fyndzz_sensors = sensors }, [sensors])

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

  return <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
}