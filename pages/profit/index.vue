<template>
  <view class="page">
    <cus-header :title="$t('mine.profit')"></cus-header>
    <!-- 页面背景 -->
    <view
      class="page_bg"
      :style="{ backgroundColor: config['theme-bg-color'] }"
    >
      <image
        v-if="config.homebg"
        style="width: 100%; height: 100%"
        :src="config.homebg"
      />
    </view>
    <uni-card
      class="container"
      :style="{ backgroundColor: config['theme-bg-color2'] }"
      :border="false"
      shadow="0px 0px 3px 1px rgba(0, 0, 0, 0)"
    >
      <view class="flex-center jc-between">
        <uni-datetime-picker v-model="range" type="daterange" />
        <uni-icons
          class="ml20"
          type="search"
          size="30"
          @click="search"
        ></uni-icons>
      </view>
      <uni-row class="rtx-wrapper">
        <uni-col :span="12">
          <uni-card
            style="margin: 20rpx 20rpx 0 0"
            :border="false"
            shadow="0px 0px 3px 1px rgba(0, 0, 0, 0)"
          >
            <view class="rtx-title">{{ $t("mine.base_income") }}</view>
            <view
              :style="{ color: config['theme-text-color'], fontSize: '34rpx' }"
            >
              {{ this.profit.ex_ }}
              <span class="ml10">{{ this.config.unit }}</span>
            </view>
          </uni-card>
        </uni-col>
        <uni-col :span="12">
          <uni-card
            style="margin: 20rpx 0 0 20rpx"
            :border="false"
            shadow="0px 0px 3px 1px rgba(0, 0, 0, 0)"
          >
            <view class="rtx-title">{{ $t("mine.promotion_income") }}</view>
            <view
              :style="{ color: config['theme-text-color'], fontSize: '34rpx' }"
            >
              {{ this.profit.cm_ }}
              <span class="ml10">{{ this.config.unit }}</span>
            </view>
          </uni-card>
        </uni-col>
      </uni-row>
<!--      <uni-row class="rtx-wrapper">-->
<!--        <uni-col :span="12">-->
<!--          <uni-card-->
<!--            style="margin: 20rpx 20rpx 0 0"-->
<!--            :border="false"-->
<!--            shadow="0px 0px 3px 1px rgba(0, 0, 0, 0)"-->
<!--          >-->
<!--            <view class="rtx-title">{{ $t("mine.coin_income") }}</view>-->
<!--            <view-->
<!--              :style="{ color: config['theme-text-color'], fontSize: '34rpx' }"-->
<!--            >-->
<!--              {{ this.profit.yb_ }}-->
<!--              <span class="ml10">{{ this.config.unit }}</span>-->
<!--            </view>-->
<!--          </uni-card>-->
<!--        </uni-col>-->
<!--        <uni-col :span="12">-->
<!--          <uni-card-->
<!--            style="margin: 20rpx 0 0 20rpx"-->
<!--            :border="false"-->
<!--            shadow="0px 0px 3px 1px rgba(0, 0, 0, 0)"-->
<!--          >-->
<!--            <view class="rtx-title">{{ $t("mine.trade_income") }}</view>-->
<!--            <view-->
<!--              :style="{ color: config['theme-text-color'], fontSize: '34rpx' }"-->
<!--            >-->
<!--              {{ this.profit.up_ }}-->
<!--              <span class="ml10">{{ this.config.unit }}</span>-->
<!--            </view>-->
<!--          </uni-card>-->
<!--        </uni-col>-->
<!--      </uni-row>-->
      <view
        class="list-title"
        >{{ $t("mine.profit_list") }}</view
      >
      <uni-card style="border-radius: 20rpx;" margin="0px 0px 30rpx 0" v-for="item in profitList" :key="item.id">
        <uni-collapse>
          <uni-collapse-item titleBorder="none">
            <template v-slot:title>
              <uni-row>
                <uni-col :span="24">
                  <span class="title">{{ $t("mine.table_type") }}:</span>
                  {{ item.type }}
                </uni-col>
              </uni-row>
              <uni-row>
                <uni-col :span="24">
                  <span class="title">{{ $t("mine.table_status") }}:</span>
                  {{ item.status }}
                </uni-col>
              </uni-row>
            </template>
            <view class="content">
              <uni-row>
                <uni-col :span="24">
                  <span class="title">{{ $t("mine.table_account") }}:</span>
                  {{ item.account }}
                </uni-col>
              </uni-row>
              <uni-row>
                <uni-col :span="24">
                  <span class="title">{{ $t("mine.table_time") }}:</span>
                  {{ item.create_time }}
                </uni-col>
              </uni-row>
            </view>
          </uni-collapse-item>
        </uni-collapse>
      </uni-card>
      <view class="flex-center" style="margin-top: 30rpx;color: #999;">{{isHasMore ? $t('common.loadmore') : $t('common.nomore')}}</view>
    </uni-card>
  </view>
</template>
<script>
import { balancelog } from "../../api/mine";

export default {
  data() {
    return {
      config: {},
      range: [],
      params: {
        page: 1,
        startime: "",
        endtime: "",
      },
      total: 0,
      profit: [],
      profitList: [],
      isHasMore: true,
    };
  },
  onLoad() {
    this.config = uni.getStorageSync("config");
    this.getTableData();
  },
  onReachBottom() {
    if (this.isHasMore) {
        this.params.page = Number(this.params.page) + 1;
        this.getTableData();
      }
  },
  methods: {
    search() {
      this.getTableData();
    },
    // changePage(e) {
    //   this.params.page = e.current;
    //   this.getTableData();
    // },
    getTableData() {
      this.params.startime = this.range[0] || "";
      this.params.endtime = this.range[1] || "";
      balancelog(this.params).then((res) => {
        const { data } = res;
        this.total = data.count;
        this.profit = data;
        this.profitList = this.profitList.concat(data.list)
        if(this.params.page == res.data.pages) {
          this.isHasMore = false
        }
      });
    },
  },
};
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
}
.container {
  border-radius: 20rpx;
  .list-title {
    font-size: 36rpx;
    font-weight: bold;
    color: #ddd;
    margin: 60rpx 0 30rpx 0;
  }
  .rtx-wrapper {
    margin-top: 20rpx;
    .uni-card {
      border-radius: 20rpx;
      margin: 0;
      text-align: center;

      .rtx-title {
        margin-bottom: 30rpx;
        font-size: 24rpx;
      }
    }
  }

  .uni-collapse {
    .title {
      margin-right: 10rpx;
      font-weight: bolder;
      color: #3a3a3a;
    }
  }
}
</style>


