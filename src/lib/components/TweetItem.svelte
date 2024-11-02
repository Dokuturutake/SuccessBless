<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { tweetStore } from "$lib/stores/tweetStore";
  import { handleLikeTweet, handleLikeReply } from "$lib/utils/likeActions";
  import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "$lib/components/ui/collapsible";
  import { Heart, MessageCircle, Repeat2, Share } from 'lucide-svelte';
	import { onDestroy, onMount } from "svelte";
	import type { Tweet } from "$lib/types/tweet";
	import { profileStore } from "$lib/stores/profileStore";
	import { addBasePath } from "$lib/utils/addBasePath";
	import { base } from "$app/paths";
	import TweetContent from "./TweetContent.svelte";

  export let tweet: Tweet;

  let likedTweets = new Set<string>();
  let likedReplies = new Set<string>();
  let showReplies = false;

  function toggleReplies() {
    showReplies = !showReplies;
  }

  function formatCount(count: number): string {
    return count > 999 ? `${(count / 1000).toFixed(1)}K` : count.toString();
  }

  function formatDate(date: string): string {
    const tweetDate = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - tweetDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 1) {
      return `${tweetDate.getHours()}:${tweetDate.getMinutes().toString().padStart(2, '0')}`;
    } else if (diffDays < 7) {
      return `${diffDays}d`;
    } else {
      return `${tweetDate.toLocaleString('default', { month: 'short' })} ${tweetDate.getDate()}`;
    }
  }
  let imageLoaded = false;
  let imageLoadError = false;

  function preloadImage(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        imageLoaded = true;
        resolve();
      };
      img.onerror = () => {
        imageLoadError = true;
        reject();
      };
      img.src = src;
    });
  }
  
  let imageUrl;
  $: imageUrl = tweetStore.getImageUrl(tweet);


  onDestroy(() => {
    tweetStore.cleanupImageUrl(tweet.id);
  });
</script>

<div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
  <div class="flex items-start space-x-3">
    <img src="{$profileStore?.avatarUrl || base+"/userImage/0.webp"}" alt="Profile" class="w-12 h-12 rounded-full">
    <div class="flex-1">
      <div class="flex flex-wrap items-center gap-y-1">
        <span class="font-bold text-[15px] mr-2 dark:text-white">{tweet.name}</span>
        <span class="text-gray-500 dark:text-gray-400 text-[15px] mr-2">@{tweet.name.toLowerCase().replace(' ', '')}</span>
        <span class="text-gray-500 dark:text-gray-400 text-[15px] mx-1 hidden sm:inline">·</span>
        <span class="text-gray-500 dark:text-gray-400 text-[15px] w-full sm:w-auto">{formatDate(tweet.createdAt)}</span>
      </div>
      <TweetContent content={tweet.content}/>

      
      <!-- 画像の表示 -->
      {#if imageUrl}
          <div class="mt-3 rounded-2xl overflow-hidden">
            <img 
              src={imageUrl} 
              alt="" 
              class="w-full h-auto object-cover"
            >
          </div>
      {/if}
   

      <div class="mt-3 flex items-center justify-between text-gray-500 dark:text-gray-400">
        <Button variant="ghost" class="hover:text-blue-500 p-2" on:click={toggleReplies}>
          <MessageCircle size={18} />
          <span class="ml-2 text-xs">{formatCount(tweet.replyCount)}</span>
        </Button>
        <Button variant="ghost" class="hover:text-green-500 p-2">
          <Repeat2 size={18} />
          <span class="ml-2 text-xs">0</span>
        </Button>
        <Button 
          variant="ghost" 
          class="hover:text-red-500 p-2" 
          on:click={() => handleLikeTweet(tweet.id, likedTweets, tweetStore)} 
          disabled={likedTweets.has(tweet.id)}
        >
          <Heart size={18} fill={likedTweets.has(tweet.id) ? "currentColor" : "none"} />
          <span class="ml-2 text-xs">{formatCount(tweet.likes)}</span>
        </Button>
        <Button variant="ghost" class="hover:text-blue-500 p-2">
          <Share size={18} />
        </Button>
      </div>
    </div>
  </div>

  <Collapsible>
    <CollapsibleTrigger class="w-full text-left text-sm text-blue-500 hover:underline mt-2" let:open>
      {open ? '返信を非表示' : '返信を表示'}
    </CollapsibleTrigger>
    <CollapsibleContent>
      {#if tweet.replies.length > 0}
        <div class="mt-4 space-y-4">
          {#each tweet.replies as reply (reply.id)}
            <div class="flex items-start space-x-3 md:pl-12 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
              <img src="{base}/userImage/{reply.imagenum ? reply.imagenum : 0}.webp" alt="Profile" class="w-9 h-9 rounded-full">
              <div class="flex-1">
                <div class="flex items-center">
                  <span class="font-bold text-[14px] dark:text-white">{reply.name}</span>
                  <span class="text-gray-500 dark:text-gray-400 text-[14px] ml-2">@{reply.name.toLowerCase().replace(' ', '')}</span>
                  <span class="text-gray-500 dark:text-gray-400 text-[14px] mx-1">·</span>
                  <span class="text-gray-500 dark:text-gray-400 text-[14px]">{formatDate(reply.createdAt)}</span>
                </div>
                <TweetContent content={reply.content}/>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </CollapsibleContent>
  </Collapsible>
</div>