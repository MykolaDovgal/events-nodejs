/**
 * Created by Nazarii Beseniuk on 5/17/2017.
 */
$(document).ready(function () {
	let datetime = $('#datetime_div').datetimepicker({
		format: 'dd/mm/yyyy hh:ii',
		autoclose: true,
		useCurrent: false,
	}).on('changeDate', function(ev) {
		var date = { name: 'date', value: ev.date, pk: 1 };
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
				success: function(data) {
					$('#english_title').text(data);
				}
			});	
			$('#title_ol').editable({
				type: 'text',
				pk: 1,
				name: 'title_ol',
				title: 'Enter title',
				success: function(data) {
					$('#ol_title').text(data);
				}
			});
			$('#line_name_eng').editable({
				type: 'text',
				pk: 1,
				name: 'line_name_eng',
				title: 'Line name'
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

	$('#active-switch').on('switchChange.bootstrapSwitch', function(event, state) {
		var active = { name: 'active', value: state, pk: 1 };
		$.ajax({
			url: '/party/update/' + party.id,
			type: 'POST',
			dataType: 'json',
			contentType: "application/json; charset=utf-8",
			data: JSON.stringify(active)  
		});
	});

	$('#visible-switch').on('switchChange.bootstrapSwitch', function(event, state) {
		var active = { name: 'only_for_mom_event_att', value: state, pk: 1 };
		$.ajax({
			url: '/party/update/' + party.id,
			type: 'POST',
			dataType: 'json',
			contentType: "application/json; charset=utf-8",
			data: JSON.stringify(active)  
		});
	});

	$('#language_switch').on('switchChange.bootstrapSwitch', function(event, state) {
		$('.language_switch_container').toggle();
	});
});