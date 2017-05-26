/**
 * Created by Nazarii Beseniuk on 5/17/2017.
 */
$(document).ready(function () {
	let datetime = $('#datetime_div').datetimepicker({
		format: 'dd/mm/yyyy hh:ii',
		autoclose: true,
		useCurrent: false,
	}).on('changeDate', function (ev) {
		var date = {name: 'date', value: ev.date, pk: 1};
		$.ajax({
			url: '/party/update/' + party.id,
			type: 'POST',
			dataType: 'json',
			contentType: "application/json; charset=utf-8",
			data: JSON.stringify(date)
		});
	});

	jQuery(document).ready(function () {
		FormEditable.init();
	});

	let loc = window.location.pathname.split('/');
	let id = loc[loc.length - 1];

	//inline edit
	let FormEditable = function () {

		let initEditables = function () {

			//global settings
			$.fn.editable.defaults.inputclass = 'form-control';
			$.fn.editable.defaults.url = '/party/update/' + party.id;
			$.fn.editable.defaults.mode = 'inline';

			//editables element samples
			$('#title_eng').editable({
				type: 'text',
				pk: 1,
				name: 'title_eng',
				title: 'Enter title',
				success: function (data) {
					$('#english_title').text(data);
				}
			});
			$('#title_ol').editable({
				type: 'text',
				pk: 1,
				name: 'title_ol',
				title: 'Enter title',
				success: function (data) {
					$('#ol_title').text(data);
				}
			});
			$('#line_i9d').editable({
				type: 'text',
				name: 'line_name_eng',
				title: 'Line name'
			});

			$('#lineId').editable({
				pk: 1,
				placeholder: 'Select line',
				url: '/party/update/line/' + party.id,
				name: 'lineId',
				select2: {
					ajax: {
						url: '/api/getAllLines',
						dataType: 'json',
						delay: 250,
						processResults: function (data, params) {
							return {
								results: data
							};
						},
						cache: true
					},
					escapeMarkup: function (markup) {
						return markup;
					},
				},
				tpl: '<select style="width:200px;">',
				type: 'select2',
				success: function success(response, newValue) {
					// console.log(newValue);
					//$('#lineTitle').text(title);
				},
				display: function (value, sourceData) {

					let line;
					let title;
					if (sourceData) {
						line = sourceData.line || 0;
						title = (currentLanguage == 'English') ? line.line_name_eng : line.line_name_ol;


					} else {
						title = '';
					}

					if (title.length > 0) {
						$(this).text(line.id);

						$('#line_title_english').text(line.line_name_eng);
						$('#line_title_original').text(line.line_name_ol);
					}

				}
			})
				.click(function (e) {
					if (e) e.preventDefault();
				});

			$('#mom_eventId').editable({
				type: 'text',
				pk: 1,
				name: 'mom_eventId',
				title: 'Enter name of mom event'
			});
			$('#facebook_page').editable({
				type: 'text',
				pk: 1,
				name: 'facebook_page',
				title: 'Enter Facebook page link'
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
						var $next = $(this).closest('tr').next().find('.editable');
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

	$('#button-open-upload').click(function () {
		$('#upload-picture-modal').modal('show');
	});

	var $uploadCrop;
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

	$('#form-line-pic').on('change', function () {
		readFile(this);
	});

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

	$('#button-upload-picture').on('click', function () {
		$uploadCrop.croppie('result', 'base64').then(function (base64) {
			$('#coverpic').attr("src", base64);
			setCoverPicture();
		});
	});

	function setCoverPicture() {
		var formData = new FormData($('#form_change_picture')[0]);

		$uploadCrop.croppie('result', {
			type: 'blob',
			size: 'viewport'
		}).then(function (blob) {
			formData.append('cover_picture', blob, 'coverpic.png');
			$.ajax({
				url: '/party/update/' + party.id,
				type: 'POST',
				cache: false,
				contentType: false,
				processData: false,
				data: formData,
				success: function (data) {
					$('#upload-picture-modal').modal('hide');
					toastr.success('Saved!');
				},
				error: function (jqXHR, textStatus, err) {
					toastr.error('Server error!');
				}
			});
		});
	};

	$('#active-switch').on('switchChange.bootstrapSwitch', function (event, state) {
		var active = {name: 'active', value: state, pk: 1};
		$.ajax({
			url: '/party/update/' + party.id,
			type: 'POST',
			dataType: 'json',
			contentType: "application/json; charset=utf-8",
			data: JSON.stringify(active)
		});
	});

	$('#visible-switch').on('switchChange.bootstrapSwitch', function (event, state) {
		var active = {name: 'only_for_mom_event_att', value: state, pk: 1};
		$.ajax({
			url: '/party/update/' + party.id,
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

	$('#delete_party').click(function (event) {
		event.preventDefault();
		console.log(party);
		bootbox.confirm({
			size: "small",
			message: "Are you sure you want to remove this party?",
			callback: function (result) {
				if (result) {
					$.ajax({
						url: '/party/delete/' + party.id,
						type: 'POST',
						success: function () {
							window.location = '/parties';
						},
						error: function (jqXHR, textStatus, err) {

						}
					});
				}
			}
		});

		return false;
	});
});