
$(document).ready(function () {

	$('#modal-add-bar').on('shown.bs.modal', function () {
		initGeoAddEvent();
	});


});


window.initGeoAddEvent = function () {

	let geocomplete_bar_add = $('#geocomplete_bar_add').geocomplete({
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