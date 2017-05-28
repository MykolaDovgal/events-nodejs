let parties_tables;
let global = {};
const title_length = 20;

$(document).ready(function () {

	$('#country-city-select').multiselect({
		enableClickableOptGroups: true,
		onChange: function () {
			let values = $('#country-city-select').val();
			let filter = global.filter;
			//console.log(values);
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
		},
		maxHeight: +($(window).height() / 2.5),
		nonSelectedText: 'City filter',
		buttonWidth: '150px'
	});

	parties_tables = $('#parties_datatable')
		.on('init.dt', function () {
			onTableInit();
		})
		.DataTable({
			"order": [[2, "asc"]],
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
					render: function (data, type, full, meta) {
						let text = data.length > title_length ? data.substr(0, title_length) + '...' : data;
						return '<span title="' + data + '">' + text + '</span>'
					},
					//width: '15%'
				},

				{
					"data": 'date',
					//width: '4%'
				},

				{
					"data": 'open_time',
					"className": "text-center"
					//width: '200px'
				},


				{
					"data": 'city_name_eng',
					render: function (data, type, full, meta) {
						let text = data.length > 10 ? data.substr(0, 10) + '...' : data;
						return '<span title="' + data + '">' + text + '</span>'
					},
				},
				{
					data: 'country_name_eng',
					render: function (data, type, full, meta) {
						let text = data.length > title_length ? data.substr(0, title_length) + '...' : data;
						return '<span title="' + data + '">' + text + '</span>'
					},
					//width: '15%'
				},

				{
					'data': 'line_name_eng',
					render: function (data, type, full, meta) {
						let text = data.length > title_length ? data.substr(0, title_length) + '...' : data;
						return '<span title="' + data + '">' + text + '</span>'
					},
					//width: '15%'
				},

				{
					"data": 'event_name_eng',
					//width: '15%'
				},


				{
					"data": 'attendees_count',
					"className": "text-center"
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
					"targets": 'no_sort',
					"orderable": false
				},
				{type: 'date-uk', targets: 2}
			],
			scrollY: 500,
			scrollX: true,
			scroller: true,
			responsive: false,
			autoWidth: false,
			sScrollX: "100%",

			"dom": "<'row' <'col-md-12'> > t <'row'<'col-md-12'>> <'row'<'col-md-12'i>>",
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

	// datatables search filter
	$('.party-search-filter .search').keyup(function () {
		parties_tables.search($(this).val()).draw();
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

let onTableInit = function () {
	let dest = $('.colunm-top-party .right-part');
	//$('.search-party-filter').appendTo(dest);
};

jQuery.extend(jQuery.fn.dataTableExt.oSort, {
	"date-uk-pre": function (a) {
		if (a == null || a == "") {
			return 0;
		}
		var ukDatea = a.split('/');
		return (ukDatea[2] + ukDatea[1] + ukDatea[0]) * 1;
	},

	"date-uk-asc": function (a, b) {
		return ((a < b) ? -1 : ((a > b) ? 1 : 0));
	},

	"date-uk-desc": function (a, b) {
		return ((a < b) ? 1 : ((a > b) ? -1 : 0));
	}
});

