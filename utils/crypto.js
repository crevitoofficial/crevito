import CryptoJS from 'crypto-js';

var IV = '9f394231c4b86fc1';
var KEY = '9abf153f59a11888';

/**
 * 加密
 */
export function encrypt(str) {
    var key = CryptoJS.enc.Utf8.parse(KEY);// 秘钥
    var iv= CryptoJS.enc.Utf8.parse(IV);//向量iv
    var encrypted = CryptoJS.AES.encrypt(str, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7});
    return encrypted.toString();
}
/**
 * 解密
 * @param str
 */
export function decrypt(str) {
    var key = CryptoJS.enc.Utf8.parse(KEY);// 秘钥
    var iv=    CryptoJS.enc.Utf8.parse(IV);//向量iv
    var decrypted = CryptoJS.AES.decrypt(str,key,{iv:iv,padding:CryptoJS.pad.Pkcs7});
    return decrypted.toString(CryptoJS.enc.Utf8);
}