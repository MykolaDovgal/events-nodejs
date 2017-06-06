/**
 * Created by tegos on 10.05.2017.
 */

$(document).ready(function () {


	$('#modal-add-line').on('shown.bs.modal', function () {
		initGeoAddLine();
	})

});


window.initGeoAddLine = function () {


	var geocomplete_line_add = $('#geocomplete_line_add').geocomplete({
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

		//console.log(data);

	});
};