import ajax from "../../helper/ajax";
import baseComponent from "../../models/base-control";
export default class CustomerForm {
    customer;
    isNew;
    constructor(customer, isNew) {
        this.customer = customer;
        this.isNew = isNew;
    }
    getForm() {
        const windowId = "customerWindowId";
        const formId = "customerFormId";
        const invalidMessage = "This field can not be blank"
        let formElements = [
            {
                view: "text",
                name: "TaxCode",
                label: 'Tax Code',
                required: true,
                invalidMessage
            },
            {
                view: "text",
                name: "Name",
                label: "Name",
                required: true,
                invalidMessage
            },
            {
                cols:
                    [
                        {
                            view: "text",
                            name: "Email",
                            label: "Email",
                            required: true,
                            invalidMessage
                        },
                        {
                            view: "text",
                            name: "Phone",
                            label: "Phone",
                            required: true,
                            invalidMessage
                        }
                    ]
            },
            {
                view: "text",
                name: "Address",
                label: "Address",
                required: true,
                invalidMessage
            }
        ]
        let form = {
            view: "form",
            id: formId,
            elementsConfig: {
                labelWidth: 120
            },
            data: this.customer,
            elements: formElements
        }
        return {
            view: "window",
            id: windowId,
            head: "Customer Form",
            modal: true,
            position: "center",
            width: 800,
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
                                    delete(formValue.id);
                                    if(Boolean(this.isNew)){
                                        ajax.post(windowId, "api/customer", formValue, (text, data, xhr) => {
                                            webix.message("Save customer successfully", "success");
                                            $$(windowId).close();
                                            baseComponent.refreshGrid("customerTableId")
                                        });
                                    } else {
                                        ajax.put(windowId, "api/customer", formValue, (text, data, xhr) => {
                                            webix.message("Update customer successfully", "success");
                                            $$(windowId).close();
                                            baseComponent.refreshGrid("customerTableId")
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
}