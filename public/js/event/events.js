let global = {};
let $gallery = $('#events-gallery');

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
			buildEvents();
		},
		maxHeight: +($(window).height() / 2.5),
		nonSelectedText: 'City filter',
		buttonWidth: '150px'
	});



	//buildEvents();

	$(window).scroll(function () {
		if ($(window).scrollTop() + $(window).height() === $(document).height()) {
			addNewEvents(2);
		}
	});

	// refresh
	$('#refresh-events, .filter-all').click(function () {
		delete global.filter;
		buildEvents();
	});

	$('#search-events').bind('input keyup', function () {
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
			buildEvents();

		}, delay));
	});

	// button filters time
	$('#button-filters input').change(function () {
		eventForButtonTimeFilter();
	});

	let eventForButtonTimeFilter = function () {
		let date = $('#button-filters input:checkbox:checked').map(function () {
			return $(this).val();
		}).get();
		addFilterParam('date', date);

		buildEvents();
	};

	eventForButtonTimeFilter();


});


// go to the event item
$('#events-gallery').on('click', '.event-item', function () {
	let t = $(this);

	let event_url = '/event/';
	let event_id = +t.data('event');
	if (event_id > -1) {
		event_url += event_id;
		window.location = event_url;
	}
});


function buildEvents(filter) {

	$gallery.html('');

	setTimeout(function () {
		addNewEvents(0, filter);
	}, 500);
}

function addNewEvents(page, filter) {
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
		url: '/api/events/' + page + '/?' + query,
		type: 'POST',
		data: {},
		success: function (data) {
			let events = data.data;

			if ($.isArray(events) && events.length) {
				events.forEach(function (event) {
					$gallery.append(
						generateEvent(event)
					);
				});

				global.page++;
			}
		},
		error: function (jqXHR, textStatus, err) {
			//location.reload();
		}
	});
}

function generateEvent(event) {
	let html = `<div class="mt-element-overlay col-xs-12 col-sm-6  col-lg-4" data-event="` + event.id + `">
                    <div class="mt-overlay-3">
                        <img src="` + event.cover_picture + `"/>
                        <div class="mt-overlay">
                            <h2>` + event.title_eng + `</h2>
                            <a class="mt-info" href="/event/` + event.id + `">
                                <div style="position: relative; top: -50px;">` + event.start_date + ` — ` + event.end_date + `
                                    <br>` + event.location.city + `, ` + event.location.country + `
                                </div>
                            </a>
                        </div>
                    </div>
                </div>`;
	return html;
}

let serialize = function (obj, prefix) {
	let str = [], p;
	for (p in obj) {
		if (obj.hasOwnProperty(p)) {
			let k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
			str.push((v !== null && typeof v === "object") ?
				serialize(v, k) :
				encodeURIComponent(k) + "=" + encodeURIComponent(v));
		}
	}
	return str.join("&");
};

let addFilterParam = function (filter_item, filter_value) {
	let filter = global.filter;
	if (!filter) {
		filter = {};
	}
	filter[filter_item] = filter_value;

	global.filter = filter;
};
