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
    }
  };
}

export const apiKeyStore = createApiKeyStore();