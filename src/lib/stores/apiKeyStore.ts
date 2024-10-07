import { writable } from 'svelte/store';
import { browser } from '$app/environment';

function createApiKeyStore() {
  const { subscribe, set } = writable<string>('');

  return {
    subscribe,
    setApiKey: (apiKey: string) => {
      if (browser) {
        const encryptedApiKey = btoa(apiKey); // 簡易的な暗号化
        localStorage.setItem('geminiApiKey', encryptedApiKey);
        set(apiKey);
      }
    },
    loadApiKey: () => {
      if (browser) {
        const encryptedApiKey = localStorage.getItem('geminiApiKey');
        if (encryptedApiKey) {
          const apiKey = atob(encryptedApiKey); // 復号化
          set(apiKey);
        }
      }
    }
  };
}

export const apiKeyStore = createApiKeyStore();