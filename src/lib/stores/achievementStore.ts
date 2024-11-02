import { writable, derived, get } from 'svelte/store';
import { tweetStore } from '$lib/stores/tweetStore';
import { achievementDbService } from '$lib/db/achievementService';
import type { Achievement } from '$lib/types/achievement';
import AchievementNotification from '$lib/components/AchievementNotification.svelte';

interface AchievementCondition {
    id: string;
    condition: (stats: TweetStats) => boolean;
}
  
interface TweetStats {
    totalPosts: number;
    photoPosts: number;
    totalLikes: number;
    totalComments:number;
    hashtags: string[];
}

const achievementConditions: AchievementCondition[] = [
    { id: 'first-post', condition: stats => stats.totalPosts >= 1 },
    { id: 'ten-posts', condition: stats => stats.totalPosts >= 10 },
    { id: 'first-photo', condition: stats => stats.photoPosts >= 1 },
    { id: 'likes-1000', condition: stats => stats.totalLikes >= 1000 },
    { id: 'likes-10000', condition: stats => stats.totalLikes >= 10000 },
    { id: 'likes-100000', condition: stats => stats.totalLikes >= 100000 },
    { id: 'goal-setter', condition: stats => stats.hashtags.includes('#目標') },
    { id: 'first-tag', condition: stats => stats.hashtags.length > 0},
    { id: 'hundred-posts', condition: stats => stats.totalPosts >= 100 },
    { id: 'reward-post', condition: stats => stats.hashtags.includes('#ご褒美') },
    { id: 'break-time', condition: stats => stats.hashtags.includes('#休憩') },
    { id: 'goal-achieved', condition: stats => stats.hashtags.includes('#目標達成') },
    { id: 'comments-200', condition: stats => stats.totalComments >= 200 },
    { id: 'hobbyist', condition: stats => stats.hashtags.includes('#趣味') },
    { id: 'feeling-happy', condition: stats => stats.hashtags.includes('#うれしい') },
  ];
  
function checkAchievements(stats: TweetStats): string[] {
return achievementConditions
  .filter(ac => ac.condition(stats))
  .map(ac => ac.id);
}

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
  },
  {
    "id": "likes-100000",
    "title": "いいねのスター",
    "description": "合計100000いいねを達成",
    "hint": "いいねの数だけ、あなたの魅力が伝わっています！",
    "imageUrl": "/achievements/likes-100000.jpeg"
  },
  {
    "id": "first-tag",
    "title": "初めての#タグ",
    "description": "初めて # タグを使った投稿",
    "hint": "# タグでつながる仲間を見つけよう！",
    "imageUrl": "/achievements/first-tag.jpeg"
  },
  {
    id: 'goal-setter',
    title: '目標設定のスタート',
    description: '#目標 で初めての目標作成',
    hint: '#目標 タグを使って自分の目標を投稿してみよう',
    imageUrl: '/achievements/goal-setter.jpeg'
  },
  {
    "id": "ten-posts",
    "title": "投稿マスター",
    "description": "10回の投稿を達成",
    "hint": "どんどん投稿して、自分を表現しよう！",
    "imageUrl": "/achievements/ten-posts.jpeg"
  },
  {
    id: 'hundred-posts',
    title: '投稿の達人',
    description: 'なんと100回も投稿しました！その情熱、まさに職人技！',
    hint: '次は100回目指してみよう？',
    imageUrl: '/achievements/hundred-posts.jpeg'
  },
  {
    id: 'reward-post',
    title: 'ご褒美タイム',
    description: '#ご褒美 投稿で自分を褒めてあげました！自分を大切に！',
    hint: '#ご褒美 タグを使って自分を甘やかそう！',
    imageUrl: '/achievements/reward-post.jpeg'
  },
  {
    id: 'break-time',
    title: 'ちょっと一息',
    description: '休憩は大切！#休憩 タグで一息つきました。',
    hint: '#休憩 タグでリフレッシュしよう！',
    imageUrl: '/achievements/break-time.jpeg'
  },
  {
    id: 'goal-achieved',
    title: '目標達成！',
    description: 'ついに #目標達成！やったね！',
    hint: '目標達成したら #目標達成 で語ろう',
    imageUrl: '/achievements/goal-achieved.jpeg'
  },
  {
    id: 'comments-200',
    title: 'コメント職人',
    description: '200コメント達成！会話の輪を広げています！',
    hint: '積極的にコメントをもらい、交流を楽しもう！',
    imageUrl: '/achievements/comments-200.jpeg'
  },
  {
    id: 'hobbyist',
    title: '趣味人',
    description: '#趣味 をシェアして、仲間とつながろう！',
    hint: '#趣味 タグで楽しいことを共有してみよう！',
    imageUrl: '/achievements/hobbyist.jpeg'
  },
  {
    id: 'feeling-happy',
    title: '幸せいっぱい！',
    description: 'うれしい気持ちを共有しました！幸せは広がるもの！',
    hint: '#うれしい タグでハッピーを表現しよう！',
    imageUrl: '/achievements/feeling-happy.jpeg'
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

  // ツイートストアを監視して統計を計算
  tweetStore.subscribe((tweets) => {
    if (!initialized) return;

    const stats: TweetStats = {
      totalPosts: tweets.length,
      photoPosts: tweets.filter(t => t.imageBlob).length,
      totalLikes: tweets.reduce((sum, t) => sum + t.likes, 0),
      totalComments: tweets.reduce((sum, t) => sum + t.replies.length, 0),
      hashtags: tweets.flatMap(t => t.hashtags || [])
    };

    const achievedIds = checkAchievements(stats);
    for (const id of achievedIds) {
      unlock(id);
    }

  });


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