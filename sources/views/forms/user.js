import ajax from "../../helper/ajax";
import baseComponent from "../../models/base-control";
const windowId = "userWindowId";
const formId = "userFormId";
export default class UserForm {
    user;
    isNew;
    constructor(user, isNew) {
        this.user = user;
        this.isNew = isNew;
    }
    getForm() {

        const invalidMessage = "This field can not be blank"
        let formElements = [
            {
                view: "text",
                name: "username",
                label: "Username",
                required: true,
                invalidMessage: invalidMessage
            },
            {
                view: "text",
                type: "password",
                name: "password",
                label: "Password",
                required: true,
                invalidMessage: invalidMessage,
                readonly: !this.isNew
            },
            {
                view: "text",
                name: "phone",
                label: "Phone",
                required: true,
                invalidMessage: invalidMessage
            },
            {
                view: "text",
                name: "email",
                label: "Email",
                required: true,
                validate: webix.rules.isEmail,
                invalidMessage: invalidMessage
            },
            {
                view: "text",
                name: "fullName",
                label: "FullName",
                required: true,
                invalidMessage: invalidMessage
            }
        ]
        let form = {
            view: "form",
            id: formId,
            elementsConfig: {
                labelWidth: 120
            },
            data: this.user,
            elements: formElements
        }
        return {
            view: "window",
            id: windowId,
            head: "User Form",
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
                                        ajax.post(windowId, "api/user", formValue, (text, data, xhr) => {
                                            webix.message("Save user successfully", "success");
                                            $$(windowId).close();
                                            baseComponent.refreshGrid("manageUserGrid")
                                        });
                                    } else {
                                        ajax.put(windowId, "api/user", formValue, (text, data, xhr) => {
                                            webix.message("Update user successfully", "success");
                                            $$(windowId).close();
                                            baseComponent.refreshGrid("manageUserGrid")
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