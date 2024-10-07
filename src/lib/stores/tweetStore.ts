import { analyzeTweetWithGemini } from '$lib/geminiApi';
import { writable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';

export interface Tweet {
  id: string;
  name: string;
  content: string;
  createdAt: string;
  likes: number;
  replies: Reply[];
  replyCount: number;
}

export interface Reply {
  id: string;
  tweetId: string;
  name: string;
  content: string;
  createdAt: string;
  likes: number;
  style?: string;
  hashtags?: string[];
}

function createTweetStore() {
  const { subscribe, set, update } = writable<Tweet[]>([]);

  return {
    subscribe,
    addTweet: (name: string, content: string, likes:number) => update(tweets => {
      const newTweet: Tweet = {
        id: uuidv4(),
        name,
        content,
        createdAt: new Date().toISOString(),
        likes: likes,
        replies: [],
        replyCount: 0
      };
      const updatedTweets = [newTweet, ...tweets];
      localStorage.setItem('tweets', JSON.stringify(updatedTweets));
      return updatedTweets;
    }),
    addReply: (tweetId: string, reply: Omit<Reply, 'id' | 'tweetId' | 'createdAt'>) => update(tweets => {
      const updatedTweets = tweets.map(tweet => {
        if (tweet.id === tweetId) {
          const newReply: Reply = {
            id: uuidv4(),
            tweetId,
            createdAt: new Date().toISOString(),
            ...reply,
            likes: 0
          };
          return { 
            ...tweet, 
            replies: [newReply, ...tweet.replies],
            replyCount: tweet.replyCount + 1
          };
        }
        return tweet;
      });
      localStorage.setItem('tweets', JSON.stringify(updatedTweets));
      return updatedTweets;
    }),
    likeTweet: (tweetId: string) => update(tweets => {
      const updatedTweets = tweets.map(tweet => 
        tweet.id === tweetId ? { ...tweet, likes: tweet.likes + 1 } : tweet
      );
      localStorage.setItem('tweets', JSON.stringify(updatedTweets));
      return updatedTweets;
    }),
    likeReply: (tweetId: string, replyId: string) => update(tweets => {
      const updatedTweets = tweets.map(tweet => {
        if (tweet.id === tweetId) {
          const updatedReplies = tweet.replies.map(reply =>
            reply.id === replyId ? { ...reply, likes: reply.likes + 1 } : reply
          );
          return { ...tweet, replies: updatedReplies };
        }
        return tweet;
      });
      localStorage.setItem('tweets', JSON.stringify(updatedTweets));
      return updatedTweets;
    }),
    loadTweets: () => {
      const storedTweets = localStorage.getItem('tweets');
      if (storedTweets) {
        set(JSON.parse(storedTweets));
      }
    }
  };
}

export const tweetStore = createTweetStore();