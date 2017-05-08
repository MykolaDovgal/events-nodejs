/**
 * Created by tegos on 08.05.2017.
 */

$(document).ready(function () {

    var line_managers_table = $('#table-line-managers').DataTable({
        "ajax": "/api/line/managers/" + line.id,
        "columns": [
            {
                "data": 'id'
            },
            {
                data: 'profile_picture_circle',
                render: function (data, type, full, meta) {
                    return '<div class="text-center"><img class="profile-picture" src="' + data + '"/></div>';
                },
                width: '8%'
            },
            {
                "data": 'id'
            },
            {
                "data": 'username'
            },
            {
                "data": 'permission_level'
            }
        ],
        scrollY: 200,
        scroller: true,
        responsive: false,
        "dom": "<'row' <'col-md-12'> > t <'row'<'col-md-12'>>",
    });
});