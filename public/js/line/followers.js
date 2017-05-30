/**
 * Created by tegos on 09.05.2017.
 */

$(document).ready(function () {
    var line_followers_table;

    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        var target = $(e.target).attr("href");
        if ((target === '#followers-container')) {
            initTableFollowers();
        }
    });


    function initTableFollowers() {
        if (!$.fn.DataTable.isDataTable('#table-line-followers')) {

            line_followers_table = $('#table-line-followers').DataTable({

                "ajax": "/api/line/followers",
                "columns": [
                    {
                        data: 'profile_picture_circle',
	                    render: function (data, type, full, meta) {
		                    return '<div class="text-center"><img class="profile-picture" src="' + data + '"/></div>';
	                    },
                        width: '15%'
                    },
	                {
		                data: 'id',
		                width: '5%'
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
        } else {
            updateTable()
        }
    }

    function updateTable() {
        line_followers_table.clear().draw();
        setTimeout(function () {
            line_followers_table.ajax.reload();
            line_followers_table.columns.adjust().draw();
        }, 1000);
    }
});