/**
 * Created by tegos on 02.06.2017.
 */

function initMap() {

	let geocomplete_event = $("#geocomplete").geocomplete({
		map: '#map',
		details: '.geo-data',
		//types: ['(cities)']

	}).on('geocode:result', function (e, result) {

		let data = {
			lat: $('#lat').val(),
			lng: $('#lng').val(),
			locality: $('#locality').val(),
			country: $('#country').val(),
			country_short: $('#country_short').val(),
		};

		$.ajax({
			url: '/event/update/address/' + event.id,
			type: 'POST',
			data: data,
			success: function (req) {
				if (req.status) {
					$('#place_title').text('in ' + data['locality'] + ', ' + data['country']);
					toastr.success(req.msg);
					let text_val = data['locality'] + ', ' + data['country'];
					$('#geocomplete').val(text_val);
				} else {
					toastr.error(req.msg);
				}

			},
			error: function (jqXHR, textStatus, err) {
				console.error(err);
				toastr.error('Server error!');
			}
		});

	});

	$("#find_geocomplete").click(function () {
		$("#geocomplete").trigger("geocode");
	});

	let center = {lat: 0, lng: 0};
	try {
		center = {lat: event.location.longitude.lat || 0, lng: event.location.longitude.lng || 0};
	} catch (e) {

	}

	let map = geocomplete_event.geocomplete("map");

	map.setCenter(center);
	new google.maps.Marker({
		position: center,
		map: map
	});


}