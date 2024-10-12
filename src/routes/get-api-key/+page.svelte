<script lang="ts">
	import { base } from "$app/paths";
  import { Button } from "$lib/components/ui/button";
</script>

<div class="max-w-2xl mx-auto mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
  <h1 class="text-2xl font-bold mb-4">How to Get a Gemini API Key</h1>
  <ol class="list-decimal pl-6 space-y-4">
    <li>Go to the <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">Google AI Studio</a> website.</li>
    <li>Sign in with your Google account if you haven't already.</li>
    <li>Click on the "Get API key" button.</li>
    <li>If you don't have any existing API keys, you'll be prompted to create a new one. Click "Create API key in new project".</li>
    <li>A new API key will be generated. Copy this key.</li>
    <li>Return to our application and paste the key into the API key input field.</li>
  </ol>
  <p class="mt-4">Remember to keep your API key secret and never share it publicly. You can always generate a new key or revoke an existing one from the Google AI Studio dashboard.</p>
  <div class="mt-6">
    <Button href="{base}/" variant="default">Back to Home</Button>
  </div>
</div>