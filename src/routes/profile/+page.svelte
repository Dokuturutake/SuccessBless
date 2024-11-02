<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { profileStore } from '$lib/stores/profileStore';
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Textarea } from "$lib/components/ui/textarea";
  import { Dialog, DialogContent, DialogHeader, DialogTitle } from "$lib/components/ui/dialog";
  import { LucideCamera as Camera, LucidePencil as Pencil } from "lucide-svelte";
  import type { Profile } from '$lib/db/profileDB';

  const EDITOR_SIZE = 300;
  const CROP_SIZE = 150;
  const SCALE_FACTOR = 0.005;
  const MIN_SCALE = 0.1;
  const MAX_SCALE = 3;

  let profile: Profile & { avatarUrl?: string };
  let isLoading = true;
  let imageEditor: HTMLDivElement;
  let cropCanvas: HTMLCanvasElement;
  let fileInput: HTMLInputElement;
  
  let isEditing = false;
  let image: HTMLImageElement;
  let scale = 1;
  let offsetX = 0;
  let offsetY = 0;
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let lastTouchDistance = 0;
  let isImageLoaded = false;
  let animationFrameId: number;
  let unsubscribe: () => void;

  $: if (isEditing && image) {
    drawImage();
  }

  onMount(async () => {
    fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    fileInput.addEventListener('change', handleFileSelect);
    document.body.appendChild(fileInput);

    unsubscribe = profileStore.subscribe(value => {
      if (value) {
        profile = value;
        isLoading = false;
        if (profile.avatarUrl) {
          isImageLoaded = true;
        }
      }
    });
  });

  onDestroy(() => {
    if (fileInput) {
      document.body.removeChild(fileInput);
    }
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    if (unsubscribe) {
      unsubscribe();
    }
  });

  function openFileSelector() {
    fileInput?.click();
  }

  function handleFileSelect(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      image = new Image();
      image.onload = () => {
        resetTransform();
        isEditing = true;
        requestAnimationFrame(drawImage);
      };
      image.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  function resetTransform() {
    if (!image) return;
    const scaleX = CROP_SIZE / image.width;
    const scaleY = CROP_SIZE / image.height;
    scale = Math.max(scaleX, scaleY) * 1.2;
    offsetX = 0;
    offsetY = 0;
  }

  function drawImage() {
    if (!image || !cropCanvas) return;
    
    const ctx = cropCanvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, EDITOR_SIZE, EDITOR_SIZE);
    
    const scaledWidth = image.width * scale;
    const scaledHeight = image.height * scale;
    const x = (EDITOR_SIZE - scaledWidth) / 2 + offsetX;
    const y = (EDITOR_SIZE - scaledHeight) / 2 + offsetY;
    
    ctx.globalAlpha = 0.3;
    ctx.drawImage(image, x, y, scaledWidth, scaledHeight);
    
    ctx.globalAlpha = 1;
    ctx.save();
    ctx.beginPath();
    ctx.arc(EDITOR_SIZE/2, EDITOR_SIZE/2, CROP_SIZE/2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(image, x, y, scaledWidth, scaledHeight);
    ctx.restore();
    
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(EDITOR_SIZE/2, EDITOR_SIZE/2, CROP_SIZE/2, 0, Math.PI * 2);
    ctx.stroke();
  }

  function handleTouchStart(event: TouchEvent) {
    if (event.touches.length === 1) {
      isDragging = true;
      const touch = event.touches[0];
      const rect = cropCanvas.getBoundingClientRect();
      startX = touch.clientX - rect.left - offsetX;
      startY = touch.clientY - rect.top - offsetY;
    } else if (event.touches.length === 2) {
      lastTouchDistance = getTouchDistance(event.touches);
    }
  }

  function handleTouchMove(event: TouchEvent) {
    event.preventDefault();
    
    if (event.touches.length === 1 && isDragging) {
      const touch = event.touches[0];
      const rect = cropCanvas.getBoundingClientRect();
      offsetX = touch.clientX - rect.left - startX;
      offsetY = touch.clientY - rect.top - startY;
      requestAnimationFrame(drawImage);
    } else if (event.touches.length === 2) {
      const currentDistance = getTouchDistance(event.touches);
      const delta = (currentDistance - lastTouchDistance) * 0.01;
      lastTouchDistance = currentDistance;
      
      const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale * (1 + delta)));
      if (newScale !== scale) {
        scale = newScale;
        requestAnimationFrame(drawImage);
      }
    }
  }

  function getTouchDistance(touches: TouchList) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function handleMouseDown(event: MouseEvent) {
    isDragging = true;
    const rect = cropCanvas.getBoundingClientRect();
    startX = event.clientX - rect.left - offsetX;
    startY = event.clientY - rect.top - offsetY;
  }

  function handleMouseMove(event: MouseEvent) {
    if (!isDragging) return;
    
    const rect = cropCanvas.getBoundingClientRect();
    offsetX = event.clientX - rect.left - startX;
    offsetY = event.clientY - rect.top - startY;
    
    requestAnimationFrame(drawImage);
  }

  function handleMouseUp() {
    isDragging = false;
  }

  function handleWheel(event: WheelEvent) {
    event.preventDefault();
    const delta = -event.deltaY * SCALE_FACTOR;
    const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale * (1 + delta)));
    
    if (newScale !== scale) {
      scale = newScale;
      requestAnimationFrame(drawImage);
    }
  }

  async function cropImage() {
    if (!cropCanvas) return;
    
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = CROP_SIZE;
    tempCanvas.height = CROP_SIZE;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    tempCtx.beginPath();
    tempCtx.arc(CROP_SIZE/2, CROP_SIZE/2, CROP_SIZE/2, 0, Math.PI * 2);
    tempCtx.clip();
    
    const sourceX = (EDITOR_SIZE - CROP_SIZE) / 2;
    const sourceY = (EDITOR_SIZE - CROP_SIZE) / 2;
    tempCtx.drawImage(cropCanvas, sourceX, sourceY, CROP_SIZE, CROP_SIZE, 0, 0, CROP_SIZE, CROP_SIZE);
    
    tempCanvas.toBlob(async (blob) => {
      if (blob) {
        profile.avatarBlob = blob;
        await profileStore.saveProfile(profile);
        isEditing = false;
        isImageLoaded = true;
      }
    }, 'image/jpeg', 0.9);
  }

  async function handleSave() {
    await profileStore.saveProfile(profile);
  }
</script>

{#if isLoading}
  <div class="flex justify-center items-center min-h-[200px]">
    <div class="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
  </div>
{:else}
<div class="max-w-2xl mx-auto bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg p-4 md:p-8 space-y-8 transition-colors dark:border dark:border-border">
  <h1 class="text-2xl md:text-3xl font-bold text-card-foreground text-center dark:text-gray-400">プロフィール設定</h1>
  
  <div class="flex flex-col items-center space-y-8">
    <div class="relative group">
      <div class="relative w-[150px] h-[150px]">
        <!-- プレースホルダー -->
        {#if !isImageLoaded}
          <div class="absolute inset-0 rounded-full bg-muted flex items-center justify-center">
            <Camera class="w-8 h-8 text-muted-foreground" />
          </div>
        {/if}
        
        <img
          src={profile?.avatarUrl || "/userImage/0.webp"}
          alt="プロフィール画像"
          class="w-full h-full rounded-full object-cover border-border transition-all duration-200"
        />
        
        <!-- 編集ボタン -->
        <div class="absolute -right-2 -bottom-2 flex gap-2">
          <Button
            variant="secondary"
            size="icon"
            class="rounded-full shadow-lg"
            on:click={openFileSelector}
          >
            <Pencil class="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
    
    <div class="w-full space-y-6">
      <div class="space-y-2">
        <label for="username" class="text-sm font-medium text-muted-foreground">ユーザー名</label>
        <Input 
          type="text" 
          id="username" 
          bind:value={profile.name} 
          class="bg-background dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700"
        />
      </div>

      <div class="space-y-2">
        <label for="bio" class="text-sm font-medium text-muted-foreground">自己紹介</label>
        <Textarea
          id="bio"
          bind:value={profile.bio}
          class="min-h-[100px] bg-background dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700"
          placeholder="自己紹介を入力してください"
        />
      </div>
      
      <Button class="w-full" on:click={handleSave}>
        保存
      </Button>
    </div>
  </div>
</div>

<Dialog bind:open={isEditing}>
  <DialogContent class="sm:max-w-[425px] p-6 bg-card">
    <DialogHeader>
      <DialogTitle class="text-card-foreground">プロフィール画像の編集</DialogTitle>
    </DialogHeader>
    <div
      bind:this={imageEditor}
      class="relative w-[300px] h-[300px] mx-auto rounded-lg overflow-hidden bg-background dark:bg-slate-900"
      role="presentation"
      on:mousedown={handleMouseDown}
      on:mousemove={handleMouseMove}
      on:mouseup={handleMouseUp}
      on:mouseleave={handleMouseUp}
      on:wheel={handleWheel}
      on:touchstart={handleTouchStart}
      on:touchmove={handleTouchMove}
      on:touchend={handleMouseUp}
    >
      <canvas
        bind:this={cropCanvas}
        width={EDITOR_SIZE}
        height={EDITOR_SIZE}
        class="touch-none"
      />
    </div>
    <div class="mt-6 flex justify-end space-x-2">
      <Button variant="outline" on:click={() => isEditing = false}>
        キャンセル
      </Button>
      <Button on:click={cropImage}>
        確定
      </Button>
    </div>
  </DialogContent>
</Dialog>
{/if}