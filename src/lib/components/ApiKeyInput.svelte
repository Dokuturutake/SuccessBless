<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Alert, AlertDescription } from "$lib/components/ui/alert";
  import { apiKeyStore } from "$lib/stores/apiKeyStore";

  export let error = "";
  let apiKey = "";

  apiKeyStore.subscribe(value => {
    apiKey = value;
  });

  function setApiKey() {
    apiKeyStore.setApiKey(apiKey);
    error = "";
  }
</script>

<div class="mb-4">
  <Input type="text" placeholder="Enter Gemini API Key" bind:value={apiKey} />
  <Button on:click={setApiKey}>Set API Key</Button>
</div>

{#if error}
  <Alert variant="destructive" class="mb-4">
    <AlertDescription>{error}</AlertDescription>
  </Alert>
{/if}