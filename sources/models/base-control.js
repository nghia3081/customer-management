import ajax from "../helper/ajax"

let getCrudButtom = function (refreshFunction, createFunction, updateFunction, removeFunction) {
    return [
        {
            view: "button",
            type: "icon",
            icon: "mdi mdi-refresh",
            label: "Refresh",
            id: "base-btn-refresh",
            click: () => {
                refreshFunction()
            }
        },
        {
            view: "button",
            type: "icon",
            icon: "mdi mdi-plus",
            label: "Create",
            id: "base-btn-create",
            click: () => {
                createFunction()
            }
        },
        {
            view: "button",
            type: "icon",
            icon: "mdi mdi-pencil",
            label: "Update",
            id: "base-btn-update",
            click: () => {
                updateFunction()
            }
        },
        {
            view: "button",
            type: "icon",
            icon: "mdi mdi-trash-can-outline",
            id: "base-btn-remove",
            label: "Remove",
            click: () => {
                removeFunction()
            }
        }
    ]
}
let getFilterQueryWithoutStringType = (key, filter, type) => {
    switch (type) {
        case "datetime": {
            let result = [];
            if (filter.start) {
                result.push(`${key} gt ${new Date(filter.start).toJSON()}`);
            }
            if (filter.end) {
                result.push(`${key} lt ${new Date(filter.end).toJSON()}`);
            }
            return result.join(' and ');
        }
        case "eq": {
            return `${key} eq ${filter}`
        }
        default: return null;
    }
}

let getGridUrlConfig = (uri, expand, preFilter) => {
    return {
        $proxy: true,
        load: function (view, callback, params) {
            let fullUrl = ajax.buildUrl(`${uri}/get-with-custom-response`);
            let query = {
                $filter: null,
                $skip: 0,
                $top: view.config.datafetch,
                $orderby: null,
                $count: true,
                $expand: null
            }
            if (preFilter) {
                query.$filter = (query.$filter ?? "") + preFilter
            }
            if (expand) query.$expand = expand
            if (params) {
                if (params.start) query.$skip = params.start;
                if (params.take) query.$top = params.take;
                if (params.sort) query.$orderby = `${params.sort.id} ${params.sort.dir}`
                let filter = params?.filter;
                let filterQuery = [];
                if (filter) {
                    let columnConfigs = view.config.columns;
                    for (const key in filter) {
                        if (filter[key] === null || filter[key] === "" || Object.values(filter[key]).every((value) => value === null)) continue;
                        var config = columnConfigs.find((value) => value.id == key)?.columnType;
                        if (!config) {
                            filterQuery.push(`contains(${key},'${filter[key]}')`);
                            continue;
                        }
                        filterQuery.push(getFilterQueryWithoutStringType(key, filter[key], config));
                    }
                }
                if (filterQuery.length > 0)
                    query.$filter = query.$filter ? query.$filter + filterQuery.join(' and ') : filterQuery.join(' and ');
            }
            for (var propName in query) {
                if (query[propName] === null || query[propName] === undefined) {
                    delete query[propName];
                }
            }
            return webix.ajax().header({ "content-type": "application/json" }).bind(view).get(fullUrl, query, callback)
        }
    }
}
let getSelectedItem = (gridId) => {
    let selectedItem = $$(gridId).getSelectedItem();
    if (!selectedItem) {
        webix.message("Please choose an data row", "error");
        throw new Error();
    }
    return selectedItem;
}
const refreshGrid = (gridId) => {
    ajax.enableLoading(gridId);
    $$(gridId).clearAll();
    $$(gridId).load($$(gridId).config.url);
    ajax.disableLoading(gridId)
}
let baseComponent = {
    getCrudButtom,
    getGridUrlConfig,
    getSelectedItem,
    refreshGrid
}
export default baseComponent