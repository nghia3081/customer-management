import ajax from "../../helper/ajax";
import baseComponent from "../../models/base-control";
const windowId = "menuWindowId";
const formId = "menuFormId";
export default class MenuForm {
    menu;
    isNew;
    constructor(menu, isNew) {
        this.menu = menu;
        this.isNew = isNew;
    }
    getForm() {

        const invalidMessage = "This field can not be blank"
        let formElements = [
            {
                view: "text",
                name: "MenuId",
                label: "Menu Id",
                required: true,
                invalidMessage: invalidMessage
            },
            {
                view: "text",
                name: "Title",
                label: "Menu Title",
                required: true,
                invalidMessage: invalidMessage,
            },
            {
                view: "text",
                name: "TabTitle",
                label: "Tab Title",
                required: true,
                invalidMessage: invalidMessage,
            },
            {
                view: "text",
                name: "Icon",
                label: "Icon Code",
                required: true,
                invalidMessage: invalidMessage
            },
            {
                view: "text",
                type: "number",
                name: "Order",
                label: "Order",
                required: true,
                invalidMessage: invalidMessage
            },
            {
                view: "combo",
                name: "ParentMenuId",
                id: "ParentMenuIdFormCombo",
                label: "Parent",
            }
        ]
        let form = {
            view: "form",
            id: formId,
            elementsConfig: {
                labelWidth: 120
            },
            data: this.menu,
            elements: formElements
        }
        return {
            view: "window",
            id: windowId,
            head: "Menu Form",
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
                                    delete (formValue.id);
                                    if (Boolean(this.isNew)) {
                                        ajax.post(windowId, "api/menu", formValue, (text, data, xhr) => {
                                            webix.message("Save menu successfully", "success");
                                            $$(windowId).close();
                                            baseComponent.refreshGrid("menuSettingTree")
                                        });
                                    } else {
                                        ajax.put(windowId, "api/menu", formValue, (text, data, xhr) => {
                                            webix.message("Update menu successfully", "success");
                                            $$(windowId).close();
                                            baseComponent.refreshGrid("menuSettingTree")
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
    setParentMenuIdFormCombo() {
        ajax.get(windowId, "odata/Menu?$filter=parentMenuId eq null", null, (text, data, xhr) => {
            let dataJson = data.json().value;
            $$("ParentMenuIdFormCombo").define("options", dataJson.map((val) => { return { id: val.menuId, value: val.title } }));
            $$("ParentMenuIdFormCombo").refresh();
        })
    }
}