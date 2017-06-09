
$(document).ready(function () {

	$('#event_datetime_input_start').datetimepicker({
		format: 'yyyy-mm-dd hh:ii',
		autoclose: true,
		useCurrent: false,
		setDate: Date.now()
	});

	$('#event_datetime_input_end').datetimepicker({
		format: 'yyyy-mm-dd hh:ii',
		autoclose: true,
		useCurrent: false,
		setDate: Date.now()
	});

	$('#modal-add-event').on('shown.bs.modal', function () {
		initGeoAddEvent();
	});


});


window.initGeoAddEvent = function () {


	let geocomplete_event_add = $('#geocomplete_event_add').geocomplete({
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