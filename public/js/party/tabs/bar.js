let barCount = 1;
let catCount = 1;
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

    $('body').on('click', '.add-category-button', function () {
        let barId = $(this).parents('.bar-tab').attr('id');
        let data = { barId: barId, categoryName: 'Category ' + catCount }
        $.ajax({
            url: '/api/party/bar/category/add',
            type: 'POST',
            data: data,
            success: (_id) => {
                createCategoryTab({ bar_name_eng: 'Bar ' + barCount, _id: barId }, { category_name: 'Category ' + catCount, _id: _id });
            }
        });
    });

    $('body').on('click', '.collapse_category', function (e) {
        if ($(e.target).prop("tagName") == 'DIV') {
            $(this).closest('.category-accordion').find('.panel-collapse').not($(this).siblings('.panel-collapse')).slideUp(300);
            $(this).siblings('.panel-collapse').slideToggle({ 
                start: function () {
                    let table = $(this).find('table')[0];
                    if ($(table).hasClass('not-initialized')) {
                        console.log('Updating', table)
                        fixTableLayout.apply(this);
                        $(table).removeClass('not-initialized')
                    }
                },
                duration: 300
             });
        }
    })

    $('body').on('click', '.delete_bar_btn_flag', function () {
        deleteBar.apply(this);
    });

    $('body').on('click', '.delete_category_btn_flag', function () {
        deleteCategory.apply(this);
    });

    $('body').on('click', '.add_drink_button', function () {
        let data = { barId: $(this).parents('.bar-tab').attr('id'), categoryId: $(this).data('id') }
        $.ajax({
            url: '/api/party/bar/drinks/add',
            type: 'POST',
            data: data
        });
    });

    let createCategoryTab = (bar, category) => {
        let categoryTemplate = getCategoryTabTemplate(catCount, bar, category);
        $(`#bar_${bar._id}_drinks_accordion`).append(categoryTemplate);
        setCategoryEditable(category);
        initDrinks('category_' + category._id + '_drinks', bar._id, category._id);
        catCount += 1;
    }

    let createBarTab = bar => {
        let barTemplate = getBarTabTemplate(barCount, bar);
        $('#bar_accordion_container').append(barTemplate);
        setBarEditable(barCount);
        setTypeahead('bar_' + barCount + '_tenders_input');
        initBarTenders('bar_' + barCount + '_tenders_table', bar._id);
        if (bar.drinkCategories)
            bar.drinkCategories.forEach(category => {
                createCategoryTab(bar, category);
            });
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

    let setCategoryEditable = category => {
        $('#category_' + category._id).editable({
            url: '/api/party/bar/category/update',
            type: 'text',
            title: 'Enter category name'
        });
    }

    let initBars = () => {
        $.ajax({
            url: '/api/party/' + party.id + '/bars',
            type: 'GET',
            success: (data) => {
                let accordion = $('#bar_accordion_container');
                accordion.empty();
                barCount = 1;
                catCount = 1;
                data.forEach((bar) => {
                    createBarTab(bar);
                });
            }
        });
    };

    function deleteBar() {
        let barId = $(this).data('id');
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

    function deleteCategory() {
        let categoryId = $(this).data('id');
        bootbox.confirm({
            size: 'small',
            message: 'Are you sure you want to remove this category?',
            callback: function (results) {
                if (results) {
                    $.ajax({
                        url: '/api/party/bar/category/delete',
                        type: 'POST',
                        data: { categoryId: categoryId },
                        success: () => {
                            initBars();
                        }
                    })
                }
            }
        })
    }

    let getCategoryTabTemplate = (catCounter, bar, category) => {
        return $(`
            <div class="panel panel-default">
                <div class="panel-heading collapse_category">
                    <a id="category_${category._id}" class="editable editable-click editable-disabled" data-name="category_name" href="#bar_${bar._id}_drinks_${catCounter}"
                    style="margin:10px;display: inline-block" data-type="text" data-pk="${category._id}"
                    data-parent="#bar_${bar._id}_drinks_accordion">${category.category_name}</a>
                    <button id="delete_category_${category._id}" data-id="${category._id}" class="delete_category_btn_flag" type="button">
                        <i bar-id="${bar._id}" class="fa fa-trash"></i>
                    </button>
                </div>
                <div id="bar_${bar._id}_drinks_${catCounter}" class="panel-collapse collapse">
                    <div class="panel-body"><div class="portlet-body table-both-scroll">
                        <table id="category_${category._id}_drinks" class="table table-striped table-bordered table-hover order-column not-initialized">
                            <thead>
                            <th>#</th>
                            <th>Drink</th>
                            <th>Serve Method</th>
                            <th>Volume</th>
                            <th>Price</th>
                            <th>In Stock</th>                             
                            </thead>
                        </table>
                        <button class="btn btn-default add_drink_button" data-id="${category._id}">Add Drink</button>
                    </div>
                </div>
            </div>
        `)
    }

    let getBarTabTemplate = (counter, bar) => {
        return $(`
            <div id="${bar._id}" class="panel panel-default bar-tab tab_flag">
                <div class="panel-heading collapse_accordion init_table_flag">
                    <a id="bar_${counter}_name" class="editable editable-click editable-disabled" data-name="bar_name_eng" href="#bar_${counter}_body"
                        style="margin:10px;display: inline-block" data-type="text" data-pk="${bar._id}"
                        data-parent="#bar_accordion_container">${bar.bar_name_eng}</a>
                    <button id="delete_bar_${counter}" data-id="${bar._id}" class="delete_bar_btn_flag" type="button">
                        <i bar-id="${bar._id}" class="fa fa-trash"></i>
                    </button>
                </div>
                <div id="bar_${counter}_body" class="panel-collapse collapse horizontal-tab">
                    <div class="row">
                        <div class="col-md-12 col-lg-5 table-tenders">
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
                        <div class="col-md-12 col-lg-7 table-drinks">

                            <div class="portlet light bordered">
                                <div class="title-block caption font-red">
                                    <i class="fa fa-star font-red" aria-hidden="true"></i>
                                    <span class="caption-subject bold">Drinks</span>
                                </div>
                                <div class="panel-group category-accordion" id="bar_${bar._id}_drinks_accordion">
                                </div>
                                <button id="bar_${counter}_add_category" class="btn btn-default add-category-button">Add Category</button>    
                            </div>

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

    function initDrinks(tableId, barId, categoryId) {
        $('#' + tableId)
            .DataTable({
                "ajax": {
                    "url": "/api/party/bar/" + barId + "/drinks/" + categoryId,
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
                                        <input value="${ data || ''}"  name="drink_price" class="form-control" type="text" style="width: 100%">			
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