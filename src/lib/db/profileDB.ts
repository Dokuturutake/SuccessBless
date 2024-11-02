// profileDb.ts
export interface Profile {
    name: string;
    bio: string;
    avatarBlob?: Blob;
  }
  
  const defaultProfile: Profile = {
    name: 'ゲストユーザー',
    bio: '',
  };
  
  class ProfileDB {
    private dbName = 'profileDB';
    private storeName = 'profiles';
    private version = 1;
  
    async init(): Promise<void> {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(this.dbName, this.version);
  
        request.onerror = () => {
          reject(request.error);
        };
  
        request.onsuccess = () => {
          resolve();
        };
  
        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(this.storeName)) {
            db.createObjectStore(this.storeName);
          }
        };
      });
    }
  
    private async getDb(): Promise<IDBDatabase> {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(this.dbName, this.version);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
      });
    }
  
    async getProfile(): Promise<Profile> {
      try {
        const db = await this.getDb();
        return new Promise((resolve, reject) => {
          const transaction = db.transaction(this.storeName, 'readonly');
          const store = transaction.objectStore(this.storeName);
          const request = store.get('profile');
  
          request.onerror = () => {
            reject(request.error);
          };
  
          request.onsuccess = () => {
            resolve(request.result || defaultProfile);
          };
        });
      } catch (error) {
        console.error('Failed to get profile:', error);
        return defaultProfile;
      }
    }
  
    async saveProfile(profile: Profile): Promise<void> {
      const db = await this.getDb();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(this.storeName, 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.put(profile, 'profile');
  
        request.onerror = () => {
          reject(request.error);
        };
  
        request.onsuccess = () => {
          resolve();
        };
      });
    }
  }
  
  export const profileDb = new ProfileDB();