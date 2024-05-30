<template>
  <view class="page">
    <!-- 自定义导航栏，参考：https://uniapp.dcloud.io/component/uniui/uni-nav-bar.html#%E4%BB%8B%E7%BB%8D -->
    <uni-nav-bar
      :border="false"
      color="#ddd"
      backgroundColor="transparent"
      height="160rpx"
      leftWidth="450rpx"
      rightWidth="300rpx"
    >
      <view slot="left">
        <view class="flex-row ai-center">
          <image style="width: 100rpx; height: 100rpx" :src="config.logo" />
          <view class="user flex-col">
            <text class="title">{{ user.username }}</text>
            <text>{{ `${$t("common.welcome")} ${config.name}` }} </text>
          </view>
        </view>
      </view>
      <view slot="right">
        <view class="btn flex-row ai-center">
          <view class="lang flex-center" :style="{ backgroundColor: config['theme-bg-color1'] }" @click="showLang">
            <image style="width: 40rpx" :src="curLang.logo" mode="widthFix" />
            <view
              class="list"
              :style="{
                height: listHeight + 'rpx',
                color: '#333'
              }"
            >
              <view
                class="item flex-row ai-center"
                v-for="(item, index) in langs"
                :key="index"
                @click.stop="chooseLang(item)"
              >
                <image
                  style="width: 40rpx; margin-right: 20rpx"
                  :src="item.logo"
                  mode="widthFix"
                />
                <text>{{ item.content }}</text>
              </view>
            </view>
          </view>
          <view class="icon flex-center" :style="{ backgroundColor: config['theme-bg-color1'] }" @click="() => goToPage('notification')"
            ><text class="iconfont">&#xe8bd;</text></view
          >
          <view class="icon flex-center" :style="{ backgroundColor: config['theme-bg-color1'] }" @click="goService"
            ><text class="iconfont">&#xe61b;</text></view
          >
        </view>
      </view>
    </uni-nav-bar>
    <!-- 余额 -->
    <view class="balance plr30">
      <view>{{ $t("mine.total_balance") }}</view>
      <view class="num flex-row ai-center jc-between">
        <view>
          <text class="total mr10">{{ balance.left }}</text>
          <text>{{ config.unit }}</text>
        </view>
        <view>
          <text v-if="balance.right >= 0" :style="{ color: 'green' }">+</text>
          <text v-else :style="{ color: 'red' }">-</text>
          <text class="profit mr10 ml10">{{ Math.abs(balance.right) }}</text>
          <text style="font-size: 24rpx">{{ config.unit }}</text>
        </view>
      </view>
    </view>
    <!-- 菜单 -->
    <view class="menu">
      <swiper class="swiper" :autoplay="false" @change="changeSwiper">
        <swiper-item v-for="(item, index) in menu" :key="index">
          <view class="item-wrap flex-row ai-center">
            <view
              class="swiper-item flex-col ai-center cursor"
              v-for="(itm, idx) in item"
              :key="idx"
              @click="pageTo(itm.path)"
            >
              <view
                class="icon-wrap flex-center"
                :style="{
                  backgroundColor:
                    config[
                      `theme-icon-bgcolor${index > 0 ? item.length + idx : idx}`
                    ],
                }"
              >
                <text
                  class="iconfont"
                  style="font-size: 50rpx"
                  :style="{ color: config['theme-icon-color'] }"
                >
                  {{ itm.icon }}
                </text>
              </view>
              <text :style="{ color: config['theme-icon-color'] }">{{ itm.title }}</text>
            </view>
          </view>
        </swiper-item>
      </swiper>
    </view>
    <view class="panigation flex-center">
      <view
        :class="['dot', 'ml10', curDot == index ? 'active' : '']"
        :style="{
          borderColor: curDot == index ? config['theme-btn-bgcolor'] : '#ddd',
        }"
        v-for="(item, index) in menu.length"
        :key="index"
      ></view>
    </view>
    <!-- 图表 -->
    <view
      class="market plr30"
      :style="{ backgroundColor: config['theme-bg-color2'] }"
    >
      <view class="title">
        <text style="font-size: 40rpx; font-weight: bold">{{
          $t("home.market_situation")
        }}</text>
        <!-- <text class="ml10" style="font-size: 24rpx; color: red">{{
          $t("home.market_situation")
        }}</text> -->
      </view>
      <view
        class="cur-item flex-row ai-center jc-between"
        :style="{ backgroundColor: config['theme-bg-color1'], boxShadow: `0 0 10px ${config['theme-box-shadow']}` }"
      >
        <view class="flex-row ai-center">
          <image :src="market.logo" style="width: 80rpx; height: 80rpx" />
          <view class="ml20 flex-col">
            <text style="font-size: 30rpx; font-weight: bold">{{
              market.title
            }}</text>
            <text style="font-size: 24rpx; color: #999">{{
              market.title2
            }}</text>
          </view>
        </view>
        <view class="ml20 flex-row ai-center" style="overflow: hidden">
          <view class="mr20 flex-row ai-center" style="font-size: 34rpx">
            <text>{{ market.close }}</text>
          </view>
          <view class="flex-row ai-center" style="color: #666">
            <text v-if="market.status >= 0" :style="{ color: 'green' }">+</text>
            <text v-else :style="{ color: 'red' }">-</text>
            <text>{{ Math.abs(market.status) }}</text>
          </view>
        </view>
      </view>
      <view class="join_button">
        <view  @click="goGroup" class="item">
          <view class="img_box">
            <image
                    style="width: 100%;height: 100%"
                    src="/static/images/join.png"
                    mode="aspectFill"
                    class="kefu-img2"
            />
          </view>
          <view>{{$t("home.join_the_group")}}</view>
        </view>
        <view  @click="goService" class="item">
          <view class="img_box">
            <image
                    style="width: 88%;height: 88%"
                    src="/static/images/customer_service.png"
                    mode="aspectFill"
                    class="kefu-img2"
            />
          </view>
          <view>{{$t("home.customer_service")}}</view>
          </view>
      </view>
<!--      <view class="charts-box">-->
<!--        &lt;!&ndash; 图表配置再config-ucharts.js里配置，demotype就是你需要自定义配置的效果 &ndash;&gt;-->
<!--        <qiun-data-charts type="demotype" :chartData="chartData" />-->
<!--      </view>-->
    </view>
    <!-- banner -->
    <view
      class="banner"
      :style="{ backgroundColor: config['theme-bg-color2'] }"
    >
      <!-- <view style="font-size: 40rpx; font-weight: bold; margin-left: 30rpx">
        {{ $t("home.advertising") }}
      </view> -->
      <swiper
        class="swiper"
        :autoplay="false"
        previous-margin="30rpx"
        next-margin="30rpx"
        @change="changeBanSwiper"
      >
        <swiper-item
          class="flex-center"
          v-for="(item, index) in homead"
          :key="index"
        >
          <view class="swiper-item">
            <image :src="item.logo" style="width: 100%; height: 100%" />
          </view>
        </swiper-item>
      </swiper>
      <view class="panigation flex-center">
        <view
          :class="['dot', 'ml10', curBanDot == index ? 'active' : '']"
          :style="{
            borderColor: curDot == index ? config['theme-btn-color'] : '#ddd',
          }"
          v-for="(item, index) in homead.length"
          :key="index"
        ></view>
      </view>
    </view>
    <!-- 描述介绍 -->
    <view
      class="join flex-col ai-center"
      :style="{ backgroundColor: config['theme-bg-color2'] }"
    >
      <view class="title">{{ $t("home.desc_title") }}</view>
      <text class="iconfont">&#xe64b;</text>
      <rich-text class="rich_text" :nodes="about.content"></rich-text>
      <view
        class="jbtn flex-center cursor"
        :style="{
          color: config['theme-btn-color'],
          backgroundColor: config['theme-btn-bgcolor'],
          boxShadow: `0 0 10px ${config['theme-box-shadow']}`,
        }"
        @click="toNofiticationDetail"
        >{{ $t("home.join_btn") }}</view
      >
<!--      <view class="flex-col ai-center" @click="toOther">
        <view class="title">{{ $t("home.problem") }}</view>
        <view class="flex-center" style="color: #999">{{
          $t("home.sub_content")
        }}</view>
        <text class="iconfont">&#xe64b;</text>
      </view> -->
    </view>
    <!-- 币种行情列表 -->
<!--    <view class="clist" :style="{ backgroundColor: config['theme-bg-color2'] }">
      <block v-if="goods.length">
        <trade-card
          v-for="item in goods"
          :key="item.id"
          :info="item"
          @purchase="showBuy"
        ></trade-card>
      </block>
    </view> -->
    <!-- 理财申购弹窗 -->
    <uni-popup ref="popup" type="center">
      <view
        class="area"
        :style="{
          backgroundColor: config['theme-bg-color2'],
          color: config['theme-text-color'],
        }"
      >
        <view class="title flex-center">{{ $t("trades.purchase") }}</view>
        <view class="param">
          <view class="label">{{ $t("trades.purchase_quantity") }}</view>
          <input
            class="input"
            :style="{ color: config['theme-text-color'] }"
            v-model="params.buy_account"
            type="number"
            :placeholder="$t('trades.enter_purchase')"
          />
        </view>
        <view class="param">
          <view class="label">{{ $t("common.payment_password") }}</view>
          <input
            class="input"
            :style="{ color: config['theme-text-color'] }"
            type="password"
            v-model="params.paypwd"
            :placeholder="$t('common.enter_password')"
          />
        </view>
        <view
          class="confirm flex-center"
          :style="{
            color: config['theme-btn-color'],
            backgroundColor: config['theme-btn-bgcolor'],
          }"
          @click="submit"
        >
          {{ $t("trades.confirm") }}
        </view>
      </view>
    </uni-popup>
    <!-- 遮罩层 -->
    <view v-if="listHeight" class="mask" @click="listHeight = 0"></view>
  </view>
</template>
<script>
import { home, market, kline } from "@/api/index";
import { index, good_dobuy } from "@/api/mine";
import { getLangs, getBaseSite } from "@/api/base";
import Validate from "@/utils/validate";
import { loginout } from "@/api/wicket";

export default {
  data() {
    return {
      user: {},
      config: {},
      langs: [],
      balance: {},
      listHeight: 0,
      curLang: {},
      menu: [
        [
          {
            title: this.$t("home.desposit"),
            icon: "\ue829",
            path: "/pages/desposit/index",
          },
          {
            title: this.$t("home.withdraw"),
            icon: "\ue606",
            path: "/pages/withdrawal/index",
          },
          {
            title: this.$t("home.share"),
            icon: "\ue62b",
            path: "/pages/share/index",
          },
          {
            title: this.$t("home.team"),
            icon: "\ue65c",
            path: "/pages/team/index",
          },
        ],
        [
          {
            title:this.$t("home.transfer"),
            icon: "\ue65d",
            path: "/pages/transfer/index",
          },
          {
            title: this.$t("home.profit"),
            icon: "\ue690",
            path: "/pages/profit/index",
          },
          {
            title: this.$t("home.app"),
            icon: "\ue669",
            path: "app",
          },
          {
            title:this.$t("home.logout"),
            icon: "\ue698",
            path: "logout",
          },
        ],
      ],
      curDot: 0,
      chartData: {},
      curBanDot: 0,
      homead: [],
      market: {},
      goods: [],
      about: {},
      proHref: "",
      params: {
        good_id: "",
        buy_account: "",
        paypwd: "",
      },
    };
  },
  watch: {
    curLang() {
      this.menu = [
        [
          {
            title: this.$t("home.desposit"),
            icon: "\ue829",
            path: "/pages/desposit/index",
          },
          {
            title: this.$t("home.withdraw"),
            icon: "\ue606",
            path: "/pages/withdrawal/index",
          },
          {
            title: this.$t("home.share"),
            icon: "\ue62b",
            path: "/pages/share/index",
          },
          {
            title: this.$t("home.team"),
            icon: "\ue65c",
            path: "/pages/team/index",
          },
        ],
        [
          {
            title:this.$t("home.transfer"),
            icon: "\ue65d",
            path: "/pages/transfer/index",
          },
          {
            title: this.$t("home.profit"),
            icon: "\ue690",
            path: "/pages/profit/index",
          },
          {
            title: this.$t("home.app"),
            icon: "\ue669",
            path: "app",
          },
          {
            title:this.$t("home.logout"),
            icon: "\ue698",
            path: "logout",
          },
        ],
      ]
    }
  },
  created() {
    this.user = uni.getStorageSync("userInfo");
    this.getLang();
    this.getBase();
  },
  methods: {
    goService() {
		window.open(this.config.kefu)
		// window.location.href = this.config.kefu
	},
	goGroup() {
		window.open(this.config.qun)
	},
    // 跳转文章详情
    toNofiticationDetail() {
      uni.navigateTo({
        url: `/pages/notification/detail?id=${this.about.id}`,
      });
    },

    // 跳转链接
    toOther() {
      uni.navigateTo({
        url: `/pages/other/index?url=${this.proHref}`,
      });
    },
    // 显示申购弹窗
    showBuy(item) {
      this.params = {
        good_id: "",
        buy_account: "",
        paypwd: "",
      };
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

    // 初始化
    init() {
      this.getHome();
      this.getIndex();
      this.getKline();
      this.getMarket();
    },

    // 创建h5标签栏ico图标
    createIco(icon) {
      let link = document.createElement("link");
      let head = document.getElementsByTagName("head")[0];
      link.setAttribute("rel", "icon");
      link.href = icon;
      head.appendChild(link);
    },

    // 获取基础配置
    getBase() {
      getBaseSite({}).then((res) => {
        this.config = res.data;
        uni.setNavigationBarTitle({
          title: this.config.name,
        });
        this.$emit('getConfig', this.config)
        // #ifdef H5
        this.createIco(this.config.ico);
        // #endif
        uni.setStorageSync("config", res.data);
      });
    },

    // 设置语言
    setLocaleMessage(langs) {
      for(let i = 0; i < langs.length; i++) {
        let lang = require(`../../../static/lang/${this.curLang.name}.json`)
        this._i18n.setLocaleMessage(langs[i].name, lang);
      }
    },

    // 获取语言
    getLang() {
      getLangs({}).then((res) => {
        this.langs = res.data.list;
        this.curLang = this.langs.filter(
          (item) => item.name == res.data.default
        )[0];
        uni.setStorageSync("langs", res.data);
        uni.setStorageSync("lang", this.curLang.name);
        this.setLocaleMessage(res.data.list)
        this.$emit("changeLang", this.curLang.name);
        this.init();
      });
    },

    // 获取首页数据
    getHome() {
      home({}).then((res) => {
        this.balance = res.data.balance;
        this.homead = res.data.homead;
        this.goods = res.data.goods;
        this.about = res.data.about;
        this.proHref = res.data.pro_href;
        // 通知父组件关闭加载动画
        this.$emit("getHomeDataFinish");
      });
    },

    // 获取余额
    getIndex() {
      index({}).then((res) => {
        this.user.balance = res.data.balance;
      });
    },

    // 创建时间
    getTime(time) {
      const d = time * 1000;
      let now = new Date(d);
      var year=now.getFullYear();
      var month=now.getMonth()+1;
      var date=now.getDate();
      return month+"."+date
    },

    // 获取k线图
    getKline() {
      kline({}).then((res) => {
        let kline = res.data;
        kline.sort((a, b) => a.id - b.id);
        let kdata = [];
        let cdata = [];
        for (let i = 0; i < kline.length; i++) {
          kdata.push([
            kline[i].open,
            kline[i].close,
            kline[i].low,
            kline[i].high,
          ]);
          const time = kline[i].id
          cdata.push(this.getTime(time));
        }
        this.chartData = {
          categories: cdata,
          series: [
            {
              name: "上证指数",
              data: kdata,
            },
          ],
        };
      });
    },

    // 获取市场行情
    getMarket() {
      market({}).then((res) => {
        this.market = res.data;
      });
    },

    // 显示语言列表
    showLang() {
      if (this.listHeight) {
        this.listHeight = 0;
      } else {
        this.listHeight = 80 * this.langs.length;
      }
    },

    // 选择语言
    chooseLang(item) {
      this.curLang = item;
      this._i18n.setLocaleMessage(this.curLang.name, require(`../../../static/lang/${this.curLang.name}.json`));
      this.$emit("changeLang", item.name);
      this.showLang();
      this.init();
    },

    // 跳转理财详情
    goTradeDetail(id) {
      uni.navigateTo({
        url: `/pages/tradeDetail/index?id=${id}`,
      });
    },

    changeSwiper(e) {
      this.curDot = e.detail.current;
    },

    changeBanSwiper(e) {
      this.curBanDot = e.detail.current;
    },

    goToPage(page) {
      let pages = {
        notification: "/pages/notification/index",
        customer: `/pages/customer/index`,
      };
      uni.navigateTo({
        url: pages[page],
      });
    },
    pageTo(path) {
      switch (path) {
        case "app":
          window.location.href = this.config.down_url;
          break;
        case "logout":
          uni.removeStorageSync("token");
          uni.removeStorageSync("userInfo");
          uni.showToast({
            title: this.$t("mine.logout_msg"),
            duration: 2000,
          });
          setTimeout(() => {
            uni.reLaunch({
              url: "/pages/login/index",
            });
          }, 2000);
          break;
        default:
          uni.navigateTo({
            url: path,
          });
      }
    },
  },
};
</script>
<style lang='scss' scoped>
.page {
  color: #ddd;
  .user {
    margin-left: 20rpx;
    .title {
      font-size: 30rpx;
      font-weight: 600;
    }
  }
  .btn {
    .lang {
      width: 64rpx;
      height: 64rpx;
      border-radius: 50%;
      background-color: #fff;
      margin-right: 10rpx;
      box-shadow: 0 0 4px #ddd;
      .list {
        position: fixed;
        top: 130rpx;
        right: 30rpx;
        width: 240rpx;
        padding: 0 30rpx;
        background-color: #fff;
        border-radius: 10rpx;
        transition: all 0.3s;
        overflow: hidden;
        z-index: 10;
        .item {
          font-size: 30rpx;
          width: 100%;
          height: 80rpx;
          border-bottom: 1px solid #eee;
          box-sizing: border-box;
        }
        .item:last-child {
          border: none;
        }
      }
    }
    .icon {
      font-size: 36rpx;
      width: 64rpx;
      height: 64rpx;
      border-radius: 50%;
      background-color: #fff;
      margin-right: 10rpx;
      box-shadow: 0 0 4px #ddd;
    }
  }
  .balance {
    margin-top: 30rpx;
    .num {
      height: 100rpx;
    }
    .total {
      font-size: 60rpx;
      font-weight: bold;
    }
    .profit {
      font-size: 40rpx;
      font-weight: bold;
    }
  }
  .menu {
    width: 100%;
    height: 200rpx;
    .swiper {
      height: 100%;
      .item-wrap {
        height: 100%;
        .swiper-item {
          width: 25%;
          .icon-wrap {
            width: 100rpx;
            height: 100rpx;
            background-color: #659386;
            color: #fff;
            border-radius: 20rpx;
            margin-bottom: 20rpx;
          }
        }
      }
    }
  }
  .panigation {
    .dot {
      width: 16rpx;
      height: 16rpx;
      border-radius: 50%;
      background-color: #ddd;
      border-width: 4rpx;
      border-style: solid;
      border-color: #ddd;
      box-sizing: border-box;
      transition: all 0.3s;
    }
    .dot.active {
      background-color: transparent;
      border-width: 4rpx;
      border-color: #659386;
    }
  }
  .market {
    margin-top: 40rpx;
    border-radius: 30rpx 30rpx 0 0;
    padding: 30rpx 30rpx 0 30rpx;
    .cur-item {
      padding: 20rpx;
      margin: 30rpx 0;
      border-radius: 20rpx;
    }
  }
  .charts-box {
    min-height: 400rpx;
  }
  .join_button{
    margin-top: 40rpx;
    display: flex;
    justify-content: space-between;
    .item{
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      cursor: pointer;
      width: 45%;
      color: #feb140;
      border-radius: 10px;
      height: 200rpx;
      background: #292c3d;
      text-align: center;
      .img_box{
        width: 40px;height: 40px

      }
    }

  }
  .banner {
    padding: 5rpx 0 0;
    .swiper {
      height: 260rpx;
      margin: 30rpx 0;
      .swiper-item {
        width: 96%;
        height: 100%;
        image {
          border-radius: 20rpx;
        }
      }
    }
  }
  .join {
    border-radius: 30rpx;
    margin: 40rpx 30rpx;
    padding: 40rpx 30rpx;
    .title {
      font-size: 40rpx;
      font-weight: bold;
    }
    .iconfont {
      margin: 20rpx;
    }
    .jbtn {
      width: 400rpx;
      height: 90rpx;
      font-size: 36rpx;
      border-radius: 20rpx;
      color: #fff;
      border: 2px solid #fff;
      margin: 60rpx 0;
    }
  }
  .rich_text{
    width: 100%;
    ::v-deep p{
      white-space: normal;
      word-wrap: break-word;
    }
  }
  .clist {
    padding: 30rpx;
    border-radius: 20rpx;
    padding-bottom: 160rpx;
    .coin {
      height: 160rpx;
      border-radius: 20rpx;
      padding: 0 30rpx;
      margin-bottom: 30rpx;
      .cbtn {
        margin-left: auto;
        width: 180rpx;
        height: 60rpx;
        border-radius: 10rpx;
        color: #fff;
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
  .mask {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 1;
  }
}
</style>
