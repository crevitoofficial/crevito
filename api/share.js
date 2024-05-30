import { apiResquest } from '../utils/request.js'

// 我的分享
export const index = (query) => {
	return apiResquest({
		url: '/share/index',
		method: 'POST',
		query: {...query}
	})
}

// 我的团队
export const team = (query) => {
	return apiResquest({
		url: '/share/team',
		method: 'POST',
		query: {...query}
	})
}

// 推广佣金记录
export const cmlog = (query) => {
	return apiResquest({
		url: '/share/cmlog',
		method: 'POST',
		query: {...query}
	})
}