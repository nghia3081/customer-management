import ajax from "../helper/ajax";
function status() {
    let user = webix.storage.local.get(import.meta.env.VITE_USER);
    if (user && user.token && user.expire && new Date(user.expire) > new Date()) return webix.promise.resolve(user);
    return webix.promise.reject(null).fail(function (error) {
        resolve(null);
    });


}
function login(user, pass) {

    return ajax.ajax.post(`${import.meta.env.VITE_SERVER}/api/user/login`, { username: user, password: pass }, function (text, data, xhr) {
        webix.storage.local.put(import.meta.env.VITE_USER, data.json());
        return webix.promise.resolve(data.json());
    })
}

function logout() {
    return new webix.promise((resolve, reject) => {
        webix.storage.local.remove(import.meta.env.VITE_USER);
        resolve(null)
    });
}
var getUser = () => webix.storage.local.get(import.meta.env.VITE_USER);
export default {
    status, login, logout, getUser
}