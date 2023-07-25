import { JetView } from "webix-jet";
import baseComponent from "../models/base-control"
import ContractForm from "./forms/contract";
import ajax from "../helper/ajax";
const gridId = "contractTable"
const subviewGridId = "contractDetail";
let controls = baseComponent.getCrudButtom(
    () => {
        baseComponent.refreshGrid(gridId);
    },
    () => {
        let ctForm = new ContractForm(null, customerId, true);
        $$(gridId).$scope.ui(ctForm.getForm()).show();
        ctForm.setContractFormOption();
    },
    () => {
        let selectedItem = baseComponent.getSelectedItem(gridId);

        ajax.get(gridId, "odata/ContractDetail", { $filter: `ContractId eq ${selectedItem.id}` }, (text, data, xhr) => {
            let contractDetail = data.json().value.map((cd) => {
                cd.grandTotal = cd.unitPrice * cd.quantity;
                cd.grandTotal -= cd.grandTotal * cd.discount / 100;
                return cd;
            })
            let ctForm = new ContractForm(selectedItem, customerId, false, contractDetail);
            webix.ui(ctForm.getForm()).show();
            ctForm.setContractFormOption();
        })


    },
    () => {
        let selectedItem = baseComponent.getSelectedItem(gridId);
        webix.confirm({
            text: "Are you sure to delete this item?",
            callback: (res) => {
                if (!res) return;
                ajax.del(gridId, `api/contract/${selectedItem.id}`, null, function (text, data, xhr) {
                    webix.message("Remove successfully", "success");
                    baseComponent.refreshGrid(gridId);
                })
            }
        });

    })
let customerId = null;

const controls2 = [{
    view: "button",
    type: "icon",
    icon: "mdi mdi-arrow-expand-left",
    label: "Back to customer",
    click: () => {
        $$(gridId).$scope.show("customer")
    }
}]
    .concat(controls)
    .concat([
        {
            view: "button",
            type: "icon",
            icon: "mdi mdi-draw-pen",
            label: "Send to approve",
            click: () => {
                let selectedItem = baseComponent.getSelectedItem(gridId);
                if (selectedItem.statusId > 1) {
                    webix.message("Contract has been sent to approve before. Can not send any more", "error");
                    return;
                }
                webix.confirm({
                    text: "Are you sure to send this item to approve?",
                    callback: (res) => {
                        if (!res) return;
                        ajax.patch(gridId, `api/contract/${selectedItem.id}/send-to-approve`, null, (text, data, xhr) => {
                            webix.message("Success", "success");
                            baseComponent.refreshGrid(gridId);
                        });
                    }
                })
            }
        },
        {
            view: "button",
            type: "icon",
            icon: "mdi mdi-play-box",
            label: "Active license",
            click: () => {
                let selectedItem = baseComponent.getSelectedItem(gridId);
                let form = new ContractForm(selectedItem, null, false, null);
                if (selectedItem.licenseStartDate) {
                    webix.message("Contract has been active license. Can not active any more", "error");
                    return;
                }
                ajax.get(gridId, "odata/ContractDetail", { $filter: `ContractId eq ${selectedItem.id}` }, (text, data, xhr) => {
                    let total = data.json().value.reduce((a, c) => {
                        return a + c.licenseNumberQuantity
                    }, 0);
                    let activeForm = form.getActiveLicenseForm(total);
                    $$(gridId).$scope.ui(activeForm).show();
                })

            }
        },
        {
            view: "button",
            type: "icon",
            icon: "mdi mdi-file-pdf-box",
            label: "Print",
            click: () => {
                let selectedItem = baseComponent.getSelectedItem(gridId);
                ajax.download(gridId, `api/contract/${selectedItem.id}/print`, null, (text, data, xhr) => {
                    var blob = new Blob([data], { type: "application/pdf" });
                    const a = document.createElement('a');
                    a.href = URL.createObjectURL(blob);
                    a.target = "_blank";
                    a.click();
                })
            }
        },
        {
            view: "button",
            type: "icon",
            icon: "mdi mdi-file-export-outline",
            label: "Export invoice",
            click: () => {
                let selectedItem = baseComponent.getSelectedItem(gridId);
                webix.confirm({
                    text: "Are you sure to export invoice for this contract?",
                    callback: (res) => {
                        if (!res) return;
                        ajax.patch(gridId, `api/contract/${selectedItem.id}/export-invoice`, null, (text, data, xhr) => {
                            webix.message("Success", "success");
                            baseComponent.refreshGrid(gridId);
                        });
                    }
                })
            }
        },
        {
            view: "button",
            type: "icon",
            icon: 'mdi mdi-email-arrow-right-outline',
            label: "Send to customer",
            click: () => {
                let selectedItem = baseComponent.getSelectedItem(gridId);
                webix.confirm({
                    text: "Are you sure to send this contract to customer. System will send this contract to email address that filled in customer's email field",
                    title: "Send contract to customer",
                    callback: (res) => {
                        if (!res) return;
                        ajax.patch(gridId, `api/contract/${selectedItem.id}/send-to-customer`, null, (text, data, xhr) => {
                            webix.message("Send to customer successfully", "success");
                            baseComponent.refreshGrid(gridId);
                        })
                    }
                })
            }
        }
    ])
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
    pager: "contractPager",
    select: true,
    resizeColumn: true,
    subview: subview_cells,
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
    }
}
const pager = {
    view: "pager",
    id: "contractPager",
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
                    cols: controls2
                },
            ]
        },
        grid,
        pager
    ]
}
export default class contract extends JetView {
    config() {
        return layout;
    }
    init() {
        if (!this.getUrl()[1]?.page) {
            $$(gridId).show("customer");
        }
        customerId = this.getUrl()[1].page
        $$(gridId).define("url", baseComponent.getGridUrlConfig('api/contract', null, `CustomerId eq ${customerId}`))
    }
};