import { tweetStore } from "$lib/stores/tweetStore";
import { createGeminiApi } from "$lib/utils/geminiApi";
import { get } from "svelte/store";

export async function createTweet(newTweetContent: string): Promise<string> {
  if (newTweetContent.trim().length === 0 || newTweetContent.length > 140) {
    return "Invalid tweet content";
  }

  try {
    const geminiApi = createGeminiApi();
    const geminiAnalyze = await geminiApi.analyzeTweet(newTweetContent);
    
    const tweet = tweetStore.addTweet("User", newTweetContent, geminiAnalyze.likes);
    const tweetId = tweet.id;
    tweetStore.addReply(tweetId, {
      name: "tweetAdviser",
      content: geminiAnalyze.reply,
      likes: 0,
    });

    const geminiUnderstand = await geminiApi.understandingTweet(newTweetContent);
    console.log(geminiUnderstand);
    

    const geminiResponses = await geminiApi.getResponseTweets(geminiUnderstand);
    
    geminiResponses.forEach(response => {
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