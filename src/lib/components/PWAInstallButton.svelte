<script lang="ts">
  import { Download } from "lucide-svelte";
  import { onMount } from "svelte";

  let deferredPrompt: any = null;
  let isInstalled = false;
  let installing = false;
  let pressTimer: any = null;
  let progress = 0;

  onMount(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      isInstalled = true;
      return;
    }

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
    });

    window.addEventListener('appinstalled', () => {
      isInstalled = true;
      deferredPrompt = null;
    });

    return () => {
      if (pressTimer) clearTimeout(pressTimer);
    };
  });

  function handlePressStart() {
    if (isInstalled || installing) return;
    
    progress = 0;
    const startTime = Date.now();
    
    pressTimer = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      progress = Math.min((elapsedTime / 1500) * 100, 100);
      
      if (progress >= 100) {
        clearInterval(pressTimer);
        handleInstall();
      }
    }, 10);
  }

  function handlePressEnd() {
    if (pressTimer) {
      clearInterval(pressTimer);
      if (progress < 100) {
        progress = 0;
      }
    }
  }

  async function handleInstall() {
    if (!deferredPrompt || isInstalled) return;
    
    installing = true;
    progress = 100;
    
    try {
      await deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      if (result.outcome === 'accepted') {
        isInstalled = true;
      }
    } catch (err) {
      console.error('PWA Install Error:', err);
    } finally {
      deferredPrompt = null;
      installing = false;
      if (!isInstalled) {
        progress = 0;
      }
    }
  }
</script>

{#if !isInstalled}
<div class="flex justify-center mt-6">
  <div class="relative">
    <button 
      disabled={installing}
      on:mousedown={handlePressStart}
      on:mouseup={handlePressEnd}
      on:mouseleave={handlePressEnd}
      on:touchstart|preventDefault={handlePressStart}
      on:touchend|preventDefault={handlePressEnd}
      class="w-20 h-20 rounded-full bg-white dark:bg-gray-800 shadow-lg flex flex-col items-center justify-center space-y-1 relative overflow-hidden border-2 border-blue-500 dark:border-blue-400 disabled:opacity-50"
    >
      <Download size={24} class="text-blue-500 dark:text-blue-400" />
      <span class="text-[10px] text-blue-600 dark:text-blue-400 font-medium">
        {#if installing}
          インストール中
        {:else if progress > 0 && progress < 100}
          長押しで
          インストール
        {:else}
          アプリを
          インストール
        {/if}
      </span>
      
      {#if progress > 0}
        <div class="absolute inset-0 flex items-center justify-center">
          <svg 
            class="w-[calc(100%-4px)] h-[calc(100%-4px)] -rotate-90"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="currentColor"
              stroke-width="6"
              stroke-linecap="round"
              class="text-blue-100 dark:text-blue-900"
            />
            <circle
              cx="53"
              cy="50"
              r="46"
              fill="none"
              stroke="currentColor"
              stroke-width="6"
              stroke-linecap="round"
              class="text-blue-500 dark:text-blue-400"
              style="stroke-dasharray: 289; stroke-dashoffset: {289 - (progress * 289 / 100)};"
            />
          </svg>
        </div>
      {/if}
    </button>
  </div>
</div>
{/if}

<style>
  circle {
    transition: stroke-dashoffset 0.1s ease-out;
  }
</style>