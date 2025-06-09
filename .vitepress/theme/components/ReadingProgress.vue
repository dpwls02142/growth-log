<template>
  <div class="reading-progress" :style="{ width: `${progress}%` }"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const progress = ref(0)

const calculateProgress = () => {
  const windowHeight = window.innerHeight
  const mainContent = document.querySelector('.vp-doc')
  const commentSection = document.querySelector('.giscus-frame')
  
  if (!mainContent) return
  
  const mainContentHeight = mainContent.offsetHeight
  const mainContentTop = mainContent.offsetTop
  const scrolled = window.scrollY - mainContentTop
  
  const commentTop = commentSection ? commentSection.offsetTop : mainContentHeight
  
  const contentHeight = commentTop - mainContentTop
  
  if (scrolled < 0) {
    progress.value = 0
  } else if (scrolled > contentHeight) {
    progress.value = 100
  } else {
    progress.value = (scrolled / contentHeight) * 100
  }
}

onMounted(() => {
  window.addEventListener('scroll', calculateProgress)
  calculateProgress()
})

onUnmounted(() => {
  window.removeEventListener('scroll', calculateProgress)
})
</script>

<style scoped>
.reading-progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background-color: var(--vp-c-brand);
  z-index: 100;
  transition: width 0.1s ease;
}
</style> 