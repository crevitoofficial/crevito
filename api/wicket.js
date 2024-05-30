import { apiResquest } from '../utils/request.js'

// 获取图形验证码
export const getCaptcha = (query) => {
	return apiResquest({
		url: '/wicket/captcha',
		method: 'POST',
		noToken: true,
		query: {...query}
	})
}

// 获取区号
export const getPrefix = (query) => {
	return apiResquest({
		url: '/wicket/prefix',
		method: 'POST',
		noToken: true,
		query: {...query}
	})
}

// 发送手机验证码
export const sendcode = (query) => {
	return apiResquest({
		url: '/wicket/sendcode',
		method: 'POST',
		noToken: true,
		query: {...query}
	})
}

// 注册
export const register = (query) => {
	return apiResquest({
		url: '/wicket/register',
		method: 'POST',
		noToken: true,
		query: {...query}
	})
}

// 登陆
export const login = (query) => {
	return apiResquest({
		url: '/wicket/login',
		method: 'POST',
		noToken: true,
		query: {...query}
	})
}
// 退出登陆
export const loginout = (query) => {
	return apiResquest({
		url: '/wicket/loginout',
		method: 'POST',
		noToken: true,
		query: {...query}
	})
}
