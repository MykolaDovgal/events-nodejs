var global = {};

var $gallery = $('#lines-gallery');

$(document).ready(function () {
    var CountryToCities = [];
    var form = $('#form_add_user');

    $.getJSON('/data/countriesToCities.json', function (data) {
        var selectCountry = [];
        $.each(data, function (key, val) {
            var selectItem = [];
            selectCountry.push('<option value="' + key + '">' + key + '</option>');
            $.each(val, function (_key, _val) {
                selectItem.push('<option value="' + _val + '">' + _val + '</option>');
            });
            CountryToCities[key] = selectItem;
        });

        $('#form-line-country-select').html(selectCountry.join(""));

    });

    $('#form-line-country-select').on({
        change: function () {
            appendSelectItem($(this).val());
        }
    });

    function appendSelectItem(countryName) {
        $('#form-line-city-select').html(CountryToCities[countryName].join(""));
    }


    //$gallery.justifiedGallery('norewind');


    buildLines();

    $(window).scroll(function () {
        if ($(window).scrollTop() + $(window).height() == $(document).height()) {
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
        var t = $(this);
        var status = t.data('status');
        var filter = {
            active: status
        };
        global.filter = filter;

        buildLines(filter);
    });


});


// go to the line item
$('#lines-gallery').on('click', '.line-item', function () {
    var t = $(this);

    // if (t.attr('class').indexOf('line-item') === -1) {
    //     t = t.parents('.line-item').first();
    // }

    var line_url = '/line/';
    var line_id = +t.data('line');
    if (line_id > -1) {
        line_url += line_id;
        window.location = line_url;
    }
});

function initGallery() {
    $gallery.justifiedGallery({
        rowHeight: 300,
        margins: 5
    });
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
    var query = serialize(filter);
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
            var lines = data.data;

            if ($.isArray(lines) && lines.length) {
                lines.forEach(function (line) {
                    $gallery.append(
                        generateLine(line)
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

function generateLine(line) {
    let html = `<div class="line-item mt-element-overlay" data-line="` + line.id + `">
                    
                            <div class="mt-overlay-5"><img src="` + line.cover_picture + `"/>
                                <div class="mt-overlay">
                                    <h2>` + line.line_name_eng + `</h2>
                                    <p>
                                        <a class="uppercase" href="` + line.website + `">Learn More</a>
                                    </p>
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
}
