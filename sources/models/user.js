import ajax from "../helper/ajax";
function status() {
    var token = webix.storage.local.get(import.meta.env.VITE_TOKEN_KEY);
    var validTime = webix.storage.local.get(import.meta.env.VITE_TOKEN_EXPIRE);
    if (token && validTime && new Date(validTime) > new Date()) return webix.promise.resolve(token);
    return webix.promise.reject(null).fail(function (error) {
        resolve(null);
    });


}
function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}
function login(user, pass) {
    return ajax.post(null, "api/user/login", { username: user, password: pass }, function (text, data, xhr) {
        webix.storage.local.put(import.meta.env.VITE_TOKEN_KEY, data.json().token);
        webix.storage.local.put(import.meta.env.VITE_TOKEN_EXPIRE, data.json().expire)
        return webix.promise.resolve(data.json().token);
    })
}

function logout() {
    return new webix.promise((resolve, reject) => {
        webix.storage.local.remove(import.meta.env.VITE_TOKEN_KEY);
        resolve(null)
    });
}
function getUsername() {
    let token = webix.storage.local.get(import.meta.env.VITE_TOKEN_KEY);
    let tokenJson = parseJwt(token);
    return tokenJson[import.meta.env.VITE_TOKEN_USER_CLAIM];
}
export default {
    status, login, logout, getUsername
}