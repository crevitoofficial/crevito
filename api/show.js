import { apiResquest } from '../utils/request.js'

// 获取内容列表
export const lists = (query) => {
	return apiResquest({
		url: '/show/lists',
		method: 'POST',
		query: {...query}
	})
}

// 获取内容详情
export const info = (query) => {
	return apiResquest({
		url: '/show/info',
		method: 'POST',
		query: {...query}
	})
}

// 获取banner图
export const banner = (query) => {
	return apiResquest({
		url: '/show/banner',
		method: 'POST',
		query: {...query}
	})
}