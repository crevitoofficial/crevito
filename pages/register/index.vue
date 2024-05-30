<template>
	<view class="page">
		<!-- 页面背景 -->
		<view class="page_bg" :style="{ backgroundColor: config['theme-bg-color'] }">
			<image v-if="config.loginbg" style="width: 100%; height: 100%" :src="config.loginbg" />
		</view>
		<!-- 页面内容 -->
		<view class="content">
			<view class="head flex-row jc-between ai-center">
				<view class="signup">{{ $t("login.btn2") }}</view>
				<view class="lang flex-center" @click="showLang">
					<image style="width: 40rpx;" :src="curLang.logo" mode="widthFix" />
					<view class="list" :style="{
              height: listHeight + 'rpx',
            }">
						<view class="item flex-row ai-center" v-for="(item, index) in langs" :key="index"
							@click.stop="chooseLang(item)">
							<image style="width: 40rpx; margin-right: 20rpx" :src="item.logo" mode="widthFix" />
							<text>{{ item.content }}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="logo flex-center">
				<image class="img" :src="config.logo" mode="widthFix" />
			</view>
			<view class="form">
				<!-- 图形验证码 -->
				<view v-if="config.isopenverifycode == 1" class="item flex-row ai-center">
					<input class="flex-1" :style="{ color: config['theme-text-color'] }" type="text"
						:value="sendParams.captcha" @input="inputCaptcha" placeholder-style="color: #bbb;"
						:placeholder="$t('register.placeholder1')" />
					<image style="width: 140rpx; height: 60rpx" :src="codeImg" @click="clickCodeImg" />
				</view>
				<!-- 区号和手机号 -->
				<view class="item flex-row ai-center">
					<view class="areacode" :style="{ color: config['theme-text-color'] }" @click="openAreaList">
						+{{ params.prefix || $t("register.choose_area") }}</view>
					<input class="flex-1" :style="{ color: config['theme-text-color'] }" type="text"
						:value="sendParams.phone" @input="inputPhone" placeholder-style="color: #bbb;"
						:placeholder="$t('register.placeholder2')" />
				</view>
				<!-- 手机验证码 -->
				<view v-if="config.isopenmobliecode == 1" class="item flex-row ai-center">
					<input class="flex-1" :style="{ color: config['theme-text-color'] }" type="text"
						v-model="params.code" placeholder-style="color: #bbb;"
						:placeholder="$t('register.placeholder5')" />
					<view :class="['send', 'flex-center']" :style="{
              backgroundColor: isSend ? '#ddd' : config['theme-btn-bgcolor'],
              color: isSend ? '#333' : config['theme-btn-color'],
            }">
						<text v-if="isSend">{{ countdown }}s</text>
						<text v-else @click="sendCode">{{ $t("register.sendcode") }}</text>
					</view>
				</view>
				<!-- 登陆密码 -->
				<view class="item flex-row ai-center">
					<text class="iconfont">&#xe6bf;</text>
					<input v-model="params.password" class="input flex-1" :style="{ color: config['theme-text-color'] }"
						type="password" placeholder-style="color: #bbb;" :placeholder="$t('register.placeholder6')" />
				</view>
				<view class="item flex-row ai-center">
					<text class="iconfont">&#xe6bf;</text>
					<input v-model="rePassword" class="input flex-1" :style="{ color: config['theme-text-color'] }"
						type="password" placeholder-style="color: #bbb;" :placeholder="$t('register.placeholder7')" />
				</view>
				<!-- 支付密码 -->
				<view class="item flex-row ai-center">
					<text class="iconfont">&#xe7f8;</text>
					<input v-model="params.paypwd" class="input flex-1" :style="{ color: config['theme-text-color'] }"
						type="password" placeholder-style="color: #bbb;" :placeholder="$t('register.placeholder8')" />
				</view>
				<view class="item flex-row ai-center">
					<text class="iconfont">&#xe7f8;</text>
					<input v-model="rePayPassword" class="input flex-1" :style="{ color: config['theme-text-color'] }"
						type="password" placeholder-style="color: #bbb;" :placeholder="$t('register.placeholder9')" />
				</view>
				<!-- 邀请码 -->
				<view v-if="config.isopeninvitecode == 1" class="item flex-row ai-center">
					<text class="iconfont">&#xe6c0;</text>
					<input v-model="params.invite_code" class="input flex-1"
						:style="{ color: config['theme-text-color'] }" type="text" placeholder-style="color: #bbb;"
						:placeholder="$t('register.placeholder10')" />
				</view>
				<view class="btn flex-center" :style="{
            color: config['theme-btn-color'],
            backgroundColor: config['theme-btn-bgcolor'],
            marginTop: '100rpx',
          }" @click="register">{{ $t("login.btn2") }}</view>
				<view class="btn flex-center" :style="{
            color: config['theme-btn2-color'],
            backgroundColor: config['theme-btn2-bgcolor'],
            marginTop: '30rpx',
          }" @click="back">{{ $t("login.btn1") }}</view>
			</view>
		</view>
		<uni-popup ref="popup" type="center" background-color="#fff">
			<view class="area">
				<view class="title flex-center" :style="{ color: config['theme-text-color'] }">
					{{ $t("register.choose_area") }}</view>
				<view class="swrap flex-row ai-center">
					<input class="areainput flex-1" :style="{
              color: config['theme-text-color'],
            }" v-model="inputArea" type="text" :placeholder="$t('register.area_placeholder')" />
					<view class="search flex-center" :style="{
              color: config['theme-btn-color'],
              backgroundColor: config['theme-btn-bgcolor'],
            }" @click="searchArea">{{ $t("register.search") }}</view>
				</view>
				<scroll-view class="scroll" scroll-y>
					<view class="aitm flex-row ai-center" :style="{
              color: config['theme-text-color'],
            }" v-for="(item, index) in filterAreaCodes" :key="index" @click="selectAreaCode(item)">
						{{ isCN ? item.cn : item.en }} (+{{ item.prefix }})</view>
				</scroll-view>
			</view>
		</uni-popup>
		<view v-if="listHeight" class="mask" @click="listHeight = 0"></view>
	</view>
</template>
<script>
	import Validate from "../../utils/validate";
	import {
		getLangs
	} from "../../api/base";
	import {
		getCaptcha,
		getPrefix,
		sendcode,
		register
	} from "../../api/wicket";

	export default {
		data() {
			return {
				config: {},
				langs: [],
				listHeight: 0,
				curLang: {},
				isCN: false,
				codeImg: "",
				isSend: false,
				countdown: 60,
				sendParams: {
					captcha: "",
					phone: "",
					prefix: "",
				},
				params: {
					phone: "",
					password: "",
					paypwd: "",
					captcha: "",
					invite_code: "",
					code: "",
					prefix: "",
				},
				rePassword: "", // 确认密码
				rePayPassword: "", //确认支付密码
				areaCodes: [], // 区号列表
				filterAreaCodes: [], // 筛选的区号列表
				inputArea: "", // 搜索区号
			};
		},
		onLoad(options) {
			// 如果是分享链接进来，自动填充邀请码
			if (options && options.code) {
				this.params.invite_code = options.code
			}
			this.config = uni.getStorageSync("config");
			this.getLang();
			this.getCaptcha();
			this.getPrefix();
		},
		methods: {
			// 设置语言
			setLocaleMessage(langs) {
				for (let i = 0; i < langs.length; i++) {
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
				this._i18n.setLocaleMessage(this.curLang.name, require(`../../static/lang/${this.curLang.name}.json`));
				this._i18n.locale = item.name;
				uni.setStorageSync("lang", item.name);
				this.showLang();
			},

			// 返回登陆
			back() {
				uni.navigateBack();
			},
			// 刷新验证码
			clickCodeImg() {
				this.getCaptcha();
			},
			// 获取图形验证码
			getCaptcha() {
				getCaptcha({}).then((res) => {
					this.codeImg = `data:image/png;base64,${res.data}`;
				});
			},

			// 获取区号
			getPrefix() {
				getPrefix({}).then((res) => {
					this.areaCodes = res.data.list;
					this.filterAreaCodes = res.data.list;
				});
			},

			// 输入图形
			inputCaptcha(e) {
				this.sendParams.captcha = e.detail.value;
				this.params.captcha = e.detail.value;
			},

			// 输入手机号
			inputPhone(e) {
				this.sendParams.phone = e.detail.value;
				this.params.phone = e.detail.value;
			},

			// 发送验证码
			sendCode() {
				let valid = new Validate();
				let result = valid.test({
					captcha: [{
						rule: "isRequired",
						value: this.sendParams.captcha,
						message: this.$t("register.valid_code"),
					}, ],
					prefix: [{
						rule: "isRequired",
						value: this.params.prefix,
						message: this.$t("register.valid_area"),
					}, ],
					phone: [{
							rule: "isRequired",
							value: this.params.phone,
							message: this.$t("register.valid_phone"),
						},
						{
							rule: "maxLength",
							value: [this.params.phone, 15],
							message: this.$t("register.valid_isPhone"),
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
					sendcode(this.sendParams)
						.then((res) => {
							uni.showToast({
								title: res.msg,
								duration: 3000,
							});
						})
						.catch((err) => {
							console.log(err);
						});
					this.countdown = 60;
					this.isSend = true;
					let timer = setInterval(() => {
						if (this.countdown > 1) {
							this.countdown--;
						} else {
							clearInterval(timer);
							this.isSend = false;
						}
					}, 1000);
				}
			},

			// 打开区号列表
			openAreaList() {
				this.$refs.popup.open();
			},

			// 选中区号
			selectAreaCode(item) {
				this.params.prefix = item.prefix;
				this.sendParams.prefix = item.prefix;
				this.$refs.popup.close();
			},

			// 搜索区号
			searchArea() {
				if (this.inputArea) {
					this.filterAreaCodes = this.areaCodes.filter(
						(item) =>
						item.prefix.includes(this.inputArea) ||
						item.en.includes(this.inputArea) ||
						item.cn.includes(this.inputArea)
					);
				} else {
					this.filterAreaCodes = this.areaCodes;
				}
			},

			// 注册
			register() {
				console.log(this.params);
				let valid = new Validate();
				let validParams = {
					captcha: null,
					prefix: [{
						rule: "isRequired",
						value: this.params.prefix,
						message: this.$t("register.valid_area"),
					}, ],
					phone: [{
							rule: "isRequired",
							value: this.params.phone,
							message: this.$t("register.valid_phone"),
						},
						{
							rule: "maxLength",
							value: [this.params.phone, 15],
							message: this.$t("register.valid_isPhone"),
						},
					],
					code: null,
					password: [{
							rule: "isRequired",
							value: this.params.password,
							message: this.$t("register.valid_login_password"),
						},
						{
							rule: "minLength",
							value: [this.params.password, 6],
							message: this.$t("register.valid_login_password_num"),
						},
						{
							rule: "maxLength",
							value: [this.params.password, 18],
							message: this.$t("register.valid_login_password_num"),
						},
						{
							rule: "isEqual",
							value: [this.params.password, this.rePassword],
							message: this.$t("register.valid_login_password_same"),
						},
					],
					paypwd: [{
							rule: "isRequired",
							value: this.params.paypwd,
							message: this.$t("register.valid_pay_password"),
						},
						{
							rule: "minLength",
							value: [this.params.password, 6],
							message: this.$t("register.valid_pay_password_num"),
						},
						{
							rule: "maxLength",
							value: [this.params.password, 18],
							message: this.$t("register.valid_pay_password_num"),
						},
						{
							rule: "isEqual",
							value: [this.params.paypwd, this.rePayPassword],
							message: this.$t("register.valid_pay_password_same"),
						},
					],
					incode: null,
				};

				if (this.config.isopenverifycode == 1) {
					validParams.captcha = [{
						rule: "isRequired",
						value: this.params.captcha,
						message: this.$t("register.valid_code"),
					}, ];
				}
				if (this.config.isopenmobliecode == 1) {
					validParams.code = [{
						rule: "isRequired",
						value: this.params.code,
						message: this.$t("register.valid_phone_code"),
					}, ];
				}

				// 邀请码不需要验证
				// if(this.config.isopeninvitecode == 1) {
				//   validParams.incode = [
				//     {
				//       rule: "isRequired",
				//       value: this.params.incode,
				//       message: this.$t("register.valid_invite"),
				//     },
				//   ]
				// }
				let result = valid.test(validParams);

				if (result) {
					uni.showToast({
						title: result.errMsg,
						duration: 3000,
						icon: "none",
					});
				} else {
					register(this.params)
						.then((res) => {
							uni.setStorageSync("token", res.token);
							uni.setStorageSync("userInfo", res.data);
							uni.showToast({
								title: this.$t("register.reg_success_tip"),
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
		},
	};
</script>
<style lang='scss' scoped>
	.page {
		.mask {
			position: fixed;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			background-color: rgba(0, 0, 0, 0.4);
			z-index: 1;
		}

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
				height: 300rpx;

				.img {
					width: 200rpx;
					height: 200rpx;
				}
			}

			.form {
				padding: 0 30rpx;

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
					}

					.areacode {
						padding-right: 20rpx;
						margin-right: 20rpx;
						border-right: 1px solid #fff;
					}

					.send {
						width: 140rpx;
						height: 60rpx;
						border-radius: 10rpx;
						font-size: 20rpx;
					}

					.send.disable {
						background-color: #bbb;
					}
				}

				.btn {
					width: 100%;
					height: 90rpx;
					border-radius: 90rpx;
					background-color: #3573c1;
					color: #fff;
					font-weight: bold;
					margin-top: 26rpx;
				}
			}
		}

		.area {
			color: #fff;
			width: 600rpx;
			overflow: hidden;
			padding: 20rpx;
			box-sizing: border-box;

			.title {
				font-size: 32rpx;
				font-weight: bold;
				padding: 10rpx 0;
			}

			.swrap {
				padding: 20rpx 0;

				.areainput {
					border-radius: 6rpx;
					height: 50rpx;
					padding: 0 20rpx;
					font-size: 26rpx;
					border: 1px solid #ddd;
					box-sizing: border-box;
				}

				.search {
					width: 120rpx;
					height: 50rpx;
					margin-left: 20rpx;
					border-radius: 6rpx;
				}
			}

			.scroll {
				width: 100%;
				height: 800rpx;

				.aitm {
					height: 70rpx;
					padding-left: 20rpx;
				}
			}
		}
	}
</style>
