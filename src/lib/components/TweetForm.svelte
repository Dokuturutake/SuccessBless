<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Textarea } from "$lib/components/ui/textarea";
  import { apiKeyStore } from "$lib/stores/apiKeyStore";
  import { createTweet } from "$lib/utils/tweetActions";
  import { Image, Smile, Calendar, MapPin, X } from 'lucide-svelte';
  import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "$lib/components/ui/dialog";
  import { createEventDispatcher } from 'svelte';
	import { profileStore } from "$lib/stores/profileStore";
	import { get } from "svelte/store";

  const dispatch = createEventDispatcher();
  let isImageDialogOpen = false;

  let avatarUrl = "/userImage/0.webp";

  function handleClick() {
    dispatch('reply', { message: 'Replyボタンがクリックされました' });
  }
  export let error = "";
  let newTweetContent = "";
  let apiKey = "";
  let charLimit = 280;
  let selectedImage: File | undefined = undefined;
  let imagePreviewUrl = "";
  let creatingTweet = false;

  apiKeyStore.subscribe(value => {
    apiKey = value;
  });

  async function handleCreateTweet() {
    handleClick();

    creatingTweet = true;

    let name = get(profileStore).name;

    error = await createTweet(newTweetContent, name , selectedImage);
    if (!error) {
      newTweetContent = "";
      selectedImage = undefined;
      imagePreviewUrl = "";
    }
    creatingTweet = false;
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      handleCreateTweet();
    }
  }

  function handleImageSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      selectedImage = input.files[0];
      imagePreviewUrl = URL.createObjectURL(selectedImage);
    }

    isImageDialogOpen = false;
  }

  function removeImage() {
    selectedImage = undefined;
    imagePreviewUrl = "";
  }
  

  $: charactersRemaining = charLimit - newTweetContent.length;
  $: isOverLimit = charactersRemaining < 0;
</script>

<div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
  <form on:submit|preventDefault={handleCreateTweet} class="space-y-4">
    <div class="flex items-start space-x-4">
      <img src="{$profileStore?.avatarUrl || avatarUrl}" alt="Profile" class="w-12 h-12 rounded-full">
      <Textarea
        bind:value={newTweetContent}
        placeholder="今何をしていますか？"
        rows="4"
        class="flex-1 resize-none border-0 focus:ring-0 text-xl bg-transparent dark:text-white dark:placeholder-gray-400"
        on:keydown={handleKeyDown}
      />
    </div>
    
    {#if selectedImage}
      <div class="relative">
        <img src={imagePreviewUrl} alt="Selected image" class="max-w-full h-auto rounded-lg">
        <Button variant="ghost" class="absolute top-2 right-2 bg-gray-800 bg-opacity-50 text-white rounded-full p-1" on:click={removeImage}>
          <X size={16} />
        </Button>
      </div>
    {/if}

    {#if error}
      <p class="text-red-500 text-sm">{error}</p>
    {/if}

    <div class="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-3">
      <div class="flex space-x-4">
        <Dialog bind:open={isImageDialogOpen}>
          <DialogTrigger>
            <Button variant="ghost" class="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900 p-2" title="Media">
              <Image size={20} />
            </Button>
          </DialogTrigger>
          <DialogContent class="dark:bg-gray-800 dark:text-white">
            <DialogHeader>
              <DialogTitle>画像をアップロード</DialogTitle>
              <DialogDescription class="dark:text-gray-300">
                注意: アップロードする画像に個人情報や機密情報が含まれていないことを確認してください。
                画像はAIに送信され分析されます。公開しても問題ない内容のみをアップロードしてください。
              </DialogDescription>
            </DialogHeader>
            <input type="file" accept="image/jpeg, image/png, image/webp, image/heic, image/heif" on:change={handleImageSelect} class="mt-4 dark:text-gray-300" />
          </DialogContent>
        </Dialog>
        <Button variant="ghost" class="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900 p-2" title="GIF">
          <span class="font-bold">GIF</span>
        </Button>
        <Button variant="ghost" class="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900 p-2" title="Poll">
          <Calendar size={20} />
        </Button>
        <Button variant="ghost" class="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900 p-2" title="Emoji">
          <Smile size={20} />
        </Button>
        <Button variant="ghost" class="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900 p-2" title="Location">
          <MapPin size={20} />
        </Button>
      </div>
      
      <div class="flex items-center space-x-4">
        {#if newTweetContent.length > 0}
          <div class={`text-sm ${isOverLimit ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
            {charactersRemaining}
          </div>
        {/if}
        <Button 
          type="submit" 
          variant="default"
          class="bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded-full dark:bg-blue-600 dark:hover:bg-blue-700"
          disabled={newTweetContent.length === 0 || isOverLimit || creatingTweet}
        >
          投稿
        </Button>
      </div>
    </div>
  </form>
</div>