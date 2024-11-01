<script lang="ts">
    import { achievementStore } from '$lib/stores/achievementStore';
    import AchievementCard from '$lib/components/AchievementCard.svelte';
    import { goto } from '$app/navigation';
	import type { Achievement } from '$lib/types/achievement';
    
    let achievements: Achievement[];
    achievementStore.subscribe(value => achievements = value);
  </script>
  
  <div class="max-w-4xl mx-auto p-4 dark:bg-gray-900 min-h-screen">
    <h1 class="text-2xl font-bold mb-6 dark:text-white">実績一覧</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {#each achievements as achievement}
        <AchievementCard 
          {achievement} 
          onClick={() => goto(`/achievements/${achievement.id}`)} 
        />
      {/each}
    </div>
  </div>