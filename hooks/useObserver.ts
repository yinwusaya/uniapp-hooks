import { MaybeRef, MaybeRefOrGetter, VueElement } from "vue"


export function useObserver(refClass:string,target:MaybeRefOrGetter) {
  watch(() => unref(target)?.$el, ele => !ele && init())
  let contentObserver: any = null
  const observeShow = ref(0)
  const thresholdValue = 50
  function init() {
    contentObserver = uni.createIntersectionObserver(unref(target))
    contentObserver.relativeToViewport({
      bottom: thresholdValue
    }).observe(`${refClass}`, (res) => {
      if (res.intersectionRatio > 0) {
        contentObserver && contentObserver.disconnect()
        // 懒加载状态改变
        observeShow.value++
        contentObserver = null
      }
    })
  }
  // 重新监听
  function reObserve() {
    contentObserver = uni.createIntersectionObserver(unref(target))
    contentObserver.observe(`${refClass}`, (res) => {
      if (res.intersectionRatio > 0) {
        contentObserver && contentObserver.disconnect()
        // 懒加载状态改变
        observeShow.value++
        contentObserver = null
      }
    })
  }
  function resetObserveShow() {
    observeShow.value = 0
  }
  return {
    observeShow,
    reObserve,
    init,
    resetObserveShow
  }
} 