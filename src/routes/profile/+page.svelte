<script lang="ts">
  import { onMount } from 'svelte';
  import { profileStore, type Profile } from '$lib/stores/profileStore';
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Textarea } from "$lib/components/ui/textarea";

  let profile: Profile;
  let isLoading = true;

  onMount(() => {
    profileStore.loadProfile();
    profileStore.subscribe(value => {
      console.log(value);
      profile = value;
      isLoading=false;
    });
  });

  function handleSave() {
    profileStore.saveProfile(profile);
    alert('プロフィールが保存されました');
  }
</script>

{#if isLoading}
  <p>読み込み中...</p>
{:else}
<div class="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6">
  <h1 class="text-2xl font-bold mb-6 dark:text-white">プロフィール</h1>
  <div class="space-y-4">
    <div>
      <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300">ユーザー名</label>
      <Input type="text" id="username" bind:value={profile.name} class="mt-1" />
    </div>
    <div>
      <label for="avatarUrl" class="block text-sm font-medium text-gray-700 dark:text-gray-300">アバター画像URL</label>
      <Input type="text" id="avatarUrl" bind:value={profile.avatarUrl} class="mt-1" />
    </div>
    <Button on:click={handleSave}>保存</Button>
  </div>
</div>
{/if}