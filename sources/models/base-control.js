var getCrudButtom = function (refreshFunction, createFunction, updateFunction, removeFunction) {
    return [
        {
            view: "button",
            type: "icon",
            icon: "mdi mdi-refresh",
            label: "Refresh",
            click: () => {
                refreshFunction()
            }
        },
        {
            view: "button",
            type: "icon",
            icon: "mdi mdi-plus",
            label: "Create",
            click: () => {
                createFunction()
            }
        },
        {
            view: "button",
            type: "icon",
            icon: "mdi mdi-pencil",
            label: "Update",
            click: () => {
                updateFunction()
            }
        },
        {
            view: "button",
            type: "icon",
            icon: "mdi mdi-trash-can-outline",
            label: "Remove",
            click: () => {
                removeFunction()
            }
        }
    ]
}
var baseComponent = {
    getCrudButtom
}
export default baseComponent