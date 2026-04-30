export async function getRoute(from, to) {
  const url = `https://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`
  const res = await fetch(url)
  const data = await res.json()
  return data.routes[0]
}

export async function getNearestFree(sensors, destination) {
  const free = sensors.filter(s => s.is_free)
  if (free.length === 0) return null

  // Calcul distance vol d'oiseau pour pré-filtrer
  const candidates = free
    .map(s => ({
      ...s,
      dist: Math.hypot(s.lat - destination.lat, s.lng - destination.lng)
    }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, 5)

  // OSRM pour distance réelle sur les 5 plus proches
  const coords = candidates.map(s => `${s.lng},${s.lat}`).join(';')
  const destCoord = `${destination.lng},${destination.lat}`
  const url = `https://router.project-osrm.org/table/v1/driving/${destCoord};${coords}?sources=0`
  
  const res = await fetch(url)
  const data = await res.json()
  
  const durations = data.durations[0].slice(1)
  const bestIdx = durations.indexOf(Math.min(...durations))
  return candidates[bestIdx]
}