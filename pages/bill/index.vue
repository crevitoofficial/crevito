<template>
  <view class="page">
    <cus-header :title="($t('mine.bill_list'))"></cus-header>
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
      <uni-card is-shadow v-for="item in billList" :key="item.id">
        <uni-collapse>
          <uni-collapse-item titleBorder="none">
            <template v-slot:title>
              <uni-row>
                <uni-col :span="12">
                  <span class="title">{{$t('mine.expect')}}:</span>
                  {{ item.expect }}
                </uni-col>
                <uni-col :span="12">
                  <span class="title">{{$t('mine.status')}}:</span>
                  {{ item.status }}
                </uni-col>
              </uni-row>
              <uni-row>
                <uni-col :span="12">
                  <span class="title">{{$t('mine.time')}}:</span>
                  {{item.sel_name}}
                </uni-col>
                <uni-col :span="12">
                  <span class="title">{{$t('mine.rate')}}:</span>
                  {{item.sel_odd}}
                </uni-col>
              </uni-row>
            </template>
            <view class="content">
              <uni-row>
                <uni-col :span="12">
                  <span class="title">{{$t('mine.draw')}}:</span>
                  {{item.isdraw}}
                </uni-col>
                <uni-col :span="12" class="flex-row" style="margin-left: -30rpx;">
                  <span class="title">{{$t('mine.all_account')}}:</span>
                  <view v-html="item.all_account"></view>
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
                  <span class="title">{{$t('mine.table_type')}}:</span>
                  {{item.create_time}}
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
import { gameorder } from '../../api/mine'

export default {
  name: "Bill",
  data() {
    return {
      config: {},
      billList:[],
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
      gameorder({page: this.page}).then((res) => {
        this.billList = this.billList.concat(res.data.list)
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

      .title{
        margin-right: 10rpx;
        font-weight: bolder;
        color: #3a3a3a;
      }
    }
  }
}
</style>
