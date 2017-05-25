/**
 * Created by Nazarii Beseniuk on 5/17/2017.
 */
$(document).ready(function () {

//inline edit
	let FormEditable = function () {

		let initEditables = function () {

			//global settings
			$.fn.editable.defaults.inputclass = 'form-control';
			$.fn.editable.defaults.url = '/party/update/' + party.id;
			$.fn.editable.defaults.mode = 'inline';

			$('#video_stream').editable({
				type: 'text',
				name: 'video_stream',
				title: 'Enter video_stream'
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
		let tab_smart_for_disabled = $('.for_disabled');
		if (state) {
			tab_smart_for_disabled.removeClass('disabled');
		} else {
			tab_smart_for_disabled.addClass('disabled');
		}

	});

});