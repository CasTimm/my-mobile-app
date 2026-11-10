import { useEffect } from 'react';
import { Platform } from 'react-native';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS !== 'web' || !('serviceWorker' in navigator)) return;

    const clearDevelopmentWorker = async () => {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((registration) => registration.unregister()));
      if ('caches' in window) {
        const keys = await window.caches.keys();
        await Promise.all(
          keys.filter((key) => key.startsWith('pootmaat-')).map((key) => window.caches.delete(key)),
        );
      }
    };

    const setupServiceWorker = process.env.NODE_ENV === 'production'
      ? navigator.serviceWorker.register('/sw.js')
      : clearDevelopmentWorker();

    setupServiceWorker.catch((error: unknown) => {
      console.error('Pootmaat service worker setup failed:', error);
    });
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <Slot />
    </SafeAreaProvider>
  );
}
