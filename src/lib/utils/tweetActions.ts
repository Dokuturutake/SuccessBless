import { tweetStore } from "$lib/stores/tweetStore";
import { createGeminiApi } from "$lib/utils/geminiApi";
import { get } from "svelte/store";

export async function createTweet(newTweetContent: string, name: string, image?: File): Promise<string> {
  if (newTweetContent.trim().length === 0 || newTweetContent.length > 280) {
    return "Invalid tweet content";
  }

  try {
    const geminiApi = createGeminiApi();
    const geminiResponses = await geminiApi.getResponseTweets(`{username:${name}, tweet:${newTweetContent}}`, image);
    
    const tweet = tweetStore.addTweet(name, newTweetContent);
    const tweetId = tweet.id;

    tweetStore.updateTweetLikes(tweetId, geminiResponses.predicted_likes);

    if (image) {
      tweetStore.updateTweetImage(tweetId, URL.createObjectURL(image));
    }

    geminiResponses.replies.forEach(response => {
      tweetStore.addReply(tweetId, {
        name: response.username,
        content: response.text,
        likes: 0,
      });
    });

    return "";
  } catch (error) {
    console.error("Error in createTweet:", error);
    return error instanceof Error ? error.message : "An unknown error occurred";
  }
}