

$(document).ready(function () {
	let $select = $('#opening_time_table select');
	let $input = $('#opening_time_table input');
	$select.select2();


	$select.on('change',function () {
		openingTimeAjaxUpdate.apply(this);
	});

	$input.on('blur',function () {
		openingTimeAjaxUpdate.apply(this);
	});

	getOpeningTimes();

});

let initOpeningDaysTable = function (data) {
	let table = $('#opening_time_table');
	let keys = Object.keys(data);
	keys.forEach((key) => {
		table.find(`[data-day='${key}'][data-name='open']`).html(generateSelect2Options(data[key].open));
		table.find(`[data-day='${key}'][data-name='close']`).html(generateSelect2Options(data[key].close));
		table.find(`[data-day='${key}'][data-name='notes']`).val(data[key].notes);
	});
};

let getOpeningTimes = function () {
	$.ajax({
		url: '/api/bar/' + bar.id +'/opening',
		type: 'GET',
		success: function (data) {
			initOpeningDaysTable(data);
		}
	});
};

let openingTimeAjaxUpdate = function () {
	let select = $(this);
	let data = {value: select.val(), name: select.data('day') + '.' +select.data('name')};
	$.ajax({
		url: '/api/bar/update/' + bar.id,
		type: 'POST',
		data: data,
		success: function () {

		}
	});
};

let generateSelect2Options = function (selectedValue = '') {
	let container = $('<div></div>');

	for(let i = 0,j = 0; i < 48;i+=1)
	{
		let minute = i%2 == 0 ? '00' : '30';
		let time = (String)( j+j+1 < i == 0 ? j  : j+=1 ).length == 1 ? `0${j}:${minute}` : `${j}: ${minute}`;
		let option = $(`<option ${selectedValue == time ? 'selected' : ''} value="${time}">${time}</option>`);
		container.append(option);
	}
	container.append(`<option ${selectedValue == '-' ? 'selected' : ''} value="-">-</option>`);
	container.append(`<option ${selectedValue == 'The last Client' ? 'selected' : ''} value="The last Client">The last Client</option>`);
	return container.html();
};
