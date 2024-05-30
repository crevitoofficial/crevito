import { apiResquest } from '../utils/request.js'

// 赚币主页
export const index = (query) => {
	return apiResquest({
		url: '/coins/index',
		method: 'POST',
		query: {...query}
	})
}

// 划入
export const into = (query) => {
	return apiResquest({
		url: '/coins/into',
		method: 'POST',
		query: {...query}
	})
}