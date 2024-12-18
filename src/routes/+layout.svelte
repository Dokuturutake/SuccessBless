<script lang="ts">
  import "../app.css";
  import {LucideMedal, LucideSettings, LucideHome, LucideUser, LucideBell, LucideFeather, LucideMenu, LucideX } from "lucide-svelte";
  import { dev } from '$app/environment';
  import { page } from '$app/stores';
  import { slide } from 'svelte/transition';
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  import { Dialog, DialogContent } from "$lib/components/ui/dialog";
  import TweetForm from "$lib/components/TweetForm.svelte";
  import { onMount } from 'svelte';
	import ApiKeyInput from "$lib/components/ApiKeyInput.svelte";
	import { base } from "$app/paths";
	import { tweetStore } from "$lib/stores/tweetStore";
	import { apiKeyStore } from "$lib/stores/apiKeyStore";
	import { profileStore } from "$lib/stores/profileStore";
	import { startRandomLikeIncrease } from "$lib/utils/likeSimulator";
	import { achievementStore } from "$lib/stores/achievementStore";
	import { onNavigate } from "$app/navigation";
	import PWAInstallButton from "$lib/components/PWAInstallButton.svelte";

  let sidebarOpen = false;
  let tweetDialogOpen = false;
  let isDesktop = false;

  const SIDEBAR_WIDTH = 256; // サイドバーの幅を定数として定義

  onMount(async() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    isDesktop = mediaQuery.matches;
    sidebarOpen = isDesktop;
    mediaQuery.addEventListener('change', (e) => {
      isDesktop = e.matches;
      sidebarOpen = isDesktop;
    });

    startRandomLikeIncrease();
    achievementStore.init();
    profileStore.loadProfile();
    await tweetStore.init();
    await apiKeyStore.loadApiKey();
  });
  
  onNavigate((navigation) => {
      profileStore?.setProfile($profileStore);
      console.log("momomom");
      
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
    <div class="svg-icon bg-blue-500 h-6 w-6"></div>
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
      <div class="w-[15vw]"></div>
      <nav class="space-y-6 mt-8 md:mt-0">
        <a href="{base}/" class="flex items-center space-x-3 text-xl font-bold text-blue-500 w-">
          <div class="h-auto w-full svg-iconAndText bg-blue-500 m-0">
          </div>
        </a>
        <a href="{base}/" on:click={closeSidebarIfMobile} class="flex items-center space-x-3 text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400" class:text-blue-500={$page.url.pathname === '/'}>
          <LucideHome size={24} />
          <span>ホーム</span>
        </a>
        <a href="{base}/profile" on:click={closeSidebarIfMobile} class="flex items-center space-x-3 text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400" class:text-blue-500={$page.url.pathname === '/profile'}>
          <LucideUser size={24} />
          <span>プロフィール</span>
        </a>
        <a href="{base}/achievements" on:click={closeSidebarIfMobile} class="flex items-center space-x-3 text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400" class:text-blue-500={$page.url.pathname === '/achievements'}>
          <LucideMedal size={24} />
          <span>実績</span>
        </a>
        <a href="{base}/settings" on:click={closeSidebarIfMobile} class="flex items-center space-x-3 text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400" class:text-blue-500={$page.url.pathname === '/settings'}>
          <LucideSettings size={24} />
          <span>設定</span>
        </a>
      </nav>
      <PWAInstallButton/>
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
  <DialogContent class="dark:bg-gray-800 dark:text-white">
    <TweetForm on:reply={closeTweetForm}/>
  </DialogContent>
</Dialog>


<style>
  .svg-icon {
  -webkit-mask: url(/SuccessBlessIcon.svg) no-repeat center / contain;
  mask: url(/SuccessBlessIcon.svg) no-repeat center / contain;
}
  .svg-text {
  -webkit-mask: url(/SuccessBlessString.svg) no-repeat center / contain;
  mask: url(/SuccessBlessString.svg) no-repeat center / contain;
}

.svg-iconAndText {
  -webkit-mask-image: url(/SuccessBlessIconAndString.svg);
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
  -webkit-mask-size: contain;
  mask-image: url(/SuccessBlessIconAndString.svg);
  mask-repeat: no-repeat;
  mask-position: center;
  mask-size: contain;
  aspect-ratio: 15 / 6;
}
</style>