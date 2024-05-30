<template>
  <view class="page">
    <!-- 页面背景 -->
    <view
      class="page_bg"
      :style="{ backgroundColor: config['theme-bg-color'] }"
    >
      <image
        v-if="config.loginbg"
        style="width: 100%; height: 100%"
        :src="config.loginbg"
      />
    </view>
    <!-- 页面内容 -->
    <view class="content">
      <view class="head flex-row jc-between ai-center">
        <view class="signup">{{ $t("login.btn1") }}</view>
        <view
          class="lang flex-center"
          @click="showLang"
        >
          <image
            style="width: 40rpx;"
            :src="curLang.logo"
            mode="widthFix"
          />
          <view
            class="list"
            :style="{
              height: listHeight + 'rpx',
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
      </view>
      <view class="logo flex-row ai-end jc-center">
        <image class="img" :src="config.logo" mode="widthFix" />
      </view>
      <view class="form">
        <view class="item flex-row ai-center code">
          <text class="iconfont">&#xe6a1;</text>
          <input
            v-model="params.phone"
            class="input flex-1"
            :style="{ color: config['theme-text-color'] }"
            type="text"
            placeholder-style="color: #999;"
            :placeholder="$t('login.placeholder1')"
          />
        </view>
        <view class="item flex-row ai-center code">
          <text class="iconfont">&#xe6bf;</text>
          <input
            v-model="params.password"
            class="input flex-1"
            :style="{ color: config['theme-text-color'] }"
            type="password"
            placeholder-style="color: #999;"
            :placeholder="$t('login.placeholder2')"
          />
        </view>
        <view class="flex-row ai-center" style="margin-top: 30rpx">
          <switch
            :checked="checked"
            :color="config['theme-btn-bgcolor']"
            @change="isRememberAcount"
          />
          <text class="ml10" style="color: #999;">{{$t('login.remember')}}</text>
        </view>
        <view
          class="btn flex-center"
          :style="{
            color: config['theme-btn-color'],
            backgroundColor: config['theme-btn-bgcolor'],
            marginTop: '100rpx',
          }"
          @click="login"
          >{{ $t("login.btn1") }}</view
        >
        <view
          class="btn register flex-center"
          :style="{ color: config['theme-btn2-color'],
            backgroundColor: config['theme-btn2-bgcolor'], }"
          @click="register"
          >{{ $t("login.btn2") }}</view
        >
      </view>
    </view>
    <view v-if="listHeight" class="mask" @click="listHeight = 0"></view>
  </view>
</template>
<script>
import Validate from "../../utils/validate";
import { getBaseSite, getLangs } from "../../api/base";
import { login } from "../../api/wicket";
import { encrypt, decrypt } from "../../utils/crypto";

export default {
  data() {
    return {
      config: {},
      langs: [],
      listHeight: 0,
      curLang: {},
      checked: false,
      params: {
        phone: "",
        password: "",
      },
    };
  },
  onLoad() {
    // 是否记住账号
    if (uni.getStorageSync("acount")) {
      this.checked = true;
      this.params = JSON.parse(decrypt(uni.getStorageSync("acount")));
    }
  },
  onShow() {
    this.getLang()
  },
  methods: {
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
      this._i18n.setLocaleMessage(this.curLang.name, require(`../../static/lang/${this.curLang.name}.json`));
      this._i18n.locale = item.name;
      uni.setStorageSync("lang", item.name);
      this.showLang();
    },

    // 获取基础配置
    getBase() {
      getBaseSite({}).then((res) => {
        uni.setStorageSync("config", res.data);
        this.config = res.data;
      });
    },

    // 设置语言
    setLocaleMessage(langs) {
      for(let i = 0; i < langs.length; i++) {
        let lang = require(`../../static/lang/${this.curLang.name}.json`)
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
        this._i18n.locale = this.curLang.name;
        this.getBase();
      });
    },

    // 记住账号
    isRememberAcount(e) {
      this.checked = e.detail.value;
    },

    // 登陆
    login() {
      let valid = new Validate();
      let result = valid.test({
        phone: [
          {
            rule: "isRequired",
            value: this.params.phone,
            message: this.$t("login.valid_phone"),
          },
          {
            rule: "maxLength",
            value:[this.params.phone , 15],
            message: this.$t("login.valid_isPhone"),
          },
        ],
        password: [
          {
            rule: "isRequired",
            value: this.params.password,
            message: this.$t("login.valid_login_password"),
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
        login(this.params)
          .then((res) => {
            uni.setStorageSync("token", res.token);
            uni.setStorageSync("userInfo", res.data);

            // 是否记住账号密码
            if (this.checked) {
              uni.setStorageSync(
                "acount",
                encrypt(JSON.stringify(this.params))
              );
            } else {
              uni.removeStorageSync("acount");
            }
            uni.showToast({
              title: this.$t("login.log_success_tip"),
            });
            setTimeout(() => {
              uni.reLaunch({
                url: "/pages/index/index",
              });
            }, 2000);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },

    // 跳转注册
    register() {
      uni.navigateTo({
        url: "/pages/register/index",
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
  .content {
    .head {
      height: 100rpx;
      padding: 0 30rpx;
      .lang {
        position: relative;
        width: 70rpx;
        height: 70rpx;
        background-color: #fff;
        box-shadow: 0 0 10px #ddd;
        border-radius: 50%;
        .list {
          position: absolute;
          top: 80rpx;
          right: 0;
          width: 240rpx;
          border-radius: 10rpx;
          background-color: #fff;
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
    }
    .logo {
      width: 100%;
      height: 400rpx;
      .img {
        width: 200rpx;
        height: 200rpx;
        margin-bottom: 40rpx;
      }
    }
    .form {
      padding: 0 30rpx;
      margin-top: 100rpx;
      .item {
        width: 100%;
        height: 90rpx;
        background-color: rgba(170, 69, 69, 0.1);
        border-radius: 90rpx;
        padding: 20rpx 30rpx;
        margin-top: 26rpx;
        box-sizing: border-box;
        .iconfont {
          color: #fff;
        }
        .iconfont.right {
          padding-left: 30rpx;
        }
        .input {
          height: 100%;
          padding-left: 20rpx;
          margin-left: 20rpx;
          border-left: 1px solid #fff;
          color: #333;
        }
      }
      .btn {
        width: 100%;
        height: 90rpx;
        border-radius: 90rpx;
        background-color: #669288;
        color: #fff;
        font-weight: bold;
        margin-top: 26rpx;
      }
      .btn.register {
        background-color: #b78b62;
      }
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
