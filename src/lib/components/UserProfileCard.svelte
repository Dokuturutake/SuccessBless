<script lang="ts">
  import { Card, CardContent } from "$lib/components/ui/card";
  import { Heart, MessageCircle, MessageSquare, Calendar } from 'lucide-svelte';
  import { fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { tweened } from 'svelte/motion';
  
  export let username = "";
  export let displayName = "";
  export let avatarUrl = "https://via.placeholder.com/100";
  export let bio = "";
  export let joinDate = new Date();
  export let totalLikes = 0;
  export let totalPosts = 0;
  export let totalComments = 0;

  // tweenedストアを作成して数値のアニメーションを管理
  const tweenedLikes = tweened(totalLikes, {
    duration: 800,
    easing: cubicOut
  });
  const tweenedPosts = tweened(totalPosts, {
    duration: 800,
    easing: cubicOut
  });
  const tweenedComments = tweened(totalComments, {
    duration: 800,
    easing: cubicOut
  });

  // プロップの変更を監視してアニメーションを実行
  $: {
    tweenedLikes.set(totalLikes);
    tweenedPosts.set(totalPosts);
    tweenedComments.set(totalComments);
  }

  function formatNumber(num: number): string {
    if (num >= 1000000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toFixed(0);
  }

  function formatDate(date: Date): string {
    return new Intl.DateTimeFormat('ja-JP', { 
      year: 'numeric',
      month: 'long'
    }).format(date);
  }
</script>

<Card class="bg-white/95 dark:bg-gray-800/95 border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
  <CardContent class="p-6">
    <div class="flex flex-col space-y-8">
      <!-- メインスタッツ -->
      <div class="grid grid-cols-3 gap-6 -mt-2">
        <!-- Likes -->
        <div 
          class="flex flex-col items-center p-6 rounded-2xl bg-gradient-to-br from-pink-500/10 to-red-500/10 dark:from-pink-500/20 dark:to-red-500/20"
          transition:fly={{ y: 20, duration: 600, easing: cubicOut }}
        >
          <Heart class="w-8 h-8 text-pink-500 dark:text-pink-400 mb-2" />
          <div class="text-3xl font-bold bg-gradient-to-r from-pink-600 to-red-600 dark:from-pink-400 dark:to-red-400 bg-clip-text text-transparent">
            {formatNumber($tweenedLikes)}
          </div>
          <span class="text-sm text-gray-600 dark:text-gray-400 mt-1">Likes</span>
        </div>

        <!-- Posts -->
        <div 
          class="flex flex-col items-center p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 dark:from-purple-500/20 dark:to-blue-500/20"
          transition:fly={{ y: 20, duration: 600, easing: cubicOut }}
        >
          <MessageCircle class="w-8 h-8 text-purple-500 dark:text-purple-400 mb-2" />
          <div class="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
            {formatNumber($tweenedPosts)}
          </div>
          <span class="text-sm text-gray-600 dark:text-gray-400 mt-1">Posts</span>
        </div>

        <!-- Comments -->
        <div 
          class="flex flex-col items-center p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20"
          transition:fly={{ y: 20, duration: 600, easing: cubicOut }}
        >
          <MessageSquare class="w-8 h-8 text-blue-500 dark:text-blue-400 mb-2" />
          <div class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
            {formatNumber($tweenedComments)}
          </div>
          <span class="text-sm text-gray-600 dark:text-gray-400 mt-1">Comments</span>
        </div>
      </div>

      <!-- プロフィール情報 -->
      <div class="flex items-center space-x-4">
        <img 
          src={avatarUrl} 
          alt={displayName} 
          class="w-16 h-16 rounded-full ring-2 ring-purple-500/20 dark:ring-purple-400/20"
        />
        <div class="flex-1">
          <h1 class="text-xl font-bold text-gray-900 dark:text-white">
            {displayName}
          </h1>
          <p class="text-sm text-gray-600 dark:text-gray-400">@{displayName.toLowerCase().replace(' ', '')}</p>
          {#if bio}
            <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">{bio}</p>
          {/if}
          <div class="flex items-center mt-2 text-xs text-gray-600 dark:text-gray-400">
            <Calendar size={14} class="mr-1" />
            <span>{formatDate(joinDate)}に登録</span>
          </div>
        </div>
      </div>
    </div>
  </CardContent>
</Card>