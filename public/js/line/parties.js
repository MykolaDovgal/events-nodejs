/**
 * Created by tegos on 09.05.2017.
 */

$(document).ready(function () {
	let line_parties_table;

	$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
		let target = $(e.target).attr("href");
		if ((target === '#parties-container')) {
			initTableParties();
		}
	});


	function initTableParties() {
		if (!$.fn.DataTable.isDataTable('#table-line-parties')) {

			line_parties_table = $('#table-line-parties').DataTable({

				"ajax": "/api/line/" + line.id + "/parties",
				"columns": [
					{
						data: 'id',
						width: '10%'
					},
					{
						data: 'title',
						width: '10%',
						render: function (data, type, full, meta) {
							let title_length = 20;
							let text = data.length > title_length ? data.substr(0, title_length).trim() + '...' : data;
							return '<span title="' + data + '">' + text + '</span>'
						},
					},
					{
						data: 'club',
						width: '20%'
					},
					{
						data: 'date',
						width: '10%',
						className: 'text-center'
					},
					{
						data: 'open_time',
						width: '15%',
						className: 'text-center'
					},
					{
						data: 'attendees_count',
						width: '15%',
						className: 'text-center'
					},
					{
						data: 'video_stream_avbl',
						render: function (data, type, full, meta) {
							return `<div class="text-center"><input disabled type="checkbox" ${data === true ? 'checked' : ''} ></div>`;
						},
						width: '10%'
					},
					{
						data: 'tkts_avbl_here',
						render: function (data, type, full, meta) {
							return `<div class="text-center"><input disabled type="checkbox" ${data === true ? 'checked' : ''} ></div>`;
						},
						width: '10%'
					},
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

				"dom": "<'row' <'col-md-12'  t >  <'col-md-12'i> >",
			});

			$('#table-line-parties tbody').on('click', "tr :not(a,i)", function (e) {
				let check = true;

				let tag = e.target.nodeName;
				let _t = this;
				if (tag === 'A' || tag === 'I') {
					check = false;
				}

				if (tag !== 'TD') {
					_t = $(this).closest('tr').get(0);
				}


				let partyRow = line_parties_table.row(_t).data();
				console.log(partyRow);
				if (check) {
					window.open('/party/' + partyRow.id, '_blank');
				}
			});

			dataTableHelper.eventForUpdateTable('.update_tab_table_parties', line_parties_table);
			dataTableHelper.eventForSearchInTable('#filter-party-table', line_parties_table);

		} else {
			dataTableHelper.updateTable(line_parties_table);
		}


	}
});