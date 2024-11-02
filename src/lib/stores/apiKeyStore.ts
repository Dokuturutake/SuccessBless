import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { apiKeyDB } from '$lib/db/apiKeyDB';

function createApiKeyStore() {
  const { subscribe, set } = writable<string>('');

  return {
    subscribe,
    setApiKey: async (apiKey: string) => {
      if (browser) {
        await apiKeyDB.saveApiKey(apiKey);
        set(apiKey);
      }
    },
    loadApiKey: async () => {
      if (browser) {
        const apiKey = await apiKeyDB.getApiKey();
        if (apiKey) {
          set(apiKey);
        }
      }
    },
    
        // コールバック登録機能を追加
    onApiKeyLoad: (callback: (apiKey: string) => void) => {
      apiKeyDB.addCallback(callback);
      return () => apiKeyDB.removeCallback(callback); // クリーンアップ関数を返す
    }
  };
}

export const apiKeyStore = createApiKeyStore();