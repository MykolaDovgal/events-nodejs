let barCount = 1;
let catCount = 1;
let isBarInit = false;

$(document).ready(() => {

	let j_body = $('body');

	$('#bar_tab_btn').on('click', () => {
		if (!isBarInit) {
			initBars();
			isBarInit = true;
		}
	});

	$('#party_add_bar').on('click', () => {
		addBarTab();
		collapseAllBarTab();
	});

	$('body').on('click', '.add-tender-button', function () {
		if (selectedResults && selectedResults.username) {
			let barId = $(this).parents('.bar-tab').attr('id');
			let data = {partyId: party.id, barId: barId, userId: selectedResults.id};
			$.ajax({
				url: '/api/party/bar/tenders/add',
				type: 'POST',
				data: data,
				success: () => {
					let parent = $(this).parents('.table-tenders');
					let table = parent.find('table');
					updateTable(table, true);
				}
			});
		}
	});

	$('body').on('click', '.add-category-button', function () {
		let barId = $(this).parents('.bar-tab').attr('id');
		let data = {barId: barId, categoryName: 'Category ' + catCount}
		$.ajax({
			url: '/api/party/bar/category/add',
			type: 'POST',
			data: data,
			success: (_id) => {
				createCategoryTab({bar_name_eng: 'Bar ' + barCount, _id: barId}, {
					category_name: 'Category ' + catCount,
					_id: _id
				},false);
			}
		});
		collapseAllCategoryTab.call(this);
	});

	$('body').on('click', '.collapse_category', function (e) {
		if ($(e.target).prop("tagName") == 'DIV') {
			$(this).closest('.category-accordion').find('.panel-collapse').not($(this).siblings('.panel-collapse')).slideUp(300);
			$(this).siblings('.panel-collapse').slideToggle({
				start: function () {
					if (!$(this).is(':hidden')) {
						let table = $(this).find('table');
						if (table.hasClass('not-initialized')) {
							updateTable(table);
							table.removeClass('not-initialized')
						}
					}
				},
				duration: 300
			});
		}
	});

	$('body').on('click', '.remove_tender_column', function (event) {
		if ($(event.target).prop("tagName") == "I") {
			let parent = this.parentElement;
			let table = $(this.closest('table'));
			let userId = table.DataTable().row(parent).data().id;
			let barId = $(this.closest('.bar-tab')).attr('id');
			bootbox.confirm({
				size: "small",
				message: "Are you sure you want to remove this user from bar tenders?",
				callback: function (result) {
					if (result) {
						let data = JSON.stringify({userId: userId, barId: barId});
						$.ajax({
							url: '/api/party/bar/tenders/delete',
							type: 'POST',
							dataType: 'json',
							contentType: "application/json; charset=utf-8",
							data: data,
							success: function () {
								updateTable(table, true)
							},
							error: function () {
								updateTable(table, true)
							}
						});
					}
				}
			});
		}
	});

	$('body').on('click', '.delete_bar_btn_flag', function () {
		deleteBar.apply(this);
	});

	$('body').on('click', '.delete_category_btn_flag', function () {
		deleteCategory.apply(this);
	});

	// delete drink
	j_body.on('click', '.remove_drink_button', function () {
		deleteDrink.apply(this);
	});

	// add drink
	$('body').on('click', '.add_drink_button', function () {
		let data = {
			barId: $(this).parents('.bar-tab').attr('id'), categoryId: $(this).data('id')
		};

		let table = $('#category_' + $(this).data('id') + '_drinks');
		let currentDataTable = table.DataTable();

		$.ajax({
			url: '/api/party/bar/drinks/add',
			type: 'POST',
			data: data,
			success: function () {
				dataTableHelper.updateTable(currentDataTable);
			}
		});
	});

	let collapseAllBarTab = () => $('#bar_accordion_container div.panel-collapse').slideUp(300);

	let collapseAllCategoryTab = function () {
		$(this).closest('.table-drinks').find('div.panel-collapse').slideUp(300);
	};

	let createCategoryTab = (bar, category,isCollapsed = true) => {
		let categoryTemplate = getCategoryTabTemplate(catCount, bar, category,isCollapsed);
		$(`#bar_${bar._id}_drinks_accordion`).append(categoryTemplate);
		setCategoryEditable(category);
		initDrinks('category_' + category._id + '_drinks', bar._id, category._id);
		catCount += 1;
	};

	let createBarTab = (bar,isCollapsed = true) => {
		let barTemplate = getBarTabTemplate(barCount, bar,isCollapsed);
		$('#bar_accordion_container').append(barTemplate);
		setBarEditable(barCount);
		setTypeahead('bar_' + barCount + '_tenders_input');
		initBarTenders('bar_' + barCount + '_tenders_table', bar._id);
		if (bar.drinkCategories)
			bar.drinkCategories.forEach(category => {
				createCategoryTab(bar, category);
			});
		barCount += 1;
	};

	let addBarTab = () => {
		$.ajax({
			url: '/api/party/bar/add',
			type: 'POST',
			data: {partyId: party.id, name: 'Bar ' + barCount},
			success: (_id) => {
				createBarTab({bar_name_eng: 'Bar ' + barCount, _id: _id},false);
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
	};

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
		let tab = $(this);
		bootbox.confirm({
			size: "small",
			message: "Are you sure you want to remove this bar?",
			callback: function (result) {
				if (result) {
					$.ajax({
						url: '/api/party/bar/delete',
						type: 'POST',
						data: {partyId: party.id, barId: barId},
						success: () => {
							tab.closest('.panel-default').remove();
							//initBars();
						}
					});
				}
			}
		})
	}

	function deleteCategory() {
		let categoryId = $(this).data('id');
		let tab = $(this);
		bootbox.confirm({
			size: 'small',
			message: 'Are you sure you want to remove this category?',
			callback: function (results) {
				if (results) {
					$.ajax({
						url: '/api/party/bar/category/delete',
						type: 'POST',
						data: {categoryId: categoryId},
						success: () => {
							tab.closest('.panel-default').remove();
							//initBars();
						}
					})
				}
			}
		})
	}

	let getCategoryTabTemplate = (catCounter, bar, category,isCollapsed) => {
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
                <div id="bar_${bar._id}_drinks_${catCounter}" class="panel-collapse ${isCollapsed ? 'collapse' : ''}">
                    <div class="panel-body"><div class="portlet-body table-both-scroll">
                        <table id="category_${category._id}_drinks" class="table table-striped table-bordered table-hover order-column not-initialized">
                            <thead>
							<th></th>                           
                            <th>Drink</th>
                            <th>Serve&nbsp;Method</th>
                            <th>Volume</th>
                            <th>Price</th>
                            <th>In&nbsp;Stock</th>                             
                            </thead>
                        </table>
                        <button class="btn btn-default add_drink_button" data-id="${category._id}">Add Drink</button>
                    </div>
                </div>
            </div>
        `)
	};

	let getBarTabTemplate = (counter, bar, isCollapsed) => {
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
                <div id="bar_${counter}_body" class="panel-collapse  ${isCollapsed ? 'collapse' : ''} horizontal-tab">
                    <div class="row">
                        <div class="col-md-12 col-lg-5 table-tenders">
                            <div class="portlet light bordered">
                                <div class="title-block caption font-red">
                                    <i class="fa fa-star font-red" aria-hidden="true"></i>
                                    <span class="caption-subject bold">Bar Tenders</span>
                                </div>
                                <div class="portlet-body table-both-scroll">
                                    <table id="bar_${counter}_tenders_table" class="table table-striped table-bordered table-hover order-column tenders_table">
                                        <thead>
										<th></th>
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
						data: 'delete_button',
						render: function (data, type, full, meta) {
							return '<div class="text-center remove_tender_column"><a class="btn-circle"><i class="fa fa-remove"></i></a></div>';
						},
						orderable: false,
						width: '5%'
					},
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
		let currentTable = $('#' + tableId)
			.DataTable({
				"ajax": {
					"url": "/api/party/bar/" + barId + "/drinks/" + categoryId,
				},
				"columns": [
					{
						data: 'delete_button',
						render: function (data, type, full, meta) {
							return '<div data-drink_id="' + full.drinkId + '" class="text-center remove_drink_button"><a class="btn-circle"><i class="fa fa-remove"></i></a></div>';
						},
						orderable: false,
						width: '5%'
					},
					{
						data: 'drinkname_eng',
						render: function (data, type, full, meta) {
							let className = 'drink_name editable';
							if (!data || data.trim().length < 1 || data.trim() === 'Empty') {
								className += ' editable-empty';
							}
							return `<a href="#" data-pk="` + full.drinkId + `" class="` + className + `">` + (data || 'Empty') + `</a>`
						}
					},
					{
						data: 'serve_method',

						render: function (data) {
							let className = 'serve_method editable';
							if (!data || data.trim().length < 1 || data.trim() === 'Empty') {
								className += ' editable-empty';
							}

							return `<a class="` + className + `" data-pk="1" data-value="` + data + `" data-original-title="Select serve method">` + (data || 'Empty') + `</a>`;
						},
						width: 75
					},
					{
						data: 'volume',
						render: function (data, type, full, meta) {
							let className = 'volume_input editable';
							if (!data || data.trim().length < 1 || data.trim() === 'Empty') {
								className += ' editable-empty';
							}
							return `<a href="#" data-pk="` + full.drinkId + `" class="` + className + `">` + (data || 'Empty') + `</a>`
						},
						width: 50
					},
					{
						data: 'price',
						render: function (data, type, full, meta) {
							let className = 'price_input editable';
							if (!data || data < 0 || data === 'Empty') {
								className += ' editable-empty';
							}
							return `<a href="#" data-pk="` + full.drinkId + `" class="` + className + `">` + (data || 'Empty') + `</a>`
						},
						width: 50
					},
					{
						data: 'in_stock',
						render: function (data, type, full, meta) {
							let className = 'stock_input editable stock_drink';
							if (data) {
								className += ' in_stock_drink';
							} else {
								className += ' not_in_stock_drink';
							}

							return `<a href="#" data-value="` + (data ? 1 : 0) + `" data-pk="` + full.drinkId + `" class="` + className + `">` + (data ? '' : '') + `</a>`
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


		initForDrinkEditable(tableId);

	}

	// event for deleting drinks
	function deleteDrink() {
		let partyId = party.id;
		let t = $(this);
		let remove_drink_button = t.parent('.remove_drink_button');
		let currentTable = $(t.closest('table'));
		let currentDataTable = currentTable.DataTable();

		let drinkId = +t.data('drink_id');
		bootbox.confirm({
			size: 'small',
			message: 'Are you sure you want to remove this drink?',
			callback: function (results) {
				if (results) {
					$.ajax({
						url: '/api/party/bar/category/drink/delete',
						type: 'POST',
						data: {drinkId: drinkId, partyId: partyId},
						success: () => {
							dataTableHelper.updateTable(currentDataTable);
						}
					})
				}
			}
		})
	}

	let eventForSubmitDrink = function () {
		//
	};

	let updateTable = function (table, reload = false) {
		if (reload) {
			setTimeout(function () {
				table.DataTable().ajax.reload();
			}, 1000);

		}
		table.DataTable().columns.adjust().draw();
	};

	let initForDrinkEditable = function (tableId) {
		let table = $('#' + tableId);

		table.editable({
			mode: 'popup',
			name: 'drinkname_eng',
			container: 'body',
			placement: 'right',
			selector: '.drink_name',
			url: '/api/party/bar/category/drink/update',
			type: 'text',
			title: 'Enter name of drink',
			params: function (params) {
				let t = $(this);
				let currentTable = $(t.closest('table'));
				let currentTableRow = $(t.closest('tr'));
				let currentDataTable = currentTable.DataTable();

				let rowData = currentDataTable.row(currentTableRow.get(0)).data();
				let drinkId = rowData.drinkId;
				if (drinkId > 0) {
					params.drinkId = drinkId;
					params.pk = drinkId;
					params.partyId = party.id;
				}

				return params;

			}
		});

		table.editable({
			mode: 'popup',
			name: 'serve_method',
			container: 'body',
			placement: 'right',
			selector: '.serve_method',
			url: '/api/party/bar/category/drink/update',
			type: 'select',
			source: sourceOfServeMethods,
			title: 'Select serve method',
			params: function (params) {
				let t = $(this);

				let currentTable = $(t.closest('table'));
				let currentTableRow = $(t.closest('tr'));
				let currentDataTable = currentTable.DataTable();

				let rowData = currentDataTable.row(currentTableRow.get(0)).data();
				let drinkId = rowData.drinkId;
				if (drinkId > 0) {
					params.drinkId = drinkId;
					params.pk = drinkId;
					params.partyId = party.id;
				}

				return params;

			}
		});

		table.editable({
			mode: 'popup',
			name: 'volume',
			container: 'body',
			placement: 'right',
			selector: '.volume_input',
			url: '/api/party/bar/category/drink/update',
			type: 'text',
			title: 'Enter volume of drink',
			params: function (params) {
				let t = $(this);
				let currentTable = $(t.closest('table'));
				let currentTableRow = $(t.closest('tr'));
				let currentDataTable = currentTable.DataTable();

				let rowData = currentDataTable.row(currentTableRow.get(0)).data();
				let drinkId = rowData.drinkId;
				if (drinkId > 0) {
					params.drinkId = drinkId;
					params.pk = drinkId;
					params.partyId = party.id;
				}

				return params;

			}
		});

		table.editable({
			mode: 'popup',
			name: 'price',
			container: 'body',
			placement: 'right',
			selector: '.price_input',
			url: '/api/party/bar/category/drink/update',
			type: 'text',
			title: 'Enter volume of drink',
			params: function (params) {
				let t = $(this);
				let currentTable = $(t.closest('table'));
				let currentTableRow = $(t.closest('tr'));
				let currentDataTable = currentTable.DataTable();

				let rowData = currentDataTable.row(currentTableRow.get(0)).data();
				let drinkId = rowData.drinkId;
				if (drinkId > 0) {
					params.drinkId = drinkId;
					params.pk = drinkId;
					params.partyId = party.id;
				}

				return params;

			},
			validate: function (value) {
				let regex = /^[0-9]+$/;
				if (!regex.test(value)) {
					return 'Price must contains numbers only!';
				}
			},
		});

		table.editable({
			mode: 'popup',
			name: 'in_stock',
			container: 'body',
			placement: 'right',
			emptytext: '',
			emptyclass: '',
			selector: '.stock_input',
			url: '/api/party/bar/category/drink/update',
			type: 'checklist',
			source: {'1': 'In Stock'},
			title: 'Is drink in stock?',
			savenochange: true,
			params: function (params) {
				let t = $(this);
				let currentTable = $(t.closest('table'));
				let currentTableRow = $(t.closest('tr'));
				let currentDataTable = currentTable.DataTable();


				let value = params.value;
				if (Array.isArray(value)) {
					value = !!value[0];
				} else {
					value = false;
				}

				params.value = value;

				let rowData = currentDataTable.row(currentTableRow.get(0)).data();
				let drinkId = rowData.drinkId;
				if (drinkId > 0) {
					params.drinkId = drinkId;
					params.pk = drinkId;
					params.partyId = party.id;
				}
				return params;
			},
			display: function (value, sourceData) {
				let a = $(this);
				let check = 'in_stock_drink';
				let uncheck = 'not_in_stock_drink';

				a.removeClass(check).removeClass(uncheck);

				let checked = value;
				if (Array.isArray(value)) {
					checked = !!value[0];
				} else {
					checked = false;
				}

				if (checked) {
					a.addClass(check)
				} else {
					a.addClass(uncheck)
				}
			}
		});

	};



});