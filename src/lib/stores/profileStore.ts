// src/lib/stores/profileStore.ts
import { onMount } from 'svelte';
import { writable } from 'svelte/store';

onMount(() => {
  const storedUsername = localStorage.getItem('username') || '';
  const storedBio = localStorage.getItem('bio') || '';
  const storedProfilePicture = localStorage.getItem('profilePicture') || null;

  username.set(storedUsername);
  bio.set(storedBio);
  profilePicture.set(storedProfilePicture ? JSON.parse(storedProfilePicture) : null);

  username.subscribe((value) => {
    localStorage.setItem('username', value);
  });

  bio.subscribe((value) => {
    localStorage.setItem('bio', value);
  });

  try{
    profilePicture.subscribe((value) => {
      localStorage.setItem('profilePicture', value ? JSON.stringify(value) : '');
    });
  }
  
});
// ローカルストレージに保存されている値を読み込む

// 各フィールドに対応するstoreを作成

export const username = writable<string>('default');
export const bio = writable<string>('');
export const profilePicture = writable<File | null>(null);

// storeの値が変更された時にlocalStorageに保存する処理を追加