'use client'

import { useEffect, useRef, useState } from 'react'
import 'leaflet/dist/leaflet.css'
import { getRoute, getNearestFree } from '@/lib/osrm'

export default function Map({ sensors = [] }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef({})
  const routeLayerRef = useRef(null)
  const destinationMarkerRef = useRef(null)
  const [status, setStatus] = useState('Clique sur la carte ou recherche une destination')
  const [userPos, setUserPos] = useState(null)

  useEffect(() => {
    if (mapInstanceRef.current) return
    const L = require('leaflet')

    mapInstanceRef.current = L.map(mapRef.current).setView([48.860, 2.275], 14)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(mapInstanceRef.current)

    // Géolocalisation
    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude, longitude } = pos.coords
      setUserPos({ lat: latitude, lng: longitude })
      L.circleMarker([latitude, longitude], {
        radius: 10, fillColor: '#3D2CD5', color: '#fff',
        fillOpacity: 1, weight: 2
      }).bindTooltip('Vous êtes ici').addTo(mapInstanceRef.current)
    })

    // Handler commun destination (clic ou recherche)
    const handleDestination = async (destination) => {
      if (destinationMarkerRef.current) destinationMarkerRef.current.remove()
      destinationMarkerRef.current = L.circleMarker(
        [destination.lat, destination.lng],
        { radius: 10, fillColor: '#FFD700', color: '#fff', fillOpacity: 1, weight: 2 }
      ).bindTooltip('Destination').addTo(mapInstanceRef.current)

      setStatus('Recherche de la place la plus proche...')

      const currentSensors = window.__fyndzz_sensors || []
      const nearest = await getNearestFree(currentSensors, destination)

      if (!nearest) {
        setStatus('Aucune place libre trouvée !')
        return
      }

      setStatus(`Place trouvée : ${nearest.street} — Calcul de l'itinéraire...`)

      const from = window.__fyndzz_userpos || { lat: 48.860, lng: 2.275 }
      const route = await getRoute(from, nearest)

      if (routeLayerRef.current) routeLayerRef.current.remove()
      routeLayerRef.current = L.geoJSON(route.geometry, {
        style: { color: '#3d2cd5', weight: 4, opacity: 0.8 }
      }).addTo(mapInstanceRef.current)

      const mins = Math.round(route.duration / 60)
      setStatus(`🅿️ ${nearest.street} — ${mins} min`)
    }

    // Clic sur la carte
    mapInstanceRef.current.on('click', async (e) => {
      await handleDestination({ lat: e.latlng.lat, lng: e.latlng.lng })
    })

    // Trigger depuis la barre de recherche
    window.__fyndzz_search_trigger = async () => {
      const dest = window.__fyndzz_destination
      if (!dest || !mapInstanceRef.current) return
      mapInstanceRef.current.setView([dest.lat, dest.lng], 15)
      await handleDestination(dest)
    }

  }, [])

  useEffect(() => {
    window.__fyndzz_sensors = sensors
  }, [sensors])

  useEffect(() => {
    window.__fyndzz_userpos = userPos
  }, [userPos])

  // Markers capteurs
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

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
      <div style={{
        position: 'absolute', bottom: '2rem', left: '50%',
        transform: 'translateX(-50%)', zIndex: 1000,
        background: '#160C6B', color: '#fff',
        padding: '0.8rem 1.5rem', borderRadius: '12px',
        fontSize: '14px', fontWeight: '500',
        border: '1px solid rgba(255,255,255,0.2)',
        maxWidth: '90vw', textAlign: 'center',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
      }}>
        {status}
      </div>
    </div>
  )
}