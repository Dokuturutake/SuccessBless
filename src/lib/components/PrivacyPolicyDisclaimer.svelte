<script lang="ts">
  import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "$lib/components/ui/dialog";
  import { Button } from "$lib/components/ui/button";
</script>

<Dialog>
  <DialogTrigger>
    <Button variant="link" class="text-sm text-gray-500 dark:text-gray-400">Privacy Policy & Disclaimer</Button>
  </DialogTrigger>
  <DialogContent class="max-w-3xl">
    <DialogHeader>
      <DialogTitle>Privacy Policy & Disclaimer</DialogTitle>
    </DialogHeader>
    <DialogDescription>
      <div class="space-y-4">
        <h2 class="text-lg font-semibold">Privacy Policy</h2>
        <p>このアプリケーションは、当社のサーバー上で個人データを収集または保存することはありません。すべてのユーザーデータ、投稿およびAPIキーは、ブラウザのローカルストレージおよびIndexedDBに保存されます。</p>
        <p>返信を生成するためにGemini APIを使用しています。投稿内容は処理のためにGemini APIに送信されます。投稿した情報がGemini APIによって処理される可能性があることにご注意ください。</p>
        

        <h2 class="text-lg font-semibold">Disclaimer</h2>
        <ul class="list-disc pl-5 space-y-2">
          <li>このアプリケーションは現在開発中であり、不安定になる可能性があります。</li>
          <li>このアプリケーションを通じて投稿されたコンテンツや生成された返信に関して、当社は一切の責任を負いません。</li>
          <li>Gemini APIは返信を生成するために使用されており、その返信の正確性や適切性を当社は管理または保証しません。</li>
          <li>このアプリケーションを使用することにより、機密情報や個人情報を投稿しないことに同意したものとみなされます。</li>
          <li>当社は予告なしに本サービスを変更または中止する権利を留保します。</li>
        </ul>

        <p class="font-semibold">本アプリケーションを使用することにより、お客様は本プライバシーポリシーおよび免責事項を読み、理解したものとみなされます。</p>
      </div>
    </DialogDescription>
  </DialogContent>
</Dialog>