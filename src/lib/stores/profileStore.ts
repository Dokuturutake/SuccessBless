import { writable } from 'svelte/store';

export interface Profile {
  name: string;
  username: string;
  bio: string;
  avatarUrl: string;
}

const defaultProfile: Profile = {
  name: 'ゲストユーザー',
  username: 'guest',
  bio: '',
  avatarUrl: 'https://via.placeholder.com/150'
};

function createProfileStore() {
  const { subscribe, set, update } = writable<Profile>(defaultProfile);

  return {
    subscribe,
    update,
    setProfile: (profile: Profile) => set(profile),
    loadProfile: () => {
      const storedProfile = localStorage.getItem('profile');
      if (storedProfile) {
        set(JSON.parse(storedProfile));
      } else {
        set(defaultProfile);
      }
    },
    saveProfile: (profile: Profile) => {
      localStorage.setItem('profile', JSON.stringify(profile));
      set(profile);
    },
  };
}

export const profileStore = createProfileStore();