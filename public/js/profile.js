/**
 * Created by tegos on 24.04.2017.
 */

$(document).ready(function () {
	var user_activity = $('#table-user-activity').DataTable({
		"ajax": "/api/activity/" + user.id,
		"columns": [
			{
				data: 'login_time'
			},
			{
				data: 'logout_time'
			}
		],
		scrollY: 300,
		scroller: true,
		responsive: false,
		"dom": "<'row' <'col-md-12'>> t <'row'<'col-md-12'>>",
	});

	var lines;

	toastr.options.showMethod = 'slideDown'; 
	FormEditable.init();

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
		$('#crop-picture-modal').modal('show');
		$toCrop.croppie('bind', {
			url: $('#image-to-crop').attr('src')
		});
	});

	$('#button-open-change').on('click', function() {
		$('#change-picture-modal').modal('show');
	});

	$('#button-crop-picture').on('click', function() {
		$toCrop.croppie('result', 'base64').then(function(base64) {
			$('#userpic').attr("src", base64);
			
			var formData = new FormData($('#form_update_user')[0]);
			
			$toCrop.croppie('result', {
				type: 'blob',
				size: 'viewport',
				circle: true
			}).then(function (blob) {
				console.log(blob);
				formData.append('userpic', blob, 'userpic.png');
					$.ajax({
						url: '/user/update/' + user.id,
						type: 'POST',
						cache: false,
						contentType: false,
						processData: false,
						data: formData,
						success: function (data) {
							$('#crop-picture-modal').modal('hide');
							toastr.success('Saved!');
						},
						error: function (jqXHR, textStatus, err) {
							toastr.error('Server error!');
						}
					});
			});
		})
	});

	$('#form_update_user').submit(function(e) {
		e.preventDefault();

		var formData = new FormData(this);
		formData.append('profile-image', $('#form-profile-pic')[0].files[0]);
		$('#image-to-crop').attr('src', $('#upload-demo .cr-image').attr('src'));
 
		$uploadCrop.croppie('result', {
			type: 'blob',
			size: 'viewport',
			circle: true
		}).then(function (blob) {
			formData.append('userpic', blob, 'userpic.png');
				$.ajax({
					url: '/user/update/' + user.id,
					type: 'POST',
					cache: false,
					contentType: false,
					processData: false,
					data: formData,
					success: function (data) {
						$('#change-picture-modal').modal('hide');
						toastr.success('Saved!');
					},
					error: function (jqXHR, textStatus, err) {
						toastr.error('Server error!');
					}
				});
		});
	});

	$('#form-date-of-birth').change(function() {
		var date_of_birth = { name: 'date_of_birth', value: $(this).val(), pk: 1 };
		console.log(date_of_birth);
		$.ajax({
			url: '/user/update/' + user.id,
			type: 'POST',
			dataType: 'json',
			contentType: "application/json; charset=utf-8",
			data: JSON.stringify(date_of_birth),
		});
	});

	$('#active-switch').on('switchChange.bootstrapSwitch', function(event, state) {
		var active = { name: 'active', value: state, pk: 1 };
		$.ajax({
			url: '/user/update/' + user.id,
			type: 'POST',
			dataType: 'json',
			contentType: "application/json; charset=utf-8",
			data: JSON.stringify(active)  
		});
	});

	$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
		if (typeof lines === 'undefined')
			lines = $('#table-lines').DataTable({
				"ajax": "/api/user/lines/" + user.id,
				"columns": [
					{
						data: 'id'
					},
					{
						data: 'name'
					},
					{
						data: 'country'
					},
					{
						data: 'city'
					},
				],
				scrollY: 300,
				scroller: true,
				responsive: false,
				"dom": "<'row' <'col-md-12'>> t <'row'<'col-md-12'>>",
			});
			$('#table-lines tbody').on('click', 'tr', function () {
				window.location.href = "/line/" + lines.row(this).data().id;
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
						toastr.error('Server error!');
					}
				});
			}
		}
	})
}

//inline edit
let FormEditable = function() {
	let initEditables = function() {


		//global settings
		$.fn.editable.defaults.inputclass = 'form-control';
		$.fn.editable.defaults.url = '/user/update/' + user.id;
		$.fn.editable.defaults.mode = 'inline';

		//editables element samples


		$('#username').editable({
			type: 'text',
			pk: 1,
			name: 'username',
			title: 'Enter User Name'
		});
		$('#firstname').editable({      
			type: 'text',
			pk: 1,
			name: 'firstname',
			title: 'Enter First Name'
		});
		$('#lastname').editable({               
			type: 'text',
			pk: 1,
			name: 'lastname',
			title: 'Enter Last Name'
		});
		$('#facebook').editable({           
			type: 'text',
			pk: 1,
			name: 'facebook',
			title: 'Enter Facebook Profile'
		});
		$('#email').editable({              
			type: 'text',
			pk: 1,
			name: 'email',
			title: 'Enter Email'
		});
		$('#phone').editable({              
			type: 'text',
			pk: 1,
			name: 'phone',
			title: 'Enter Phone Number'
		});
		$('#about').editable({
			type: 'text',
			pk: 1,
			name: 'about',
			title: 'Enter description'
		});
	};
	return {
		//main function to initiate the module
		init: function() {
			// init editable elements


			initEditables();

			// init editable toggler
			$('#enable').click(function() {
				$('#user .editable').editable('toggleDisabled');
			});

			// handle editable elements on hidden event fired
			$('#user .editable').on('hidden', function(e, reason) {
				if (reason === 'save' || reason === 'nochange') {
					var $next = $(this).closest('tr').next().find('.editable');
					if ($('#autoopen').is(':checked')) {
						setTimeout(function() {
							$next.editable('show');
						}, 300);
					} else {
						$next.focus();
					}
				}
			});


		}

	};
}();