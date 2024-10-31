import type { Tweet } from '$lib/types/tweet';

const DB_NAME = 'tweetsDB';
const DB_VERSION = 2;
const TWEET_STORE = 'tweets';

export class DatabaseService {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    this.db = await this.initDB();
  }

  private initDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = request.result;
        if (!db.objectStoreNames.contains(TWEET_STORE)) {
          const store = db.createObjectStore(TWEET_STORE, { keyPath: 'id' });
          store.createIndex('createdAt', 'createdAt');
        }
      };
    });
  }

  async getAllTweets(): Promise<Tweet[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(TWEET_STORE, 'readonly');
      const store = tx.objectStore(TWEET_STORE);
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async addTweet(tweet: Tweet): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(TWEET_STORE, 'readwrite');
      const store = tx.objectStore(TWEET_STORE);
      const request = store.add(tweet);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async updateTweet(tweet: Tweet): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(TWEET_STORE, 'readwrite');
      const store = tx.objectStore(TWEET_STORE);
      const request = store.put(tweet);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async deleteTweetsOverLimit(limit: number): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const tx = this.db.transaction(TWEET_STORE, 'readwrite');
    const store = tx.objectStore(TWEET_STORE);
    const index = store.index('createdAt');
    
    const count = await new Promise<number>(resolve => {
      store.count().onsuccess = (event) => {
        resolve((event.target as IDBRequest).result);
      };
    });

    if (count > limit) {
      const request = index.openCursor(null, 'prev');
      let skipCount = 0;
      
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor && skipCount >= limit) {
          store.delete(cursor.primaryKey);
          cursor.continue();
        } else if (cursor) {
          skipCount++;
          cursor.continue();
        }
      };
    }
  }

  async deleteDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.deleteDatabase(DB_NAME);
      
      request.onsuccess = () => {
        this.db = null;
        resolve();
      };
      
      request.onerror = () => reject(request.error);
    });
  }

  async close(): Promise<void> {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}

export const dbService = new DatabaseService();