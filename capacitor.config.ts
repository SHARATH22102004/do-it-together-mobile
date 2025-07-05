import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.2fd83f3e4c45411fb9558d9bf5e7220a',
  appName: 'do-it-together-mobile',
  webDir: 'dist',
  server: {
    url: 'https://2fd83f3e-4c45-411f-b955-8d9bf5e7220a.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#7c3aed',
      androidScaleType: 'CENTER_CROP',
      splashFullScreen: true,
      splashImmersive: true,
    }
  }
};

export default config;