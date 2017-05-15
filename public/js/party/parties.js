$(document).ready(function () {

	$('div.pull-left > div.pull-left > a').click(function () {
		$('div.pull-left > div.pull-left > a').removeClass('btn-warning');
		$(this).addClass('btn-warning');
	});


	let parties_tables = $('#parties_datatable').DataTable({

		"ajax": "/api/parties",
		"columns": [
			{
				data: 'party_id',
				width: '5%'
			},
			{
				'data': 'line_name_eng',
				width: '15%'
			},
			{
				data: 'country_name_eng',
				width: '15%'
			},
			{
				"data": 'city_name_eng',
				width: '15%'
			},
			{
				"data": 'event_name_eng',
				width: '15%'
			},
			{
				"data": 'date',
				width: '10%'
			},
			{
				"data": 'open_time',
				width: '10%'
			},
			{
				"data": 'attendees_count',
				width: '5%'
			},
			{
				"data": 'video_stream_avb',
				width: '5%'
			},
			{
				"data": 'tkts_avbl_here',
				width: '5%'
			}
		],
		"columnDefs": [
			{
				"targets": 'no-sort',
				"orderable": false
			}
		],
		scrollY: 200,
		scroller: true,
		responsive: false,



		"dom": "<'row' <'col-md-12'> > t <'row'<'col-md-12'>>",
		});


});