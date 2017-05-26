let parties_tables;
let global = {};

$(document).ready(function () {

	$('#country-city-select').multiselect({
		enableClickableOptGroups: true,
		onChange: function () {
			var values = $('#country-city-select').val();
			var filter = global.filter;
			console.log(values);
			if (values) {
				if (!filter) {
					filter = {};
				}
				filter['address'] = values;

				global.filter = filter;
			} else {
				delete global.filter.address;
			}
			updatePartyTable();
		}
	});

	parties_tables = $('#parties_datatable').DataTable({

		"ajax": {
			"url": "/api/parties",
			"data": function () {
				return global.filter
			},
		},
		"columns": [
			{
				data: 'party_id',
				//width: '2%'
			},
			{
				data: 'title_eng',
				//width: '15%'
			},
			{
				'data': 'line_name_eng',
				//width: '15%'
			},
			{
				data: 'country_name_eng',
				//width: '15%'
			},
			{
				"data": 'city_name_eng',
				//width: '15%'
			},
			{
				"data": 'event_name_eng',
				//width: '15%'
			},
			{
				"data": 'date',
				//width: '4%'
			},
			{
				"data": 'open_time',
				//width: '200px'
			},
			{
				"data": 'attendees_count',
				//width: '5%'
			},
			{
				"data": 'video_stream_avb',
				//width: '5%'
			},
			{
				"data": 'tkts_avbl_here',
				//width: '5%'
			}
		],
		"columnDefs": [
			{
				"targets": 'no-sort',
				"orderable": false
			},
			{"width": "40%", "targets": 0},
			{"width": "60%", "targets": 1}
		],
		scrollY: 500,
		scrollX: true,
		scroller: true,
		responsive: false,
		autoWidth: false,
		sScrollX: "100%",

		"dom": "<'row' <'col-md-12'> ><'search pull-right'<'fa fa-search'> f > t <'row'<'col-md-12'>> <'row'<'col-md-12'i>>",
	});

	function updatePartyTable() {
		parties_tables.clear().draw();
		setTimeout(function () {
			parties_tables.ajax.reload();
			parties_tables.columns.adjust().draw();
		}, 1000);
	}

	$('#parties_datatable tbody').on('click', 'tr', function () {
		let partyRow = parties_tables.row(this).data();
		window.location = '/party/' + partyRow.party_id;
	});

	let allFilters = $('div.pull-left > div.pull-left > a');


	$('#all_parties_filter').click(function () {
		toggleColor.call(this, allFilters);
		$.fn.dataTable.ext.search.push((oSettings, aData, iDataIndex) => true);
		parties_tables.draw();
		$.fn.dataTable.ext.search = [];
	});

	$('#past_parties_filter').click(function () {
		toggleColor.call(this, allFilters);
		dateSort(-1);


	});

	$('#today_parties_filter').click(function () {
		toggleColor.call(this, allFilters);
		dateSort(0);
	});

	$('#future_parties_filter').click(function () {
		toggleColor.call(this, allFilters);
		dateSort(1);
	});


});


let toggleColor = function (allFilters) {
	allFilters.removeClass('btn-warning');
	$(this).addClass('btn-warning');
};

let dateEquals = function (date) {
	let firstDateArray = date.split('/');
	let dateNow = new Date(Date.now());

	let firstDateTS = new Date(firstDateArray[2], firstDateArray[1], firstDateArray[0]).getTime();
	let secondDateTS = new Date(dateNow.getFullYear(), dateNow.getMonth() + 1, dateNow.getDate()).getTime();

	if (firstDateTS > secondDateTS)
		return 1;
	if (firstDateTS < secondDateTS)
		return -1;
	else
		return 0;
};

let dateSort = function (x) {
	$.fn.dataTable.ext.search.push((oSettings, aData, iDataIndex) => dateEquals(aData[5]) == x);
	parties_tables.draw();
	$.fn.dataTable.ext.search = [];
};

