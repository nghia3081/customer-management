const host = import.meta.env.VITE_SERVER
const ajax = webix.ajax().headers({ "content-type": "application/json" })
let buildUrl = (uri) => {
    let url = String(host);
    if (String(uri).startsWith('/')) url = `${url}${uri}`;
    else url = `${url}/${uri}`;
    console.log(url);
    return url;
}
webix.attachEvent("onBeforeAjax", function (mode, url, params, x, headers, files, defer) {
    headers["Authorization"] = `${import.meta.env.VITE_AUTH_SCHEME} ${webix.storage.local.get(import.meta.env.VITE_TOKEN_KEY)}`
});

webix.attachEvent("onAjaxError", function (xhr) {
    if (xhr.status == 401) {
        logout();
        window.location.reload();
    }
});
const callback = (viewId, successCallback, errorCallback) => ({
    success: (text, data, xhr) => {
        disableLoading(viewId)
        if (successCallback)
            successCallback(text, data, xhr);
    },
    error: (text, data, xhr) => {
        disableLoading(viewId)
        if (errorCallback)
            errorCallback(text, data, xhr);
        else webix.message(text, "error");
    }
});
const enableLoading = (viewId) => {
    if(!viewId) return;
    webix.extend($$(viewId), webix.ProgressBar);
    $$(viewId).disable();
    $$(viewId).showProgress({
        type: "top"
    })
}
const disableLoading = (viewId) => {
    if(!viewId) return;
    $$(viewId).enable();
    $$(viewId).hideProgress();
}
export default {
    ajax: ajax,
    get: (viewId, uri, data, successCallback, errorCallback) => {
        enableLoading(viewId);
        ajax.get(buildUrl(uri), data, callback(viewId, successCallback, errorCallback))
    },
    post: (viewId, uri, data, successCallback, errorCallback) => {
        enableLoading(viewId);
        ajax.post(buildUrl(uri), data, callback(viewId,successCallback, errorCallback));
    },
    put: (viewId, uri, data, successCallback, errorCallback) => {
        enableLoading(viewId);
        ajax.put(buildUrl(uri), data, callback(viewId,successCallback, errorCallback));
    },
    delete: (viewId, uri, data, successCallback, errorCallback) => {
        ajax.delete(buildUrl(uri), data, callback(viewId,successCallback, errorCallback));
    },
    patch: (viewId, uri, data, successCallback, errorCallback) => {
        enableLoading(viewId);
        ajax.patch(buildUrl(uri), data, callback(viewId,successCallback, errorCallback));
    },
    download: (viewId, uri, data, successCallback, errorCallback) => {
        enableLoading(viewId);
        ajax.response("arraybuffer").get(buildUrl(uri), data, callback(viewId,successCallback, errorCallback));
    }

}