import CustomerForm from "./forms/customer.js";
import baseComponent from "../models/base-control.js"
import login from "./login.js";
import ajax from "../helper/ajax.js";
import user from "../models/user.js";
const gridId = "customerTableId";
const pagerId = "customerPager";
let controls = baseComponent.getCrudButtom(
    () => {
        baseComponent.refreshGrid(gridId);
    },
    () => {
        webix.ui(new CustomerForm(null, true).getForm()).show();
    },
    () => {
        webix.ui(new CustomerForm(baseComponent.getSelectedItem(gridId), false).getForm()).show();
    },
    () => {
        let selectedItem = baseComponent.getSelectedItem(gridId);
        webix.confirm({
            text: "Are you sure to remove this item?",
            callback: (res) => {
                if (!res) return;
                ajax.del(gridId, `api/customer/${selectedItem.Id}`, null, function (text, data, xhr) {
                    webix.message("Remove successfully", "success");
                    baseComponent.refreshGrid(gridId);
                })
            }
        })
    })
controls.push({
    view: 'button',
    type: "icon",
    icon: "mdi mdi-book",
    label: "Contracts",
    click: () => {
        let selectedItem = baseComponent.getSelectedItem(gridId);
        $$(gridId).$scope.show(`contract/${selectedItem.Id}`);
    }
})
controls.push({
    view: "button",
    type: "icon",
    icon: "mdi mdi-file-excel",
    label: "Export excels",
    click: () => {
        webix.toExcel($$(gridId));
    }
})
const columnWidth = 200;
const grid = {
    view: "datatable",
    id: gridId,
    pager: pagerId,
    select: true,
    columns: [
        {
            id: "TaxCode",
            header: [
                "TaxCode",
                {
                    content: 'serverFilter'
                }
            ],
            sort: "server",
            width: columnWidth,
        },
        {
            id: "Name",
            header: [
                "Name",
                {
                    content: "serverFilter"
                }
            ],
            fillspace: true,
            sort: "server"
        },
        {
            id: "Email",
            header: [
                "Email",
                {
                    content: "serverFilter"
                }
            ],
            sort: "server",
            width: columnWidth,
        },
        {
            id: "Phone",
            header: [
                "Phone",
                {
                    content: "serverFilter"
                }
            ],
            sort: "server",
            width: columnWidth,
        },
        {
            id: "Address",
            header: [
                "Address",
                {
                    content: "serverFilter"
                }
            ],
            sort: "server",
            width: columnWidth,
        },
        {
            id: "CreatedDate",
            header: [
                "Created Date",
                {
                    content: "serverDateRangeFilter"
                },

            ],
            sort: "server",
            width: columnWidth,
            columnType: "datetime",
        },
        {
            id: "CreatedBy",
            header: [
                "Created By",
                {
                    content: "serverFilter"
                }
            ],
            template: function (obj) {
                return obj.CreatedByNavigation.FullName
            },
            sort: "server",
            width: columnWidth,
        }

    ],
    url: baseComponent.getGridUrlConfig("api/customer", "CreatedByNavigation"),
    on: {
        onItemDblClick: () => {
            webix.ui(new CustomerForm(baseComponent.getSelectedItem(gridId), false).getForm()).show();
        }
    }
}
const layout = {
    rows: [
        {
            height: 40,
            cols: [
                {
                    cols: controls
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