﻿$(document).ready(function () {
    getAllUsers();
});

function getAllUsers() {
    let userPromis = $.Deferred();
    let usersDataSource = new DevExpress.data.DataSource({
        key: "Id",
        load: () => {
            $.ajax({
                type: "GET",
                url: "/UserManagement/GetUsers",
                contentType: "application/json",
                data: "{}",
                success: (data) => {
                    console.log("succ")
                    console.log(data);
                    userPromis.resolve(data);
                },
                error: (data) => {
                    userPromis.reject(data);
                }
            });
            return userPromis.promise();
        },
        insert: function (values) {
            $.ajax({
                url: "/Account/SaveUser",
                type: "POST",
                data: JSON.stringify({ model: values }),
                contentType: 'application/json; charset=utf-8',
            });
        },
        update: function (key, values) {
            const users = usersDataSource.items();
            let editedUser = users.find(user => user.Id === key);
            editedUser = {
                ...editedUser,
                FirstName: values.FirstName ? values.FirstName : editedUser.FirstName,
                LastName: values.LastName ? values.LastName : editedUser.LastName,
                DealerName: values.DealerName ? values.DealerName : editedUser.DealerName,
                Email: values.Email ? values.Email : editedUser.Email,
                RoleId: values.RoleId ? values.RoleId : editedUser.RoleId,
                isActive: values.isActive ? values.isActive : editedUser.isActive
            }
            $.ajax({
                url: "/UserManagement/EditUser",
                type: "POST",
                data: JSON.stringify({ Id: key, editData: editedUser }),
                contentType: 'application/json; charset=utf-8',
            });
        },
        remove: function (key) {
            $.ajax({
                url: "/UserManagement/DeleteUser",
                type: "POST",
                data: JSON.stringify({ Id: key }),
                contentType: 'application/json; charset=utf-8',
            });
            $("#usersGrid").dxDataGrid("instance").refresh()
        }
    });
    function rolesDropdownData() {
        let d = new $.Deferred();
        const lookupRolesSource = {
            store: new DevExpress.data.CustomStore({
                key: "id",
                loadMode: "raw",
                load: function () {
                    return $.ajax({
                        url: "/User/RoleDropdown",
                        type: "GET",
                        data: "{}",
                        dataType: 'json',
                        contentType: 'application/json; charset=utf-8',
                        success: (data) => {
                            d.resolve(data);
                        },
                        error: (data) => {
                            d.reject(data);
                        }
                    });
                }
            }),
            sort: "text"
        }
        return lookupRolesSource;
    }

    $("#usersGrid").dxDataGrid({
        dataSource: usersDataSource,
        showBorders: true,
        paging: {
            pageSize: 10
        },
        pager: {
            visible: true,
            allowedPageSizes: [10, 15, 50, 100],
            showPageSizeSelector: true,
            showInfo: true,
            showNavigationButtons: true
        },
        columnAutoWidth: true,
        editing: {
            refreshMode: "full",
            mode: "popup",
            allowUpdating: true,
            allowDeleting: true,
            allowAdding: true,
            popup: {
                title: "User",
                showTitle: true,
                width: 500,
                height: 525,
            },
            form: {
                items: [
                    {
                        dataField: "FirstName",
                        colSpan: 2,
                    },
                    {
                        dataField: "LastName",
                        colSpan: 2,
                    },
                    {
                        dataField: "Address",
                        colSpan: 2,
                    },
                    {
                        dataField: "Country",
                        colSpan: 2,
                    },
                    {
                        dataField: "City",
                        colSpan: 2
                    },
                    {
                        dataField: "Email",
                        colSpan: 2,
                    },
                    {
                        dataField: "Phone",
                        colSpan: 2,
                    },
                    {
                        dataField: "Role",
                        colSpan: 2,
                    },
                    {
                        dataField: "isActive",
                        colSpan: 2
                    }
                ]
            },
        },
        onEditorPreparing: function (e) {
            if (e.dataField === "Password" && e.parentType === "dataRow") {
                e.editorOptions.mode = 'password';
            }
        },
        columns: [
            {
                dataField: "FirstName",
                caption: "First Name"
            },
            {
                dataField: "LastName",
                caption: "Last Name"
            },
            {
                dataField: "Address",
                caption: "Address"
            },
            //{
            //    dataField: "Id",
            //    caption: "Number",
            //    dataType: "text",
            //    visible: false,
            //    allowEditing: false,
            //    formItem: {
            //        visible: false
            //    }
            //},
            {
                dataField: "Country",
                caption: "Country",
            },
            {
                dataField: "City",
                caption: "City"
            },
            {
                dataField: "Email",
                caption: "Email"
            },
            {
                dataField: "Phone",
            },
            {
                dataField: "Role"
            },
            {
                dataField: "isActive",
                caption: "Is Active"
            },
             {
                    dataSource: rolesDropdownData(),
                    valueExpr: "Id",
                   displayExpr: "Name",
                }
            //},
            //{
            //    dataField: "RoleId",
            //    caption: "Role",
            //    dataType: "string",
            //    visible: false,
            //    allowEditing: {
            //        formItem: {
            //            visible: true
            //        }
            //    },
            //    lookup:
            //    {
            //        dataSource: rolesDropdownData(),
            //        valueExpr: "Id",
            //        displayExpr: "Name",
            //    }
            //},

        ],
    }).dxDataGrid("instance");
}