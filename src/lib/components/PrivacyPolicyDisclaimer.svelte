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
        <p>This application does not collect or store any personal data on our servers. All user data, including posts and API keys, are stored locally in your browser's Local Storage.</p>
        <p>We use the Gemini API for generating responses. Your post content is sent to the Gemini API for processing. Please be aware that any information you post may be processed by the Gemini API.</p>

        <h2 class="text-lg font-semibold">Disclaimer</h2>
        <ul class="list-disc pl-5 space-y-2">
          <li>This application is currently in development and may be unstable.</li>
          <li>We are not responsible for any content posted or replies generated through this application.</li>
          <li>The Gemini API is used for generating responses, and we do not control or guarantee the accuracy or appropriateness of these responses.</li>
          <li>By using this application, you agree not to post any sensitive or personal information.</li>
          <li>We reserve the right to modify or discontinue this service at any time without notice.</li>
        </ul>

        <p class="font-semibold">By using this application, you acknowledge that you have read and understood this Privacy Policy and Disclaimer.</p>
      </div>
    </DialogDescription>
  </DialogContent>
</Dialog>