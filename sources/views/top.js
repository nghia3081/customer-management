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
					return ajax.get(mainScreenId, `odata/User('${user.getUsername()}')?$expand=Menus&$select=Menus`, null, function (text, data, xhr) {
						var menu = Array.from(data.json().menus).map(x => { x.id = x.menuId; return x ;});
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
					view: "button",
					type: "icon",
					icon: "mdi mdi-account",
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