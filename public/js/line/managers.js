/**
 * Created by tegos on 08.05.2017.
 */

$(document).ready(function () {

    var line_managers_table = $('#table-line-managers').DataTable({
        "ajax": "/api/line/managers/" + line.id,
        "columns": [
            {
                "data": 'id',
                width: '10%'
            },
            {
                data: 'profile_picture_circle',
                render: function (data, type, full, meta) {
                    return '<div class="text-center"><img class="profile-picture" src="' + data + '"/></div>';
                },
                width: '20%'
            },
            {
                "data": 'username',
                width: '50%'
            },
            {
                "data": 'permission_level',
                width: '20%'
            }
        ],
        scrollY: 200,
        scroller: true,
        responsive: false,
        "dom": "<'row' <'col-md-12'> > t <'row'<'col-md-12'>>",
    });

    $('#table-line-managers tbody').on('click', 'tr', function () {
        let data = JSON.stringify({ userId: line_managers_table.row(this).data().id, lineId: line.id });
        $.ajax({
			url: '/api/line/manager/delete',
			type: 'POST',
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
			data: data,
		});
    });
});