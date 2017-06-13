/**
 * Created by Nazarii Beseniuk on 6/7/2017.
 */

$(document).ready(function () {
    jQuery(document).ready(function () {
		FormEditable.init();
	});

    $('#button-open-upload').click(function () {
        $('#upload-picture-modal').modal('show');
    });

    let $uploadCrop;
    $uploadCrop = $('#upload-cover-picture').croppie({
        viewport: {
            width: 368,
            height: 200,
        },
        boundary: {
            width: 552,
            height: 300
        }
    });

	$('#form-bar-pic').on('change', function () {
		readFile(this);
	});

    function readFile(input) {
		if (input.files && input.files[0]) {
			let reader = new FileReader();
			reader.onload = function (e) {
				$uploadCrop.croppie('bind', {
					url: e.target.result
				});
				$('.upload-demo').addClass('ready');
			};
			reader.readAsDataURL(input.files[0]);
		}
	}

	$('#button-upload-picture').on('click', function () {
		$uploadCrop.croppie('result', 'base64').then(function (base64) {
			$('#coverpic').attr("src", base64);
			setCoverPicture();
		});
	});

	function setCoverPicture() {
		let formData = new FormData($('#form_change_picture')[0]);
		let progress_bar_j = $('#upload-picture-modal').find('.progress-bar');

		$uploadCrop.croppie('result', {
			type: 'blob',
			size: 'viewport'
		}).then(function (blob) {
			formData.append('cover_picture', blob, 'coverpic.png');
			$.ajax({
				xhr: function () {
					let xhr = new window.XMLHttpRequest();
					xhr.upload.addEventListener("progress", function (evt) {
						if (evt.lengthComputable) {
							let percentComplete = evt.loaded / evt.total;
							progress_bar_j.css({
								width: percentComplete * 100 + '%'
							});
							if (percentComplete === 1) {
								progress_bar_j.parent('.progress').addClass('hide');
							}
						}
					}, false);
					xhr.addEventListener("progress", function (evt) {
						if (evt.lengthComputable) {
							let percentComplete = evt.loaded / evt.total;
							progress_bar_j.css({
								width: percentComplete * 100 + '%'
							});
						}
					}, false);
					return xhr;
				},
				beforeSend: function () {
					progress_bar_j.parent('.progress').removeClass('hide');
					progress_bar_j.css({
						width: 0 + '%'
					});
				},
				url: '/bar/update/' + bar.id,
				type: 'POST',
				cache: false,
				contentType: false,
				processData: false,
				data: formData,
				success: function () {
					setTimeout(function () {
						$('#upload-picture-modal').modal('hide');
					}, 300);
					toastr.success('Saved!');
				},
				error: function (jqXHR, textStatus, err) {
					toastr.error('Server error!');
				}
			});
		});
	}

    $('#active-switch').on('switchChange.bootstrapSwitch', function (e, state) {
		let active = {name: 'active', value: state, pk: 1};
		$.ajax({
			url: '/bar/update/' + bar.id,
			type: 'POST',
			dataType: 'json',
			contentType: "application/json; charset=utf-8",
			data: JSON.stringify(active)
		});
	});


	$('#language_switch').on('switchChange.bootstrapSwitch', function (event, state) {
		if (state) {
			currentLanguage = 'Original';
		} else {
			currentLanguage = 'English';
		}
		$('.language_switch_container').toggle();
	});

    //inline edit
	let FormEditable = function () {

		let initEditables = function () {

			//global settings
			$.fn.editable.defaults.inputclass = 'form-control';
			$.fn.editable.defaults.url = '/bar/update/' + bar.id;
			$.fn.editable.defaults.mode = 'inline';

			$('#bar_name_eng').editable({
				type: 'text',
				pk: 1,
				name: 'bar_name_eng',
				title: 'Enter title',
				success: function (data) {
					$('#english_title').text(data);
				},
				validate: xeditable.validators.notEmpty
			});
			$('#bar_name_ol').editable({
				type: 'text',
				pk: 1,
				name: 'bar_name_ol',
				title: 'Enter title',
				success: function (data) {
					$('#ol_title').text(data);
				},
				validate: xeditable.validators.notEmpty
			});
			$('#facebook_page').editable({
				type: 'text',
				pk: 1,
				name: 'facebook_page',
				title: 'Enter Facebook page link'
			});
            $('#website').editable({
				type: 'text',
				pk: 1,
				name: 'website',
				title: 'Enter Website link'
			});
			$('#description_eng').editable({
				type: 'text',
				pk: 1,
				name: 'description_eng',
				title: 'Enter description'
			});
			$('#description_ol').editable({
				type: 'text',
				pk: 1,
				name: 'description_ol',
				title: 'Enter description'
			});
		};
		return {
			//main function to initiate the module
			init: function () {
				// init editable elements

				initEditables();

				// init editable toggler
				$('#enable').click(function () {
					$('#user .editable').editable('toggleDisabled');
				});

				// handle editable elements on hidden event fired
				$('#user .editable').on('hidden', function (e, reason) {
					if (reason === 'save' || reason === 'nochange') {
						let $next = $(this).closest('tr').next().find('.editable');
						if ($('#autoopen').is(':checked')) {
							setTimeout(function () {
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

    let bar_managers_table = $('#table_bar_managers').DataTable({
		"ajax": "/api/bar/" + bar.id + "/managers",
		"columns": [
			{
				data: 'delete_button',
				render: function (data, type, full, meta) {
					return '<div class="text-center remove_bar_manager_column"><a class="btn-circle"><i class="fa fa-remove"></i></a></div>';
				},
				width: '5%'
			},
			{
				'data': 'id',
				width: '10%'
			},
			{
				data: 'profile_picture_circle',
				render: function (data, type, full, meta) {
					return '<div class="text-center"><img class="profile-picture" src="' + data + '"/></div>';
				},
				width: '20%'
			},
			{
				"data": 'username',
				width: '45%'
			},
			{
				"data": 'permission_level',
				width: '20%'
			}
		],
		"columnDefs": [
			{
				"targets": 'no-sort',
				"orderable": false
			}
		],
		scrollY: 200,
		scrollX: true,
		scroller: true,
		responsive: false,
		"dom": "<'row' <'col-md-12'> > t <'row'<'col-md-12'>>",
	});

	//user dataset for search
	let users = new Bloodhound({
		datumTokenizer: function (datum) {
			let emailTokens = Bloodhound.tokenizers.whitespace(datum.id);
			let lastNameTokens = Bloodhound.tokenizers.whitespace(datum.name);
			let firstNameTokens = Bloodhound.tokenizers.whitespace(datum.username);

			return emailTokens.concat(lastNameTokens).concat(firstNameTokens);
		},
		queryTokenizer: Bloodhound.tokenizers.whitespace,
		prefetch: {
			url: '/api/users/usersname',
			cache: false,
			transform: function (response) {
				return $.map(response, function (item) {
					return {
						id: item.id,
						name: item.name,
						username: item.username,
						picture: item.picture
					};
				});
			}
		}
	});

	//display searched result
	$('#bar_managers_search').typeahead({
			hint: true,
			highlight: true,
			minLength: 1
		},
		{
			name: 'users_dataset',
			display: 'name',
			source: users,
			templates: {
				suggestion: function (item) {
					return '<div class="col-md-12">' +
						'<div class="col-md-4" style="float:left;"><img style="width:50px;height:50px;border-radius: 50%;" src="' + item.picture + '"/></div>' +
						'<div> ID:(' + item.id + ') <strong>' + item.name + '</strong>' + '</div>' +
						'</div>';
				}
			}
		}).bind('typeahead:select', (ev, suggestion) => SelectedManager = suggestion);

	$('#add_bar_manager').click(() => {
		SelectedManager.lineId = bar.id;
		//let data = JSON.stringify(SelectedManager);
		$.ajax({
			url: '/api/bar/manager/add',
			type: 'POST',
			data: SelectedManager,
			success: function (data) {
				updateManagersTable();
			},
			error: function (jqXHR, textStatus, err) {
			}
		}).then(function () {
		});
		SelectedManager = {};
		$('#bar_managers_search').val('');
	});

	function updateManagersTable() {
		bar_managers_table.clear().draw();
		setTimeout(function () {
			bar_managers_table.ajax.reload();
			bar_managers_table.columns.adjust().draw();
		}, 1000);
	}


	$('#table_bar_managers').on('click', '.remove_bar_manager_column', function (e) {
		if ($(e.target).prop("tagName") == "I") {
			let parent = this.parentElement;
			bootbox.confirm({
				size: "small",
				message: "Are you sure you want to remove this user from managers?",
				callback: function (result) {
					if (result) {
						let data = JSON.stringify({
							userId: bar_managers_table.row(parent).data().id,
							barId: bar.id
						});
						$.ajax({
							url: '/api/bar/manager/delete',
							type: 'POST',
							dataType: 'json',
							contentType: "application/json; charset=utf-8",
							data: data,
							success: function () {
								updateManagersTable();
							},
							error: function () {
								updateManagersTable();
							}
						});
					}
				}
			});
		}
	});

	$('#table_bar_managers').on('click', 'td', function (event) {
		if ($(event.target).prop("tagName") != "I") {
			window.location = '/users/' + bar_managers_table.row(this).data().id;
		}
	});

	$('#delete_bar').click(deleteBar)
});

let deleteBar = () => {
	bootbox.confirm({
		size: "small",
		message: "Are you sure you want to remove this bar?",
		callback: function (result) {
			if (result) {
				$.ajax({
					url: '/bar/delete/' + bar.id,
					type: 'POST',
					success: function () {
						window.location = '/bars';
					},
					error: function (jqXHR, textStatus, err) {

					}
				});
			}
		}
	});
};
