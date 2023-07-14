import ajax from "../helper/ajax";
import baseComponent from "../models/base-control";
import ProductForm from "./forms/product";

const gridId = "productGrid";
const pagerId = "productPager";
const columnWidth = 200;
let controls = baseComponent.getCrudButtom(
    () => {
        baseComponent.refreshGrid(gridId);
    },
    () => {
        webix.ui(new ProductForm(null, true).getForm()).show();
    },
    () => {
        webix.ui(new ProductForm(baseComponent.getSelectedItem(gridId), false).getForm()).show();
    },
    () => {
        let selectedItem = baseComponent.getSelectedItem(gridId);
        webix.confirm({
            text: "Are you sure to delete this item?",
            callback: (res) => {
                if (!res) return;
                ajax.del(gridId, `api/package/${selectedItem.Code}`, null, function (text, data, xhr) {
                    webix.message("Remove successfully", "success");
                    baseComponent.refreshGrid(gridId);
                })
            }
        })

    })
const grid = {
    view: "datatable",
    id: gridId,
    select: true,
    pager: pagerId,
    columns: [
        {
            id: "Code",
            header: [
                "Package Code",
                {
                    content: "serverFilter"
                }
            ],
            sort: "server",
            width: columnWidth
        },
        {
            id: "Name",
            header: [
                "Name",
                {
                    content: "serverFilter"
                }
            ],
            sort: "server",
            fillspace: true,
        },
        {
            id: "Description",
            header: [
                "Description",
                {
                    content: "serverFilter"
                }
            ],
            sort: "server",
            width: columnWidth,
            fillspace: true,
        },
        {
            id: "UnitPrice",
            header: [
                "Unit Price",
                {
                    content: "serverFilter"
                }
            ],
            sort: "server",
            width: columnWidth
        },
        {
            id: "CreatedDate",
            header: [
                "Created Date",
                {
                    content: "serverFilter"
                }
            ],
            sort: "server",
            width: columnWidth
        },
        {
            id: "TaxCategoryId",
            header: [
                "Tax value",
                {
                    content: "serverSelectFilter"
                }
            ],
            options: `${import.meta.env.VITE_SERVER}/api/taxcategory/get-options`,
            sort: "server",
            width: columnWidth,
            columnType: "eq"
        }

    ],
    url: baseComponent.getGridUrlConfig('api/Package', 'TaxCategory')
}

const layout = {
    rows: [
        {
            height: 40,
            cols: [
                {
                    cols: controls
                },
            ]
        },
        grid,
        {
            css: {
                "text-align": "center"
            },
            view: "pager",
            id: pagerId,
            template: "{common.prev()}{common.pages()}{common.next()}",
            group: 5,
            size: 50
        }
    ]
}
export default layout;