import ajax from "../helper/ajax";
import baseComponent from "../models/base-control";
const subviewGridId = "contractDetail";
const gridId = "contractManage";
const controls = [
    {
        view: "button",
        type: "icon",
        icon: "mdi mdi-refresh",
        label: "Refresh",
        click: () => {
            baseComponent.refreshGrid(gridId);
        }
    },
    {
        view: "button",
        type: "icon",
        icon: 'mdi mdi-file-outline',
        label: "Print PDF",
        click: () => {
            let selectedItem = baseComponent.getSelectedItem(gridId);
            ajax.download(gridId, `api/contract/${selectedItem.id}/print`, null, (text, data, xhr) => {
                console.log(text);
            })
        }
    },
    {
        view: "button",
        type: "icon",
        icon: "mdi mdi-file-check-outline",
        label: "Approve",
        click: () => {
            let selectedItem = baseComponent.getSelectedItem(gridId);
            webix.confirm({
                text: "Are you sure to approve this contract?",
                callback: (res) => {
                    if (!res) return;
                    ajax.patch(gridId, `api/contract/${selectedItem.id}/approve`, null, function (text, data, xhr) {
                        webix.message("Approve successfully", "success");
                        baseComponent.refreshGrid(gridId);
                    })
                }
            });
        }
    },
    {
        view: "button",
        type: "icon",
        icon: "mdi mdi-file-sign",
        label: "Sign PDF",
        click: () => {

        }
    },
    {
        view: "button",
        type: "icon",
        icon: "mdi mdi-file-remove-outline",
        label: "Reject",
        click: () => {
            let selectedItem = baseComponent.getSelectedItem(gridId);
            webix.confirm({
                text: "Are you sure to reject this contract?",
                callback: (res) => {
                    if (!res) return;
                    ajax.patch(gridId, `api/contract/${selectedItem.id}/reject`, null, function (text, data, xhr) {
                        webix.message("Reject successfully", "success");
                        baseComponent.refreshGrid(gridId);
                    })
                }
            });
        }
    }
]
const subview_cells =
{
    view: "datatable",
    resizeColumn: true,
    scroll: true,
    id: subviewGridId,
    columns: [
        {
            id: "packageCode",
            header: "Package Code",
            editor: "text",
            fillspace: true,
        },
        {
            id: "packageName",
            header: "Package Name",
            editor: "text",
            fillspace: true,
        },
        {
            id: "licenseNumberQuantity",
            header: "License Value (month)",
            editor: "text",
            format: webix.Number.numToStr({
                groupDelimiter: ",",
                groupSize: 3,
                decimalDelimiter: ".",
                decimalSize: 0,
            }),
            css: {
                "text-align": "right",
            },
            fillspace: true,
        },
        {
            id: "unitPrice",
            header: "UnitPrice",
            format: webix.Number.numToStr({
                groupDelimiter: ",",
                groupSize: 3,
                decimalDelimiter: ".",
                decimalSize: 0,
            }),
            css: {
                "text-align": "right",
            },
            fillspace: true,
        },
        {
            id: "quantity",
            header: "Quantity",
            format: webix.Number.numToStr({
                groupDelimiter: ",",
                groupSize: 3,
                decimalDelimiter: ".",
                decimalSize: 0,
            }),
            css: {
                "text-align": "right",
            },
            fillspace: true,
        },
        {
            id: "discount",
            header: "Discount (%)",
            fillspace: true,
            format: webix.Number.numToStr({
                groupDelimiter: ",",
                groupSize: 3,
                decimalDelimiter: ".",
                decimalSize: 0,
            }),
            css: {
                "text-align": "right",
            },
        },
        {
            id: "taxValue",
            header: "Tax Value",
            fillspace: true,
            options: `${import.meta.env.VITE_SERVER}/api/taxcategory/get-options`
        },
        {
            id: "grandTotal",
            header: "Grand Total",
            fillspace: true,
            template: (obj) => {
                let grandTotal = obj.quantity * obj.unitPrice;
                return grandTotal - grandTotal * obj.discount / 100
            },
            format: webix.Number.numToStr({
                groupDelimiter: ",",
                groupSize: 3,
                decimalDelimiter: ".",
                decimalSize: 0,
            }),
            css: {
                "text-align": "right",
            }
        }
    ],
    autoheight: true,
}
const grid = {
    view: "datatable",
    id: gridId,
    select: true,
    resizeColumn: true,
    subview: subview_cells,
    pager: "contractManagePager",
    columns: [

        {
            template: "{common.subrow()}",
            width: 50,
        },
        {
            id: "createdDate",
            header: [
                "Created Date",
                { content: "serverDateRangeFilter" }
            ],
            fillspace: true,
            sort: "server"
        },
        {
            id: "code",
            header: [
                "Contract Code",
                { content: "serverFilter" }
            ],
            sort: "server",
            fillspace: true,
        },
        {
            id: "licenseStartDate",
            header: [
                "License Start Date",
                { content: "serverDateRangeFilter" }
            ],
            sort: "server",
            columnType: "datetime",
            fillspace: true,
        },
        {
            id: "licenseEndDate",
            header: [
                "License End Date",
                { content: "serverDateRangeFilter" }
            ],
            sort: "server",
            columnType: "datetime",
            fillspace: true,
        },
        {
            id: "invoiceExportedDate",
            header: [
                "Invoice Exported Date",
                { content: "serverDateRangeFilter" }
            ],
            sort: "server",
            columnType: "datetime",
            fillspace: true,
        },
        {
            id: "statusId",
            header: [
                "Status",
                {
                    content: "serverSelectFilter"
                }
            ],
            sort: "server",
            columnType: "eq",
            fillspace: true,
            options: `${import.meta.env.VITE_SERVER}/api/statuscategory/get-options`
        }
    ],
    on: {
        onSubViewCreate: function (view, item) {
            view.clearAll();
            var url = baseComponent.getGridUrlConfig("api/contractdetail", null, `ContractId eq ${item.id}`)
            view.load(url);
        },
    },
    url: baseComponent.getGridUrlConfig('api/contract')
}
const pager = {
    view: "pager",
    id: "contractManagePager",
    css: {
        "text-align": "center"
    },
    template: "{common.prev()}{common.pages()}{common.next()}",
    group: 5,
    size: 50
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
        pager
    ]
}
export default layout;