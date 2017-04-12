/**
 * Created by tegos on 12.04.2017.
 */

$(document).ready(function () {
    $('#users-list-datatable').DataTable({
        "ajax": "/data/objects.txt",
        "columns": [
            {"data": "name"},
            {"data": "position"},
            {"data": "office"},
            {"data": "extn"},
            {"data": "start_date"},
            {"data": "salary"}
        ]
    });
});