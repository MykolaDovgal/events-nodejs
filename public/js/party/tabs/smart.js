/**
 * Created by Nazarii Beseniuk on 5/17/2017.
 */
$(document).ready(function () {
	let video_stream_avbl = party.video_stream_avbl || false;
	let view = new View();

	view.setDisableBlock(video_stream_avbl);

	let FormEditable = function () {

		let initEditables = function () {

			//global settings
			$.fn.editable.defaults.inputclass = 'form-control';
			$.fn.editable.defaults.url = '/party/update/' + party.id;
			$.fn.editable.defaults.mode = 'inline';

			$('#video_stream').editable({
				type: 'text',
				name: 'video_stream',
				title: 'Enter video_stream',
				pk: 1
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

	FormEditable.init();

	$('#video_available').on('switchChange.bootstrapSwitch', function (event, state) {

		var active = {name: 'video_stream_avbl', value: state};
		$.ajax({
			url: '/party/update/' + party.id,
			type: 'POST',
			dataType: 'json',
			contentType: "application/json; charset=utf-8",
			data: JSON.stringify(active)
		});

		view.setDisableBlock(state);

	});

	$('#video_broadcast').on('switchChange.bootstrapSwitch', function (event, state) {

		let data = {name: 'video_stream_on', value: state};
		$.ajax({
			url: '/party/update/' + party.id,
			type: 'POST',
			data: data
		});

	});


});

let View = function () {
	let t = this;
	t.setDisableBlock = function (state = false) {

		let tab_smart_for_disabled = $('.for_disabled');
		if (state) {
			tab_smart_for_disabled.removeClass('disabled');
		} else {
			tab_smart_for_disabled.addClass('disabled');
		}
	};
};