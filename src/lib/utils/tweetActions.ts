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
    const hashtags = extractHashtags(newTweetContent);
    const tweet = await tweetStore.addTweet(name, newTweetContent,  geminiResponses.predicted_likes,image, hashtags);
    const tweetId = tweet.id;
    const PictureMax = 43;

    if(geminiResponses.replies){
      geminiResponses.replies.forEach(response => {
        tweetStore.addReply(tweetId, {
          name: response.username,
          content: response.text,
          likes: 0,
          imagenum:getRandomInt(PictureMax),
        });
    });
    }

    return "";
  } catch (error) {
    console.error("Error in createTweet:", error);
    return error instanceof Error ? error.message : "An unknown error occurred";
  }
}

function extractHashtags(text: string): string[] {
  const regex = /#[a-z0-9_\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]+/gi;
  return text.match(regex) || [];
}

function getRandomInt(max: number): number {
  return Math.floor(Math.random() * (max + 1));
}