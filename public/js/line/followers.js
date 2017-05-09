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

                "ajax": "/api/users/",
                "columns": [
                    {
                        data: 'id',
                        width: '5%'
                    },
                    {
                        data: 'profile_picture_circle',
                        render: function (data, type, full, meta) {
                            return '<div class="text-center"><img width="20" class="profile-picture" src="' + data + '"/></div>';
                        },
                        width: '8%'
                    },
                    {
                        data: 'active',
                        render: function (data, type, full, meta) {
                            var content;
                            if (data) {
                                content = '<span class="badge badge-success">Active</span>'
                            } else {
                                content = '<span class="badge badge-danger">Disabled</span>';
                            }
                            return content;
                        },
                        width: '8%'
                    },
                    {
                        data: 'username',
                        width: '14%'
                    },
                    {
                        data: "realname",
                        width: '14%'
                    },
                    {
                        data: 'facebook_profile',
                        render: function (data, type, full, meta) {
                            if (!data) {
                                data = '/';
                            }
                            return '<a href="' + data + '">' + full.realname + '</a>';
                        },
                        width: '14%'
                    },
                    {
                        data: 'lastActivity',
                        width: '14%'
                    },
                    {
                        data: 'bars',
                    },
                    {
                        data: 'events',
                    },
                    {
                        data: 'lines',
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