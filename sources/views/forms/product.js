import ajax from "../../helper/ajax";
import baseComponent from "../../models/base-control";
export default class ProductForm {
    product;
    isNew;
    constructor(product, isNew) {
        this.product = product;
        this.isNew = isNew;
    }
    getForm() {
        const windowId = "productFormWindow";
        const formId = "customerForm";
        const invalidMessage = "This field can not be blank"
        let formElements = [
            {
                view: "text",
                name: "Code",
                label: 'Product Code',
                required: true,
                readonly: !Boolean(this.isNew),
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
                view:"textarea",
                name:"Description",
                label:"Description",
                
            },
            {
                view:"text",
                type:"number",
                name:'LicenseNumberQuantity',
                label:"License value (month)",
                required:true,
                invalidMessage
            },
            {
                view:"text",
                type:"number",
                name:"UnitPrice",
                label:"Unit Price",
                required:true,
                invalidMessage
            },
            {
                view:"combo",
                name:"TaxCategoryId",
                label:"Tax Value",
                required:true,
                invalidMessage,
                options: `${import.meta.env.VITE_SERVER}/api/taxcategory/get-options`
            }
        ]
        let form = {
            view: "form",
            id: formId,
            elementsConfig: {
                labelWidth: 140
            },
            data: this.product,
            elements: formElements
        }
        return {
            view: "window",
            id: windowId,
            head: "Product Form",
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
                                        ajax.post(windowId, "api/package", formValue, (text, data, xhr) => {
                                            webix.message("Save product successfully", "success");
                                            $$(windowId).close();
                                            baseComponent.refreshGrid("productGrid")
                                        });
                                    } else {
                                        ajax.put(windowId, "api/package", formValue, (text, data, xhr) => {
                                            webix.message("Update product successfully", "success");
                                            $$(windowId).close();
                                            baseComponent.refreshGrid("productGrid")
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