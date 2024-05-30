import { apiResquest } from '../utils/request.js'


// 列表
export const historyList = (query) => {
	return apiResquest({
		url: '/game/gamehistory',
		method: 'POST',
		query: {...query}
	})
}

// 详情
// export const info = (query) => {
// 	return apiResquest({
// 		url: '/good/info',
// 		method: 'POST',
// 		query: {...query}
// 	})
// }