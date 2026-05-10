'use client'

import { useEffect } from 'react'
import { initPostHog, posthog } from '@/lib/posthog'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function PostHogProvider({ children }) {
  const pathname = usePathname()

  useEffect(() => {
    initPostHog()
    posthog.capture('app_opened')
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        posthog.identify(data.user.id, { email: data.user.email })
      }
    })
  }, [])

  useEffect(() => {
    posthog.capture('$pageview', { path: pathname })
  }, [pathname])

  return children
}