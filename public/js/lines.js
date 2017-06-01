let global = {};
let $gallery = $('#lines-gallery');
let height = 0;

$(document).ready(function () {

	$('#country-city-select').multiselect({
		enableClickableOptGroups: true,
		onChange: function () {
			let values = $('#country-city-select').val();
			let filter = global.filter;
			console.log(values);
			if (values) {
				if (!filter) {
					filter = {};
				}
				filter['address'] = values;

				global.filter = filter;
			} else {
				delete global.filter.address;
			}
			buildLines();
		},
		maxHeight: +($(window).height() / 2.5),
		nonSelectedText: 'City filter',
		buttonWidth: '150px'
	});

	buildLines();

	$(window).scroll(function () {
		if ($(window).scrollTop() + $(window).height() === $(document).height()) {
			addNewLines(2);
		}
	});

	// refresh
	$('#refresh-lines, .filter-all').click(function () {
		delete  global.filter;
		buildLines();
	});

	// filter by status
	$('.filter-status').click(function () {
		let t = $(this);
		let status = t.data('status');
		let filter = {
			active: status
		};
		global.filter = filter;

		buildLines(filter);
	});

	$('#search-lines').bind('input keyup', function () {
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
			buildLines();

		}, delay));
	});

});


// go to the line item
$('#lines-gallery').on('click', '.line-item', function () {
	let t = $(this);

	let line_url = '/line/';
	let line_id = +t.data('line');
	if (line_id > -1) {
		line_url += line_id;
		window.location = line_url;
	}
});

function initGallery() {
	$gallery = $('#lines-gallery');
}


function buildLines(filter) {

	$gallery.html('');
	initGallery();

	setTimeout(function () {
		addNewLines(0, filter);
	}, 700);
}

function addNewLines(page, filter) {
	if (filter === undefined) {
		filter = global.filter;
	}
	let query = serialize(filter);
	console.log(query);

	if (page === undefined || page < 1) {
		page = 1;
		global.page = page;
	} else {
		page = global.page;
	}

	$.ajax({
		url: '/api/lines/' + page + '/?' + query,
		type: 'POST',
		data: {},
		success: function (data) {
			let lines = data.data;

			if ($.isArray(lines) && lines.length) {
				lines.forEach(function (line) {
					$gallery.append(
						generateLine(line)
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

function generateLine(line) {
	let address = line.address ? '<br>' + line.address.city + ', ' + line.address.country : '';
	let html = `<div class="mt-element-overlay col-xs-12 col-sm-6  col-lg-4" data-line="` + line.id + `">
                    <div class="mt-overlay-3">
                        <img src="` + line.cover_picture + `"/>
                        <div class="mt-overlay">
                            <h2>` + line.line_name_eng + `</h2>
                            <a class="mt-info" href="/line/` + line.id + `">
                                <div style="position: relative; top: -50px;">#` + line.id + address + `
                                    <br>Next Party: ` + new Date(Date.now()).toLocaleDateString() + `
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


