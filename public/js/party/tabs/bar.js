let barCount = 0;
isBarInit = false

$(document).ready(() => {
    $('#bar_tab_btn').on('click', () => {
        if (!isBarInit) {
            initBars();
            isBarInit = true;
        }
    });

    $('#party_add_bar').on('click', () => {
        addBarTab();
    });

    $('body').on('click', '.add-tender-button', function () {
        if (selectedResults && selectedResults.username) {
            let barId = $(this).parents('.bar-tab').attr('id');
            let data = { partyId: party.id, barId: barId, userId: selectedResults.id };
            $.ajax({
                url: '/api/party/bar/tenders/add',
                type: 'POST',
                data: data,
                success: () => {
                    let parent = $(this).parents('.table-tenders');
                    let table = parent.find('table')[1];
                    updateTable($(table).attr('id'));
                }
            });
        }
    });

    $('body').on('click', '.add-drink-button', function () {
        let barId = $(this).parents('.bar-tab').attr('id');
        let input = $(this).closest('div').find('.drink-input').first();
        let data = { partyId: party.id, barId: barId, drinkName: input.val() };
        $.ajax({
            url: '/api/party/bar/drink/add',
            type: 'POST',
            data: data,
            success: () => {
                let parent = $(this).parents('.table-drinks');
                let table = parent.find('table')[1];
                updateTable($(table).attr('id'));
                input.val('');
            }
        });
    });

    $('body').on('click', '.edit_bar_btn_flag', function () {
        let barName = $(this).parent('.panel-heading').find('a.editable');
        barName.editable('toggleDisabled');
        let isCollapse = barName.attr('data-toggle') == 'collapse' ? '' : 'collapse';
        barName.attr('data-toggle', isCollapse);
    }).on('click', '.delete_bar_btn_flag', function () {
        deleteBar.apply(this);
    });

    let createBarTab = bar => {
        let barTemplate = getBarTabTemplate(barCount, bar);
        $('#bar_accordion_container').append(barTemplate);
        setBarEditable(barCount);
        setTypeahead('bar_' + barCount + '_tenders_input');
        initBarTenders('bar_' + barCount + '_tenders_table', bar._id);
        initDrinks('bar_' + barCount + '_drinks_table', bar._id);
        barCount += 1;
    }

    let addBarTab = () => {
        $.ajax({
            url: '/api/party/bar/add',
            type: 'POST',
            data: { partyId: party.id, name: 'Bar ' + barCount },
            success: (_id) => {
                createBarTab({ bar_name_eng: 'Bar ' + barCount, _id: _id });
            }
        });
    };

    let setBarEditable = counter => {
        $('#bar_' + counter + '_name').editable({
            url: '/api/party/bar/update',
            type: 'text',
            title: 'Enter title',
        });
    };

    let initBars = () => {
        $.ajax({
            url: '/api/party/' + party.id + '/bars',
            type: 'GET',
            success: (data) => {
                let accordion = $('#bar_accordion_container');
                accordion.empty();
                barCount = 0;
                data.forEach((bar) => {
                    createBarTab(bar);
                });
            }
        });
    };

    function deleteBar() {
        console.log(this);
        let barId = $(this).data('id');
        console.log(barId);
        bootbox.confirm({
            size: "small",
            message: "Are you sure you want to remove this bar?",
            callback: function (result) {
                if (result) {
                    $.ajax({
                        url: '/api/party/bar/delete',
                        type: 'POST',
                        data: { partyId: party.id, barId: barId },
                        success: _id => {
                            initBars();
                        }
                    });
                }
            }
        })
    }

    let getBarTabTemplate = (counter, bar) => {
        return $(`
            <div id="${bar._id}" class="panel panel-default bar-tab">
                <div class="panel-heading collapse_accordion">
                    <a id="bar_${counter}_name" class="editable editable-click editable-disabled" data-name="bar_name_eng" href="#bar_${counter}_body"
                        style="margin:10px;display: inline-block" data-type="text" data-pk="${bar._id}"
                        data-parent="#bar_accordion_container">${bar.bar_name_eng}</a>
                    <button id="delete_bar_${counter}" data-id="${bar._id}" class="delete_bar_btn_flag" type="button">
                        <i bar-id="${bar._id}" class="fa fa-trash"></i>
                    </button>
                </div>
                <div id="bar_${counter}_body" class="panel-collapse in container horizontal-tab">
                    <div class="row">
                        <div class="col-md-5 table-tenders">
                            <div class="portlet light bordered">
                                <div class="title-block caption font-red">
                                    <i class="fa fa-star font-red" aria-hidden="true"></i>
                                    <span class="caption-subject bold">Bar Tenders</span>
                                </div>
                                <div class="portlet-body table-both-scroll">
                                    <table id="bar_${counter}_tenders_table" class="table table-striped table-bordered table-hover order-column">
                                        <thead>
                                        <th>#</th>
                                        <th>Pic</th>
                                        <th>User Name</th>
                                        <th>Name</th>
                                        </thead>
                                    </table>
                                </div>
                            </div>
                            <div class="input-add">
                                <div class="input-group">
                                    <span class="input-group-addon">
                                        <i class="fa fa-search" aria-hidden="true"></i>
                                    </span>
                                    <input type="text" id="bar_${counter}_tenders_input" placeholder="User name"
                                            name="user_search" class="form-control tender-input"/>
                                    <span class="input-group-addon btn-manager_user">
                                        <button id="bar_${counter}_add_tender" type="button"
                                                class="btn btn-icon-only green pull-right add-tender-button">
                                        <i class="fa fa-plus"></i>
                                    </button>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-7 table-drinks">
                            <div id="bar_${counter}_drinks_accordion" class="panel-group accordion"><!-- WORKING ON ACCORDION -->

                                <div class="portlet light bordered">
                                    <div class="title-block caption font-red">
                                        <i class="fa fa-star font-red" aria-hidden="true"></i>
                                        <span class="caption-subject bold">Drinks</span>
                                    </div>
                                    <div class="portlet-body table-both-scroll">
                                        <table id="bar_${counter}_drinks_table" class="table table-striped table-bordered table-hover order-column">
                                            <thead>
                                            <th>#</th>
                                            <th>Drink</th>
                                            <th>Serve Method</th>
                                            <th>Volume</th>
                                            <th>Price</th>
                                            <th>In Stock</th>                             
                                            </thead>
                                        </table>
                                    </div>
                                </div>

                                <div class="input-add">
                                    <div class="input-group">
                                        <input type="text" id="bar_${counter}_drinks_input" placeholder="Drink Name"
                                                name="user_search" class="form-control drink-input"/>
                                        <span class="input-group-addon btn-manager_user">
                                            <button id="bar_${counter}_add_drink" type="button"
                                                    class="btn btn-icon-only green pull-right add-drink-button">
                                                <i class="fa fa-plus"></i>
                                            </button>
                                        </span>
                                    </div>
                                </div>

                            </div><!-- accordion -->
                        </div><!-- col-md-7 -->
                    </div>
                </div>
            </div>
        `);
    };

    function initBarTenders(tableId, barId) {
        $('#' + tableId)
            .DataTable({
                "ajax": {
                    "url": "/api/party/" + party.id + "/bar/" + barId + "/tenders",
                },
                "columns": [
                    {
                        data: 'id',
                    },
                    {
                        data: 'profile_picture_circle',
                        render: function (data) {
                            return '<div class="text-center"><img class="profile-picture" src="' + data + '"/></div>';
                        },
                        width: 50
                    },
                    {
                        data: 'username',
                    },

                    {
                        data: "realname",
                        render: function (data, type, full, meta) {
                            return full.firstname + ' ' + full.lastname;
                        }
                    }
                ],
                scrollY: 300,
                scrollX: true,
                scroller: true,
                responsive: false,
                autoWidth: false,
                sScrollX: "100%",
                "dom": "<'row' <'col-md-12'> > t <'row'<'col-md-12'>> <'row'<'col-md-12'i>>",
            });
    }

    function initDrinks(tableId, barId) {
        $('#' + tableId)
            .DataTable({
                "ajax": {
                    "url": "/api/party/" + party.id + "/bar/" + barId + "/drinks",
                },
                "columns": [
                    {
                        data: 'uniqueId',
                        render: function (data) {
                            return data || `<div class="text-center">-</div>`
                        },
                        width: 30
                    },
                    {
                        data: 'drinkname_eng',
                        render: function (data) {
                            return `<div class="identity_flag">
                                        <input value="${ data || ''}"  name="drink-name" class="form-control" type="text" style="width: 100%">			
                                    </div>`
                        }
                    },
                    {
                        data: 'serve_method',

                        render: function (data) {
                            let options = ['Bottle', 'Shot (50ml)', 'Shot (100ml)'];
                            let optionsHTML = [];
                            optionsHTML = options.map((option) => {
                                return `<option value="${option}">${option}</option>`
                            })
                            return `
                                <select name="currency" class="bs-select form-control">
                                    ${optionsHTML.join("")}                             
                                </select>
                            `;
                        },
                        width: 75
                    },
                    {
                        data: "volume",
                        render: function (data) {
                            return `<div class="identity_flag">
                                        <input value="${ data || ''}"  name="volume" class="form-control" type="text" style="width: 100%">			
                                    </div>`
                        },
                        width: 50
                    },
                    {
                        data: "price",
                        render: function (data) {
                            return `<div class="identity_flag">
                                        <input value="${ data || ''}"  name="price" class="form-control" type="text" style="width: 100%">			
                                    </div>`
                        },
                        width: 50
                    },
                    {
                        data: "stock",
                        render: function (data) {
                            return `<div class="identity_flag">
                                        <input ${ data ? 'checked' : ''} type="checkbox" name="stock" class="form-control" type="text" style="width: 100%">			
                                    </div>`
                        },
                        width: 50
                    }
                ],
                scrollY: 300,
                scrollX: true,
                scroller: true,
                responsive: false,
                autoWidth: false,
                sScrollX: "100%",
                "dom": "<'row' <'col-md-12'> > t <'row'<'col-md-12'>> <'row'<'col-md-12'i>>",
            });
    }

});