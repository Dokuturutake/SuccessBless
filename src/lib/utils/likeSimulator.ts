import { tweetStore } from "$lib/stores/tweetStore";
import { get } from "svelte/store";

export function startRandomLikeIncrease() {
  setInterval(() => {
    const tweets = get(tweetStore);
    tweets.forEach(tweet => {
      if (Math.random() < 0.1) {  // 10% chance to increase likes
        tweetStore.likeTweet(tweet.id);
      }
    });
  }, 5000);  // Check every 5 seconds
}