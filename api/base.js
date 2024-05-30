import { apiResquest } from '../utils/request.js'

// 获取基础配置
export const getBaseSite = (query) => {
	return apiResquest({
		url: '/base/site',
		method: 'POST',
		noToken: true,
		query: {...query}
	})
}

// 获取语言列表
export const getLangs = (query) => {
	return apiResquest({
		url: '/base/lang',
		method: 'POST',
		noToken: true,
		query: {...query}
	})
}

// 切换语言包
export const setLangs = (query) => {
	return apiResquest({
		url: '/base/lang_json',
		method: 'POST',
		noToken: true,
		query: {...query}
	})
}