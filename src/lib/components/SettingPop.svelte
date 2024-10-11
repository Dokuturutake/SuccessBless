<script lang="ts">
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { Textarea } from "$lib/components/ui/textarea";
    import { Camera, MapPin, Calendar } from "lucide-svelte";
  
    // プロフィールデータのストアを作成
    const createProfileStore = () => {
      const { subscribe, set, update } = writable({
        username: '',
        bio: '',
        location: '',
        website: '',
      });
  
      return {
        subscribe,
        set,
        update,
        // LocalStorageからデータを読み込む
        loadFromStorage: () => {
          const storedData = localStorage.getItem('profileData');
          if (storedData) {
            set(JSON.parse(storedData));
          }
        },
        // LocalStorageにデータを保存
        saveToStorage: (data) => {
          localStorage.setItem('profileData', JSON.stringify(data));
        }
      };
    };
  
    const profileStore = createProfileStore();
  
    // コンポーネントがマウントされたらLocalStorageからデータを読み込む
    onMount(() => {
      profileStore.loadFromStorage();
    });
  
    // ストアの値を監視し、変更があればLocalStorageに保存
    $: {
      if ($profileStore) {
        profileStore.saveToStorage($profileStore);
      }
    }
  
    function handleSubmit() {
      // フォーム送信時の処理（必要に応じて実装）
      console.log($profileStore);
      // ここでAPIリクエストを送信するなどの処理を追加できます
    }
  </script>
  
  <div class="max-w-2xl mx-auto p-4 bg-white dark:bg-gray-800">
    <h1 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">プロフィールを編集</h1>
    
    <form on:submit|preventDefault={handleSubmit} class="space-y-6">
      <div>
        <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ユーザーネーム</label>
        <Input type="text" id="username" bind:value={$profileStore.username} placeholder="@username" class="w-full" />
      </div>
  
      <div>
        <label for="bio" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">自己紹介</label>
        <Textarea id="bio" bind:value={$profileStore.bio} placeholder="自己紹介を入力してください" class="w-full" />
      </div>
  
      <div>
        <label for="website" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ウェブサイト</label>
        <Input type="url" id="website" bind:value={$profileStore.website} placeholder="https://example.com" class="w-full" />
      </div>
  
      <div class="pt-4">
        <Button type="submit" class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          保存
        </Button>
      </div>
    </form>
  </div>
  
  <style>
    /* Twitterライクなフォントスタイル */
    :global(body) {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
  </style>