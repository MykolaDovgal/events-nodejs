/**
 * Created by tegos on 09.05.2017.
 */

$(document).ready(function () {
	let line_followers_table;

	$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
		let target = $(e.target).attr("href");
		if ((target === '#followers-container')) {
			initTableFollowers();
		}
	});


	function initTableFollowers() {
		if (!$.fn.DataTable.isDataTable('#table-line-followers')) {

			line_followers_table = $('#table-line-followers').DataTable({

				'ajax': {
					type: 'GET',
					'url': "/api/line/followers",
					'data': function (d) {
						return d;
					},
					"dataSrc": function (json) {
						$('#total_number').text(json.total_number);
						return json.data;
					}
				},
				"columns": [
					{
						data: 'profile_picture_circle',
						render: function (data, type, full, meta) {
							return '<div class="text-center"><img class="profile-picture" src="' + data + '"/></div>';
						},
						width: '10%'
					},
					{
						data: 'id',
						width: '10%'
					},
					{
						data: 'username',
						width: '20%'
					},
					{
						data: 'full_name',
						width: '20%'
					},
					{
						data: 'time_attended',
						width: '20%'
					},
					{
						data: 'last_attendance',
						width: '20%'
					}
				],
				"columnDefs": [
					{
						"targets": 'no_sort',
						"orderable": false
					}
				],
				autoWidth: false,
				scrollY: 400,
				scroller: true,
				responsive: false,
				scrollX: true,

				"dom": "<'row' <'col-md-12'> t> <'row'<'col-md-12'i>>",
			});

			dataTableHelper.eventForUpdateTable('.update_tab_table_followers', line_followers_table);
			dataTableHelper.eventForSearchInTable('#filter_tab_followers_table', line_followers_table);

		} else {
			dataTableHelper.updateTable(line_followers_table);
		}
	}


});