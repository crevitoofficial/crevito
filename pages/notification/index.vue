<template>
  <view class="page">
    <cus-header :title="($t('mine.notification'))"></cus-header>
    <!-- 页面背景 -->
    <view class="page_bg" :style="{ backgroundColor: config['theme-bg-color'] }">
      <image
        v-if="config.homebg"
        style="width: 100%; height: 100%"
        :src="config.homebg"
      />
    </view>
    <!-- 页面内容 -->
    <view class="content plr30">
      <view
        class="item flex-row ai-center"
          :style="{ backgroundColor: config['theme-bg-color2'] }"
        v-for="item in notiList"
        :key="item.id"
        @click="() => goToNotDetail(item)"
      >
        <view class="left">
          <uni-icons type="notification" :size="24" :color="config['theme-text-color']"></uni-icons>
        </view>
        <view class="center">
          <view class="title" :style="{color:config['theme-text-color']}">
            {{ item.title }}
          </view>
          <view class="time">
            {{ item.create_time }}
          </view>
        </view>
        <view class="right">
          <uni-icons type="forward" :size="20" color="#999"></uni-icons>
        </view>
      </view>
      <view class="flex-center" style="margin-top: 30rpx;color: #999;">{{isHasMore ? $t('common.loadmore') : $t('common.nomore')}}</view>
    </view>
  </view>
</template>
<script>
import { lists, info } from '../../api/show'

export default {
  data() {
    return {
      config: {},
      notiList:[],
      page: 1,
      isHasMore:true
    }
  },
  onLoad() {
    this.config = uni.getStorageSync('config')
    this.getList()
  },
  onReachBottom() {
    if (this.isHasMore) {
        this.page = Number(this.page) + 1;
        this.getList();
      }
  },
  methods: {
    goToNotDetail(item) {
      uni.navigateTo({
        url: `/pages/notification/detail?id=${item.id}`,
      });
    },
    getList() {
      lists({page: this.page}).then((res) => {
        this.notiList = this.notiList.concat(res.data.list)
        if(this.page == res.data.pages) {
          this.isHasMore = false
        }
      })
    },
    getDetail() {

    }
  }
}
</script>
<style lang='scss' scoped>
.page {
  .page_bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: -1;
  }
  .content {
    margin-top: 30rpx;
    .item {
        border-radius: 30rpx;
        margin-bottom: 30rpx;
        padding: 40rpx 0;
        .left {
          padding: 0 30rpx;
        }
        .center {
          .title {
            font-size: 32rpx;
          }
          .time {
            font-size: 26rpx;
            color: #666;
            margin-top: 10rpx;
          }
        }
        .right {
          padding: 0 30rpx;
          margin-left: auto;
        }
      }
  }
}
</style>

