import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const BADGES = [
  { threshold: 250, emoji: '🅿️', name: 'Rookie' },
  { threshold: 500, emoji: '⚡', name: 'Chargé' },
  { threshold: 750, emoji: '🔥', name: 'En feu' },
  { threshold: 1000, emoji: '🎯', name: 'Précis' },
  { threshold: 1250, emoji: '🚀', name: 'Lancé' },
  { threshold: 1500, emoji: '💎', name: 'Diamant' },
  { threshold: 1750, emoji: '🌟', name: 'Étoile' },
  { threshold: 2000, emoji: '👑', name: 'Roi du parking' },
  { threshold: 2500, emoji: '🏆', name: 'Champion' },
  { threshold: 5000, emoji: '🦁', name: 'Légende' },
]

export const REWARDS = [
  { id: 'discount_10', label: '-10% sur le prochain paiement', cost: 500, emoji: '🏷️' },
  { id: 'free_30min', label: '30 min offertes', cost: 1000, emoji: '🎁' },
  { id: 'free_1h', label: '1h offerte', cost: 2500, emoji: '🎁' },
  { id: 'free_2h', label: '2h offertes', cost: 5000, emoji: '🎁' },
  { id: 'free_3h', label: '3h offertes', cost: 7500, emoji: '🎁' },
]

export function getLevel(total) {
  if (total >= 5000) return { name: 'Fyndzzer Elite', color: '#FFB800' }
  if (total >= 2000) return { name: 'Fyndzzer Expert', color: '#A78BFA' }
  if (total >= 500) return { name: 'Fyndzzer Pro', color: '#3D2CD5' }
  return { name: 'Fyndzzer', color: '#00FF66' }
}

export function getNextLevel(total) {
  if (total >= 5000) return null
  if (total >= 2000) return { name: 'Fyndzzer Elite', threshold: 5000 }
  if (total >= 500) return { name: 'Fyndzzer Expert', threshold: 2000 }
  return { name: 'Fyndzzer Pro', threshold: 500 }
}

export function getUnlockedBadges(total) {
  return BADGES.filter(b => total >= b.threshold)
}

export function getNextBadge(total) {
  return BADGES.find(b => total < b.threshold) || null
}

export async function addSPTZ(userId, amount, reason) {
  // Récupérer le profil actuel
  const { data: profile } = await supabase
    .from('profiles')
    .select('sptz_total, sptz_balance, sptz_badges, sptz_streak, sptz_last_trip')
    .eq('id', userId)
    .single()

  if (!profile) return null

  const newTotal = (profile.sptz_total || 0) + amount
  const newBalance = (profile.sptz_balance || 0) + amount

  // Vérifier les nouveaux badges
  const currentBadges = profile.sptz_badges || []
  const newBadges = BADGES
    .filter(b => newTotal >= b.threshold && !currentBadges.find(cb => cb.name === b.name))
    .map(b => ({ ...b, unlockedAt: new Date().toISOString() }))

  const updatedBadges = [...currentBadges, ...newBadges]

  // Mettre à jour le streak
  const today = new Date().toISOString().split('T')[0]
  const lastTrip = profile.sptz_last_trip
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
  let newStreak = profile.sptz_streak || 0
  if (lastTrip === yesterday) newStreak += 1
  else if (lastTrip !== today) newStreak = 1

  // Bonus streak 7 jours
  let streakBonus = 0
  if (newStreak % 7 === 0) streakBonus = 50

  // Update profil
  await supabase.from('profiles').update({
    sptz_total: newTotal + streakBonus,
    sptz_balance: newBalance + streakBonus,
    sptz_badges: updatedBadges,
    sptz_streak: newStreak,
    sptz_last_trip: today,
  }).eq('id', userId)

  // Log transaction
  await supabase.from('sptz_transactions').insert({
    user_id: userId,
    amount,
    reason,
  })

  if (streakBonus > 0) {
    await supabase.from('sptz_transactions').insert({
      user_id: userId,
      amount: streakBonus,
      reason: `🔥 Bonus streak ${newStreak} jours !`,
    })
  }

  return { newTotal: newTotal + streakBonus, newBadges, streakBonus }
}

export async function spendSPTZ(userId, rewardId) {
  const reward = REWARDS.find(r => r.id === rewardId)
  if (!reward) return { error: 'Récompense introuvable' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('sptz_balance')
    .eq('id', userId)
    .single()

  if (!profile || profile.sptz_balance < reward.cost) {
    return { error: 'Solde insuffisant' }
  }

  await supabase.from('profiles').update({
    sptz_balance: profile.sptz_balance - reward.cost
  }).eq('id', userId)

  await supabase.from('sptz_rewards').insert({
    user_id: userId,
    reward_type: rewardId,
    cost: reward.cost,
    status: 'pending'
  })

  await supabase.from('sptz_transactions').insert({
    user_id: userId,
    amount: -reward.cost,
    reason: `🎁 Récompense : ${reward.label}`,
  })

  return { success: true, reward }
}