<script lang="ts">
  import { onMount } from "svelte";
  import TweetForm from "$lib/components/TweetForm.svelte";
  import TweetList from "$lib/components/TweetList.svelte";
  import ApiKeyInput from "$lib/components/ApiKeyInput.svelte";
  import ApiKeyModal from "$lib/components/ApiKeyModal.svelte";
  import PrivacyPolicyDisclaimer from "$lib/components/PrivacyPolicyDisclaimer.svelte";
  import { tweetStore } from "$lib/stores/tweetStore";
  import { apiKeyStore } from "$lib/stores/apiKeyStore";
  import { startRandomLikeIncrease } from "$lib/utils/likeSimulator";
  import { LucideSettings } from "lucide-svelte";

  let error = "";
  let isApiKeyModalOpen = false;

  onMount(() => {
    tweetStore.loadTweets();
    apiKeyStore.loadApiKey();
    startRandomLikeIncrease();
  });

  function handleReply() {
    if (!$apiKeyStore) {
      isApiKeyModalOpen = true;
    }
  }
</script>

<div class="max-w-2xl mx-auto mt-0 md:mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
  <TweetForm bind:error on:reply={handleReply} />
  <TweetList />
</div>

<ApiKeyModal bind:isOpen={isApiKeyModalOpen} />