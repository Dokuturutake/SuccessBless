// データベースの設定
const DB_NAME = 'ApiKeyDB';
const STORE_NAME = 'apiKeys';
const DB_VERSION = 1;

// コールバック関数の型定義
type ApiKeyCallback = (apiKey: string) => void;

// IndexedDBのラッパークラス
class ApiKeyDB {
  private db: IDBDatabase | null = null;
  private callbacks: Set<ApiKeyCallback> = new Set();

  // コールバック関数を登録
  addCallback(callback: ApiKeyCallback): void {
    this.callbacks.add(callback);
  }

  // コールバック関数を削除
  removeCallback(callback: ApiKeyCallback): void {
    this.callbacks.delete(callback);
  }

  // 全てのコールバックを実行
  private executeCallbacks(apiKey: string): void {
    this.callbacks.forEach(callback => callback(apiKey));
  }

  // データベースを開く/作成する
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
    });
  }

  // APIキーを保存
  async saveApiKey(apiKey: string): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(apiKey, 'current');

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.executeCallbacks(apiKey);
        resolve();
      };
    });
  }

  // APIキーを取得
  async getApiKey(): Promise<string | null> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get('current');

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        if (request.result) {
          this.executeCallbacks(request.result);
        }
        resolve(request.result);
      };
    });
  }
}

// シングルトンインスタンスをエクスポート
export const apiKeyDB = new ApiKeyDB();