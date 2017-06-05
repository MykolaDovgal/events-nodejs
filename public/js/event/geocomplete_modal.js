/**
 * Created by tegos on 16.05.2017.
 */

$(document).ready(function () {

	$('#event_party_datetime_input').datetimepicker({
		format: 'yyyy-mm-dd hh:ii',
		autoclose: true,
		useCurrent: false,
		setDate: Date.now()
	});

	$('#event_add_party').on('shown.bs.modal', function () {
		initGeoAddParty();
	});


});


window.initGeoAddParty = function () {


	let geocomplete_party_add = $('#geocomplete_event_add').geocomplete({
		details: '.geo-data',
		//types: ['(cities)']

	}).on('geocode:result', function (e, result) {
		let geo_data = $('.geo-data');
		let data = {
			lat: $('#lat').val(),
			lng: $('#lng').val(),
			locality: $('#locality').val(),
			country: $('#country').val(),
			country_short: $('#country_short').val(),
			route: $('#route').val(),
			street_number: $('#street_number').val(),
		};

	});
};