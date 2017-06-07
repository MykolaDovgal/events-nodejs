let global = {};

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

	$(window).scroll(function () {
		if ($(window).scrollTop() + $(window).height() === $(document).height()) {
			addNewEvents(2);
		}
	});





});

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
};