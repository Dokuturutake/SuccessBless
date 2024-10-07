<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Textarea } from "$lib/components/ui/textarea";

  export let tweetId: string;
  export let onReply: (tweetId: string, content: string) => void;

  let replyContent = "";
  let isReplying = false;

  function toggleReply() {
    isReplying = !isReplying;
    replyContent = "";
  }

  function submitReply() {
    if (replyContent.trim().length === 0 || replyContent.length > 140) return;
    onReply(tweetId, replyContent);
    toggleReply();
  }
</script>

<div>
  <Button variant="ghost" on:click={toggleReply}>
    {isReplying ? "Cancel" : "Reply"}
  </Button>

  {#if isReplying}
    <form on:submit|preventDefault={submitReply} class="mt-2">
      <Textarea
        bind:value={replyContent}
        placeholder="Write your reply..."
        rows="2"
        maxlength="140"
      />
      <div class="flex justify-between items-center mt-2">
        <span class="text-sm text-gray-500">{140 - replyContent.length} characters remaining</span>
        <Button type="submit" disabled={replyContent.length === 0 || replyContent.length > 140}>
          Reply
        </Button>
      </div>
    </form>
  {/if}
</div>