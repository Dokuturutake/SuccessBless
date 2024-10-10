<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { tweetStore, type Tweet } from "$lib/stores/tweetStore";
  import { handleLikeTweet, handleLikeReply } from "$lib/utils/likeActions";

  export let tweet: Tweet;

  let likedTweets = new Set<string>();
  let likedReplies = new Set<string>();
</script>

<div class="bg-white p-4 rounded-lg shadow">
  <div class="font-bold">{tweet.name}</div>
  <p>{tweet.content}</p>
  <div class="text-sm text-gray-500 mt-2">
    {new Date(tweet.createdAt).toLocaleString()}
  </div>
  <div class="mt-2 flex items-center space-x-4">
    <Button 
      variant="ghost" 
      on:click={() => handleLikeTweet(tweet.id, likedTweets, tweetStore)} 
      disabled={likedTweets.has(tweet.id)}
    >
      👍 {tweet.likes}
    </Button>
    <span>{tweet.replyCount} replies</span>
  </div>
  
  {#if tweet.replies.length > 0}
    <div class="mt-4 ml-4 space-y-2">
      {#each tweet.replies as reply (reply.id)}
        <div class="bg-gray-100 p-2 rounded" style={reply.style}>
          <div class="font-bold">{reply.name}</div>
          <p>{reply.content}</p>
          <div class="text-xs text-gray-500 mt-1">
            {new Date(reply.createdAt).toLocaleString()}
          </div>
          <Button 
            variant="ghost" 
            on:click={() => handleLikeReply(tweet.id, reply.id, likedReplies, tweetStore)} 
            disabled={likedReplies.has(`${tweet.id}-${reply.id}`)}
          >
            👍 {reply.likes}
          </Button>
        </div>
      {/each}
    </div>
  {/if}
</div>