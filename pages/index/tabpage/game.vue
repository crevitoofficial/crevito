<template>
	<view class="page">
		<cus-header :showBack="false" title="Game"></cus-header>
		<view class="content plr30">
			<!-- 分类 -->
			<view class="section" :style="{
          backgroundColor: config['theme-bg-color2'],
          paddingBottom: '30rpx',
        }">
				<view class="cate flex-row ai-center jc-between">
					<view class="flex-row ai-center" @click="showCate">
						<image class="mr10" :src="curCate.logo" style="width: 40rpx; height: 40rpx"></image>
						<text class="mr10">{{ curCate.title }}</text>
						<uni-icons type="bottom" size="16" color="#999"></uni-icons>
					</view>
					<text :style="{
              color: config['theme-text-color'],
              fontSize: '36rpx',
              fontWeight: 'bold',
            }">{{ curCate.close }}</text>
					<view class="list" :style="{
              height: listHeight + 'rpx',
              color: '#333'
            }">
						<view class="item flex-row ai-center" v-for="(item, index) in cates" :key="index"
							@click.stop="chooseCate(item)">
							<image style="width: 40rpx; margin-right: 20rpx" :src="item.logo" mode="widthFix" />
							<text>{{ item.title }}</text>
						</view>
					</view>
				</view>
				<v-tabs v-model="current" :tabs="tabs" @change="changeTab" lineHeight="3rpx" field="name" color="#ddd"
					:bold="false" :bgColor="config['theme-bg-color2']" :activeColor="config['theme-text-color']"
					:lineColor="config['theme-text-color']"></v-tabs>
				<view class="charts-box" style="position: relative">
					<!-- 图表配置再config-ucharts.js里配置，demotype就是你需要自定义配置的效果 -->
<!--					<qiun-data-charts type="cusCandletype" :opts="opts" :chartData="chartData" />-->
					<view id="chart"></view>
					<view class="subTitle" v-if="activeData.length">
						<span>O: <i>{{activeData[0 ]}}</i></span><span>H: <i>{{activeData[1]}}</i></span>
						<span>L: <i>{{activeData[2]}}</i>
						</span><span>C: <i>{{activeData[3]}}</i></span>
					</view>
				</view>
			</view>
			<!-- 开奖期 -->
			<view class="section">
				<!-- 中间第一个框 -->
				<view v-if="lastopen" class="gitem" :style="{ backgroundColor: config['theme-bg-color2'] }">
					<view class="mr10 qnum flex-row jc-between">
						<text>{{ lastopen.expect }}：</text> <!-- 期号 -->
						<text>{{ lastopen.close }}</text>
					</view>
					<view class="flex-row ai-center jc-between" style="margin-top: 10rpx">
						<view class="qnum flex-row ai-center">
							<view class="isnum flex-center"
								:style="{backgroundColor: config['theme-btn-bgcolor'],color: config['theme-btn-color']}">
								{{ lastopen.no1 }}
							</view>+ <view class="isnum flex-center"
								:style="{backgroundColor: config['theme-btn-bgcolor'],color: config['theme-btn-color']}">
								{{ lastopen.no2 }}
							</view>+ <view class="isnum flex-center"
								:style="{backgroundColor: config['theme-btn-bgcolor'],color: config['theme-btn-color']}">
								{{ lastopen.no3 }}
							</view>=
							<view class="istotal flex-center"
								:style="{backgroundColor: config['theme-btn2-bgcolor'],color: config['theme-btn2-color']}">
								{{ lastopen.total }}
							</view>
						</view>
						<view class="types flex-row ai-center">
							<view class="it flex-center" :style="{
                  backgroundColor: config[`theme-game-${lastopen.dx}-bgcolor`],
                }">{{ lastopen.dx }}</view>
							<view class="it flex-center" :style="{
                  backgroundColor: config[`theme-game-${lastopen.ds}-bgcolor`],
                }">{{ lastopen.ds }}</view>
							<view class="it flex-center" :style="{
                  backgroundColor:
                    config[`theme-game-${lastopen.dxds}-bgcolor`],
                }">{{ lastopen.dxds }}</view>
						</view>
					</view>
				</view>
				<!-- 这是倒计时第二个框 -->
				<view class="gitem" :style="{ backgroundColor: config['theme-bg-color2'] }">
					<view class="qnum flex-row jc-between ai-center">
						<text>{{ expect.expect }}</text> <!-- 期号 -->
						<uni-countdown :key="countDownKey" v-if="time.length" color="#f00" splitorColor="#f00"
							@timeup="getInfo" :fontSize="16" :show-day="false" :hour="time[0]" :minute="time[1]"
							:second="time[2]"></uni-countdown>
					</view>
					<view class="flex-row ai-center jc-between" style="margin-top: 10rpx">
						<text class="qnum">{{ $t("common.balance") }}: </text>
						<text class="qnum">
							<uni-icons
								type="spinner-cycle"
								size="22"
								style="color: #ddd;vertical-align: -4rpx" v-if="loadingBalance"
							></uni-icons>
							{{ user.balance }} {{ config.unit }}
						</text>
					</view>
				</view>
			</view>
			<!-- 投注 -->
			<view class="odds" :style="{ backgroundColor: config['theme-bg-color2'] }">
				<view class="olist flex-row jc-between flex-wrap">
					<view
						:class="['oitem', 'flex-col', 'ai-center', 'jc-center', 'cursor']"
						:style="{backgroundColor: config[`theme-game-${item.names}-bgcolor`],}"
						v-for="(item, index) in odds.slice(0, 8)" :key="index" @click="showPopup(item)">
						<text>{{ item.names }}</text>
						<text style="margin-top: 10rpx">{{ item.odds }}</text>
					</view>
				</view>
			</view>
			<!-- 28个数字 -->
			<view class="twenty-eight_numbers" :style="{ backgroundColor: config['theme-bg-color2'] }">
				<view class="circle" v-for="(item,index) in odds.slice(8)" @click="showPopup(item)">
					<view style="font-size: 18px;margin-bottom: 5px">{{item.names}}</view>
					<view style="font-size: 12px"><span>x</span>{{item.odds }}</view>
				</view>
			</view>
		</view>
		<uni-popup ref="popup" type="center">
			<view class="area" :style="{
          color: config['theme-text-color'],
        }">
				<view class="title flex-center">{{ $t("game.bet") }}</view>
				<view class="param">
					<view class="label">{{ $t("game.bet_quantity") }}</view>
					<input class="input" :style="{color: config['theme-text-color']}" v-model="form.buy_account"
						type="text" :placeholder="$t('game.bet_placeholder1')" />
				</view>
				<!-- <view class="param">
          <view class="label">{{ $t("common.payment_password") }}</view>
          <input
            class="input"
            :style="{color: config['theme-text-color']}"
            type="password"
            v-model="form.paypwd"
            :placeholder="$t('game.bet_placeholder2')"
          />
        </view> -->
				<view class="confirm flex-center cursor" :style="{
            backgroundColor: config['theme-btn-bgcolor'],
            color: config['theme-btn-color'],
          }" @click="submit">
					{{ $t("game.confirm") }}
				</view>
			</view>
		</uni-popup>
		<view v-if="listHeight" class="mask" @click="listHeight = 0"></view>
	</view>
</template>
<script>
	import {cate, info} from "@/api/game";
	import {index, game_dobuy} from "@/api/mine";
	import vTabs from "@/components/v-tabs/v-tabs";
	import Validate from "@/utils/validate";

	/* echars 按需引入  start  */
	import * as echarts from 'echarts/core';
	import {
		ToolboxComponent,
		TooltipComponent,
		GridComponent,
		VisualMapComponent,
		LegendComponent,
		BrushComponent,
		DataZoomComponent
	} from 'echarts/components';
	import { CandlestickChart, LineChart, BarChart } from 'echarts/charts';
	import { UniversalTransition } from 'echarts/features';
	import { CanvasRenderer } from 'echarts/renderers';
	echarts.use([
		ToolboxComponent,
		TooltipComponent,
		GridComponent,
		VisualMapComponent,
		LegendComponent,
		BrushComponent,
		DataZoomComponent,
		CandlestickChart,
		LineChart,
		BarChart,
		CanvasRenderer,
		UniversalTransition
	]);
	/* echars 按需引入  end  */
	export default {
		component: {
			vTabs,
		},
		data() {
			return {
				config: {},
				current: 0,
				curCate: {},
				cates: [],
				// twentyEight_numbers: [
				// 	888,180,98,58,48,32,25,20,17,15,14,13,12,12,12,12,13,14,15,17,20,25,32,48,58,98,180,888
				// ],
				odds: [],
				listHeight: 0,
				tabs: [],
				chartData: {},
				opts: {
					extra: {
						tooltip: {
							horizentalLine: true,
							splitLine: true,
							xAxisLabel: true,
							yAxisLabel: true,
							labelFontColor: '#fff',
							labelBgColor: '#02c289'
						}
					},
					yAxis: {
						data: [
							{
								'type': 'value',
								'position': 'right',
								"showTitle": false,
								"disabled" : true
							},
							{
								'position': 'right',
								"disabled": false,
								"axisLine": false,
								"axisLineColor": '#A6A6A6',
								"calibration": false,
								"showTitle": false,
								"max": 0,
								"min": 0,
								"tofix": 6
							}
						]
					},
				},
				infoParams: {
					cate_id: "",
					id: "",
				},
				form: {
					game_id: "",
					sel_name: "",
					sel_odd: "",
					paypwd: "",
					buy_account: "",
				},
				lastopen: {},
				expect: {},
				time: [],
				countDownKey: 0,
				is_open: true,
				cate_time:1,
				activeData: [],
				loadingBalance: false,
			};
		},
		created() {
			this.config = uni.getStorageSync("config");
			this.user = uni.getStorageSync("userInfo");
			this.getCate();
			this.getInfo();
			this.latestBalance();
		},
		methods: {
			//同步倒计时
			getCountdownTime(time) {
				let timer = setInterval(() => {
					time--;
					if (time < 20) {
						clearInterval(timer)
						this.is_open = false
					} else {
						this.is_open = true
					}
				}, 1000)
			},
			// 显示分类列表
			showCate() {
				if (this.listHeight) {
					this.listHeight = 0;
				} else {
					this.listHeight = 80 * this.cates.length;
				}
			},
			// 选择分类
			chooseCate(item) {
				console.log("选择分类");
				this.curCate = item;
				this.infoParams.cate_id = this.curCate.id;
				this.infoParams.id = "";
				this.getInfo();
				this.showCate();
			},
			// 获取游戏分类
			getCate() {
				let that = this;
				cate({}).then((res) => {
					that.cates = res.data;
					that.curCate = that.cates.filter((item) => item.default == 1)[0];
					that.cate_time =that.curCate.ms*1000;
					that.infoParams.cate_id = that.curCate.id;
					setTimeout(function(){
						that.getCate()
						uni.hideLoading()
					},that.cate_time)
				});
			},

			// 根据时间戳创建时间
			getTime(time) {
				let d = time * 1000;
				let date = new Date(d);
				let h = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
				let m =
					date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
				return `${h}:${m}`;
			},

			// 根据数字创建时分秒
			setHis(times = 0) {
				if (typeof times === "number") {
					if (times <= 0) {
						return [0, 0, 0];
					} else {
						let hh = parseInt(times / 3600); //小时
						let shh = times - hh * 3600;
						let ii = parseInt(shh / 60);
						let ss = shh - ii * 60;
						return [hh, ii, ss];
					}
				} else {
					return [0, 0, 0];
				}
			},
			// 获取游戏信息
			getInfo(index) {
				info(this.infoParams).then((res) => {
					this.odds = res.data.info.odds;
					this.tabs = res.data.timelist;
					this.lastopen = res.data.info.lastopen;
					this.expect = res.data.info.expect;
					// index 是 当前tab值
					if (index) {
						this.current = index;
						this.form.game_id = this.tabs[index].id;
					} else {
						this.tabs.forEach((item, index) => {
							if (item.default === 1) {
								this.current = index;
								this.form.game_id = this.tabs[index].id;
							}
						});
					}
					this.time = this.setHis(this.expect.down_time);
					this.getCountdownTime(this.expect.down_time); //设置同步定时器
					this.countDownKey = new Date().getTime();
					let kline = res.data.kline;
					if (kline.length) {
						kline.sort((a, b) => a.id - b.id);
						let kdata = [];
						let cdata = [];
						for (let i = 0; i < kline.length; i++) {
							kdata.push([
								kline[i].open,
								kline[i].close,
								kline[i].low,
								kline[i].high,
								kline[i].vol,
								kline[i].amount,
								kline[i].count,

							]);
							cdata.push(this.getTime(kline[i].id));
						}
						let arr = [].concat(...kdata)
						let max = Math.max.apply( null, arr );
						let min = Math.min.apply( null, arr );
						this.opts.yAxis.data[1].max = max
						this.opts.yAxis.data[1].min = min
						this.chartData = {
							categories: cdata,
							series: [{
								data: kdata,
							}, ],
						};
					} else {
						this.chartData = {
							categories: [],
							series: [{
								data: [],
							}, ],
						};
					}
					this.initChart()
					this.latestBalance()
				});
			},
			initChart() {
				const chartDom = document.getElementById('chart');
				const myChart = echarts.init(chartDom);
				let option;
				const upColor = '#e86d43';
				const upBorderColor = '#65141f';
				const downColor = '#02c289';
				const downBorderColor = '#114523';

				function splitData(chartData) {
					let rawData = chartData.series[0].data
					const values = [];
					const volumes = [];
					for (let i = 0; i < rawData.length; i++) {
						values.push(rawData[i]);
						volumes.push([i, rawData[i][4], rawData[i][0] > rawData[i][1] ? 1 : -1]);
					}
					return {
						categoryData: chartData.categories, // 时间轴
						values: values,
						volumes: volumes
					};
				}
				const data = splitData(this.chartData);
				this.activeData = data.values[data.values.length - 1]
				function calculateMA(dayCount) {
					var result = [];
					for (var i = 0, len = data.values.length; i < len; i++) {
						if (i < dayCount) {
							result.push('-');
							continue;
						}
						var sum = 0;
						for (var j = 0; j < dayCount; j++) {
							sum += +data.values[i - j][1];
						}
						result.push(sum / dayCount);
					}
					return result;
				}
				const that = this
				let subtext = ''
				option = {
					title: {
						text: '',
						left: 0,
						subtext: subtext
					},
					tooltip: {
						backgroundColor: 'rgba(50,50,50,0.5)',
						// trigger: 'axis',
						// axisPointer: {
						// 	type: 'cross',
						// 	handle:{
						// 		show: false
						// 	}
						// },
						show: false,
						borderWidth: 1,
						padding: 10,
						textStyle: {
							color: '#fff'
						},
						lineStyle: {
							// color: '#376df4',
							width: 1,
							opacity: 1
						},
						confine: true,
						trigger: 'axis',
						axisPointer: {
							type: 'line'
						}
					},
					visualMap: {
						show: false,
						seriesIndex: 4,
						dimension: 2,
						pieces: [{
							value: 1,
							color: '#0c411f'
						}, {
							value: -1,
							color: '#65141f'
						}]
					},
					grid: [
						{
							left: '5%',
							right: '15%',
							height: '40%'
						},
						{
							left: '5%',
							right: '15%',
							top: '70%',
							height: '18%'
						}
					],
					dataZoom: [
						{
							show: false,
							type: 'inside',
							xAxisIndex: [0, 0],
						},
						{
							show: false,
							type: 'slider',
							xAxisIndex: [0, 1],
						}
					],
					legend: {
						x:'right,',
						data: ['MA5', 'MA10', 'MA20'],
						textStyle: {
							color: '#99998b',
							fontSize: 10
						}
					},
					xAxis:[
						{
							type: 'category',
							data: data.categoryData,
							scale: true,
							boundaryGap: false,
							axisLine: { onZero: false },
							splitLine: { show: false },
							min: 'dataMin',
							max: 'dataMax',
							axisLabel: {
								z: 100,
								fontSize: 10
							},
							axisPointer: {
								show: true,
								link: {xAxisIndex: 'all'},
								label: {
									color: '#fff',
									fontSize: 10,
									backgroundColor: '#02c289'
								},
								handle: {
									show: true,
									size: 0
								},
								triggerOn: 'none',
								alwaysShowContent:false
							},
						},
						{
							type: 'category',
							gridIndex: 1,
							data: data.categoryData,
							scale: true,
							boundaryGap : false,
							axisLine: {onZero: false},
							axisTick: {show: false},
							splitLine: {show: false},
							axisLabel: {show: false},
							// splitNumber: 20,
							min: 'dataMin',
							max: 'dataMax',
							axisPointer: {
								show: false
							},
						}
					],
					yAxis:[
						{
							position: 'right',
							axisLine: { lineStyle: { color: '#8392A5' } },
							scale: true,
							splitLine: { show: false },
							splitArea: {
								show: false
							},
							axisLabel: {
								fontSize: 10
							},
							axisPointer: {
								show: true,
								link: {xAxisIndex: 'all'},
								label: {
									color: '#fff',
									fontSize: 10,
									backgroundColor: '#02c289'
								},
								handle: {
									show: true,
									size: 0
								},
								triggerOn: 'none',
								alwaysShowContent:false
							}
						},
						{
							scale: true,
							gridIndex: 1,
							splitNumber: 2,
							axisLabel: {show: false},
							axisLine: {show: false},
							axisTick: {show: false},
							splitLine: {show: false},
							axisPointer: {
								show: false,
							},
						}
					],
					series: [
						{
							name: '日K',
							type: 'candlestick',
							data: data.values,
							itemStyle: {
								color: upColor,
								color0: downColor,
								borderColor: upBorderColor,
								borderColor0: downBorderColor
							}
						},
						{
							name: 'MA5',
							type: 'line',
							data: calculateMA(5),
							smooth: true,
							showSymbol: false,
							lineStyle: {
								opacity: 0.5
							}
						},
						{
							name: 'MA10',
							type: 'line',
							data: calculateMA(10),
							smooth: true,
							showSymbol: false,
							lineStyle: {
								width: 1,
								opacity: 0.5
							}
						},
						{
							name: 'MA20',
							type: 'line',
							data: calculateMA(20),
							smooth: true,
							showSymbol: false,
							lineStyle: {
								opacity: 0.5
							}
						},
						{
							name: 'Volume',
							type: 'bar',
							xAxisIndex: 1,
							yAxisIndex: 1,
							data: data.volumes,
							lineStyle: {
								opacity: 0.3
							}
						}
					]
				};
				option && myChart.setOption(option);
			},
			// 切换间隔
			changeTab(index) {
				console.log("当前选中的项：" + index);
				this.infoParams.id = this.tabs[index].id;
				this.getInfo(index);
			},

			// 显示投注弹窗
			showPopup(item) {
				this.form.sel_name = item.names;
				this.form.sel_odd = item.odds;
				if (this.is_open) { //倒计时20秒内不出现弹框
					return this.$refs.popup.open();
				}
				uni.showToast({
					title: this.$t('No betting within 20 seconds'),
					duration: 3000,
					icon: "none",
				})
			},
			// 提交投注
			submit() {
				let valid = new Validate();
				let result = valid.test({
					buy_account: [{
							rule: "isRequired",
							value: this.form.buy_account,
							message: this.$t("game.valid_quatity"),
						},
						{
							rule: "isNumber",
							value: this.form.buy_account,
							message: this.$t("game.valid_quatity2"),
						},
					],
					// paypwd: [
					//   {
					//     rule: "isRequired",
					//     value: this.form.paypwd,
					//     message: this.$t("game.valid_paypwd"),
					//   },
					// ],
				});
				if (result) {
					uni.showToast({
						title: result.errMsg,
						duration: 3000,
						icon: "none",
					});
				} else {
					if(this.user.balance > 10 && this.user.balance >= this.form.buy_account) {
						this.user.balance = (this.user.balance - this.form.buy_account).toFixed(4)
					}
					game_dobuy(this.form).then((res) => {
						// console.log(res)
						if (res.code == 1) {
							uni.showToast({
								title: res.msg,
								duration: 2000,
							});
							this.latestBalance()
							this.$refs.popup.close()
						}
					});
				}
			},
			latestBalance() {
				if(!this.user) {
					return !1;
				}
				this.loadingBalance = true
				index({}).then((res) => {
					let info = res.data;
					this.loadingBalance = false
					this.user.balance = info.balance || '0.0000';
				});
			},
		},
	};
</script>
<style lang='scss' scoped>
	.page {
		padding-bottom: 200rpx;

		.content {
			.section {
				margin: 40rpx 0;
				border-radius: 20rpx;
				color: #ddd;

				.cate {
					position: relative;
					padding: 30rpx 20rpx 30rpx;

					.list {
						position: absolute;
						top: 86rpx;
						left: 0;
						width: 240rpx;
						border-radius: 10rpx;
						background-color: #fff;
						transition: all 0.3s;
						overflow: hidden;
						z-index: 99999;

						.item {
							font-size: 30rpx;
							padding-left: 30rpx;
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

				.charts-box {
					width: 100%;
					min-height: 400rpx;
					margin-top: 30rpx;
					#chart{
						height: 400rpx;
						/*border-top: 1px solid #6e7079;*/
						/*border-left: 1px solid #6e7079;*/
					}
					.subTitle{
						font-size: 10px;
						position: absolute;
						left: 5px;top: 20px;
						span{
							color: #999999;
							margin-left: 10px;
						}
						i{
							color: #e86d43;

						}
					}
				}

				.gitem {
					background-color: #fff;
					padding: 30rpx;
					margin-bottom: 30rpx;
					border-radius: 20rpx;

					.qnum {
						font-size: 32rpx;
						font-weight: bold;

						.isnum,
						.istotal {
							font-weight: normal;
							width: 50rpx;
							height: 50rpx;
							border-radius: 50%;
							color: #fff;
							background-color: #4fbe6b;
						}

						.istotal {
							background-color: #208ff8;
						}
					}

					.types {
						height: 50rpx;

						.it {
							height: 50rpx;
							padding: 0 10rpx;
							font-size: 24rpx;
							color: #fff;
							border-radius: 10rpx;
						}
					}
				}
			}

			.odds {
				border-radius: 20rpx;
				background-color: #fff;

				.olist {
					padding: 30rpx 20rpx;

					.oitem {
						font-size: 24rpx;
						width: 150rpx;
						height: 150rpx;
						background-color: #f00;
						margin-bottom: 20rpx;
						border-radius: 10rpx;
						color: #fff;
					}

					.color0 {
						background-color: #f0905a;
					}

					.color1 {
						background-color: #57be6b;
					}

					.color2 {
						background-color: #edba8c;
					}

					.color3 {
						background-color: #4f5caf;
					}

					.color4 {
						background-color: #ed7a67;
					}

					.color5 {
						background-color: #ecb445;
					}

					.color6 {
						background-color: #7113e3;
					}

					.color7 {
						background-color: #9a58e1;
					}
				}
			}
			.twenty-eight_numbers{
				margin: 40rpx 0;
				border-radius: 20rpx;
				padding: 30rpx 20rpx;
				display: flex;
				justify-content: space-around;
				flex-wrap: wrap;
				color: #fff;
				.circle{
					margin: 5rpx;
					width: 140rpx;
					height: 140rpx;
					border-radius: 50%;
					background: #292c3d;
					display: flex;
					flex-direction: column;
					font-size: 28rpx;
					justify-content: center;
					align-items: center;
				}
			}

		}

		.area {
			width: 600rpx;
			overflow: hidden;
			padding: 20rpx 20rpx 40rpx;
			background-color: #fff;
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
					border: 1px solid #eee;
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
			z-index: 9999;
		}
	}
</style>
