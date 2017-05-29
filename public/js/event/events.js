var global = {};
var $gallery = $('#events-gallery');

$(document).ready(function () {

    $('#country-city-select').multiselect({
        enableClickableOptGroups: true,
        onChange: function () {
            var values = $('#country-city-select').val();
            var filter = global.filter;
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
            buildEvents();
        },
        maxHeight: +($(window).height() / 2.5),
        nonSelectedText: 'City filter',
        buttonWidth: '150px'
    });

    var form = $('#form_add_user');

    buildEvents();

    $(window).scroll(function () {
        if ($(window).scrollTop() + $(window).height() == $(document).height()) {
            addNewEvents(2);
        }
    });

    // refresh
    $('#refresh-events, .filter-all').click(function () {
        delete global.filter;
        buildEvents();
    });

    // filter by status
    $('.filter-status').click(function () {
        var t = $(this);
        var status = t.data('status');
        var filter = {
            active: status
        };
        global.filter = filter;

        buildEvents(filter);
    });

    $('#search-events').bind('input keyup', function () {
        var $this = $(this);
        var delay = 700;

        clearTimeout($this.data('timer'));
        $this.data('timer', setTimeout(function () {
            $this.removeData('timer');

            var search = $this.val();

            if (search.length > 1) {
                var filter = global.filter;
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

    $('div.pull-left > div.pull-left > a').click(function () {
        $('div.pull-left > div.pull-left > a').removeClass('btn-warning');
        $(this).addClass('btn-warning');
    });


});


// go to the event item
$('#events-gallery').on('click', '.event-item', function () {
    var t = $(this);

    var event_url = '/event/';
    var event_id = +t.data('event');
    if (event_id > -1) {
        event_url += event_id;
        window.location = event_url;
    }
});

function initGallery() {
    $gallery.justifiedGallery({
        rowHeight: 300,
        maxRowHeight: 300,
        refreshTime: 250,
        margins: 5
    });
}


function buildEvents(filter) {

    $gallery.html('');
    initGallery();

    setTimeout(function () {
        addNewEvents(0, filter);
    }, 700);
}

function addNewEvents(page, filter) {
    if (filter === undefined) {
        filter = global.filter;
    }
    var query = serialize(filter);
    console.log(query);

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
            var events = data.data;

            if ($.isArray(events) && events.length) {
                events.forEach(function (event) {
                    $gallery.append(
                        generateEvent(event)
                    );
                });

                $gallery.justifiedGallery('norewind');
                global.page++;
            }


        },
        error: function (jqXHR, textStatus, err) {
            //location.reload();
        }
    });


}

function generateEvent(event) {
    let html = `<div class="mt-element-overlay" data-event="` + event.id + `">
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

var serialize = function (obj, prefix) {
    var str = [], p;
    for (p in obj) {
        if (obj.hasOwnProperty(p)) {
            var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
            str.push((v !== null && typeof v === "object") ?
                serialize(v, k) :
                encodeURIComponent(k) + "=" + encodeURIComponent(v));
        }
    }
    return str.join("&");
};
