import gloabalConfig from '../config/gloabal.config'
import { getSignParams } from './tools'
import { decrypt } from './crypto_hx'

export const apiResquest = (params) => {
	// 判断请求类型
	let headerData = {
		'Content-Type': 'application/x-www-form-urlencoded',
		'lang': uni.getStorageSync('lang') || gloabalConfig.DEFAULT_LANG
	}

	// 如果需要token的接口，自动添加token 
	// 默认需要，不需要的接口可以传noToken=true
	if (!params.noToken && uni.getStorageSync('token') !== '') {
		headerData.token = uni.getStorageSync('token');
		// params.query.token = uni.getStorageSync('token');
	} else if (!params.noToken && !uni.getStorageSync('token')) {
		return new Promise((resolve, reject) => {
			// 如果需要，但token不存在，自动跳转登陆页并清空缓存token
			uni.removeStorageSync('token');
			uni.reLaunch({
				url: '/pages/login/index'
			});
		});
	}

	return new Promise((resolve, reject) => {
		let url = gloabalConfig.BASE_URL + params.url;
		let noTipUrls = ['/recharge/getrecharge','/index/market','/base/site','/base/lang'];
		if (!noTipUrls.includes(params.url)) {
			uni.showLoading({
				title: 'Loading'
			});
		}
		const sign_data = getSignParams(params.query)

		return uni.request({
			url: url,
			data: sign_data,
			method: params.method,
			header: headerData,
			success: (result) => {
				/* 
					非加密数据返回
				*/
				// if (res.data.code == -1) { // 登陆过期
				// 	uni.clearStorageSync();
				// 	if (noTipUrls.includes(params.url)) {
				// 		uni.reLaunch({
				// 			url: '/pages/login/index'
				// 		});
				// 		return;
				// 	} else {
				// 		uni.showToast({
				// 			title: res.data.msg,
				// 			duration: 3000,
				// 			icon: "none"
				// 		})
				// 		setTimeout(() => {
				// 			uni.reLaunch({
				// 				url: '/pages/login/index'
				// 			});
				// 		}, 3000);
				// 	}
				// } else {
				// 	if (res.data.code !== 1) {
				// 		uni.showToast({
				// 			title: res.data.msg,
				// 			duration: 3000,
				// 			icon: "none"
				// 		})
				// 		return;
				// 	}
				// 	resolve(res.data);
				// }
				/* 
					加密数据返回
				*/
				const res = JSON.parse(decrypt(result.data))
				console.log(`${url} =====`,res);
				if (res.code == -1) { // 登陆过期
					uni.clearStorageSync();
					if (noTipUrls.includes(params.url)) {
						uni.reLaunch({
							url: '/pages/login/login'
						});
						return;
					} else {
						uni.showToast({
							title: res.data.msg,
							duration: 3000,
							icon: "none"
						})
						setTimeout(() => {
							uni.reLaunch({
								url: '/pages/login/login'
							});
						}, 3000);
					}
				} else {
					if (res.code !== 1) {
						uni.showToast({
							title: res.msg,
							duration: 3000,
							icon: "none"
						})
						return;
					}
					resolve(res);
				}
			},
			fail: (err) => {
				console.log(2222);
				reject(err);
			},
			complete: () => {
				uni.hideLoading();
			}
		});
	})
}