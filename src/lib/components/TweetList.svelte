<script lang="ts">
  import { tweetStore} from "$lib/stores/tweetStore";
	import type { Tweet } from "$lib/types/tweet";
  import TweetItem from "./TweetItem.svelte";

  let tweets: Tweet[] = [];

  tweetStore.subscribe(value => {
    tweets = value;
  });
</script>

<div class="space-y-4">
  {#each tweets as tweet (tweet.id)}
    <TweetItem {tweet} />
  {/each}
</div>