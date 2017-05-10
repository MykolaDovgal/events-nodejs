var global = {};

var $gallery = $('#lines-gallery');

$(document).ready(function () {

    var form = $('#form_add_user');

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

    //$('#search-lines');
    $('#search-lines').bind('input keyup', function () {
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
            buildLines();

        }, delay));
    });


});


// go to the line item
$('#lines-gallery').on('click', '.line-item', function () {
    var t = $(this);

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
                    
                            <div class="mt-overlay-1"><img src="` + line.cover_picture + `"/>
                                <div class="mt-overlay">
                                	<h2 class="mt-info">` + line.line_name_eng + `</h2><br/>
                                    <!--ul class="mt-info">
                                        <li>
                                            <a class="btn default btn-outline" href="javascript:;">
                                                <i class="icon-magnifier"></i>
                                            </a>
                                        </li>
                                        <li>
                                            <a target="_blank" class="btn default btn-outline" href="` + line.website + `">
                                                <i class="icon-link"></i>
                                            </a>
                                        </li>
                                    </ul-->
                                    
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
