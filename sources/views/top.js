import { JetApp, JetView, plugins } from "webix-jet";
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
			template: "<div style='text-align:center'><span style='font-size:1.3em' class='#icon#'></span><p style='padding: 0;margin:0'>#value#</p></div>",
			type: {
				height: barHeight - barHeight * 10 / 100,
				css: {
					"text-align": "center",
				}
			},
			on: {
				onMenuItemClick: (id) => {
					let item = $$("top:menu").getMenuItem(id);
					$$("top:menu").$scope.show(item.id);
				}
			},
			url: {
				$proxy: true,
				load: function (view, params) {
					let parentMenuGetting = ajax.ajax.get(`${import.meta.env.VITE_SERVER}/api/menu/get-with-custom-response?$filter=parentMenuId eq null and users/any(u:u/username eq '${user.getUser().username}')`)
					let childMenuGetting = ajax.ajax.get(`${import.meta.env.VITE_SERVER}/api/menu/get-with-custom-response?$filter=parentMenuId ne null and users/any(u:u/username eq '${user.getUser().username}')`)
					return webix.promise.all([parentMenuGetting, childMenuGetting]).then((response) => {
						let parentData = response[0].json().data;
						let childData = response[1].json().data;
						let result = parentData.map((p) => {
							let child = childData.filter((c) => c.parentMenuId === p.menuId);
							return {
								id: p.menuId,
								value: p.title,
								tab: p.tabTitle,
								icon: p.icon,
								order: p.order,
								submenu: child.length === 0 ? null : child.map((c) => {
									return {
										id: c.menuId,
										value: c.title,
										tab: c.tabTitle,
										icon: c.icon,
										order: c.order,
										parentId: c.parentMenuId
									}
								}).sort((a, b) => a.order - b.order)
							}
						}).sort((a, b) => a.order - b.order)
						view.parse(result)
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
									value: "Change password",
									click: () => {
										const windowId = "changePassWindow";
										const formId = "changePassForm";
										const elements = [
											{
												view: "text",
												type: "password",
												name: "currentPassword",
												id: "currentPassword",
												label: "Current password",
												required: true,
												invalidMessage: "Please type in your current password"
											},
											{
												view: "text",
												type: "password",
												name: "newPassword",
												id: "newPassword",
												required: true,
												invalidMessage: "New password can not be blank or can not same with current password",
												label: "New password",
												validate: (value) => {
													return value !== $$("currentPassword").getValue();
												}
											},
											{
												view: "text",
												type: "password",
												name: "confirmNewPassword",
												label: "Confirm new password",
												required: true,
												invalidMessage: "This field can not be blank or not match new password",
												validate: (value) => {
													return value === $$("newPassword").getValue();
												}
											},
											{
												cols: [
													{
														view: "button",
														css: "webix_primary",
														label: "Change password",
														click: () => {
															if (!$$(formId).validate()) return;
															let formValue = $$(formId).getValues();
															ajax.post(windowId, "api/user/change-password", formValue, (text, data, xhr) => {
																webix.message('Change password successfully', "success");
																$$(windowId).close();
																setTimeout(() => {
																	user.logout();
																	window.location.reload();
																}, 2000)
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
										const form = {
											view: "form",
											id: formId,
											elementsConfig: {
												labelWidth: 150
											},
											elements: elements
										}
										const changePassWindowForm = {
											view: "window",
											id: windowId,
											modal: true,
											position: "center",
											head: "Change password form",
											width: 500,
											body: form
										}
										$$("account-button").$scope.ui(changePassWindowForm).show();
									}
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