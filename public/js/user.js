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
                    return '<img class="profile-picture img-responsive" src="' + data + '"/>';
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


});