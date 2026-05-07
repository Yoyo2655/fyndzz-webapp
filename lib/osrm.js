export async function getRoute(from, to) {
  const settings = window.__fyndzz_settings || {}
  const excludes = []
  if (settings.avoid_tolls) excludes.push('toll')
  if (settings.avoid_highways) excludes.push('motorway')
  const excludeParam = excludes.length > 0 ? `&exclude=${excludes.join(',')}` : ''
  const url = `https://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson&steps=true${excludeParam}`
  try {
    const res = await fetch(url)
    if (!res.ok) {
      console.warn('OSRM HTTP error:', res.status)
      return null
    }
    const data = await res.json()
    if (!data.routes || data.routes.length === 0) return null
    return data.routes[0]
  } catch (err) {
    console.warn('OSRM getRoute error:', err)
    return null
  }
}

export async function getNearestFree(sensors, destination) {
  const free = sensors.filter(s => s.is_free)
  if (free.length === 0) return null

  const candidates = free
    .map(s => ({
      ...s,
      dist: Math.hypot(s.lat - destination.lat, s.lng - destination.lng)
    }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, 5)

  const coords = candidates.map(s => `${s.lng},${s.lat}`).join(';')
  const destCoord = `${destination.lng},${destination.lat}`
  const url = `https://router.project-osrm.org/table/v1/driving/${destCoord};${coords}?sources=0`

  try {
    const res = await fetch(url)
    const data = await res.json()
    if (!data.durations?.[0]) return candidates[0]
    const durations = data.durations[0].slice(1)
    const bestIdx = durations.indexOf(Math.min(...durations))
    return candidates[bestIdx]
  } catch (err) {
    console.warn('OSRM getNearestFree error:', err)
    return candidates[0]
  }
}