<script lang="ts">
    import { onMount } from "svelte";
    import MainFeed from "$lib/components/MainFeed.svelte";
    import { Button } from "$lib/components/ui/button";
  
    let isLoggedIn = false;
    let username = "";
  
    onMount(() => {
      // Here you would typically check if the user is logged in
      // For now, we'll just set a dummy value
      isLoggedIn = true;
      username = "DemoUser";
    });
  
    function handleLogout() {
      isLoggedIn = false;
      username = "";
      // Here you would typically handle the logout process
    }
  </script>
  
  <svelte:head>
    <title>SUCCESSBLESS</title>
  </svelte:head>
  
  <main class="container mx-auto md:px-4 md:py-o px-0 py-0">
  
    {#if isLoggedIn}
      <MainFeed />
    {:else}
      <div class="text-center">
        <p class="mb-4">投稿を見たり作成したりするにはログインが必要です。</p>
        <Button>ログイン</Button>
      </div>
    {/if}
  </main>
  
  <footer class="mt-16 text-center text-gray-500">
    <p>&copy; 2024 SUCCESSBLESS. All rights reserved.</p>
  </footer>