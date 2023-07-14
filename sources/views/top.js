import { JetView, plugins } from "webix-jet";
import ajax from "../helper/ajax";
import user from "../models/user";
const mainScreenId = import.meta.env.VITE_APP_ID;
export default class TopView extends JetView {

	config() {
		const barHeight = 70;
		var menu = {
			view: "menu",
			id: "top:menu",
			css: {
				"text-align": "center",
				"background": "none",
				"border": "none"
			},
			width: 1000,
			borderless: true,
			autowidth: true,
			select: true,
			template: "<div style='text-align:center'><span style='font-size:1.3em' class='#icon#'></span><p style='padding: 0;margin:0'>#title#</p></div>",
			type: {
				height: barHeight - barHeight * 10 / 100,
				css: {
					"text-align": "center",
				}
			},
			url: {
				$proxy: true,
				load: function (view, params) {
					return ajax.get(mainScreenId, `odata/User('${user.getUser().username}')?$expand=Menus&$select=Menus`, null, function (text, data, xhr) {
						var menu = Array.from(data.json().menus).map(x => { x.id = x.menuId; return x; });
						menu.sort((a, b) => a.order - b.order)
						view.parse(menu)
					})
				}
			},
		};
		var leftToolbar = {
			css: {
				"text-align": "left"
			},
			cols: [
				{
					view: "template",
					template: "<a href='#!/top/home'><img src='sources/assets/images/logo.png' /></a>"
				}
			]

		}
		var rightToolbar = {
			css: {
				"text-align": "right"
			},
			cols: [
				{
					view: "menu",
					id: "account-button",
					template: "<div style='text-align:center'><span style='font-size:1.3em' class='#icon#'></span><p style='padding: 0;margin:0'>#value#</p></div>",
					label: user.getUser().fullName,
					autowidth: true,
					data: [
						{
							icon: "mdi mdi-account",
							value: user.getUser().fullName,
							submenu: [
								{
									id: "changePass",
									icon: "mdi mdi-key-change",
									value: "Change password"
								},
								{
									id: "infomation",
									icon: "mdi mdi-clipboard-account",
									value: "Account information",
									click: () => {
										let userInfor = user.getUser();
										const windowId = "account-info-window";
										const formid = "account-info-form"
										const invalidMessage = "This field is required";
										let window = {
											view: "window",
											id: windowId,
											position: 'center',
											modal: true,
											width: 500,
											head: "Your Account Information",
											body: {
												view: "form",
												id: formid,
												elementsConfig: {
													labelWidth: 120
												},
												data: userInfor,
												elements: [
													{
														view: "text",
														name: "username",
														readonly: true,
														required: true,
														label: 'Username',
														invalidMessage: invalidMessage
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
														invalidMessage: invalidMessage
													},
													{
														view: "text",
														name: "fullName",
														label: "Full Name",
														required: true,
														invalidMessage: invalidMessage
													},
													{
														cols: [
															{
																view: "button",
																css: "webix_primary",
																label: "Save",
																click: () => {
																	const form = $$(formid);
																	if (!form.validate()) {
																		return;
																	}
																	let formValue = form.getValues();
																	ajax.put(windowId, "api/user/update-information", formValue, (text, data, xhr) => {
																		webix.message("Update successfully", "success");
																		webix.message("Your information would be correct on next login session");
																		$$(windowId).close();
																	})
																}
															},
															{
																view: "button",
																css: "webix_danger",
																label: 'Cancel',
																click: () => {
																	$$(windowId).close();
																}
															}
														]
													}
												]
											}
										}
										$$("account-button").$scope.ui(window).show();
									}
								},
								{
									id: "logout",
									icon: 'mdi mdi-logout',
									value: "Log out",
									click: () => {
										user.logout();
										window.location.reload();
									}
								}
							]
						}
					],
					on: {
						onMenuItemClick: (id) => {
							let item = $$("account-button").getMenuItem(id);
							if (item.click) {
								item.click();
							}
						}
					}
				}
			]
		}
		var ui = {
			id: mainScreenId,
			paddingX: 5,
			borderless: true,
			css: "app_layout",
			rows: [
				{
					height: barHeight,
					body: {
						cols: [
							leftToolbar,
							menu,
							rightToolbar
						]
					}
				},
				{
					type: "wide",
					rows:
						[
							{ $subview: true }
						]
				}
			]
		};

		return ui
	}
	init() {
		this.use(plugins.Menu, "top:menu");
		webix.extend($$(mainScreenId), webix.ProgressBar);

	}
}