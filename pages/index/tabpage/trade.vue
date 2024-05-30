<template>
  <view class="page">
    <cus-header :showBack="false" :title="$t('tabbar.trade')"></cus-header>
    <view class="content">
      <view class="head plr30">
        <view
          class="notice flex-row ai-center"
          :style="{ color: config['theme-text-color'] }"
        >
          <view class="nicon mr20 flex-center">
            <text class="iconfont" style="font-size: 40rpx">&#xe61e;</text>
          </view>
          <view class="flex-1 flex-row" style="overflow: hidden">
            <text
              id="animate"
              class="desc"
              :style="{ animationDuration: `${aniDuration}s` }"
              >{{ notice ? notice.title : $t("trades.no_announcement") }}</text
            >
          </view>
        </view>
        <view class="banner">
          <swiper
            style="height: 100%"
            :indicator-dots="true"
            :autoplay="true"
            :interval="5000"
            :duration="1000"
            :circular="true"
          >
            <swiper-item v-for="(item, index) in banner" :key="index">
              <image style="width: 100%; height: 100%" :src="item.logo" />
            </swiper-item>
          </swiper>
        </view>
      </view>
      <view
        class="list"
        :style="{ backgroundColor: config['theme-bg-color2'] }"
      >
        <block v-if="goods.length">
          <trade-card v-for="item in goods" :key="item.id" :info="item" @purchase="showBuy"></trade-card>
        </block>
        <view v-else class="flex-center" style="height: 400rpx">
          {{ $t("common.noData") }}
        </view>
        <view v-if="goods.length" class="flex-center" style="margin-top: 30rpx; color: #999">{{
          isHasMore ? $t("common.loadmore") : $t("common.nomore")
        }}</view>
      </view>
    </view>
    <uni-popup ref="popup" type="center">
      <view class="area" :style="{backgroundColor: config['theme-bg-color2'],color:config['theme-text-color']}">
        <view class="title flex-center">{{$t('trades.purchase')}}</view>
        <view class="param">
          <view class="label">{{$t('trades.purchase_quantity')}}</view>
          <input
            class="input"
            :style="{color:config['theme-text-color']}"
            v-model="params.buy_account"
            type="number"
            :placeholder="($t('trades.enter_purchase'))"
          />
        </view>
        <view class="param">
          <view class="label">{{$t('common.payment_password')}}</view>
          <input
            class="input"
            :style="{color:config['theme-text-color']}"
            type="password"
            v-model="params.paypwd"
            :placeholder="($t('common.enter_password'))"
          />
        </view>
        <view class="confirm flex-center" :style="{color: config['theme-btn-color'],backgroundColor: config['theme-btn-bgcolor']}" @click="submit">
          {{$t('trades.confirm')}}
        </view>
      </view>
    </uni-popup>
  </view>
</template>
<script>
import { lists as goodList, index } from "../../../api/good";
import { good_dobuy } from "../../../api/mine";
import Validate from "../../../utils/validate";

export default {
  props: {
    reachBottomSign: {
      type: Number,
    },
  },
  data() {
    return {
      config: {},
      banner: [],
      goods: [],
      aniDuration: 0,
      notice: {},
      page: 1,
      isHasMore: true,
      params: {
        good_id: "",
        buy_account: "",
        paypwd: "",
      },
    };
  },
  watch: {
    reachBottomSign() {
      if (this.isHasMore) {
        this.page = Number(this.page) + 1;
        this.getGoodList();
      }
    },
  },
  created() {
    this.config = uni.getStorageSync("config");
    this.getGoodList();
    this.getIndex();
  },
  mounted() {
    this.$nextTick(() => {
      const query = uni.createSelectorQuery().in(this);
      query
        .select("#animate")
        .boundingClientRect((data) => {
          this.aniDuration = data.width / 30;
        })
        .exec();
    });
  },
  methods: {
    // 显示申购弹窗
    showBuy(item) {
      this.params = {
        good_id: "",
        buy_account: "",
        paypwd: "",
      }
      this.params.good_id = item.id;
      this.$refs.popup.open();
    },

    // 提交申购
    submit() {
      let valid = new Validate();
      let result = valid.test({
        buy_account: [
          {
            rule: "isRequired",
            value: this.params.buy_account,
            message: this.$t("trades.valid_quatity"),
          },
          {
            rule: "isNumber",
            value: this.params.buy_account,
            message: this.$t("trades.valid_quatity2"),
          },
        ],
        paypwd: [
          {
            rule: "isRequired",
            value: this.params.paypwd,
            message: this.$t("trades.valid_paypwd"),
          },
        ],
      });
      if (result) {
        uni.showToast({
          title: result.errMsg,
          duration: 3000,
          icon: "none",
        });
      } else {
        good_dobuy(this.params).then((res) => {
          if (res.code == 1) {
            uni.showToast({
              title: res.msg,
              duration: 2000,
            });
            this.$refs.popup.close();
          }
        });
      }
    },

    // 获取理财数据
    getIndex() {
      index({}).then((res) => {
        this.banner = res.data.banner;
        if (res.data.news.length) {
          this.notice = res.data.news[0];
        } else {
          this.notice = null;
        }
      });
    },

    // 获取产品列表
    getGoodList() {
      goodList({ page: this.page }).then((res) => {
        this.goods = this.goods.concat(res.data.list);
        if (this.page == res.data.pages) {
          this.isHasMore = false;
        }
      });
    },

    // 跳转详情
    toDetail(id) {
      uni.navigateTo({
        url: `/pages/tradeDetail/index?id=${id}`,
      });
    },
  },
};
</script>
<style lang='scss' scoped>
.page {
  .content {
    .head {
      .banner {
        width: 100%;
        height: 260rpx;
        border-radius: 14rpx;
        overflow: hidden;
      }
      .notice {
        width: 100%;
        height: 80rpx;
        margin-bottom: 20rpx;
        box-sizing: border-box;
        .nicon {
          background-color: #fff;
          width: 80rpx;
          height: 80rpx;
          border-radius: 50%;
        }
        .desc {
          padding-left: 90%;
          animation-name: notice;
          animation-timing-function: linear;
          animation-delay: 0s;
          animation-iteration-count: infinite;
          white-space: nowrap;
          transform: translate3d(-100px, 0, 0);
        }
      }
      @keyframes notice {
        0% {
          transform: translate3d(0, 0, 0);
        }
        100% {
          transform: translate3d(-100%, 0, 0);
        }
      }
    }
    .list {
      border-radius: 30rpx;
      padding: 30rpx;
      margin-top: 40rpx;
      padding-bottom: 160rpx;
      .project {
        margin-top: 60rpx;
        height: 100rpx;
        font-size: 40rpx;
        font-weight: bold;
        line-height: 100rpx;
        border-bottom: 1px solid transparent;
      }
      .item {
        padding: 30rpx;
        border-bottom: 1px solid transparent;
        .img {
          width: 200rpx;
          margin-right: 20rpx;
          margin-top: 10rpx;
          height: 128rpx;
        }
        .info {
          font-size: 22rpx;
          .progress {
            width: 100%;
            height: 18rpx;
            margin-top: 20rpx;
            border: 1px solid transparent;
            border-radius: 20rpx;
            .percent {
              width: 0;
              height: 100%;
              border-radius: 20rpx;
              transition: all 1s;
            }
          }
        }
      }
      .item:last-child {
        border: none;
      }
    }
  }
  .area {
    width: 600rpx;
    overflow: hidden;
    padding: 20rpx;
    border-radius: 20rpx;
    box-sizing: border-box;
    .title {
      font-size: 32rpx;
      font-weight: bold;
      padding: 10rpx 0;
      margin-bottom: 30rpx;
    }
    .param {
      margin-bottom: 50rpx;
      .label {
        margin-bottom: 10rpx;
      }
      .input {
        width: 100%;
        height: 100rpx;
        border-radius: 10rpx;
        border: 1px solid #999;
        margin-bottom: 20rpx;
        padding: 0 30rpx;
        box-sizing: border-box;
      }
    }
    .confirm {
      border-radius: 14rpx;
      font-size: 30rpx;
      width: 300rpx;
      height: 70rpx;
      margin-left: 50%;
      transform: translateX(-50%);
    }
  }
}
</style>
