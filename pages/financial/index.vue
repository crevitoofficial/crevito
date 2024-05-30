<template>
  <view class="page">
    <cus-header :title="$t('mine.financial_list')"></cus-header>
    <!-- 页面背景 -->
    <view class="page_bg" :style="{ backgroundColor: config['theme-bg-color'] }">
      <image
          v-if="config.homebg"
          style="width: 100%; height: 100%"
          :src="config.homebg"
      />
    </view>
    <!-- 页面内容 -->
    <view class="content-wrapper">
      <uni-card is-shadow v-for="item in financial" :key="item.id">
        <uni-collapse>
          <uni-collapse-item titleBorder="none">
            <template v-slot:title>
              <uni-row>
                <uni-col :span="12">
                  <span class="title">{{$t('mine.title')}}:</span>
                  {{ item.title }}
                </uni-col>
                <uni-col :span="12">
                  <span class="title">{{$t('mine.status')}}:</span>
                  {{ item.status }}
                </uni-col>
              </uni-row>
              <uni-row>
                <uni-col :span="12">
                  <span class="title">{{$t('mine.time')}}:</span>
                  {{item.time}}
                </uni-col>
                <uni-col :span="12">
                  <span class="title">{{$t('mine.rate')}}:</span>
                  {{item.rate}}
                </uni-col>
              </uni-row>
            </template>
            <view class="content">
              <uni-row>
                <uni-col :span="12">
                  <span class="title">{{$t('mine.earning')}}:</span>
                  {{item.rate_account}}
                </uni-col>
                <uni-col :span="12" style="margin-left: -30rpx;">
                  <span class="title">{{$t('mine.lock')}}:</span>
                  {{item.lock}}
                </uni-col>
              </uni-row>
              <uni-row>
                <uni-col :span="24">
                  <span class="title">{{$t('mine.buy_account')}}:</span>
                  {{item.buy_account}}
                </uni-col>
              </uni-row>
              <uni-row>
                <uni-col :span="24">
                  <span class="title">{{$t('guide.create_time')}}:</span>
                  {{item.create_time}}
                </uni-col>
              </uni-row>
              <uni-row>
                <uni-col :span="24">
                  <span class="title">{{$t('mine.table_type')}}:</span>
                  {{item.play_type}}
                </uni-col>
              </uni-row>
            </view>
          </uni-collapse-item>
        </uni-collapse>
      </uni-card>
      <view class="flex-center" style="margin-top: 30rpx;color: #999;">{{isHasMore ? $t('common.loadmore') : $t('common.nomore')}}</view>
    </view>
  </view>
</template>

<script>
import { goodorder } from '../../api/mine'

export default {
  name: "Financial",
  components: {},

  data() {
    return {
      config: {},
      financial:[],
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
    getList() {
      goodorder({page:this.page}).then((res) => {
        this.financial = this.financial.concat(res.data.list)
        if(this.page == res.data.pages) {
          this.isHasMore = false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page {

  .page_bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: -1;
  }

  .content-wrapper{
    height: calc(100vh - 80rpx);
    overflow: auto;

    .uni-card{
      border-radius: 40rpx;
      margin-bottom: 20rpx;

      .title{
        margin-right: 10rpx;
        font-weight: bolder;
        color: #3a3a3a;
      }
    }
  }
}
</style>
