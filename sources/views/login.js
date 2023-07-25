import { JetView } from "webix-jet";
import ajax from "../helper/ajax";
const resetWinId = "resetWindow";
const resetFormId = "resetForm";
const resetPassForm = {
    view: "window",
    id: resetWinId,
    modal: true,
    position: "center",
    width: 400,
    head: "Reset your password",
    body: {
        view: "form",
        id: resetFormId,
        elementsConfig: {
            labelWidth: 120
        },
        elements: [
            {
                view: "text",
                name: "username",
                label: "Username",
                required: true,
                invalidMessage: "Username is required"
            },
            {
                view: "text",
                name: "email",
                label: "Email",

                required: true,
                validate: webix.rules.isEmail,
                invalidMessage: "Please enter an valid email",
                placeholder: "Please enter email you have used to register your account"
            },
            {
                cols: [
                    {
                        view: "button",
                        css: "webix_primary",
                        label: "Reset password",
                        click: () => {
                            let form = $$(resetFormId);
                            if (!form.validate()) {
                                return;
                            }
                            let formValue = form.getValues();
                            ajax.patch(resetWinId, "api/user/reset-password", formValue, (text, data, xhr) => {
                                webix.message("Reset password successfully", "success");
                                webix.message("Please check your mail box to get your password");
                                $$(resetWinId).close();
                            })
                        }
                    },
                    {
                        view: "button",
                        css: "webix_danger",
                        label: "Cancel",
                        click: () => {
                            $$(resetWinId).close();
                        }
                    }
                ]
            }
        ]
    }

}
export default class LoginView extends JetView {
    config() {
        const login_form = {
            view: "form", id: "login:form",
            width: 400, borderless: false, margin: 10,
            rows: [
                { type: "header", template: this.app.config.name },
                { view: "text", name: "login", label: "User Name", labelPosition: "top" },
                { view: "text", type: "password", name: "pass", label: "Password", labelPosition: "top" },
                {
                    cols: [
                        {
                            view: "checkbox",
                            name: "remember",
                            labelRight: "Remember",
                            labelWidth: 0
                        },
                        {
                            view: "button",
                            label: "Forgot password",
                            click: () => {
                                $$('login:form').$scope.ui(resetPassForm).show();
                            }
                        }
                    ]
                },

                { view: "button", css: "webix_primary", value: "Login", click: () => this.do_login(), hotkey: "enter" },
            ],
            rules: {
                login: webix.rules.isNotEmpty,
                pass: webix.rules.isNotEmpty
            },
            data: webix.storage.cookie.get(import.meta.env.VITE_USER)
        };

        return {
            css: {
                "background": "../assets/images/logo.png"
            },
            cols: [
                {},
                {
                    rows: [
                        {},
                        login_form,
                        {}
                    ]
                },
                {}

            ]
        };
    }

    init(view) {
        view.$view.querySelector("input").focus();
    }

    do_login() {
        const user = this.app.getService("user");
        const form = this.$$("login:form");

        if (form.validate()) {
            const data = form.getValues();
            if (data.remember === 1) {
                webix.storage.cookie.put(import.meta.env.VITE_USER, data);
            } else {
                webix.storage.cookie.remove(import.meta.env.VITE_USER);
            }
            webix.extend(form, webix.ProgressBar);
            form.disable();
            form.showProgress({
                type: "top"
            })
            user.login(data.login, data.pass).catch(function (xhr) {
                form.enable();
                form.hideProgress();
                webix.message(xhr.response, "error");
            });
        }
    }
}