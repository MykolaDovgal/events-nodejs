/**
 * Created by Nazarii Beseniuk on 5/17/2017.
 */

let SelectedManager = {};
$(document).ready(function () {

	let datetime = $('#datetime_div').datetimepicker({
		format: 'dd/mm/yyyy hh:ii',
		autoclose: true,
		useCurrent: false,
	}).on('changeDate', function (ev) {
		let date = {name: 'date', value: ev.date, pk: 1};
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

			$('#title_eng').editable({
				type: 'text',
				pk: 1,
				name: 'title_eng',
				title: 'Enter title',
				success: function (data) {
					$('#english_title').text(data);
				},
				validate: xeditable.validators.notEmpty
			});
			$('#title_ol').editable({
				type: 'text',
				pk: 1,
				name: 'title_ol',
				title: 'Enter title',
				success: function (data) {
					$('#ol_title').text(data);
				},
				validate: xeditable.validators.notEmpty
			});


			$('.lineId').editable({
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
					templateResult: function (state) {
						if (state.id !== -1) {
							return state.text;
						}
						let $state = $(
							'<div class="empty_item_in_select"><span class="pull-left">' + state.text + '</span><span class="pull-right"><i class="fa fa-minus-circle" aria-hidden="true"></i></span></div>'
						);
						return $state;
					},
					escapeMarkup: function (markup) {
						return markup;
					},
				},
				tpl: '<select style="width:200px;">',
				type: 'select2',
				success: function success(response, newValue) {

				},
				display: function (value, sourceData) {


					let line;
					let title = '';
					let div_line_link = $('.div_line_link');
					let href;


					if (sourceData && sourceData !== null) {
						line = sourceData.line || 0;
						title = (currentLanguage == 'English') ? line.line_name_eng : line.line_name_ol;
						href = '/line/' + line.id;
					} else {
						title = '';
					}
					if (!title) {
						title = '';
					}

					if (value) {
						if (+value === -1) {
							generateLinkData(div_line_link);
						} else {
							generateLinkData(div_line_link, title, href, 'line');
						}
					}

					if (title.length > 0) {

						$('#line_title_english').text(line.line_name_eng);
						$('#line_title_original').text(line.line_name_ol);
					}

				}
			})
				.click(function (e) {
					if (e) e.preventDefault();
				});

			$('.eventId').editable({
				pk: 1,
				placeholder: 'Select event',
				url: '/party/update/event/' + party.id,
				name: 'eventId',
				select2: {
					ajax: {
						url: '/api/events/getAll',
						dataType: 'json',
						delay: 250,
						processResults: function (data, params) {
							return {
								results: data
							};
						},
						cache: true
					},
					templateResult: function (state) {
						if (state.id !== -1) {
							return state.text;
						}
						let $state = $(
							'<div class="empty_item_in_select"><span class="pull-left">' + state.text + '</span><span class="pull-right"><i class="fa fa-minus-circle" aria-hidden="true"></i></span></div>'
						);
						return $state;
					},
					escapeMarkup: function (markup) {
						return markup;
					},
				},
				tpl: '<select style="width:200px;">',
				type: 'select2',
				success: function success(response, newValue) {

				},
				display: function (value, sourceData) {

					let event;
					let title;
					let div_event_link = $('.div_event_link');
					if (sourceData) {
						event = sourceData.event || 0;
						title = (currentLanguage == 'English') ? event.title_eng : event.title_ol;

					} else {
						title = '';
					}


					if (event) {
						let href = '/event/' + event.id;
						$('#event_title_english').text(event.title_eng);
						$('#event_title_original').text(event.title_ol);


						generateLinkData(div_event_link, title, href, 'event');

					}

					if (value && sourceData) {
						if (+value === -1) {
							generateLinkData(div_event_link);
						}
					}
				}
			})
				.click(function (e) {
					if (e) e.preventDefault();
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
				url: '/party/update/' + party.id,
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

	$('#active-switch').on('switchChange.bootstrapSwitch', function (event, state) {
		let active = {name: 'active', value: state, pk: 1};
		$.ajax({
			url: '/party/update/' + party.id,
			type: 'POST',
			dataType: 'json',
			contentType: "application/json; charset=utf-8",
			data: JSON.stringify(active)
		});
	});

	$('#visible-switch').on('change', function (event, state) {
		let active = {name: 'only_for_event_att', value: this.checked, pk: 1};
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


	let party_managers_table = $('#table_party_managers').DataTable({
		"ajax": "/api/party/" + party.id + "/managers",
		"columns": [
			{
				data: 'delete_button',
				render: function (data, type, full, meta) {
					return '<div class="text-center remove_party_manager_column"><a class="btn-circle"><i class="fa fa-remove"></i></a></div>';
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
	$('#party_managers_search').typeahead({
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

	$('#add_party_manager').click(() => {
		SelectedManager.lineId = party.id;
		//let data = JSON.stringify(SelectedManager);
		$.ajax({
			url: '/api/party/manager/add',
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
		$('#party_managers_search').val('');
	});

	function updateManagersTable() {
		party_managers_table.clear().draw();
		setTimeout(function () {
			party_managers_table.ajax.reload();
			party_managers_table.columns.adjust().draw();
		}, 1000);
	}


	$('#table_party_managers').on('click', '.remove_party_manager_column', function (event) {
		if ($(event.target).prop("tagName") == "I") {
			let parent = this.parentElement;
			bootbox.confirm({
				size: "small",
				message: "Are you sure you want to remove this user from managers?",
				callback: function (result) {
					if (result) {
						let data = JSON.stringify({
							userId: party_managers_table.row(parent).data().id,
							partyId: party.id
						});
						$.ajax({
							url: '/api/party/manager/delete',
							type: 'POST',
							dataType: 'json',
							contentType: "application/json; charset=utf-8",
							data: data,
							//TODO fix this KOSTYL
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

	$('#table_party_managers').on('click', 'td', function (event) {
		if ($(event.target).prop("tagName") != "I") {
			window.location = '/users/' + party_managers_table.row(this).data().id;
		}
	});

	let generateLinkData = function (jquery_div_link, title, href, type = '') {
		if (title && href) {
			let text = 'Open ' + type + ' - ';
			let link = jquery_div_link.find('a');
			link.attr('title', text + title);
			link.attr('href', href);
			jquery_div_link.removeClass('hide');
		} else {
			jquery_div_link.addClass('hide');
		}
	}
});