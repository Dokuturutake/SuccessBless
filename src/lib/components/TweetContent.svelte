<!-- TweetContent.svelte -->
<script lang="ts">
    export let content: string;
    
    function formatContent(text: string) {
      // ハッシュタグを検出する正規表現
      const hashtagRegex = /#[\w一-龠ぁ-んァ-ヶー]+/g;
      
      // テキストをハッシュタグで分割し、配列に変換
      const parts = text.split(hashtagRegex);
      const hashtags = text.match(hashtagRegex) || [];
      
      let result = [];
      
      // パーツとハッシュタグを交互に配列に追加
      for (let i = 0; i < parts.length; i++) {
        if (parts[i]) result.push(parts[i]);
        if (hashtags[i]) result.push(hashtags[i]);
      }
      
      return result;
    }
  </script>
  
  <p class="mt-1 text-[15px] leading-normal dark:text-white">
    {#each formatContent(content) as part}
      {#if part.startsWith('#')}
        <span class="text-blue-500 hover:underline cursor-pointer">{part}</span>
      {:else}
        {part}
      {/if}
    {/each}
  </p>