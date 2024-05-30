import { apiResquest } from '../utils/request.js'

// 提现
export const index = (query) => {
	return apiResquest({
		url: '/withdrawal/index',
		method: 'POST',
		query: {...query}
	})
}

// 提交
export const completed = (query) => {
	return apiResquest({
		url: '/withdrawal/completed',
		method: 'POST',
		query: {...query}
	})
}