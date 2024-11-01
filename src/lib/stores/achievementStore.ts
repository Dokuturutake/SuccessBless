import { writable, derived, get } from 'svelte/store';
import { tweetStore } from '$lib/stores/tweetStore';
import { achievementDbService } from '$lib/db/achievementService';
import type { Achievement } from '$lib/types/achievement';
import AchievementNotification from '$lib/components/AchievementNotification.svelte';

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-post',
    title: '初めての投稿',
    description: 'おめでとう！最初の一歩を踏み出しました',
    hint: '最初の投稿を作成してみよう',
    imageUrl: '/achievements/first-post.jpeg'
  },
  {
    id: 'first-photo',
    title: '写真家デビュー',
    description: '初めての写真付き投稿を作成しました',
    hint: '写真付きの投稿を試してみよう',
    imageUrl: '/achievements/first-photo.jpeg'
  },
  {
    id: 'likes-1000',
    title: 'いいね1000突破！',
    description: '合計1000いいねを達成',
    hint: 'いいねを集めよう',
    imageUrl: '/achievements/likes-1000.jpeg'
  },
  {
    id: 'likes-10000',
    title: 'いいねの達人',
    description: '合計10000いいねを達成',
    hint: 'さらにいいねを集めよう',
    imageUrl: '/achievements/likes-10000.jpeg'
  }
];

function showAchievementNotification(achievement: Achievement) {
    const notification = document.createElement('div');
    document.body.appendChild(notification);
    
    new AchievementNotification({
      target: notification,
      props: { 
        achievement,
        onClose: () => {
          if (notification && notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }
      }
    });
}

function createAchievementStore() {
  const { subscribe, set, update } = writable<Achievement[]>([]);
  let initialized = false;
  let previousStats: { totalPosts: number; photoPosts: number; totalLikes: number } | null = null;

  // ツイートストアを監視して統計を計算
  tweetStore.subscribe((tweets) => {
    if (!initialized) return;

    const stats = {
      totalPosts: tweets.length,
      photoPosts: tweets.filter(t => t.imageBlob).length,
      totalLikes: tweets.reduce((sum, t) => sum + t.likes, 0),
      comments: tweets.reduce((sum, t) => sum + t.replies.length, 0)
    };

    // 前回の統計と比較して、変更があった場合のみチェック
    if (!previousStats || 
        stats.totalPosts !== previousStats.totalPosts ||
        stats.photoPosts !== previousStats.photoPosts ||
        stats.totalLikes !== previousStats.totalLikes) {
      checkAchievements(stats);
      previousStats = stats;
    }
  });

  async function checkAchievements(stats: { totalPosts: number; photoPosts: number; totalLikes: number }) {
    const currentAchievements = get({ subscribe });
    const checks = [
      { condition: stats.totalPosts >= 1, id: 'first-post' },
      { condition: stats.photoPosts >= 1, id: 'first-photo' },
      { condition: stats.totalLikes >= 1000, id: 'likes-1000' },
      { condition: stats.totalLikes >= 10000, id: 'likes-10000' }
    ];

    for (const check of checks) {
      const achievement = currentAchievements.find(a => a.id === check.id);
      
      if (check.condition && achievement && !achievement.unlockedAt) {
          
        await unlock(check.id);
      }
    }
  }

  async function unlock(achievementId: string) {
    const currentAchievements = get({ subscribe });
    const achievement = currentAchievements.find(a => a.id === achievementId);
    
    // 既に解除済みの場合は何もしない
    if (achievement?.unlockedAt) return;

    const unlockedAt = new Date().toISOString();
    await achievementDbService.unlockAchievement(achievementId, unlockedAt);
    
    update(achievements => achievements.map(achievement => 
      achievement.id === achievementId 
        ? { ...achievement, unlockedAt } 
        : achievement
    ));

    const achievementData = ACHIEVEMENTS.find(a => a.id === achievementId);
    if (achievementData) {
      showAchievementNotification(achievementData);
    }
  }

  return {
    subscribe,
    async init() {
        if (initialized) return;

        await achievementDbService.init();
        
        const mergedAchievements = await Promise.all(ACHIEVEMENTS.map(async achievement => ({
            ...achievement,
            unlockedAt: await achievementDbService.getAchievement(achievement.id),
        })));
        
        set(mergedAchievements);
        initialized = true;
    }
  };
}

export const achievementStore = createAchievementStore();