import { apiResquest } from '../utils/request.js'

// 更新余额统一接口
export const index = (query) => {
	return apiResquest({
		url: '/mine/index',
		method: 'POST',
		query: {...query}
	})
}

// 营销账户划转到基本账户
export const transfer = (query) => {
	return apiResquest({
		url: '/mine/transfer',
		method: 'POST',
		query: {...query}
	})
}

// 理财订单
export const goodorder = (query) => {
	return apiResquest({
		url: '/mine/goodorder',
		method: 'POST',
		query: {...query}
	})
}

// 账户记录
export const balancelog = (query) => {
	return apiResquest({
		url: '/mine/balancelog',
		method: 'POST',
		query: {...query}
	})
}

// 理财购买提交
export const good_dobuy = (query) => {
	return apiResquest({
		url: '/mine/good_dobuy',
		method: 'POST',
		query: {...query}
	})
}

// 游戏购买提交
export const game_dobuy = (query) => {
	return apiResquest({
		url: '/mine/game_dobuy',
		method: 'POST',
		query: {...query}
	})
}

// 游戏投注记录
export const gameorder = (query) => {
	return apiResquest({
		url: '/mine/gameorder',
		method: 'POST',
		query: {...query}
	})
}

// 设置支付密码
export const setpaypass = (query) => {
	return apiResquest({
		url: '/mine/setpaypass',
		method: 'POST',
		query: {...query}
	})
}