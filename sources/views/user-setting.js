import { JetView } from "webix-jet";
import baseComponent from "../models/base-control";
import UserForm from "./forms/user";
import ajax from "../helper/ajax";
const gridId = "manageUserGrid";
const pagerId = "manageUserPagerId";
let controls = baseComponent.getCrudButtom(
    () => {
        baseComponent.refreshGrid(gridId);
    },
    () => {
        let userForm = new UserForm(null, true);
        $$(gridId).$scope.ui(userForm.getForm()).show();
    },
    () => {
        let selectedItem = baseComponent.getSelectedItem(gridId);
        let userForm = new UserForm(selectedItem, false);
        $$(gridId).$scope.ui(userForm.getForm()).show();

    },
    () => {
        let selectedItem = baseComponent.getSelectedItem(gridId);
        webix.confirm({
            text: "Are you sure to delete this item?",
            callback: (res) => {
                if (!res) return;
                ajax.del(gridId, `api/user/${selectedItem.username}`, null, function (text, data, xhr) {
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

controls = controls.concat([
    {
        view: "button",
        type: "icon",
        id: "blockUserBtn",
        icon: "mdi mdi-account-lock-outline",
        label: "Block",
        click: () => {
            let selectedItem = baseComponent.getSelectedItem(gridId);
            webix.confirm({
                text: `Are you sure to ${selectedItem.isBlocked ? "unblock" : "block"} this user?`,
                callback: (res) => {
                    if (!res) return;
                    ajax.patch(gridId, `api/user/${selectedItem.username}/block`, null, function (text, data, xhr) {
                        webix.message("Blocked successfully", "success");
                        baseComponent.refreshGrid(gridId);
                    })
                }
            });
        }
    },
    {
        view: "button",
        type: "icon",
        icon: "mdi mdi-account-wrench-outline",
        label: "Permission",
        click: () => {
            let selectedItem = baseComponent.getSelectedItem(gridId);
            const window = "permissionWindowId";
            const permissionGridId = "permissionGridId";
            const view = {
                view: "window",
                id: window,
                modal: true,
                position: "center",
                width: 800,
                height: 450,
                head: `Edit menu viewing permission for user ${selectedItem.username}`,
                body: {
                    rows: [
                        {
                            view: 'datatable',
                            id: permissionGridId,
                            resizeColumn: true,
                            select: true,
                            multiselect: true,
                            pager: pagerId,
                            checkboxRefresh: true,

                            on: {
                                onafterload: function () {
                                    $$(permissionGridId).find((obj) => {
                                        return obj.Users.some((val) => val.Username == selectedItem.username)
                                    }).map((obj) => {
                                        $$(permissionGridId).select(obj.id, true)
                                    })
                                }
                            },
                            columns: [
                                // {
                                //     id: "selected", header: "", template: (obj, common, value) => {
                                //         console.log(common);
                                //         if (obj.Users.some((val) => val.Username == selectedItem.username))
                                //             return "<div class='webix_table_checkbox custom checked'> YES </div>";
                                //         else
                                //             return "<div class='webix_table_checkbox custom notchecked'> NO </div>";
                                //     }
                                // },
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
                                        $expand: "childMenus, users",
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
                        },
                        {
                            cols: [
                                {
                                    view: "button",
                                    css: "webix_primary",
                                    label: "Save",
                                    click: () => {
                                        let selected = $$(permissionGridId).getSelectedItem();
                                        if (!selected) selected = [];
                                        if (!Array.isArray(selected)) selected = [selected];
                                        const user = {
                                            username: selectedItem.username,
                                            menus: selected
                                        }
                                        ajax.put(window, "api/user/permission", user, (text, data, xhr) => {
                                            webix.message("Save permission successfuly", "success");
                                            $$(window).close();
                                        })
                                    }
                                },
                                {
                                    view: "button",
                                    css: "webix_danger",
                                    label: "Cancel",
                                    click: () => {
                                        $$(window).close()
                                    }
                                }
                            ]
                        }
                    ]

                }
            }
            $$(gridId).$scope.ui(view).show();
        }
    }
])
controls.splice(2, 1)
function setBlockBtn() {
    if (!$$(gridId)) return;
    let selectedItem = $$(gridId).getSelectedItem();
    if (!selectedItem) return;

    $$("blockUserBtn").config.label = selectedItem.isBlocked ? "Un Block" : "Block";
    $$("blockUserBtn").config.icon = selectedItem.isBlocked ? "mdi mdi-account-lock-open-outline" : "mdi mdi-account-lock-outline"
    $$("blockUserBtn").refresh();
}
let grid = {
    view: "datatable",
    id: gridId,
    select: true,
    resizeColumn: true,
    pager: pagerId,
    columns: [
        {
            id: "username",
            header: [
                "Username",
                { content: "serverFilter" }
            ],
            sort: "server",
            fillspace: true
        },
        {
            id: "password",
            header: [
                "Password",
                { content: "serverFilter" }
            ],
            sort: "server",
            template: "********",
            fillspace: true
        },
        {
            id: "phone",
            header: [
                "Phone",
                { content: "serverFilter" }
            ],
            sort: "server",
            fillspace: true
        },
        {
            id: "email",
            header: [
                "Email",
                { content: "serverFilter" }
            ],
            sort: "server",
            fillspace: true
        },
        {
            id: "fullName",
            header: [
                "FullName",
                { content: "serverFilter" }
            ],
            sort: "server",
            fillspace: true
        },
        {
            id: "isAdmin",
            header: [
                "IsAdmin",
                { content: "serverSelectFilter" }
            ],
            template: (obj) => `<input type='checkbox' disabled ${obj.isAdmin ? 'checked' : ''}/>`,
            sort: "server",
            fillspace: true,
            columnType: "eq",
        },
        {
            id: "isBlocked",
            header: [
                "IsBlocked",
                { content: "serverSelectFilter" }
            ],
            template: (obj) => `<input type='checkbox' disabled ${obj.isBlocked ? 'checked' : ''}/>`,
            sort: "server",
            fillspace: true,
            columnType: "eq",
        }
    ],
    url: baseComponent.getGridUrlConfig("api/user"),
    on: {
        onselectchange: () => {
            setBlockBtn();
        }
    }
}
// const pager = 
const layout = {
    rows: [
        {
            height: 40,
            cols: controls
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
export default class userSetting extends JetView {
    config() {
        return layout;
    }
    init() {
    }

} 