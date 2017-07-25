/**
 * Created by tegos on 02.06.2017.
 */

function initMap() {

	let geocomplete_bar = $("#geocomplete").geocomplete({
		map: '#map',
		details: '.geo-data',
	}).on('geocode:result', function (e, result) {

		let data = {
			lat: $('#lat').val(),
			lng: $('#lng').val(),
			locality: $('#locality').val(),
			route: $('#route').val(),
			country: $('#country').val(),
			country_short: $('#country_short').val(),
		};

		$.ajax({
			url: '/bar/update/address/' + bar.id,
			type: 'POST',
			data: data,
			success: function (req) {
				if (req.status) {
					$('#place_title').text('in ' + data['locality'] + ', ' + data['country']);
					toastr.success(req.msg);
					let text_val = data['locality'] + ', ' + data['country'] + ', ' + data['route'];
					console.log('req',req);
					console.log('data',data);
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
		center = {lat: bar.location.longitude.lat || 0, lng: bar.location.longitude.lng || 0};
	} catch (e) {

	}

	let map = geocomplete_bar.geocomplete("map");

	map.setCenter(center);
	new google.maps.Marker({
		position: center,
		map: map
	});


}