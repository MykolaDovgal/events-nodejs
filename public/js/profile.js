/**
 * Created by tegos on 24.04.2017.
 */

$(document).ready(function () {
    var user_activity = $('#table-user-activity').DataTable({

        "ajax": "/api/activity/" + user.id,
        "columns": [
            {
                "data": 'login_time'
            },
            {
                "data": 'logout_time'
            }
        ],
        scrollY: 300,
        scroller: true,
        responsive: true,
        "dom": "<'row' <'col-md-12'> > t <'row'<'col-md-12'>>",
    });

    $('#form_update_user').submit(function(e) {
        e.preventDefault();
        $('input[name="userId"]').val(user.id);

        var formData = new FormData(this);

        $.ajax({
            url: '/user/update/',
            type: 'POST',
            cache: false,
            contentType: false,
            processData: false,
            data: formData,
            success: function (data) {
                bootbox.alert('Saved');
            },
            error: function (jqXHR, textStatus, err) {
                bootbox.alert('Server error');
            }
        });
    });
});

function showDeleteConfirmation() {
    bootbox.confirm({
        size: "small",
        message: "You are about to delete " + user.firstname + "'s profile. Are you sure?",
        callback: function(result) {
            if (result) {
                $.ajax({
                    url: '/user/delete/',
                    type: 'POST',
                    data: { userId: user.id },
                    success: function (data) {
                        window.location.replace('/users');
                    },
                    error: function (jqXHR, textStatus, err) {
                        bootbox.alert('Server error');
                    }
                });
            }
        }
    })
}

