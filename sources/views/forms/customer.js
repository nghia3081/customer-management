import ajax from "../../helper/ajax";
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
                name: "taxCode",
                label: 'Tax Code',
                required: true,
                invalidMessage
            },
            {
                view: "text",
                name: "name",
                label: "Name",
                required: true,
                invalidMessage
            },
            {
                view: "text",
                name: "email",
                label: "Email",
                required: true,
                invalidMessage
            },
            {
                view: "text",
                name: "phone",
                label: "Phone",
                required: true,
                invalidMessage
            },
            {
                view: "text",
                name: "address",
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
                                    ajax.post(windowId, "api/customer", formValue, (text, data, xhr) => {
                                        webix.message("Save customer successfully", "success");
                                    });
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