/**
 * Created by tegos on 12.04.2017.
 */

$(document).ready(function () {
    var user_tables = $('#users-list-datatable').DataTable({
        "ajax": "/api/users/",
        "columns": [
            {"data": 'id'},
            {
                'data': 'profile_picture',
                'render': function (data, type, full, meta) {
                    return '<img class="profile-picture" src="' + data + '"/>';
                }
            },
            {"data": "username"},
            {"data": "realname"}
        ]
    });

    // reload table
    $('#user-table-reload').click(function () {
        user_tables.clear().draw();
        setTimeout(function () {

            user_tables.ajax.reload();
            console.log('reloaded');
        }, 1000);
    });

    $('#add-new-user').click(function () {

    });

    var uploadCrop = $('#upload-profile-pic').croppie({
        enableExif: true,
        viewport: {
            width: 100,
            height: 100,
            type: 'circle'
        },
        boundary: {
            width: 200,
            height: 200
        }
    });

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
                    alert(message);
                },
                error: function (jqXHR, textStatus, err) {
                    alert('text status ' + textStatus + ', err ' + err)
                }
            });
        });
    });


});