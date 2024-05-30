import { apiResquest } from '../utils/request.js'

// 充值类型选择
export const index = (query) => {
	return apiResquest({
		url: '/recharge/index',
		method: 'POST',
		query: {...query}
	})
}

// 创建订单返回二维码信息
export const neworder = (query) => {
	return apiResquest({
		url: '/recharge/neworder',
		method: 'POST',
		query: {...query}
	})
}

// 定时获取最近充值记录
export const getrecharge = (query) => {
	return apiResquest({
		url: '/recharge/getrecharge',
		method: 'POST',
		query: {...query}
	})
}

// 提交充值
export const completed = (query) => {
	return apiResquest({
		url: '/recharge/completed',
		method: 'POST',
		query: {...query}
	})
}