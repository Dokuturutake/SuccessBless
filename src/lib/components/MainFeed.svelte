<script lang="ts">
  import { onMount } from "svelte";
  import TweetForm from "$lib/components/TweetForm.svelte";
  import TweetList from "$lib/components/TweetList.svelte";
  import ApiKeyInput from "$lib/components/ApiKeyInput.svelte";
  import { tweetStore } from "$lib/stores/tweetStore";
  import { apiKeyStore } from "$lib/stores/apiKeyStore";
  import { startRandomLikeIncrease } from "$lib/utils/likeSimulator";

  let error = "";

  onMount(() => {
    tweetStore.loadTweets();
    apiKeyStore.loadApiKey();
    startRandomLikeIncrease();
  });
</script>

<div class="max-w-2xl mx-auto mt-8">
  <ApiKeyInput bind:error />
  <TweetForm bind:error />
  <TweetList />
</div>