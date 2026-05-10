import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.fyndzz.app',
  appName: 'Fyndzz',
  webDir: 'out',
  server: {
    url: 'https://fyndzz.fr',
    cleartext: true
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    },
    Geolocation: {
      permissions: ['location']
    },
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#160C6B',
      showSpinner: false,
    }
  }
}

export default config