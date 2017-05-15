$(document).ready(function () {
	var user_tables = $('#users-list-datatable').DataTable({

		"ajax": "/api/users/",
		"columns": [
			{
				data: 'id',
				width: '5%'
			},
			{
				data: 'profile_picture_circle',
				render: function (data, type, full, meta) {
					return '<div class="text-center"><img class="profile-picture" src="' + data + '"/></div>';
				},
				width: '50'
			},
			{
				data: 'active',
				render: function (data, type, full, meta) {
					var content;
					if (data) {
						content = '<div class="text-center"><span class="badge badge-success">Active</span></div>'
					} else {
						content = '<div class="text-center"><span class="badge badge-danger">Disabled</span></div>';
					}
					return content;
				},
				width: 45
			},
			{
				data: 'username',
			},
			{
				data: "realname",			
			},
			{
				data: 'facebook_profile',
				render: function (data, type, full, meta) {
					if (!data) {
						return '<div class="text-center">-</div>';
					}
					return '<div class="text-center"><a href="' + data + '"><img class="facebook-icon" src="/images/icons/facebook-icon.png"></a></div>';
				},
				width: 13
			},
			{
				data: 'lastActivity',
				render: function (data) {
					return '<div class="text-center">' + data + '</div>'
				},
				width: 125
			},
			{
				data: 'bars',
				width: 50
			},
			{
				data: 'events',
				width: 50
			},
			{
				data: 'lines',
				width: 50
			},
		],
		"columnDefs": [
			{
				"targets": 'no-sort',
				"orderable": false
			}
		],
		autoWidth: false,

		buttons: [
			{
				text: 'Add new user',
				action: function (e, dt, node, config) {
					$('#add-new-user-modal').modal('show');
				},
				className: 'btn sbold green'
			},
			{extend: 'print', className: 'btn dark btn-outline'},
			{extend: 'pdf', className: 'btn green btn-outline'},
			{extend: 'csv', className: 'btn purple btn-outline '}
		],
		scrollY: 500,
		scroller: true,
		responsive: false,


		"dom": "<'row' <'col-md-12' <'pull-left' B > <'pull-right group-input' <'search pull-right'<'fa fa-search'> f > <'fa fa-refresh update-table-users'> > > > t <'row'<'col-md-12'i>>",
	});

	$('.update-table-users').click(function () {
		updateUserTable();
	});

	// -- CROPPIE --
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
	// -- CROPPIE --


	function updateUserTable() {
		user_tables.clear().draw();
		setTimeout(function () {
			user_tables.ajax.reload();
			user_tables.columns.adjust().draw();
		}, 1000);
	}

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
				minlength: 3,
				required: true
			},
			email: {
				required: true,
				email: true
			},

			firstname: {
				required: true,
				minlength: 2
			},
			lastname: {
				required: true,
				minlength: 2
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
			type: 'blob',
			size: 'viewport',
			circle: true
		}).then(function (resp) {
			formData.append('userpic', resp, 'userpic.png');

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

	$('#users-list-datatable tbody').on('click', 'tr', function () {
		window.location.href = "/users/" + user_tables.row(this).data().id;
	});
});

