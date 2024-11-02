import { get, writable } from 'svelte/store';
import { profileDb, type Profile } from '$lib/db/profileDB';

function createProfileStore() {
  const { subscribe, set, update } = writable<Profile & { avatarUrl?: string }>();
  let initialized = false;
  let currentAvatarUrl: string | undefined;
  let initializationPromise: Promise<void> | null = null;

  function updateAvatarUrl(profile: Profile) {
    // 前のURLがあれば解放
    if (currentAvatarUrl) {
      URL.revokeObjectURL(currentAvatarUrl);
      currentAvatarUrl = undefined;
    }

    // 新しいblobがある場合のみ新しいURLを生成
    if (profile.avatarBlob) {
      try {
        currentAvatarUrl = URL.createObjectURL(profile.avatarBlob);
        return { ...profile, avatarUrl: currentAvatarUrl };
      } catch (error) {
        console.error('Failed to create object URL:', error);
        return { ...profile, avatarUrl: undefined };
      }
    }

    return { ...profile, avatarUrl: undefined };
  }

  return {
    subscribe,
    update,
    setProfile: (profile: Profile) => {
      set(updateAvatarUrl(profile));
    },
    loadProfile: async () => {
      // 同時に複数回呼び出された場合の保護
      if (initializationPromise) {
        return initializationPromise;
      }

      initializationPromise = (async () => {
        try {
          if (!initialized) {
            await profileDb.init();
            initialized = true;
          }
          const profile = await profileDb.getProfile();
          set(updateAvatarUrl(profile));
        } catch (error) {
          console.error('Profile loading error:', error);
          throw error;
        } finally {
          initializationPromise = null;
        }
      })();

      return initializationPromise;
    },
    saveProfile: async (profile: Profile) => {
      // 初期化中の重複保存を防ぐ
      if (initializationPromise) {
        await initializationPromise;
      }
      await profileDb.saveProfile(profile);
      set(updateAvatarUrl(profile));
    },
    cleanup: () => {
      if (currentAvatarUrl) {
        URL.revokeObjectURL(currentAvatarUrl);
        currentAvatarUrl = undefined;
      }
    }
  };
}

export const profileStore = createProfileStore();