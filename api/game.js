import { apiResquest } from '../utils/request.js'

// 获取游戏分类
export const cate = (query) => {
	return apiResquest({
		url: '/game/cate',
		method: 'POST',
		query: {...query}
	})
}

// 获取游戏信息
export const info = (query) => {
	return apiResquest({
		url: '/game/info',
		method: 'POST',
		query: {...query}
	})
}