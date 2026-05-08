import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.fyndzz.app',
  appName: 'Fyndzz',
  webDir: 'out',
  server: {
    url: 'https://fyndzz.vercel.app',
    cleartext: true
  }
}

export default config