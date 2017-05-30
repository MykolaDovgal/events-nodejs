/**
 * Created by tegos on 09.05.2017.
 */

$(document).ready(function () {
    var line_parties_table;

    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        var target = $(e.target).attr("href");
        if ((target === '#parties-container')) {
            initTableParties();
        }
    });


    function initTableParties() {
        if (!$.fn.DataTable.isDataTable('#table-line-parties')) {

            line_parties_table = $('#table-line-parties').DataTable({

                "ajax": "/api/line/"+ line.id +"/parties",
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
			                return `<div class="text-center"><input disabled type="checkbox" ${data == true ? 'checked' : ''} ></div>`;
		                },
		                width: '10%'
	                },
	                {
		                data: 'tkts_avbl_here',
		                render: function (data, type, full, meta) {
			                return `<div class="text-center"><input disabled type="checkbox" ${data == true ? 'checked' : ''} ></div>`;
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


                "dom": "<'row' <'col-md-12' <'pull-right group-input' <'search pull-right'<'fa fa-search'> f > <'fa fa-refresh update-table-users'> > > > t <'row'<'col-md-12'i>>",
            });
        }else {
            updateTable()
        }
    }

    function updateTable() {
        line_parties_table.clear().draw();
        setTimeout(function () {
            line_parties_table.ajax.reload();
            line_parties_table.columns.adjust().draw();
        }, 1000);
    }
});