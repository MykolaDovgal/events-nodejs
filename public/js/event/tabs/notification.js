$(document).ready(function () {

	$('#datetime_input').datetimepicker({
		format: 'mm/dd/yyyy hh:ii',
		autoclose: true,
		useCurrent: false

	});

	$('#submit_send_event_party').on({

		click: function () {

			let data = $('#notification_form').serialize();


			$.ajax({
				url: '/api/event/notification/add' + '/?' + data.toString(),
				type: 'POST',
				data: {id: event.id},
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
});