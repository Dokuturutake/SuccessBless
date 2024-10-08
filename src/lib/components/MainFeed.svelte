<script lang="ts">
  import { onMount } from "svelte";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Textarea } from "$lib/components/ui/textarea";
  import { Alert, AlertDescription } from "$lib/components/ui/alert";
  import { tweetStore, type Tweet } from "$lib/stores/tweetStore";
  import { apiKeyStore } from "$lib/stores/apiKeyStore";
  import { getGeminiResponseTweet, analyzeTweetWithGemini} from "$lib/geminiApi";

  let newTweetContent = "";
  let tweets: Tweet[] = [];
  let apiKey = "";
  let userName = "User"; // 簡易的なユーザー名
  let error = "";
  let likedTweets = new Set<string>();
  let likedReplies = new Set<string>();

  tweetStore.subscribe(value => {
    tweets = value;
  });

  apiKeyStore.subscribe(value => {
    apiKey = value;
  });

  function setApiKey() {
    apiKeyStore.setApiKey(apiKey);
    error = "";
  }

  async function createTweet() {
    if (newTweetContent.trim().length === 0 || newTweetContent.length > 140) return;
    if (!apiKey) {
      error = "APIキーが設定されていません。先にAPIキーを入力してください。";
      return;
    }

    const geminiAnalyze = await analyzeTweetWithGemini(newTweetContent);

    error = ""; // エラーメッセージをリセット
    tweetStore.addTweet(userName, newTweetContent, geminiAnalyze.likes);
    tweetStore.addReply(tweets[0].id,{
          name: "tweetAdviser",
          content: geminiAnalyze.reply,
          likes:0,
        });
    
    try {
      const prompt = `
指定されたスタイルに従って、SNSでのTweetに複数の回答を作成してください。ツイート内容は「${newTweetContent}」です。異なるスタイルでの回答を準備し、それぞれ回答者のユーザ名と共にJSON形式で表現してください。

# Steps

1. ツイート内容を徹底的に理解、分析してください。
  1.1 「${newTweetContent}」を構成する要素を言語学的に分析します。
  1.2 言葉の意味や背景を考慮して、このフレーズが持つ可能性のある意図や状況を汲み取ります。

2. 1を踏まえて以下のスタイルに基づいた複数の回答を考え出してください：
   - ユーモア
   - 生真面目
   - おふざけ
   - 発話者の感情を盛り上げて話を広げる
   - 専門家
   - 人物を否定
   - 内容を踏まえた自分の意見
   - アンチ
   - 人物への特定の報酬を提案
   - 突っ込み
   - ギャルの軽率
   - 老人特有の含蓄
   - 子供特有の純粋
   - イケメン風
   - 一言
   - 予想外
   - 創造的
3. 各回答には、そのスタイルに合ったユーザ名も含めてください。

# Output Format

- 出力はJSON形式で表現してください。
- 各回答には以下のキーを含めてください：
  - "username": "[回答者のユーザ名]"
  - "text": "[ツイートへの回答文]"

# Examples

入力:
- 内容: "今日はいい天気だね"

出力例:
'''json
[
  {
    "username": "funny_user",
    "text": "今日はいい天気だね！太陽が僕の影に嫉妬してるよ！"
  },
  {
    "username": "serious_user",
    "text": "今日は本当に良い天気ですね。このまま気温が安定してくれることを願います。"
  },
  {
    "username": "playful_user",
    "text": "今日はいい天気だね！じゃあ、やっちゃった、ソーラーパネルダンス！"
  }
  // 各スタイルの回答を同様に追加してください。
]
'''

# Notes

- 各スタイルに沿ったクリエイティブな回答を心掛けてください。
- 同じ内容のツイートを異なるスタイルで応答するために、適切なトーンと文体を工夫してください。
- スタイルに合った語尾や口癖を用いて特徴づけを行ってください。      `;

      const geminiResponses = await getGeminiResponseTweet(prompt);
      geminiResponses.forEach(response => {
        tweetStore.addReply(tweets[0].id, {
          name: response.username,
          content: response.text,
          likes:0,
        });
      });
    } catch (error) {
      console.error("Error getting Gemini response:", error);
      this.error = "Gemini APIからの応答中にエラーが発生しました。";
    }

    newTweetContent = "";
  }


  function handleLikeTweet(tweetId: string) {
    if (!likedTweets.has(tweetId)) {
      tweetStore.likeTweet(tweetId);
      likedTweets.add(tweetId);
    }
  }

  function handleLikeReply(tweetId: string, replyId: string) {
    const uniqueId = `${tweetId}-${replyId}`;
    if (!likedReplies.has(uniqueId)) {
      tweetStore.likeReply(tweetId, replyId);
      likedReplies.add(uniqueId);
    }
  }

  function startRandomLikeIncrease() {
    setInterval(() => {
      tweets.forEach(tweet => {
        if (Math.random() < 0.1) {  // 10% chance to increase likes
          tweetStore.likeTweet(tweet.id);
        }
        tweet.replies.forEach(reply => {
          if (Math.random() < 0.05) {  // 5% chance to increase likes for replies
            tweetStore.likeReply(tweet.id, reply.id);
          }
        });
      });
    }, 5000);  // Check every 5 seconds
  }

  onMount(() => {
    tweetStore.loadTweets();
    apiKeyStore.loadApiKey();
        startRandomLikeIncrease();
  });
</script>

<div class="max-w-2xl mx-auto mt-8">
  <div class="mb-4">
    <Input type="text" placeholder="Enter Gemini API Key" bind:value={apiKey} />
    <Button on:click={setApiKey}>Set API Key</Button>
  </div>

  {#if error}
    <Alert variant="destructive" class="mb-4">
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  {/if}

  <form on:submit|preventDefault={createTweet} class="mb-4">
    <Textarea
      bind:value={newTweetContent}
      placeholder="What's happening?"
      rows="3"
      maxlength="140"
    />
    <div class="flex justify-between items-center mt-2">
      <span class="text-sm text-gray-500">{140 - newTweetContent.length} characters remaining</span>
      <Button type="submit" disabled={newTweetContent.length === 0 || newTweetContent.length > 140}>
        Tweet
      </Button>
    </div>
  </form>

  <div class="space-y-4">
    {#each tweets as tweet (tweet.id)}
      <div class="bg-white p-4 rounded-lg shadow">
        <div class="font-bold">{tweet.name}</div>
        <p>{tweet.content}</p>
        <div class="text-sm text-gray-500 mt-2">
          {new Date(tweet.createdAt).toLocaleString()}
        </div>
        <div class="mt-2 flex items-center space-x-4">
          <Button variant="ghost" on:click={() => handleLikeTweet(tweet.id)} disabled={likedTweets.has(tweet.id)}>
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
              </div>
            {/each}
          </div>
        {/if}
      </div>
    {/each}
  </div>
</div>