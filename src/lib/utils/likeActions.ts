import { tweetStore } from "$lib/stores/tweetStore";

export function handleLikeTweet(tweetId: string, likedTweets: Set<string>, store = tweetStore) {
  if (!likedTweets.has(tweetId)) {
    store.likeTweet(tweetId);
    likedTweets.add(tweetId);
  }
}

export function handleLikeReply(tweetId: string, replyId: string, likedReplies: Set<string>, store = tweetStore) {
  const uniqueId = `${tweetId}-${replyId}`;
  if (!likedReplies.has(uniqueId)) {
    store.likeReply(tweetId, replyId);
    likedReplies.add(uniqueId);
  }
}