<script lang="ts">
  import { base } from "$app/paths";
  import { Button } from "$lib/components/ui/button";
</script>

<div class="max-w-2xl mx-auto mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
  <h1 class="text-2xl font-bold mb-4 dark:text-gray-300">Gemini APIキーの取得方法</h1>
  <ol class="list-decimal pl-6 space-y-4 dark:text-gray-300">
    <li><a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">Google AI Studio</a>のウェブサイトにアクセスします。</li>
    <li>まだサインインしていない場合は、Googleアカウントでサインインします。</li>
    <li>「APIキーを取得」ボタンをクリックします。</li>
    <li>既存のAPIキーがない場合は、新しいキーを作成するよう求められます。「新しいプロジェクトでAPIキーを作成」をクリックします。</li>
    <li>新しいAPIキーが生成されます。このキーをコピーします。</li>
    <li>私たちのアプリケーションに戻り、APIキー入力欄にキーを貼り付けます。</li>
  </ol>
  <p class="mt-4 dark:text-gray-300">APIキーは秘密にして、絶対に公開しないようにしてください。Google AI Studioのダッシュボードから、いつでも新しいキーを生成したり、既存のキーを無効にすることができます。</p>
  <div class="mt-6">
    <Button href="{base}/" variant="default">ホームに戻る</Button>
  </div>
</div>