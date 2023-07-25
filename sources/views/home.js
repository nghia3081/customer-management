export default {
    rows: [
        {

            cols: [
                {
                    header: "Number of customers report",
                    body: {
                        view: "chart",
                        type: "bar",
                        id: "customerReport",
                        value: "#monthValue#",
                        label: "#monthValue#",
                        barWidth: 35,
                        radius: 0,
                        gradient: "falling",
                        url: {
                            $proxy: true,
                            load: (view, callback, params) => {
                                var url = `${import.meta.env.VITE_SERVER}/api/customer/get-number-customers`
                                return webix.ajax().bind(view).get(url, callback);
                            }
                        },
                        xAxis: {
                            template: "#month#",
                            title: "Month"
                        },
                        yAxis: {
                            title: "Customers"
                        }
                    }
                },
                {
                    header: "Number of contracts (signed) report",
                    body: {
                        view: "chart",
                        type: "bar",
                        value: "#monthValue#",
                        label: "#monthValue#",
                        barWidth: 35,
                        radius: 0,
                        gradient: "falling",
                        url: {
                            $proxy: true,
                            load: (view, callback) => {
                                var url = `${import.meta.env.VITE_SERVER}/api/contract/get-number-contracts`
                                return webix.ajax().bind(view).get(url, callback);
                            }
                        },
                        xAxis: {
                            template: "#month#",
                            title: "Month"
                        },
                        yAxis: {
                            title: "Contracts"
                        }
                    }
                },
            ]
        },
        {
            header: "Income value",
            body: {
                view: "chart",
                type: "bar",
                value: "#monthValue#",
                label: "#monthValue#",
                barWidth: 35,
                radius: 0,
                gradient: "falling",
                url: {
                    $proxy: true,
                    load: (view, callback) => {
                        var url = `${import.meta.env.VITE_SERVER}/api/contract/get-income-value`
                        return webix.ajax().bind(view).get(url, callback);
                    }
                },
                xAxis: {
                    template: "#month#",
                    title: "Month"
                },
                yAxis: {
                    title: "Income value"
                }
            }
        },
    ]
}