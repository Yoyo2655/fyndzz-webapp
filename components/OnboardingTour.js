'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const STEP_TARGETS = [
  { selector: 'input[placeholder="Où va-t-on ?"]', title: 'Cherchez votre destination', desc: 'Tapez n\'importe quelle adresse — Fyndzz trouve la place libre la plus proche.', tooltipPos: 'below' },
  { selector: 'button[aria-label="menu"]', title: 'Capteurs en direct', desc: 'Ouvrez le menu pour voir l\'occupation par rue en temps réel.', tooltipPos: 'below' },
  { selector: '[data-tour="sptz"]', title: 'Gagnez des SPTZ', desc: 'Chaque trajet = 10 Spotzz Points. Échangez-les contre du stationnement gratuit.', tooltipPos: 'above' },
  { selector: '[data-tour="go"]', title: 'C\'est parti !', desc: 'Une route calculée ? Lancez la navigation et garez-vous sans stress.', tooltipPos: 'above' },
]

export default function OnboardingTour({ onDone }) {
  const [step, setStep] = useState(0)
  const [visible, setVisible] = useState(false)
  const [sliding, setSliding] = useState(false)
  const [direction, setDirection] = useState(1) // 1 = forward, -1 = back
  const [positions, setPositions] = useState([])
  const [spotlight, setSpotlight] = useState({ top: 0, left: 0, width: 0, height: 0 })

  const updateSpotlightForStep = (stepIndex) => {
    const target = STEP_TARGETS[stepIndex]
    if (!target) return
    const el = document.querySelector(target.selector)
    if (!el) return
    const rect = el.getBoundingClientRect()
    const padding = 6
    setSpotlight({
      top: rect.top - padding,
      left: rect.left - padding,
      width: rect.width + padding * 2,
      height: rect.height + padding * 2,
    })
    const tooltip = target.tooltipPos === 'below'
      ? { top: rect.bottom + 8, left: 12, right: 12 }
      : { bottom: window.innerHeight - rect.top + 8, left: 12, right: 12 }
    setPositions(prev => {
      const updated = [...prev]
      updated[stepIndex] = { tooltip }
      return updated
    })
  }

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_done')
        .eq('id', user.id)
        .single()
      if (!profile?.onboarding_done) {
        // Calculer les positions des tooltips
        const calculatedPositions = STEP_TARGETS.map(target => {
          const element = document.querySelector(target.selector)
          if (!element) {
            // Fallback au centre de l'écran si l'élément n'est pas trouvé
            return { tooltip: { top: 120, left: 12, right: 12 } }
          }
          const rect = element.getBoundingClientRect()
          const tooltip = target.tooltipPos === 'below'
            ? { top: rect.bottom + 8, left: 12, right: 12 }
            : { bottom: window.innerHeight - rect.top + 8, left: 12, right: 12 }
          return { tooltip }
        })
        // Plus de .filter(Boolean) !
        setPositions(calculatedPositions)
        // Initialiser le spotlight pour le premier step
        setTimeout(() => {
          updateSpotlightForStep(0)
          setVisible(true)
        }, 800)
      }
    }
    check()
  }, [])

  const handleResize = () => updateSpotlightForStep(step)

  useEffect(() => {
    if (visible) {
      updateSpotlightForStep(step)
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [step, visible])

  const goTo = (nextStep) => {
    if (sliding) return
    setDirection(nextStep > step ? 1 : -1)
    setSliding(true)
    setTimeout(() => {
      setStep(nextStep)
      setSliding(false)
      setTimeout(() => updateSpotlightForStep(nextStep), 50)
    }, 280)
  }

  const finish = async () => {
    setStep(0) // ← reset step AVANT de cacher
    setVisible(false)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('profiles').update({ onboarding_done: true }).eq('id', user.id)
    }
    onDone?.()
  }

  const skip = () => finish()

  const next = () => {
    if (step < STEP_TARGETS.length - 1) goTo(step + 1)
    else finish()
  }

  if (!visible) return null

  const current = STEP_TARGETS[step]
  const currentPos = positions[step]
  if (!currentPos || !currentPos.tooltip) return null

  const isLast = step === STEP_TARGETS.length - 1

  // Construire le style du spotlight
  const spotStyle = {
    position: 'fixed',
    boxShadow: '0 0 0 9999px rgba(0,0,0,0.65)',
    zIndex: 9998,
    borderRadius: '12px',
    transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
    pointerEvents: 'none',
    top: spotlight.top + 'px',
    left: spotlight.left + 'px',
    width: spotlight.width + 'px',
    height: spotlight.height + 'px',
  }

  // Style tooltip
  const tooltipStyle = {
    position: 'absolute',
    zIndex: 9999,
    background: '#160C6B',
    border: '1px solid rgba(0,255,102,0.3)',
    borderRadius: '14px',
    padding: '14px 16px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
    transition: 'opacity 0.28s ease, transform 0.28s ease',
    opacity: sliding ? 0 : 1,
    transform: sliding
      ? `translateX(${direction * 24}px)`
      : 'translateX(0)',
    ...Object.fromEntries(
      Object.entries(currentPos.tooltip)
        .map(([k, v]) => [k, typeof v === 'number' ? `${v}px` : v])
    ),
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9997,
      pointerEvents: 'none',
    }}>
      {/* Spotlight */}
      <div style={spotStyle} />

      {/* Tooltip — pointer-events activés */}
      <div style={{ ...tooltipStyle, pointerEvents: 'auto' }}>

        {/* Dots */}
        <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
          {STEP_TARGETS.map((_, i) => (
            <div key={i} style={{
              height: '3px',
              flex: 1,
              borderRadius: '2px',
              background: i === step ? '#00FF66' : 'rgba(255,255,255,0.2)',
              transition: 'background 0.3s',
            }} />
          ))}
        </div>

        {/* Contenu */}
        <div style={{
          fontSize: '13px',
          fontWeight: '600',
          color: '#fff',
          marginBottom: '5px',
          transition: 'opacity 0.28s',
          opacity: sliding ? 0 : 1,
        }}>
          {current.title}
        </div>
        <div style={{
          fontSize: '11px',
          color: 'rgba(255,255,255,0.5)',
          lineHeight: '1.55',
          marginBottom: '12px',
          transition: 'opacity 0.28s',
          opacity: sliding ? 0 : 1,
        }}>
          {current.desc}
        </div>

        {/* Boutons */}
        <button
          onClick={next}
          style={{
            width: '100%',
            padding: '9px',
            background: '#00FF66',
            border: 'none',
            borderRadius: '9px',
            fontSize: '12px',
            fontWeight: '600',
            color: '#0A0040',
            cursor: 'pointer',
            marginBottom: '6px',
          }}
        >
          {isLast ? 'Commencer →' : 'Suivant →'}
        </button>

        {!isLast && (
          <button
            onClick={skip}
            style={{
              width: '100%',
              background: 'none',
              border: 'none',
              fontSize: '10px',
              color: 'rgba(255,255,255,0.3)',
              cursor: 'pointer',
              padding: '2px',
            }}
          >
            Passer
          </button>
        )}
      </div>

      {/* Backdrop clickable pour skip */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9996,
          cursor: 'pointer',
        }}
        onClick={skip}
      />
    </div>
  )
}