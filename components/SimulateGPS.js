'use client'

import { useEffect } from 'react'

export default function SimulateGPS({ onStepAdvance, routeInfo }) {

  useEffect(() => {
    window.__fyndzz_simulate = () => {
      console.log('routeInfo reçu:', routeInfo)
      console.log('steps:', routeInfo?.steps)
      const steps = routeInfo?.steps
      if (!steps?.length) {
        console.warn('Fyndzz: aucun trajet en cours à simuler')
        return
      }
      console.log(`Fyndzz: simulation de ${steps.length} étapes...`)
      let i = 0
      const interval = setInterval(() => {
        if (i >= steps.length) {
          clearInterval(interval)
          console.log('Fyndzz: simulation terminée ✅')
          window.__fyndzz_clear_route?.()
          return
        }
        const coord = steps[i].maneuver?.location
        if (coord) {
          const lat = coord[1]
          const lng = coord[0]
          // Déplacer le marker ET recentrer la carte
          window.__fyndzz_move_to?.(lat, lng)
          console.log(`Fyndzz: étape ${i + 1}/${steps.length} — ${steps[i].name || 'sans nom'}`)
          if (onStepAdvance) onStepAdvance(i)
        }
        i++
      }, 2000)

      window.__fyndzz_simulate_stop = () => {
        clearInterval(interval)
        console.log('Fyndzz: simulation arrêtée')
      }
    }

    return () => {
      delete window.__fyndzz_simulate
      delete window.__fyndzz_simulate_stop
    }
  }, [routeInfo, onStepAdvance])

  return null
}