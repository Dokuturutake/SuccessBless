<script lang="ts">
    import ApiKeyInput from "$lib/components/ApiKeyInput.svelte";
    import { Button } from "$lib/components/ui/button";
    import { Switch } from "$lib/components/ui/switch";
    import { Alert, AlertDescription } from "$lib/components/ui/alert";
  
    let darkMode = false;
    let notifications = true;
    let privacyMode = false;
  
    function handleLogout() {
      // ログアウト処理をここに実装
      console.log("Logging out");
    }
  
    function clearLocalStorage() {
      if (confirm("本当にすべてのデータを削除しますか？この操作は元に戻せません。")) {
        localStorage.clear();
        alert("すべてのデータが削除されました。ページをリロードします。");
        window.location.reload();
      }
    }
  </script>
  
  <div class="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6">
    <h1 class="text-2xl font-bold mb-6 dark:text-white">設定</h1>
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <span class="text-gray-700 dark:text-gray-300">Gemini API Key</span>
        <ApiKeyInput/>
      </div>
      <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-semibold mb-4 dark:text-white">データ管理</h2>
        <Alert variant="destructive">
          <AlertDescription>
            注意：このアプリはAPIキー、投稿内容、およびその他すべてのデータをローカルストレージに保存しています。以下のボタンをクリックすると、すべてのデータが永久に削除されます。
          </AlertDescription>
        </Alert>
        <Button variant="destructive" class="mt-4" on:click={clearLocalStorage}>
          すべてのデータを削除
        </Button>
      </div>
    </div>
  </div>