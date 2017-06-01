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
						data: 'lineId',
						width: '10%'
					},
					{
						data: 'club',
						width: '20%'
					},
					{
						data: 'date',
						width: '10%'
					},
					{
						data: 'open_time',
						width: '15%'
					},
					{
						data: 'attendees_count',
						width: '15%'
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
						"targets": 'no-sort',
						"orderable": false
					}
				],
				autoWidth: false,
				scrollY: 400,
				scroller: true,
				responsive: false,


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
					_t = $(this).parent('tr').get(0);
				}

				console.log(tag);
				let partyRow = line_parties_table.row(_t).data();
				console.log(partyRow);
				if (check) {
					window.open('/party/' + partyRow.id, '_blank');
					//window.location = '/party/' + partyRow.party_id;
				}
			});

		} else {
			updateTable();
		}


	}

	function updateTable() {
		line_parties_table.clear().draw();
		setTimeout(function () {
			line_parties_table.ajax.reload();
			line_parties_table.columns.adjust().draw();
		}, 1000);
	}

	$('#filter-party-table').keyup(function () {
		line_parties_table.search($(this).val()).draw();
	});


});