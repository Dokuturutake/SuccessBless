<script lang="ts">
  import "../app.css";
  import { LucideSettings, LucideHome, LucideUser, LucideBell, LucideFeather, LucideMenu, LucideX } from "lucide-svelte";
  import { page } from '$app/stores';
  import { slide } from 'svelte/transition';
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  import { Dialog, DialogContent } from "$lib/components/ui/dialog";
  import TweetForm from "$lib/components/TweetForm.svelte";
  import { onMount } from 'svelte';
	import ApiKeyInput from "$lib/components/ApiKeyInput.svelte";
	import { base } from "$app/paths";

  let sidebarOpen = false;
  let tweetDialogOpen = false;
  let isDesktop = false;

  const SIDEBAR_WIDTH = 256; // サイドバーの幅を定数として定義

  onMount(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    isDesktop = mediaQuery.matches;
    sidebarOpen = isDesktop;
    mediaQuery.addEventListener('change', (e) => {
      isDesktop = e.matches;
      sidebarOpen = isDesktop;
    });
  });

  function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
  }

  function openTweetForm() {
    tweetDialogOpen = true;
  }

  function closeTweetForm(){
    tweetDialogOpen = false;
  }

  function closeSidebarIfMobile() {
    if (!isDesktop) {
      sidebarOpen = false;
    }
  }
</script>

<div class="flex h-screen bg-gray-100 dark:bg-gray-900">
  <!-- モバイルヘッダー -->
  <div class="md:hidden fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center z-10">
    <button on:click={toggleSidebar} class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
      <LucideMenu size={24} />
    </button>
    <div class="text-xl font-bold text-blue-500">SUCCESSBLESS</div>
    <button on:click={openTweetForm} class="text-blue-500 hover:text-blue-600">
      <LucideFeather size={24} />
    </button>
  </div>

  <!-- サイドバー -->

  <div class="fixed md:static left-0 top-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto z-20 transition-all duration-300 ease-in-out md:w-{SIDEBAR_WIDTH}px"
       class:w-0={!sidebarOpen}
       class:w-{SIDEBAR_WIDTH}px={sidebarOpen}
       class:hidden={!sidebarOpen && !isDesktop}>
    <div class="p-4 w-{SIDEBAR_WIDTH}px">
      <button on:click={toggleSidebar} class="md:hidden absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
        <LucideX size={24} />
      </button>
      <nav class="space-y-6 mt-8 md:mt-0">
        <a href="/" class="flex items-center space-x-3 text-xl font-bold text-blue-500">
          <svg class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          </svg>
          <span>SUCCESSBLESS</span>
        </a>
        <a href="/" on:click={closeSidebarIfMobile} class="flex items-center space-x-3 text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400" class:text-blue-500={$page.url.pathname === '/'}>
          <LucideHome size={24} />
          <span>ホーム</span>
        </a>
        <a href="{base}/profile" on:click={closeSidebarIfMobile} class="flex items-center space-x-3 text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400" class:text-blue-500={$page.url.pathname === '/profile'}>
          <LucideUser size={24} />
          <span>プロフィール</span>
        </a>
        <a href="{base}/notifications" on:click={closeSidebarIfMobile} class="flex items-center space-x-3 text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400" class:text-blue-500={$page.url.pathname === '/notifications'}>
          <LucideBell size={24} />
          <span>通知</span>
        </a>
        <a href="{base}/settings" on:click={closeSidebarIfMobile} class="flex items-center space-x-3 text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400" class:text-blue-500={$page.url.pathname === '/settings'}>
          <LucideSettings size={24} />
          <span>設定</span>
        </a>
      </nav>
      <button on:click={openTweetForm} class="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full flex items-center justify-center">
        <LucideFeather size={18} class="mr-2" />
        <span>投稿</span>
      </button>
    </div>
  </div>

  <!-- メインコンテンツ -->
  <div class="flex-1 md:p-4 md:p-0 overflow-auto mt-16 md:mt-0 transition-all duration-300 ease-in-out"
       class:ml-0={!sidebarOpen || !isDesktop}
       class:ml-{SIDEBAR_WIDTH}px={sidebarOpen && isDesktop}>
    <slot />
  </div>

</div>

<!-- ツイートダイアログ -->
<Dialog bind:open={tweetDialogOpen}>
  <DialogContent>
    <TweetForm on:reply={closeTweetForm}/>
  </DialogContent>
</Dialog>


<style>
  /* スタイルは必要に応じて調整してください */
</style>