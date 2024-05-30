import { apiResquest } from '../utils/request.js'

// 首页
export const index = (query) => {
	return apiResquest({
		url: '/good/index',
		method: 'POST',
		query: {...query}
	})
}

// 列表
export const lists = (query) => {
	return apiResquest({
		url: '/good/lists',
		method: 'POST',
		query: {...query}
	})
}

// 详情
export const info = (query) => {
	return apiResquest({
		url: '/good/info',
		method: 'POST',
		query: {...query}
	})
}