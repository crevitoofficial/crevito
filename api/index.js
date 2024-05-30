import { apiResquest } from '../utils/request.js'

// 获取首页数据
export const home = (query) => {
	return apiResquest({
		url: '/index/home',
		method: 'POST',
		query: {...query}
	})
}

// 获取市场行情
export const market = (query) => {
	return apiResquest({
		url: '/index/market',
		method: 'POST',
		query: {...query}
	})
}

// 获取市场行情
export const kline = (query) => {
	return apiResquest({
		url: '/index/kline',
		method: 'POST',
		query: {...query}
	})
}