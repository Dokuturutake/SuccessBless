<script lang="ts">
  import { onMount } from "svelte";
  import TweetForm from "$lib/components/TweetForm.svelte";
  import TweetList from "$lib/components/TweetList.svelte";
  import ApiKeyInput from "$lib/components/ApiKeyInput.svelte";
  import ApiKeyModal from "$lib/components/ApiKeyModal.svelte";
  import PrivacyPolicyDisclaimer from "$lib/components/PrivacyPolicyDisclaimer.svelte";
  import { tweetStore} from "$lib/stores/tweetStore";
  import { apiKeyStore } from "$lib/stores/apiKeyStore";
  import { startRandomLikeIncrease } from "$lib/utils/likeSimulator";
  import { LucideSettings } from "lucide-svelte";
	import { profileStore } from "$lib/stores/profileStore";
	import { get } from "svelte/store";
	import UserProfileCard from "./UserProfileCard.svelte";
	import { validate } from "uuid";
	import type { Tweet } from "$lib/types/tweet";
	import { base } from "$app/paths";

  let error = "";
  let isApiKeyModalOpen = false;
  
  export let username = "";
  export let avatarUrl = base+"/userImage/0.webp";
  export let bio = "";
  export let joinDate = new Date();
  export let totalLikes = 0;
  export let totalPosts = 0;
  export let totalComments = 0;

  
  apiKeyStore.onApiKeyLoad(value =>{
      if(value == ""){
        isApiKeyModalOpen = true;
      }
  });

  function handleReply() {
    if (!$apiKeyStore) {
      isApiKeyModalOpen = true;
    }
  }
  
  onMount(()=>{

    tweetStore.subscribe(value => {
      totalPosts = value.length;
      totalLikes = calculateTotalLikes(value);
      totalComments = calculateTotalComments(value);
    });
  });
  

  function calculateTotalLikes(tweets: Tweet[]): number {
    return tweets.reduce((total, tweet) => total + Number(tweet.likes), 0);
  }

  function calculateTotalComments(tweets: Tweet[]): number {
    return tweets.reduce((total, tweet) => total + Number(tweet.replies.length), 0);
  }
  
</script>

<div class="max-w-2xl mx-auto mt-0 md:mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
  <UserProfileCard avatarUrl={$profileStore?.avatarUrl || avatarUrl} displayName={$profileStore?.name} totalPosts={totalPosts} totalLikes={totalLikes} totalComments={totalComments}/>
  <TweetForm bind:error on:reply={handleReply} />
  <TweetList />
</div>

<ApiKeyModal bind:isOpen={isApiKeyModalOpen} />