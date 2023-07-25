import ajax from "../helper/ajax";
import baseComponent from "../models/base-control"
import MenuForm from "./forms/menu";
const gridId = "menuSettingTree"
const pagerId = "menuSettingPager";
const control = baseComponent.getCrudButtom(
    () => {
        baseComponent.refreshGrid(gridId);
    },
    () => {
        let menuForm = new MenuForm(null, true);
        $$(gridId).$scope.ui(menuForm.getForm()).show();
        menuForm.setParentMenuIdFormCombo();
    },
    () => {
        let selectedItem = baseComponent.getSelectedItem(gridId);
        let menuForm = new MenuForm(selectedItem, false);
        $$(gridId).$scope.ui(menuForm.getForm()).show();
        menuForm.setParentMenuIdFormCombo();
    },
    () => {
        let selectedItem = baseComponent.getSelectedItem(gridId);
        webix.confirm({
            text: "Are you sure to delete this item?",
            callback: (res) => {
                if (!res) return;
                ajax.del(gridId, `api/menu/${selectedItem.MenuId}`, null, function (text, data, xhr) {
                    webix.message("Remove successfully", "success");
                    baseComponent.refreshGrid(gridId);
                })
            }
        });
    }
)
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
const grid = {
    view: 'datatable',
    id: gridId,
    resizeColumn: true,
    select: true,
    pager: pagerId,
    columns: [
        {
            id: "MenuId",
            header: ["Id", { content: "serverFilter" }],
            template: "{common.treetable()} #MenuId#",
            fillspace: true,
            sort: "server"
        },
        {
            id: "Title",
            header: ["Title", { content: "serverFilter" }],
            fillspace: true,
            sort: "server"
        },
        {
            id: "TabTitle",
            header: ["Tab Title", { content: "serverFilter" }],
            fillspace: true,
            sort: "server"
        },
        {
            id: "Icon",
            header: ["Icon", { content: "serverFilter" }],
            template: "<span class='#Icon#'/>",
            fillspace: true,
            sort: "server"
        },
        {
            id: "Order",
            header: ["Order", { content: "serverFilter" }],
            fillspace: true,
            sort: "server"
        },
        {
            id: "ParentMenuId",
            header: ["Parent", { content: "serverSelectFilter" }],
            fillspace: true,
            sort: "server"
        },
    ],
    url: {
        $proxy: true,
        load: function (view, callback, params) {
            let fullUrl = ajax.buildUrl(`api/menu/get-with-custom-response`);
            let query = {
                $filter: null,
                $skip: 0,
                $top: view.config.datafetch,
                $orderby: null,
                $count: true,
                $expand: "childMenus",
            }
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
                    query.$filter += filterQuery.join(' and ');
            }
            for (var propName in query) {
                if (query[propName] === null || query[propName] === undefined) {
                    delete query[propName];
                }
            }
            return webix.ajax().header({ "content-type": "application/json" }).bind(view).get(fullUrl, query, callback)
        }
    },
}
const layout = {
    rows: [
        {
            height: 40,
            cols: [
                {
                    cols: control
                },
            ]
        },
        grid,
        {
            css: {
                "text-align": "center"
            },
            view: "pager",
            id: pagerId,
            template: "{common.prev()}{common.pages()}{common.next()}",
            group: 5,
            size: 50
        }
    ]
}
export default layout