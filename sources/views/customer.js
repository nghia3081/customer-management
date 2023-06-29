import CustomerForm from "./forms/customer.js";
import baseComponent from "../models/base-control.js"
import login from "./login.js";
const gridId = "customerTableId";
let controls = baseComponent.getCrudButtom(() => { }, () => {
    webix.ui(new CustomerForm(null, true).getForm()).show();

}, () => { }, () => { })
controls.push({
    view: 'button',
    type: "icon",
    icon: "mdi mdi-book",
    label: "Contracts",
    click: () => {

    }
})
controls.push({
    view: "button",
    type: "icon",
    icon: "mdi mdi-file-excel",
    label: "Export excels",
    click: () => {
        new login().render()
    }
})
const columnWidth = 200;
const grid = {
    view: "datatable",
    id: gridId,
    select: true,
    columns: [
        {
            id: "taxCode",
            header: [
                "TaxCode",
                {
                    content: 'serverFilter'
                }
            ],
            sort: "server",
            width: columnWidth,
        },
        {
            id: "name",
            header: [
                "Name",
                {
                    content: "serverFilter"
                }
            ],
            fillspace: true,
            sort: "server"
        },
        {
            id: "email",
            header: [
                "Email",
                {
                    content: "serverFilter"
                }
            ],
            sort: "server",
            width: columnWidth,
        },
        {
            id: "phone",
            header: [
                "Phone",
                {
                    content: "serverFilter"
                }
            ],
            sort: "server",
            width: columnWidth,
        },
        {
            id: "address",
            header: [
                "Address",
                {
                    content: "serverFilter"
                }
            ],
            sort: "server",
            width: columnWidth,
        },
        {
            id: "createdDate",
            header: [
                "Created Date",
                {
                    content: "serverFilter"
                },

            ],
            sort: "server",
            width: columnWidth,
        },
        {
            id: "createdBy",
            header: [
                "Created By",
                {
                    content: "serverFilter"
                }
            ],
            sort: "server",
            width: columnWidth,
        }

    ]
}
const layout = {
    rows: [
        {
            height: 40,
            cols: [
                {
                    cols: controls
                },
                {

                }
            ]
        },
        grid
    ]
}
export default layout;