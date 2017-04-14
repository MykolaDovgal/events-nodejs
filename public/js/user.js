/**
 * Created by tegos on 12.04.2017.
 */

$(document).ready(function () {
    var user_tables = $('#users-list-datatable').DataTable({

        "ajax": "/api/users/",
        "columns": [
            {"data": 'id', width: '90'},
            {
                'data': 'profile_picture',
                'render': function (data, type, full, meta) {
                    return '<img class="profile-picture" src="' + data + '"/>';
                },
                width: '150'
            },
            {
                'data': 'active',
                'render': function (data, type, full, meta) {
                    var content;
                    if (data) {
                        content = '<span class="badge badge-success">Active</span>'
                    } else {
                        content = '<span class="badge badge-danger">Disable</span>';
                    }
                    return content;
                },
                width: '100'
            },
            {
                "data": "username",
                width: 200,
                'render': function (data, type, full, meta) {
                    console.log(full);
                    var content = data;

                    content = '<span class="badge badge-danger">Disable</span>';

                    return content;
                }
            },
            {"data": "realname"}
        ],
        "columnDefs": [
            {
                "targets": 'no-sort',
                "orderable": false
            }
        ],
        "autoWidth": false,

        buttons: [
            {extend: 'print', className: 'btn dark btn-outline'},
            {extend: 'pdf', className: 'btn green btn-outline'},
            {extend: 'csv', className: 'btn purple btn-outline '}
        ],
        scrollY: 500,
        //deferRender: true,
        scroller: true,
        responsive: true,
        //scrollCollapse: true,

        "dom": "<'row' <'col-md-12'B>> <'table-scrollable't><'row'<'col-md-12'i>>",

        //stateSave: true,
        //"paging": false
    });

    // reload table
    $('#user-table-reload').click(function () {
        updateUserTable();
    });


    // var uploadCrop = $('#upload-profile-pic').croppie({
    //     enableExif: true,
    //     viewport: {
    //         width: 100,
    //         height: 100,
    //         type: 'circle'
    //     },
    //     boundary: {
    //         width: 200,
    //         height: 200
    //     }
    // });

    //uploadCrop.croppie('bind');


    $('#add-new-user-modal').on('shown.bs.modal', function (e) {
        $('#button-create-user').click(function () {
            var form = $('#form_add_user');
            var formData = new FormData(form[0]);
            $.ajax({
                url: '/user/add/',
                type: 'POST',
                cache: false,
                contentType: false,
                processData: false,
                data: formData,
                success: function (data) {
                    var status = data.status;
                    var message = data.message;

                    bootbox.alert({
                        title: status ? 'Success' : 'Error',
                        message: message,
                        callback: function () {
                            if (status) {
                                $('#form_add_user')[0].reset();
                                $('#add-new-user-modal').modal('hide');
                                updateUserTable();
                            }
                        }
                    });

                },
                error: function (jqXHR, textStatus, err) {
                    bootbox.alert('Server error');
                }
            });
        });
    });

    function updateUserTable() {
        user_tables.clear().draw();
        setTimeout(function () {
            user_tables.ajax.reload();
            user_tables.columns.adjust().draw();
        }, 1000);
    }

});

