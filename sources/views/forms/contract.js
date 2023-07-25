import ajax from "../../helper/ajax";
import baseComponent from "../../models/base-control";
const detailTableId = "contractFormDetailTable";

export default class ContractForm {
    customerId;
    contract;
    isNew;
    contractDetail;
    constructor(contract, customerId, isNew, contractDetail) {
        this.contract = JSON.parse(JSON.stringify(contract));
        this.customerId = customerId;
        if (!Boolean(isNew)) {
            this.contract.customerId = this.customerId;
            this.contract.createdDate = contract ? new Date(this.contract.createdDate) : new Date();
        }

        this.isNew = isNew;
        this.contractDetail = contractDetail ? JSON.parse(JSON.stringify(contractDetail)) : null;

    }
    getForm() {

               const windowId = "contractWindow";
        const formId = "contractForm";
        const invalidMessage = "This field can not be blank"
        let formElements = [
            {
                view: "text",
                name: "customerId",
                hidden: true,
                value: this.customerId
            },
            {
                cols: [
                    {
                        view: "text",
                        name: "code",
                        required: true,
                        label: "Contract Code",
                        value: "{NOT_GENERATED_CONTRACT_CODE}",
                        readonly: true,

                    },
                    {
                        view: "datepicker",
                        name: "createdDate",
                        label: "Created Date",
                        readonly: true,
                        value: new Date()
                    }
                ]
            },
            {
                rows: [
                    {
                        view: "template",
                        template: "Contract Detail Information",
                        type: "section"
                    },
                    {
                        cols: [
                            {
                                cols: [
                                    {
                                        view: "button",
                                        type: "icon",
                                        id: "plus",
                                        icon: "mdi mdi-plus",
                                        label: 'Add row',
                                        click: function () {
                                            $$(detailTableId).add({ UnitPrice: 0, Quantity: 1, Discount: 0 });
                                        },
                                    },
                                    {
                                        view: "button",
                                        type: "icon",
                                        id: "minus",
                                        icon: "mdi mdi-minus",
                                        label: "Remove row",
                                        click: function () {
                                            let selectedItem = $$(detailTableId).getSelectedItem();
                                            if (!selectedItem) return;
                                            $$(detailTableId).editStop();
                                            $$(detailTableId).unselect(selectedItem.id);
                                            $$(detailTableId).remove(selectedItem.id);
                                        },
                                    },
                                    {
                                        view: "button",
                                        type: "icon",
                                        id: "times",
                                        icon: "mdi mdi-cancel",
                                        label: "Remove all",
                                        click: function () {
                                            $$(detailTableId).editStop();
                                            $$(detailTableId).clearAll();
                                        },
                                    },
                                ]
                            },
                            {

                            }

                        ],
                    },
                    {
                        view: "datatable",
                        id: detailTableId,
                        resizeColumn: true,
                        editable: true,
                        select: "cell",
                        footer: true,
                        math: true,
                        data: this.contractDetail,
                        on: {
                            onAfterEditStop: (state, editor, ignoreUpdate) => {
                                let item = $$(detailTableId).getItem(editor.row);
                                if (item.Quantity < 0) item.Quantity = 0;
                                if (item.Discount === 0) item.Discount = 0;
                                item.GrandTotal = item.UnitPrice * item.Quantity;
                                item.GrandTotal -= item.GrandTotal * item.Discount / 100;
                                $$(detailTableId).updateItem(editor.row, item);
                            },

                        },
                        columns: [
                            {
                                id: "packageCode",
                                header: ["Package Code"],
                                editor: "combo",
                                fillspace: true,
                                footer: "Total",
                                suggest: {
                                    view: "gridsuggest",
                                    id: "ten_hanghoa_gridsuggest",
                                    body: {
                                        columns: [
                                            { id: "code", header: "Code", template: "#code#" },
                                            { id: "name", header: "Name", template: "#name#", width: 150 },
                                            { id: "licenseNumberQuantity", header: "License Value", template: "#licenseNumberQuantity#", width: 150 },
                                            { id: "unitPrice", header: "Unit Price", template: "#unitPrice#", width: 350 },
                                        ],
                                        scroll: true,
                                        autoheight: false,
                                    },
                                    on: {
                                        onValueSuggest: function (newv, oldv) {
                                            var table = $$(detailTableId);
                                            newv.quantity = 1;
                                            newv.discount = 0;
                                            newv.packageCode = newv.code;
                                            newv.packageName = newv.name;
                                            newv.licenseNumberQuantity = newv.licenseNumberQuantity;
                                            newv.unitPrice = newv.unitPrice;
                                            newv.taxValue = newv.taxCategoryId;
                                            var selectedItem = table.getSelectedItem();
                                            table.updateItem(selectedItem.id, newv);
                                        },
                                    },
                                    filter: function (item, value) {
                                        return (
                                            Object.values(item).some((val) => String(val).includes(value))
                                        );
                                    },
                                },
                            },
                            {
                                id: "packageName",
                                header: ["Package Name"],
                                editor: "combo",
                                fillspace: true,
                                suggest: {
                                    view: "gridsuggest",
                                    id: "ten_hanghoa_gridsuggest",
                                    body: {
                                        columns: [
                                            { id: "code", header: "Code", template: "#code#" },
                                            { id: "name", header: "Name", template: "#name#", width: 150 },
                                            { id: "licenseNumberQuantity", header: "License Value", template: "#licenseNumberQuantity#", width: 150 },
                                            { id: "unitPrice", header: "Unit Price", template: "#unitPrice#", width: 350 },
                                        ],
                                        scroll: true,
                                        autoheight: false,
                                    },
                                    on: {
                                        onValueSuggest: function (newv, oldv) {
                                            var table = $$(detailTableId);
                                            newv.quantity = 1;
                                            newv.discount = 0;
                                            newv.packageCode = newv.code;
                                            newv.packageName = newv.name;
                                            newv.licenseNumberQuantity = newv.licenseNumberQuantity;
                                            newv.unitPrice = newv.unitPrice;
                                            newv.taxValue = newv.taxCategoryId;
                                            var selectedItem = table.getSelectedItem();
                                            table.updateItem(selectedItem.id, newv);
                                        },
                                    },
                                    filter: function (item, value) {
                                        return (
                                            Object.values(item).some((val) => String(val).includes(value))
                                        );
                                    },
                                },
                            },
                            {
                                id: "licenseNumberQuantity",
                                header: ["License Value (month)"],
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
                                footer: {
                                    content: "summColumn",
                                    css: {
                                        "text-align": "right"
                                    }
                                }
                            },
                            {
                                id: "unitPrice",
                                header: ["UnitPrice"],
                                css: {
                                    "text-align": "right",
                                },
                                fillspace: true,
                                footer: {
                                    content: "summColumn",
                                    css: {
                                        "text-align": "right"
                                    }
                                }
                            },
                            {
                                id: "quantity",
                                header: ["Quantity"],
                                editor: "text", numberFormat: "1'111.00",
                                css: {
                                    "text-align": "right",
                                },
                                fillspace: true,
                                footer: {
                                    content: "summColumn",
                                    css: {
                                        "text-align": "right"
                                    }
                                }
                            },
                            {
                                id: "discount",
                                header: ["Discount (%)"],
                                fillspace: true,
                                editor: "text", numberFormat: "1'111.00",
                                footer: {
                                    content: "summColumn",
                                    css: {
                                        "text-align": "right"
                                    }
                                }
                            },
                            {
                                id: "taxValue",
                                header: ["Tax Value"],
                                fillspace: true,
                                options: `${import.meta.env.VITE_SERVER}/api/taxcategory/get-options`
                            },
                            {
                                id: "grandTotal",
                                header: ["Grand Total"],
                                fillspace: true,
                                footer: {
                                    content: "summColumn",
                                    css: {
                                        "text-align": "right"
                                    }
                                },
                            }
                        ]
                    }
                ]
            }

        ]
        let form = {
            view: "form",
            id: formId,
            elementsConfig: {
                labelWidth: 120
            },
            data: this.contract,
            elements: formElements
        }
        return {
            view: "window",
            id: windowId,
            head: "Contract Form",
            modal: true,
            position: "center",
            width: 1200,
            height: 600,
            body: {
                rows: [
                    form,
                    {
                        cols: [
                            {
                                view: "button",
                                css: "webix_primary",
                                label: "Save",
                                click: () => {
                                    if (!$$(formId).validate()) return;
                                    let formValue = $$(formId).getValues();
                                    let contractDetail = $$(detailTableId).serialize();
                                    if (contractDetail.length === 0) {
                                        webix.message("Detail can not be empty", "error");
                                        return;
                                    }
                                    if (contractDetail.some((val) => {
                                        return val.Quantity === 0
                                    })) {
                                        webix.message("Quantity can not be zero", "error");
                                        return;
                                    }
                                    contractDetail = contractDetail.map((d) => {
                                        delete d.id;
                                        return d;
                                    })
                                    formValue.details = contractDetail
                                    if (Boolean(this.isNew)) {
                                        ajax.post(windowId, "api/contract", formValue, (text, data, xhr) => {
                                            webix.message("Save contract successfully", "success");
                                            $$(windowId).close();
                                            baseComponent.refreshGrid("contractTable")
                                        });
                                    } else {
                                        ajax.put(windowId, "api/contract", formValue, (text, data, xhr) => {
                                            webix.message("Update contract successfully", "success");
                                            $$(windowId).close();
                                            baseComponent.refreshGrid("contractTable")
                                        });
                                    }


                                }
                            },
                            {
                                view: "button",
                                css: "webix_danger",
                                label: "Cancel",
                                click: () => {
                                    $$(windowId).close();
                                }
                            }
                        ]

                    }
                ]
            },
        }
    }
    getActiveLicenseForm(licenseNumberQuantity) {
        const windowId = "activeLicenseWindow";
        const formId = "activeLicenseForm";
        let temp = new Date();
        temp.setMonth(temp.getMonth() + licenseNumberQuantity);
        const formElements = [
            {
                view: "datepicker",
                name: 'licenseStartDate',
                label: "License Start Date",
                value: new Date(),
                required: true,
                invalidMessage: "Can not be blank",
                on: {
                    onchange: (newv, old) => {
                        console.log(newv);
                        let temp = new Date(newv);
                        temp.setMonth(temp.getMonth() + licenseNumberQuantity);
                        $$("licenseEndDate").setValue(temp);
                    }
                }
            },
            {
                view: "text",
                value: licenseNumberQuantity,
                readonly: true,
                label: "License value (month)"
            },
            {
                view: "datepicker",
                id: "licenseEndDate",
                readonly: true,
                label: "LicenseEndDate",
                value: temp
            }
        ]
        const form = {
            view: "form",
            id: formId,
            elementsConfig: {
                labelWidth: 120
            },
            elements: formElements
        }
        return {
            view: "window",
            id: windowId,
            modal: true,
            position: "center",
            width: 500,
            head: "Active license form",
            body: {
                rows: [
                    form,
                    {
                        cols: [
                            {
                                view: "button",
                                css: "webix_primary",
                                label: "Active",
                                click: () => {
                                    if (!$$(formId).validate()) return;
                                    let formValue = $$(formId).getValues();
                                    ajax.patch(windowId, `api/contract/${this.contract.id}/active-license`, JSON.stringify(formValue.licenseStartDate), (text, data, xhr) => {
                                        webix.message("Active license successfully", "success");
                                        $$(windowId).close();
                                        $$("contractTable").clearAll();
                                        $$("contractTable").load($$("contractTable").config.url);
                                    })
                                }
                            },
                            {
                                view: "button",
                                css: "webix_danger",
                                label: "Cancel",
                                click: () => {
                                    $$(windowId).close();
                                }
                            }
                        ]

                    }
                ]
            }
        }
    }
    setContractFormOption() {
        ajax.get(detailTableId, "odata/Package", null, (text, data, xhr) => {
            console.log(data);
            let table = $$(detailTableId);
            const packageNameColumn = "packageName";
            const packageCodeColumn = "packageCode";
            let options = data.json().value;
            let packageNameOption = JSON.parse(JSON.stringify(options)).map((product) => {
                product.value = product.name;
                product.id = product.name;
                return product;
            })
            let packageCodeOption = options.map((product) => {
                product.value = product.code;
                product.id = product.code;
                return product;
            })
            table.getColumnConfig(packageNameColumn).options = packageNameOption;
            table.getColumnConfig(packageCodeColumn).options = packageCodeOption;
        })
    }
}