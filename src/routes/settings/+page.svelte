<script lang="ts">
  import ApiKeyInput from "$lib/components/ApiKeyInput.svelte";
import { Button } from "$lib/components/ui/button";
  import { Switch } from "$lib/components/ui/switch";

  let darkMode = false;
  let notifications = true;
  let privacyMode = false;

  function handleLogout() {
    // ログアウト処理をここに実装
    console.log("Logging out");
  }
</script>

<div class="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6">
  <h1 class="text-2xl font-bold mb-6">設定</h1>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <span class="text-gray-700 dark:text-gray-300">Gemini API Key</span>
        <ApiKeyInput/>
    </div>
    <div class="flex items-center justify-between">
      <span class="text-gray-700 dark:text-gray-300">ダークモード</span>
      <Switch bind:checked={darkMode} />
    </div>
    <div class="flex items-center justify-between">
      <span class="text-gray-700 dark:text-gray-300">通知</span>
      <Switch bind:checked={notifications} />
    </div>
    <div class="flex items-center justify-between">
      <span class="text-gray-700 dark:text-gray-300">プライバシーモード</span>
      <Switch bind:checked={privacyMode} />
    </div>
    <Button on:click={handleLogout} variant="destructive" class="w-full">ログアウト</Button>
  </div>
</div>