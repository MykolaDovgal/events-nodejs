/**
 * Created by tegos on 09.05.2017.
 */

function initMap() {

	var geocomplete_party = $("#geocomplete_party").geocomplete({
		map: '#map',
		details: '.geo-data',
		types: ['(cities)']

	}).on('geocode:result', function (e, result) {
		var geo_data = $('.geo-data');

		var data = {
			lat: $('#lat').val(),
			lng: $('#lng').val(),
			locality: $('#locality').val(),
			country: $('#country').val(),
			country_short: $('#country_short').val(),
		};

		$.ajax({
			url: '/party/update/address/' + party.id,
			type: 'POST',
			data: data,
			success: function (req) {
				if (req.status) {
					$('#place_title').text('in ' + data['locality'] + ', ' + data['country']);
					toastr.success(req.msg);
					var text_val = data['locality'] + ', ' + data['country'];
					$('#geocomplete_party').val(text_val);
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
		$("#geocomplete_party").trigger("geocode");
	});
    
    console.log(party);

	let center = {lat: 0, lng: 0};
	try {
		center = {lat: party.location.longitude.lat || 0, lng: party.location.longitude.lng || 0};
	} catch (e) {

	}

	let map = geocomplete_party.geocomplete("map");

	map.setCenter(center);
	new google.maps.Marker({
		position: center,
		map: map
	});


}