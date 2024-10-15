<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Alert, AlertDescription } from "$lib/components/ui/alert";
  import { apiKeyStore } from "$lib/stores/apiKeyStore";
  import { Eye, EyeOff } from "lucide-svelte";

  export let error = "";
  let apiKey = "";
  let showPassword = false;

  apiKeyStore.subscribe(value => {
    apiKey = value;
  });

  function setApiKey(apiKey: string) {
    apiKeyStore.setApiKey(apiKey);
    error = "";
  }

  $: setApiKey(apiKey);


  function togglePasswordVisibility() {
    showPassword = !showPassword;
  }
</script>

<div class="mb-4">
  <div class="relative">
    <Input type="{showPassword ? "text" : "password"}" placeholder="Enter Gemini API Key" bind:value={apiKey} />
    <Button
      class="absolute right-2 top-1/2 -translate-y-1/2"
      variant="ghost"
      size="icon"
      on:click={togglePasswordVisibility}
    >
      {#if showPassword}
        <EyeOff class="h-4 w-4" />
      {:else}
        <Eye class="h-4 w-4" />
      {/if}
    </Button>

  </div>
</div>

{#if error}
  <Alert variant="destructive" class="mb-4">
    <AlertDescription>{error}</AlertDescription>
  </Alert>
{/if}

