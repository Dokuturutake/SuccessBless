export class AchievementDatabaseService {
    private db: IDBDatabase | null = null;
    private initPromise: Promise<void> | null = null;
  
    async init(): Promise<void> {
      if (this.initPromise) return this.initPromise;
  
      this.initPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open('achievementsDB', 1);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          this.db = request.result;
          resolve();
        };
        
        request.onupgradeneeded = (event) => {
          const db = request.result;
          if (!db.objectStoreNames.contains('achievements')) {
            db.createObjectStore('achievements');
          }
        };
      });
  
      return this.initPromise;
    }
  
    async getUnlockedAchievements(): Promise<Record<string, string>> {
      if (!this.db) await this.init();
      
      return new Promise((resolve, reject) => {
        const tx = this.db!.transaction('achievements', 'readonly');
        const store = tx.objectStore('achievements');
        const request = store.getAll();
        
          const achievements: Record<string, string> = {};
        request.onsuccess = (event) => {
            const cursor = (event.target as IDBRequest).result;
            if (cursor) {
              achievements[cursor.key as string] = cursor.value;
              cursor.continue();
            } else {
              resolve(achievements);
            }
          };
        request.onerror = () => reject(request.error);
      });
    }
  
    async unlockAchievement(achievementId: string, unlockedAt: string): Promise<void> {
      if (!this.db) await this.init();
  
      return new Promise((resolve, reject) => {
        const tx = this.db!.transaction('achievements', 'readwrite');
        const store = tx.objectStore('achievements');
        const request = store.put(unlockedAt, achievementId);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }

    async deleteDatabase(): Promise<void> {
        if (this.db) {
          this.db.close();
          this.db = null;
        }
    
        return new Promise((resolve, reject) => {
          const request = indexedDB.deleteDatabase('achievementsDB');
    
          request.onsuccess = () => {
            this.initPromise = null;
            resolve();
          };
          request.onerror = () => reject(request.error);
        });
      }
    
      async getAchievement(achievementId: string): Promise<string | undefined> {
        if (!this.db) await this.init();
    
        return new Promise((resolve, reject) => {
          const tx = this.db!.transaction('achievements', 'readonly');
          const store = tx.objectStore('achievements');
          const request = store.get(achievementId);
    
          request.onsuccess = () => {
            resolve(request.result || undefined);
          };
          request.onerror = () => reject(request.error);
        });
      }
      

  }
  
  export const achievementDbService = new AchievementDatabaseService();
  