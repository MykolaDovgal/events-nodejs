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


    // croppie
    var $uploadCrop;

    function readFile(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $uploadCrop.croppie('bind', {
                    url: e.target.result
                });
                $('.upload-demo').addClass('ready');
            };
            reader.readAsDataURL(input.files[0]);
        }
    }

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


    var form = $('#form_add_user');
    var error = $('.alert-danger', form);
    var success = $('.alert-success', form);

    form.validate({
        errorElement: 'span', //default input error message container
        errorClass: 'help-block help-block-error', // default input error message class
        focusInvalid: false, // do not focus the last invalid input
        ignore: "", // validate all fields including form hidden input
        messages: {},
        rules: {
            username: {
                minlength: 5,
                required: true
            },
            email: {
                required: true,
                email: true
            },

            firstname: {
                required: true,
                minlength: 5
            },
            lastname: {
                required: true,
                minlength: 5
            },


            password: "required",
            'repeat-password': {
                equalTo: "#form-password"
            }
        },

        invalidHandler: function (event, validator) { //display error alert on form submit
            success.hide();
            error.show();
            App.scrollTo(error, -200);
        },

        errorPlacement: function (error, element) {
            if (element.is(':checkbox')) {
                error.insertAfter(element.closest(".md-checkbox-list, .md-checkbox-inline, .checkbox-list, .checkbox-inline"));
            } else if (element.is(':radio')) {
                error.insertAfter(element.closest(".md-radio-list, .md-radio-inline, .radio-list,.radio-inline"));
            } else {
                error.insertAfter(element); // for other inputs, just perform default behavior
            }
        },

        highlight: function (element) { // hightlight error inputs
            $(element)
                .closest('.form-group')
                .addClass('has-error'); // set error class to the control group
        },

        unhighlight: function (element) { // revert the change done by hightlight
            $(element)
                .closest('.form-group')
                .removeClass('has-error'); // set error class to the control group
        },

        success: function (label) {
            label.closest('.form-group').removeClass('has-error'); // set success class to the control group
        },

        submitHandler: function (form) {
            success.show();
            error.hide();
        }
    });


    // submit handler
    form.submit(function (e) {
        e.preventDefault();


        var formData = new FormData(form[0]);

        //set hidden cropped image
        $uploadCrop.croppie('result', {
            //type: 'canvas',
            type: 'blob',
            size: 'viewport',
            circle: true
        }).then(function (resp) {
            formData.append('userpic', resp, 'userpic.png');
            //$('#imagebase64').val(resp);

            if (form.valid()) {

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
            }
        });
        //return false;
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

