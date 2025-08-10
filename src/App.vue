<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  // 1) Remove common build badge elements by selector
  const selectors = [
    '.build-badge',
    '[data-build-badge]',
    '.badge.build',
    '.badge[data-build]',
    '.badge--build',
    '#build',
    '[data-build]',
    '.build'
  ]
  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => el.remove())
  })

  // 2) Fallback: hide any fixed element whose text looks like "BUILD v7"
  document.querySelectorAll('body *').forEach(el => {
    try {
      const style = getComputedStyle(el)
      if (
        style.position === 'fixed' &&
        /\bBUILD\b/i.test(el.textContent || '')
      ) {
        el.style.setProperty('display', 'none', 'important')
        el.style.setProperty('visibility', 'hidden', 'important')
        el.remove() // final fallback
      }
    } catch {}
  })
})
</script>

<style>
/* keep as a belt-and-braces fallback */
.build-badge,
[data-build-badge],
.badge.build,
.badge[data-build],
.badge--build,
#build,
[data-build],
.build {
  display: none !important;
  visibility: hidden !important;
}
</style>

