<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Textarea } from "$lib/components/ui/textarea";
  import { tweetStore } from "$lib/stores/tweetStore";
  import { apiKeyStore } from "$lib/stores/apiKeyStore";
  import { createTweet } from "$lib/utils/tweetActions";

  export let error = "";
  let newTweetContent = "";
  let apiKey = "";

  apiKeyStore.subscribe(value => {
    apiKey = value;
  });

  async function handleCreateTweet() {
    error = await createTweet(newTweetContent);
    if (!error) newTweetContent = "";
  }
</script>

<form on:submit|preventDefault={handleCreateTweet} class="mb-4">
  <Textarea
    bind:value={newTweetContent}
    placeholder="What's happening?"
    rows="3"
    maxlength="140"
  />
  <div class="flex justify-between items-center mt-2">
    <span class="text-sm text-gray-500">{140 - newTweetContent.length} characters remaining</span>
    <Button type="submit" disabled={newTweetContent.length === 0 || newTweetContent.length > 140}>
      Tweet
    </Button>
  </div>
</form>