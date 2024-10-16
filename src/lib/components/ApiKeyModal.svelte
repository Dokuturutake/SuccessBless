<script lang="ts">
	import { base } from "$app/paths";
  import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "$lib/components/ui/dialog";
  import ApiKeyInput from "./ApiKeyInput.svelte";

  export let isOpen = false;

  function toggleIsOpen() {
    isOpen = !isOpen;
  }
</script>

<Dialog bind:open={isOpen}>
  <DialogContent class="dark:bg-gray-800">
    <DialogHeader>
      <DialogTitle class="dark:text-gray-300">Enter Gemini API Key</DialogTitle>
      <DialogDescription>
        <p class="mb-:bind:clientWidth dark:text-gray-300">返信機能を使用するには、Gemini APIキーを入力する必要があります。</p>
        <p class="mb-4 dark:text-gray-300">APIキーをお持ちでない場合<a href="{base}/get-api-key" class="text-blue-500 hover:underline">取得方法を見る</a>.</p>
        <ApiKeyInput />
        <button on:click={toggleIsOpen} class="mb-4 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded">setApiKey</button>
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>