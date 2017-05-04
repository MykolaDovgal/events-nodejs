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
        responsive: false,
        "dom": "<'row' <'col-md-12'> > t <'row'<'col-md-12'>>",
    });

    // croppie
    var $uploadCrop;

    function readFile(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $uploadCrop.croppie('bind', {
                    url: e.target.result
                }).then(function(){
                    $('#upload-demo').addClass('ready');
                });
            };
            reader.readAsDataURL(input.files[0]);
        }
    }

    $toCrop = $('#image-to-crop').croppie({
        viewport: {
            width: 200,
            height: 200,
            type: 'circle'
        },
        boundary: {
            width: 300,
            height: 300
        }
    });

    

    $uploadCrop = $('#upload-demo').croppie({
        viewport: {
            width: 200,
            height: 200,
            type: 'circle'
        },
        boundary: {
            width: 300,
            height: 300
        }
    });

    $('#form-profile-pic').on('change', function () {
        readFile(this);
    });
    // croppie

    $('#button-change-picture').on('click', function () {
        $uploadCrop.croppie('result', 'base64').then(function(base64) {
            $("#userpic").attr("src", base64);
            $('#form_update_user').submit();
        });
    });

    $('#button-open-crop').on('click', function() {
        $('#crop-picture-modal').modal().show();
        $toCrop.croppie('bind', {
            url: $('#image-to-crop').attr('src')
        });
    });

    $('#button-crop-picture').on('click', function() {
        $toCrop.croppie('result', 'base64').then(function(base64) {
            $('#userpic').attr("src", base64);
            
            var formData = new FormData($('#form_update_user')[0]);
            formData.append('userId', user.id);
            
            $toCrop.croppie('result', {
                type: 'blob',
                size: 'viewport',
                circle: true
            }).then(function (blob) {
                console.log(blob);
                formData.append('userpic', blob, 'userpic.png');
                    $.ajax({
                        url: '/user/update/',
                        type: 'POST',
                        cache: false,
                        contentType: false,
                        processData: false,
                        data: formData,
                        success: function (data) {
                            $('#crop-picture-modal').modal('hide');
                            bootbox.alert('Saved');
                        },
                        error: function (jqXHR, textStatus, err) {
                            bootbox.alert('Server error');
                        }
                    });
            });
        })
    });

    $('#form_update_user').submit(function(e) {
        e.preventDefault();

        var formData = new FormData(this);
        formData.append('userId', user.id);
        formData.append('profile-image', $('#form-profile-pic')[0].files[0]);

        $uploadCrop.croppie('result', {
            type: 'blob',
            size: 'viewport',
            circle: true
        }).then(function (blob) {
            formData.append('userpic', blob, 'userpic.png');
                $.ajax({
                    url: '/user/update/',
                    type: 'POST',
                    cache: false,
                    contentType: false,
                    processData: false,
                    data: formData,
                    success: function (data) {
                        $('#change-picture-modal').modal('hide');
                        bootbox.alert('Saved');
                    },
                    error: function (jqXHR, textStatus, err) {
                        bootbox.alert('Server error');
                    }
                });
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

