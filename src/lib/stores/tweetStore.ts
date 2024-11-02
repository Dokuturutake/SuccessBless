// stores/tweetStore.ts

import { writable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';
import { compressImage } from '$lib/utils/imageUtils';
import { dbService } from '$lib/db/databaseService';
import type { Tweet, Reply } from '$lib/types/tweet';

const TWEET_LIMIT = 200;

function createTweetStore() {
  const { subscribe, set, update } = writable<Tweet[]>([]);
  const urlCache = new Map<string, string>();

  // URL管理機能
  function getImageUrl(tweet: Tweet): string | null {
    if (!tweet.imageBlob) {
      return null;
    }

    let url = urlCache.get(tweet.id);
    if (!url) {
      url = URL.createObjectURL(tweet.imageBlob);
      urlCache.set(tweet.id, url);
    }
    return url;
  }

  function cleanupImageUrl(tweetId: string) {
    const url = urlCache.get(tweetId);
    if (url) {
      URL.revokeObjectURL(url);
      urlCache.delete(tweetId);
    }
  }

  return {
    subscribe,
    cleanupImageUrl,
    getImageUrl,

    async init() {
      try {
        await dbService.init();
        const tweets = await dbService.getAllTweets();
        tweets.sort((a,b) => b.createdAt.localeCompare(a.createdAt));
        set(tweets.slice(0, TWEET_LIMIT));
      } catch (error) {
        console.error('Failed to initialize tweet store:', error);
        set([]);
      }
    },

    async addTweet(name: string, content: string,likes:number, image?: File, hashtags?: string[]): Promise<Tweet> {
      const newTweet: Tweet = {
        id: uuidv4(),
        name,
        content,
        createdAt: new Date().toISOString(),
        likes: likes,
        replies: [],
        replyCount: 0,
      };
      
      if(hashtags){
        newTweet.hashtags = hashtags;
      }

      if (image) {
        try {
          newTweet.imageBlob = await compressImage(image);
        } catch (error) {
          console.error('Failed to compress image:', error);
        }
      }

      await dbService.addTweet(newTweet);
      await dbService.deleteTweetsOverLimit(TWEET_LIMIT);
      update(tweets => [newTweet, ...tweets].slice(0, TWEET_LIMIT));
      
      return newTweet;
    },

    async addReply(tweetId: string, reply: Omit<Reply, 'id' | 'tweetId' | 'createdAt'>) {
      update(tweets => {
        const updatedTweets = tweets.map(tweet => {
          if (tweet.id === tweetId) {
            const newReply: Reply = {
              id: uuidv4(),
              tweetId,
              createdAt: new Date().toISOString(),
              ...reply,
              likes: 0
            };
            const updatedTweet = {
              ...tweet,
              replies: [newReply, ...tweet.replies],
              replyCount: tweet.replyCount + 1
            };
            
            dbService.updateTweet(updatedTweet);
            return updatedTweet;
          }
          return tweet;
        });
        return updatedTweets;
      });
    },

    async likeTweet(tweetId: string) {
      update(tweets => {
        const updatedTweets = tweets.map(tweet => {
          if (tweet.id === tweetId) {
            const updatedTweet = {
              ...tweet,
              likes: Number(tweet.likes) + 1
            };
            
            dbService.updateTweet(updatedTweet);
            return updatedTweet;
          }
          return tweet;
        });
        return updatedTweets;
      });
    },

    async likeReply(tweetId: string, replyId: string) {
      update(tweets => {
        const updatedTweets = tweets.map(tweet => {
          if (tweet.id === tweetId) {
            const updatedReplies = tweet.replies.map(reply =>
              reply.id === replyId ? { ...reply, likes: reply.likes + 1 } : reply
            );
            const updatedTweet = { ...tweet, replies: updatedReplies };
            
            dbService.updateTweet(updatedTweet);
            return updatedTweet;
          }
          return tweet;
        });
        return updatedTweets;
      });
    },

    cleanup() {
      for (const url of urlCache.values()) {
        URL.revokeObjectURL(url);
      }
      urlCache.clear();
      dbService.close();
    },

    async deleteDatabase() {
      this.cleanup();
      await dbService.deleteDatabase();
      set([]);
    }
  };
}

export const tweetStore = createTweetStore();