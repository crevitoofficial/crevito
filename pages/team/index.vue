<template>
  <view class="page">
    <cus-header :title="($t('mine.team'))"></cus-header>
    <!-- 页面背景 -->
    <view class="page_bg" :style="{ backgroundColor: config['theme-bg-color'] }">
      <image
        v-if="config.homebg"
        style="width: 100%; height: 100%"
        :src="config.homebg"
      />
    </view>
    <view class="content plr30">
      <view class="number" :style="{ backgroundColor: config['theme-bg-color2'] }">
        <view class="flex-col ai-center">
          <view>{{$t('mine.team_num')}}</view>
          <view class="num" :style="{ color: config['theme-text-color'] }">{{teamNum}}</view>
        </view>
        <view class="levels flex-row">
          <view class="litem flex-1 flex-col ai-center" v-for="item,index in levels" :key="index">
            <view
              class="top flex-center"
              :style="{ backgroundColor: config['theme-btn-bgcolor'],color: config['theme-btn-color'] }"
              >Level {{item._level}}</view
            >
            <view :style="{ color: config['theme-text-color']}">{{item._num}}</view>
          </view>
        </view>
      </view>
      <view class="teams" :style="{ backgroundColor: config['theme-bg-color2'] }">
        <view class="title flex-center">{{$t('mine.promotion_record')}}</view>
        <view v-if="list.length" class="list">
          <view class="item" v-for="(item,index) in list" :key="index">
            <view class="flex-row jc-between" v-if="item.username">
               <view style="color: #feb140">Number：<span style="color: #fff">{{item.username}}</span></view>
              <view style="color: #feb140">Commission：<span style="color: #fff">{{item.tatol}}</span></view>
              <view style="color: #feb140">Registration time：<span style="color: #fff">{{item.tatol}}</span></view>
            </view>
            <!-- <view style="margin-top: 30rpx;">
              <rich-text  :nodes="item.cm_"></rich-text>
            </view> -->
          </view>
          
        </view>
        <view v-else class="empty flex-center">{{$t('common.noData')}}</view>
      </view>
      <view class="flex-center" style="margin-top: 30rpx;color: #999;">{{isHasMore ? $t('common.loadmore') : $t('common.nomore')}}</view>
    </view>
  </view>
</template>
<script>
import { team, cmlog } from "../../api/share";

export default {
  data() {
    return {
      config: {},
      page: 1,
      levels: [],
      list: [],
      teamNum: 0,
      isHasMore: true
    };
  },
  onLoad() {
    this.config = uni.getStorageSync("config");
    this.getTeam();
    this.getCmlog();
  },
  onReachBottom() {
    if (this.isHasMore) {
        this.page = Number(this.page) + 1;
        this.getCmlog();
      }
  },
  methods: {
    // 获取团队
    getTeam() {
      team({}).then((res) => {
        this.teamNum = res.data.myteam_num
        this.levels = res.data.leve
      });
    },

    // 获取推广佣金记录
    getCmlog() {
      cmlog({ page: this.page }).then((res) => {
        this.list =this.list.concat(res.data.list)
        if(this.page == res.data.pages) {
          this.isHasMore = false
        }
      });
    },
  },
};
</script>
<style lang='scss' scoped>
.page {
  color: #ddd;
  padding-bottom: 30rpx;
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
    .number {
      padding: 30rpx 30rpx;
      border-radius: 20rpx;
      font-size: 30rpx;
      .num {
        font-size: 60rpx;
        font-weight: bold;
        margin-top: 20rpx;
      }
    }
    .levels {
      margin-top: 40rpx;
      .litem {
        .top {
          width: 180rpx;
          height: 60rpx;
          border-radius: 10rpx;
          color: #fff;
          margin-bottom: 20rpx;
        }
      }
    }
    .teams {
      border-radius: 20rpx;
      margin-top: 30rpx;
      padding-bottom: 30rpx;
      .title {
        font-size: 40rpx;
        font-weight: bold;
        height: 100rpx;
        border-bottom: 1px solid #999;
      }
      .list {
        .item {
          color: #999;
          padding: 30rpx;
          border-bottom: 1px solid #999;
        }
      }
      .empty{
        height: 300rpx;
      }
    }
  }
}
</style>


