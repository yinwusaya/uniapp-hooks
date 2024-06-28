<template>
  <view ref="mainRef" class="h-full flex flex-col" >
    <view class="flex-1">
      <slot name="content" :dataList="dataList" />
      <!-- <view v-for="item,index in dataList" :key="index" class="h-200px">
        {{ item }}
      </view> -->
    </view>
    <view class="w-full text-center" v-if="listStatus !== 'NO_MORE'">
      <uv-loading-icon class="more-loading"></uv-loading-icon>
    </view>
  </view>
</template>

<script setup lang="ts">
type PageListStatus = 'INIT' | 'REFRESH' | 'MORE' | 'NO_MORE'
import { useObserver } from '@/hooks/useObserver';
const props = defineProps({
  url: String,
  searchParams: Object
})

const dataList = ref<any[]>([])
// const searchParams = defineModel<Record<string,any>>('searchParams')
const listStatus= ref<PageListStatus>('INIT')
const pageParams = reactive({
  pageNo:1,
  pageSize: 10
})
const mainRef = ref()
const { observeShow, init, reObserve } = useObserver('.more-loading', mainRef)
watch(() => props.searchParams,() => {
  queryReset()
})
function queryReset() {
  dataList.value = []
  pageParams.pageNo = 1
  getPageData()
  listStatus.value = 'REFRESH'
}
watch(observeShow,() => {
  if (observeShow.value) {
    getPageData()
    listStatus.value = 'MORE'
  } else {

  }
},{immediate: true})
onMounted(() => {
  // init()
  queryReset()
})

function getPageData() {
  if (!props.url) return
  if (listStatus.value !== 'INIT') return
  uni.$uv.http.get(props.url,{
    ...pageParams,
    ...props.searchParams
  }).then((res) => {
    dataList.value = [...dataList.value,...res.records]
    if (res.totalPage === res.pageNumber) {
      // 是最后一页
      listStatus.value = 'NO_MORE'
    } else if (res.records.length === res.pageSize) {
      pageParams.pageNo ++
      nextTick(() => {
        reObserve()
      })
      listStatus.value = "INIT"
    }
  }).catch(() => {
    listStatus.value = "INIT"
  })
}
</script>

<style scoped>

</style>