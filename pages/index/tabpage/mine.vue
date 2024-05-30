<template>
  <view class="page">
    <!-- <cus-header :showBack="false" :title="$t('tabbar.mine')"></cus-header> -->
    <!-- 自定义导航栏 -->
    <uni-nav-bar
      backgroundColor="transparent"
      :border="false"
      color="#ddd"
      leftWidth="450rpx"
      rightWidth="300rpx"
    >
      <view slot="left">
        <view class="flex-row ai-center">
          <view class="user flex-col">
            <text class="title">{{$t('tabbar.mine')}}</text>
          </view>
        </view>
      </view>
      <view slot="right">
        <view class="btn flex-row ai-center">
          <view class="lang flex-center" :style="{ backgroundColor: config['theme-bg-color1'] }" @click="showLang">
            <image
              style="width: 40rpx;"
              :src="curLang.logo"
              mode="widthFix"
            />
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
          <view class="icon flex-center" :style="{ backgroundColor: config['theme-bg-color1'] }" @click="() => goToPage('customer')"
            ><text class="iconfont">&#xe61b;</text></view
          >
        </view>
      </view>
    </uni-nav-bar>
    <!-- 主体内容 -->
    <view class="main">
      <view class="header">
        <view class="logo flex-center">
          <image :src="config.logo" />
        </view>
        <view class="text">
          <uni-row :width="'100vw'">
            <uni-col>
              <view class="flex-center text-content">{{
                $t("mine.total_balance")
              }}</view>
            </uni-col>
            <uni-col>
              <view class="flex-center text-content">
                <span class="num">{{ info.balance }}</span>
                <span class="des">{{ this.config.unit }}</span>
              </view>
            </uni-col>
          </uni-row>
        </view>
        <view class="card-box">
          <uni-card
            class="left flex-center cursor"
            margin="30rpx"
            :border="false"
            shadow="0px 0px 3px 1px rgba(0, 0, 0, 0)"
            @click="goTo('desposit')"
            :style="{ backgroundColor: config['theme-bg-color2'] }"
          >
            <view class="flex-col ai-center" style="padding-top: 40rpx">
              <uni-icons
                type="wallet"
                size="60"
                :color="config['theme-text-color']"
              ></uni-icons>
              <view style="margin-top: 40rpx;color: #ddd;">{{ $t("mine.desposit") }}</view>
            </view>
          </uni-card>
          <uni-card
            class="right flex-center cursor"
            margin="30rpx"
            :border="false"
            shadow="0px 0px 3px 1px rgba(0, 0, 0, 0)"
            @click="goTo('withdrawal')"
            :style="{ backgroundColor: config['theme-bg-color2'] }"
          >
            <view class="flex-col ai-center" style="padding-top: 40rpx">
              <uni-icons
                type="redo"
                size="60"
                :color="config['theme-text-color']"
              ></uni-icons>
              <view style="margin-top: 40rpx;color: #ddd;">{{ $t("mine.withdraw") }}</view>
            </view>
          </uni-card>
        </view>
      </view>
      <view class="content">
        <uni-card
          :border="false"
          shadow="0px 0px 3px 1px rgba(0, 0, 0, 0)"
          :style="{ backgroundColor: config['theme-bg-color2'] }"
        >
          <uni-row>
            <uni-col class="flex-row jc-between">
              <view class="dec-title">
                {{ info.desposit }}
                <span :style="{ color: config['theme-text-color'] }">{{
                  info.desposit_trx
                }}</span>
              </view>
              <text class="iconfont cursor" :style="{ color: config['theme-text-color'] }" @click="getIndex">&#xe60a;</text>
            </uni-col>
            <uni-col>
              <view class="dec-content">
                {{ info.desposit_text }}
              </view>
            </uni-col>
          </uni-row>
        </uni-card>

        <uni-card
          :border="false"
          shadow="0px 0px 3px 1px rgba(0, 0, 0, 0)"
          class="list-container"
          :style="{ backgroundColor: config['theme-bg-color2'] }"
        >
          <view class="list-title">{{ $t("mine.app_services") }}</view>
          <uni-list>
            <uni-list-item
              showArrow
              v-for="(item, index) in menuList"
              :key="index"
              @click="goTo(item)"
              clickable
            >
              <template v-slot:header>
                <view class="flex-row ai-center">
                  <view
                    class="icon-wrap flex-center"
                    :style="{
                      backgroundColor: config[`theme-icon-bgcolor${index}`],
                    }"
                  >
                    <text
                      class="iconfont"
                      style="font-size: 50rpx"
                      :style="{ color: config['theme-icon-color'] }"
                    >
                      {{ item.icon }}
                    </text>
                  </view>
                  <view style="margin-left: 40rpx; color: #999;">{{ item.title }}</view>
                </view>
              </template>
            </uni-list-item>
          </uni-list>
        </uni-card>
      </view>
    </view>
    <!-- 遮罩层 -->
    <view v-if="listHeight" class="mask" @click="listHeight = 0"></view>
  </view>
</template>
<script>
import { getLangs } from "@/api/base";
import {index} from '@/api/mine'
export default {
  data() {
    return {
      config: {},
      info: {},
      listHeight:0,
      curLang: {},
      langs: [],
      menuList: [
        {
          icon: "\ue65c",
          title: this.$t("mine.team"),
          path: "/pages/team/index",
        },
        {
          icon: "\ue690",
          title: this.$t("mine.profit"),
          path: "/pages/profit/index",
        },
        // {
        //   icon: "\ue65d",
        //   title: this.$t("mine.transfer"),
        //   path: "/pages/transfer/index",
        // },
        // {
        //   icon: "\ue607",
        //   title: this.$t("mine.financial"),
        //   path: "/pages/financial/index",
        // },
        {
          icon: "\ue61f",
          title: this.$t("mine.bill"),
          path: "/pages/bill/index",
        },
        {
          icon: "\ue62b",
          title: this.$t("mine.share"),
          path: "/pages/share/index",
        },
        {
          icon: "\ue692",
          title: this.$t("mine.notification"),
          path: "/pages/notification/index",
        },
        {
          icon: "\ue616",
          title: this.$t("mine.set_pay"),
          path: "/pages/setPaypwd/index",
        },
        {
          icon: "\ue669",
          title: this.$t("mine.app"),
          path: "app",
        },
        {
          icon: "\ue698",
          title: this.$t("mine.logout"),
          path: "logout",
        },
      ],
    };
  },
  watch: {
    curLang() {
      this.menuList = [
        {
          icon: "\ue65c",
          title: this.$t("mine.team"),
          path: "/pages/team/index",
        },
        {
          icon: "\ue690",
          title: this.$t("mine.profit"),
          path: "/pages/profit/index",
        },
        // {
        //   icon: "\ue65d",
        //   title: this.$t("mine.transfer"),
        //   path: "/pages/transfer/index",
        // },
        {
          icon: "\ue6b8",
          title: this.$t("mine.company_profile"),// 公司介绍
          path: "/pages/notification/detail?id=51",
        },
        {
          icon: "\ue607",
          title: this.$t("mine.financial"),
          path: "/pages/financial/index",
        },
        // {
        //   icon: "\ue61f",
        //   title: this.$t("mine.bill"),
        //   path: "/pages/bill/index",
        // },
        {
          icon: "\ue62b",
          title: this.$t("mine.share"),
          path: "/pages/share/index",
        },
        {
          icon: "\ue692",
          title: this.$t("mine.notification"),
          path: "/pages/notification/index",
        },
        {
          icon: "\ue616",
          title: this.$t("mine.set_pay"),
          path: "/pages/setPaypwd/index",
        },
        {
          icon: "\ue669",
          title: this.$t("mine.app"),
          path: "app",
        },
        {
          icon: "\ue698",
          title: this.$t("mine.logout"),
          path: "logout",
        },
      ]
    }
  },
  created() {
    this.config = uni.getStorageSync("config");
    this.getLang();
  },
  methods: {
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
        uni.setStorageSync("lang", this.curLang.name);
        this.setLocaleMessage(res.data.list)
        this.$emit("changeLang", this.curLang.name);
        this.getIndex();
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
      this.getIndex();
    },

    // 获取余额
    getIndex() {
      index({}).then((res) => {
        this.info = res.data;
      });
    },

    goTo(item) {
      if(item == 'desposit') {
        uni.navigateTo({
          url: '/pages/desposit/index',
        });
        return
      }
      if(item == 'withdrawal') {
        uni.navigateTo({
          url: '/pages/withdrawal/index',
        });
        return
      }
      if (item.path == "app") {
        this.down();
      }
      if (item.path == "logout") {
        this.handleLogout();
      } else {
        uni.navigateTo({
          url: item.path,
        });
      }
    },
    down() {
      window.location.href = this.config.down_url;
    },
    handleLogout() {
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
    },
  },
};
</script>
<style lang='scss' scoped>
.mask {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 1;
  }
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
        top: 100rpx;
        right: 30rpx;
        width: 240rpx;
        background-color: #fff;
        border-radius: 10rpx;
        transition: all 0.3s;
        overflow: hidden;
        z-index: 10;
        .item {
          font-size: 30rpx;
          width: 100%;
          height: 80rpx;
          padding-left: 30rpx;
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
.main {
  width: 100vw;
  //background-color: #05595B;
  display: flex;
  flex-direction: column;
  .header {
    position: relative;
    height: 700rpx;
    width: 100%;
    .logo {
      margin-top: 80rpx;
      image {
        width: 240rpx;
        height: 240rpx;
      }
    }
    .text {
      margin-top: 60rpx;
      .text-content {
        color: #ddd;
        .num {
          font-size: 60rpx;
          color: #ddd;
          font-weight: bolder;
        }
        .des {
          padding-top: 30rpx;
          padding-left: 10rpx;
        }
      }
    }
    .card-box {
      position: absolute;
      bottom: -130rpx;
      left: 20rpx;
      right: 20rpx;
      display: flex;

      .uni-card {
        height: 200rpx;
        width: 200rpx;
        border-radius: 40rpx;
      }
    }
  }
  .content {
    flex: 1;
    border-radius: 40rpx;
    padding-top: 130rpx;
    padding-bottom: 200rpx;
    .uni-card {
      border-radius: 40rpx;
      .list-title {
        color: #ddd;
        height: 80rpx;
        line-height: 80rpx;
        font-weight: bolder;
      }
      .list-container {
        .list-wrapper {
          height: 160rpx;
          width: 100%;
        }
      }
    }
    .dec-title {
      font-weight: bolder;
      color: #ddd;
    }
    .dec-content {
      color: #ddd;
    }
  }
  .icon-wrap {
    width: 80rpx;
    height: 80rpx;
    background-color: #659386;
    color: #fff;
    border-radius: 20rpx;
  }
}
</style>
