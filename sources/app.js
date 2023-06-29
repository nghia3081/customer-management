import user from "./models/user";
import "./styles/app.css";
import { JetApp, EmptyRouter, HashRouter, plugins } from "webix-jet";

// dynamic import of views
const modules = import.meta.glob("./views/**/*.js");
const views = name => modules[`./views/${name}.js`]().then(x => x.default);
// locales, optional
const locales = import.meta.glob("./locales/*.js");
const words = name => locales[`./locales/${name}.js`]().then(x => x.default);
export default class MyApp extends JetApp {
	constructor(config) {
		const defaults = {
			name:  import.meta.env.VITE_APPNAME,
			id: import.meta.env.VITE_APPNAME,
			version: import.meta.env.VITE_VERSION,
			router: import.meta.env.VITE_BUILD_AS_MODULE ? EmptyRouter : HashRouter,
			debug: !import.meta.env.PROD,
			start: "/top/home",
			host: import.meta.env.VITE_SERVER,
			// set custom view loader, mandatory
			views
		};
		super({ ...defaults, ...config });

		// locales plugin, optional
		this.use(plugins.Locale, {
			path: words,
			storage: this.webix.storage.session
		});
		this.use(plugins.User, { model: user });

	}
}

if (!import.meta.env.VITE_BUILD_AS_MODULE) {
	webix.ready(() => {
		new MyApp().render()
		
	});
}
