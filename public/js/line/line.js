$(document).ready(function () {


	jQuery(document).ready(function () {
		FormEditable.init();
	});


	let loc = window.location.pathname.split('/');
	let id = loc[loc.length - 1];
	let genres = [];
	let genresCounter = 0;


	//genres setup
	$.getJSON('/data/genres.json', function (data) {

		let selectItems = $('select[name="genres"]');

		data.forEach((item, i, arr) => {
			genres.push('<option value="' + item + '">' + item + '</option>');
		});

		//if user select genres previously
		if (selectItems.length > 0) {
			selectItems.each(function (key, value) {
				let tmpGenres = [];
				data.forEach(function (dataItem, i, arr) {
					let optionItem = $('<option value="' + dataItem + '">' + dataItem + '</option>');
					if ($(value).data('value') == dataItem) {
						optionItem.attr('selected', true);
					}
					tmpGenres.push(optionItem);
				});
				$(value).html(tmpGenres);
				genresCounter += 1;
			});
		}
		else {
			//generateDefaultSelect();
		}
	});

	$(document).on('change', 'select[name="genres"]', function () {
		updateGenres();
	});

	$('#add_genres_btn').on({
		click: function () {
			if (genresCounter < 5) {
				generateDefaultSelect();

			}
		}
	});
	$('#delete_genres_btn').click(() => {
		if (genresCounter >= 0) {
			deleteGenreSelect();
		}
	});

	function generateDefaultSelect() {
		let selectItem = $('<select></select>').addClass('form-control').attr('name', 'genres');
		selectItem.html(genres.join(""));
		$('#select_container').append(selectItem);
		genresCounter += 1;
	}

	function deleteGenreSelect() {
		$('select[name="genres"]').last().remove();
		updateGenres();
		genresCounter -= 1;
	}


	function updateGenres() {
		let genresArray = [];
		let selectItems = $('#select_container > select');

		selectItems.each(function () {
			genresArray.push($(this).val());
		});

		$.ajax({
			url: '/line/update/' + id,
			type: 'POST',
			data: {name: 'music.music_genres', value: genresArray},
			success: function (data) {
			},
			error: function (jqXHR, textStatus, err) {
			}
		}).then(function () {
		});
	}

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

	$('#form-line-pic').on('change', function () {
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
							console.log(percentComplete);
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
				url: '/line/update/' + line.id,
				type: 'POST',
				cache: false,
				contentType: false,
				processData: false,
				data: formData,
				success: function (data) {
					setTimeout(function () {
						$('#upload-picture-modal').modal('hide');
					}, 700);
					toastr.success('Saved!');
				},
				error: function (jqXHR, textStatus, err) {
					toastr.error('Server error!');
				}
			});
		});
	}

	//inline edit
	let FormEditable = function () {
		let initEditables = function () {


			//global settings
			$.fn.editable.defaults.inputclass = 'form-control';
			$.fn.editable.defaults.url = '/line/update/' + line.id;
			$.fn.editable.defaults.mode = 'inline';

			//editables element samples
			$('#line_name_eng').editable({
				type: 'text',
				pk: 1,
				name: 'line_name_eng',
				title: 'Enter title',
				success: function (data) {
					$('#english_title').text(data);
				},
				validate: xeditable.validators.notEmpty
			});
			$('#line_name_ol').editable({
				type: 'text',
				pk: 1,
				name: 'line_name_ol',
				title: 'Enter title',
				success: function (data) {
					$('#ol_title').text(data);
				},
				validate: xeditable.validators.notEmpty
			});
			$('#line_facebook_page').editable({
				type: 'text',
				pk: 1,
				name: 'facebook_page',
				title: 'Enter link on facebook page'
			});
			$('#line_website').editable({
				type: 'text',
				pk: 1,
				name: 'website',
				title: 'Enter link on website'
			});
			$('#line_country').editable({
				type: 'text',
				pk: 1,
				name: 'country',
				title: 'Enter country'
			});
			$('#line_city').editable({
				type: 'text',
				pk: 1,
				name: 'city',
				title: 'Enter city'
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


	//notification ajax
	$('#button_send_notification').on({

		click: function () {

			let data = $('#notification_form').serialize();

			$.ajax({
				url: '/notification/add' + '/?' + data.toString(),
				type: 'POST',
				data: {},
				success: function (data) {
					toastr.options.showMethod = 'slideDown';
					toastr.success('Notification successfully sent!')
				},
				error: function (jqXHR, textStatus, err) {
				}
			}).then(function () {
			});
		}

	});

	// $('#upload_button').click(function () {
	// 	$('#cover_picture_upload').focus().trigger('click');
	// });

	$('#cover_picture_upload').change(function () {
		if (this.files && this.files[0]) {
			let reader = new FileReader();
			reader.onload = function (e) {
				$('#cover_picture')
					.attr('src', e.target.result).width('100%');
			};
			reader.readAsDataURL(this.files[0]);

			let formData = new FormData();
			formData.append('cover_picture', this.files[0], 'cover_picture.png');

			console.log(formData);

			$.ajax({
				url: '/line/update/' + id,
				type: 'POST',
				cache: false,
				contentType: false,
				processData: false,
				data: formData,
				success: function (data) {
					toastr.success('Saved!');
				},
				error: function (jqXHR, textStatus, err) {
					console.error(err);
					toastr.error('Server error!');
				}
			});
		}
	});


	$('#active-switch').on('switchChange.bootstrapSwitch', function (event, state) {
		let active = {name: 'active', value: state, pk: 1};
		$.ajax({
			url: '/line/update/' + line.id,
			type: 'POST',
			dataType: 'json',
			contentType: "application/json; charset=utf-8",
			data: JSON.stringify(active)
		});
	});


	$('#delete_line').click(function (event) {
		event.preventDefault();
		bootbox.confirm({
			size: "small",
			message: "Are you sure you want to remove this line?",
			callback: function (result) {
				if (result) {
					$.ajax({
						url: '/line/delete/' + line.id,
						type: 'POST',
						data: {},
						success: function (data) {
							window.location = '/lines';
						},
						error: function (jqXHR, textStatus, err) {

						}
					});
				}
			}
		});

		return false;
	});


	$('#language_switch').on('switchChange.bootstrapSwitch', function (event, state) {
		$('.language_switch_container').toggle();
	});


});