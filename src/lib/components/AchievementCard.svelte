<script lang="ts">
    import { Card } from "$lib/components/ui/card";
    import { LucideLock, LucideTrophy } from "lucide-svelte";
    import type { Achievement } from '$lib/types/achievement';
    import { fade } from 'svelte/transition';
    import { goto } from '$app/navigation';
    import { base } from '$app/paths';
    
    export let achievement: Achievement;
    export let onClick: () => void;
    
  
    const isUnlocked = !!achievement.unlockedAt;
  </script>
  
  <Card 
    class={`relative overflow-hidden transition-all duration-300 hover:scale-102 cursor-pointer
            ${isUnlocked ? 'bg-gray-800 dark:bg-gray-700' : 'bg-gray-100 dark:bg-gray-800'}`}
    on:click={onClick}
  >
    <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 
                opacity-0 transition-opacity duration-300"
         class:opacity-100={isUnlocked}>
    </div>
    
    <div class="p-4">
      <div class="flex items-center space-x-4">
        <div class="relative w-16 h-16">
          <img
            src={achievement.imageUrl}
            alt=""
            class="w-full h-full transition-all duration-300"
            class:filter={!isUnlocked}
            class:grayscale={!isUnlocked}
            class:opacity-50={!isUnlocked}
          />
          {#if !isUnlocked}
            <div class="absolute inset-0 flex items-center justify-center">
              <LucideLock class="w-6 h-6 text-gray-400 dark:text-gray-500" />
            </div>
          {/if}
        </div>
        
        <div class="flex-1">
          <div class="flex items-center space-x-2">
            {#if isUnlocked}
              <LucideTrophy class="w-4 h-4 text-yellow-400" />
            {/if}
            <h3 class="font-bold text-gray-900 dark:text-gray-100">
              {achievement.title}
            </h3>
          </div>
          
          <p class="text-sm mt-1"
             class:text-gray-600={isUnlocked}
             class:dark:text-gray-300={isUnlocked}
             class:text-gray-500={!isUnlocked}
             class:dark:text-gray-400={!isUnlocked}>
            {isUnlocked ? achievement.description : achievement.hint}
          </p>
          
          {#if isUnlocked}
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
              達成日: {new Date(achievement.unlockedAt).toLocaleDateString()}
            </p>
          {/if}
        </div>
      </div>
    </div>
  </Card>
  