<script lang="ts">
    import { fly } from 'svelte/transition';
    import { cubicOut } from 'svelte/easing';
    import type { Achievement } from '$lib/types/achievement';
    import { LucideTrophy, LucideX } from "lucide-svelte";
    import { goto } from '$app/navigation';
    import { base } from '$app/paths';
    import { onMount } from 'svelte';
    
    export let achievement: Achievement;
    export let onClose: () => void;
  
    let closing = false;
    
    onMount(() => {
      // 5秒後に自動的に閉じる
      const timer = setTimeout(() => {
        handleClose();
      }, 5000);
  
      return () => clearTimeout(timer);
    });
  
    async function handleClick() {
      closing = true; // すぐに消去アニメーションを開始
      // アニメーションと同時に実績ページへ遷移
      await Promise.all([
        new Promise(resolve => setTimeout(resolve, 300)), // アニメーション時間
        goto(`${base}/achievements`)
      ]);
      onClose();
    }
  
    function handleClose() {
      closing = true;
      setTimeout(() => {
        onClose();
      }, 300);
    }
  </script>
  
  <div
    class="fixed top-4 right-4 z-50 transition-opacity duration-300"
    in:fly={{ x: 300, duration: 1000, easing: cubicOut }}
    out:fly={{ x: 300, duration: 300, easing: cubicOut }}
    class:opacity-0={closing}
    class:pointer-events-none={closing}
  >
    <button 
      type="button"
      class="relative w-full text-left bg-gray-800 dark:bg-gray-700 text-white rounded-lg shadow-lg overflow-hidden min-w-[300px] cursor-pointer hover:scale-105 transition-transform duration-200"
      on:click={handleClick}
    >
      <!-- グラデーションバー -->
      <div class="h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
      
      <!-- 閉じるボタン -->
      <button
        class="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors duration-200 p-1 rounded-full hover:bg-gray-600/50"
        on:click|stopPropagation={handleClose}
      >
        <LucideX class="w-4 h-4" />
      </button>
  
      <div class="p-4">
        <div class="flex items-center space-x-3">
          <div class="relative">
            <img src={base+achievement.imageUrl} alt="" class="w-12 h-12" />
            <div class="absolute -top-1 -right-1">
              <LucideTrophy class="w-5 h-5 text-yellow-400" />
            </div>
          </div>
          <div class="flex-1 pr-6"> <!-- 閉じるボタンのスペースを確保 -->
            <p class="text-sm font-medium text-gray-400">実績解除！</p>
            <h4 class="font-bold">{achievement.title}</h4>
            <p class="text-sm text-gray-300">{achievement.description}</p>
          </div>
        </div>
      </div>
    </button>
  </div>