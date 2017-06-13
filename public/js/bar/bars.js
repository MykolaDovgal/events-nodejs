let global = {};
let $gallery = $('#bars_gallery');

$(document).ready(function () {

	$('#country-city-select').multiselect({
		enableClickableOptGroups: true,
		onChange: function () {
			let values = $('#country-city-select').val();
			let filter = global.filter;
			if (values) {
				if (!filter) {
					filter = {};
				}
				filter['address'] = values;

				global.filter = filter;
			} else {
				delete global.filter.address;
			}
			buildBars();
		},
		maxHeight: +($(window).height() / 2.5),
		nonSelectedText: 'City filter',
		buttonWidth: '150px'
	});

	$(window).scroll(function () {
		if ($(window).scrollTop() + $(window).height() === $(document).height()) {
			addNewBars(2);
		}
	});

	$('#refresh_bars, .filter-all').click(function () {
		delete global.filter;
		buildBars();
	});

	$('#search_bars').bind('input keyup', function () {
		let $this = $(this);
		let delay = 700;

		clearTimeout($this.data('timer'));
		$this.data('timer', setTimeout(function () {
			$this.removeData('timer');

			let search = $this.val();

			if (search.length > 1) {
				let filter = global.filter;
				if (!filter) {
					filter = {};
				}
				filter['search'] = search;

				global.filter = filter;


			} else {
				delete global.filter.search;
			}
			buildBars();

		}, delay));
	});

	$('#button-filters input').change(function () {
		eventForButtonTimeFilter();
	});

	$('#bars_gallery').on('click', '.event-item', function () {
		let t = $(this);

		let event_url = '/bar/';
		let event_id = +t.data('bar');
		if (event_id > -1) {
			event_url += event_id;
			window.location = event_url;
		}
	});

	buildBars();
});




let buildBars = function(filter) {
	$gallery.html('');

	setTimeout(function () {
		addNewBars(0, filter);
	}, 500);
};

let generateBar = function(bar) {
	let html = `<div class="mt-element-overlay col-xs-12 col-sm-6  col-lg-4" data-event="${bar.id}">
                    <div class="mt-overlay-3">
                        <img src="${bar.cover_picture}"/>
                        <div class="mt-overlay">
                            <h2>${bar.bar_name_eng}</h2>
                            <a class="mt-info" href="/bar/${bar.id}">
                                <div style="position: relative; top: -50px;">
									#${bar.id}
                                    <br>${bar.location.city}, ${bar.location.country}
                                </div>
                            </a>
                        </div>
                    </div>
                </div>`;
	return html;
};

let addFilterParam = function (filter_item, filter_value) {
	let filter = global.filter;
	if (!filter) {
		filter = {};
	}
	filter[filter_item] = filter_value;

	global.filter = filter;
};

let eventForButtonTimeFilter = function () {
	let date = $('#button-filters input:checkbox:checked').map(function () {
		return $(this).val();
	}).get();
	addFilterParam('date', date);

	buildBars();
};

let addNewBars = function(page, filter) {

	if (filter === undefined) {
		filter = global.filter;
	}

	let query = serialize(filter);

	if (page === undefined || page < 1) {
		page = 1;
		global.page = page;
	} else {
		page = global.page;
	}
	$.ajax({
		url: '/api/scrollBars/' + page + '/?' + query,
		type: 'POST',
		data: {},
		success: function (data) {
			let events = data.data;

			if ($.isArray(events) && events.length) {
				events.forEach(function (event) {
					$gallery.append(
						generateBar(event)
					);
				});

				global.page++;
			}
		},
		error: function (jqXHR, textStatus, err) {
			//location.reload();
		}
	});
};