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
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Enter Gemini API Key</DialogTitle>
      <DialogDescription>
        <p class="mb-4">To use the reply feature, you need to enter a Gemini API key. You can change this key later in the settings.</p>
        <p class="mb-4">Don't have an API key? <a href="{base}/get-api-key" class="text-blue-500 hover:underline">Learn how to get one</a>.</p>
        <ApiKeyInput />
        <button on:click={toggleIsOpen} class="mb-4 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded">setApiKey</button>
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>