/**
 * Created by tegos on 28.04.2017.
 */

$(document).ready(function () {


    var $gallery = $('#lines-gallery');


    //$gallery.justifiedGallery('norewind');

    function addNewLines(page) {

        if (page === undefined) {
            page = 0;
        }

        $.ajax({
            url: '/api/lines/' + page + '/',
            type: 'POST',
            data: {},
            success: function (data) {
                var lines = data.data;

                if ($.isArray(lines)) {
                    lines.forEach(function (line) {
                        $gallery.append(
                            generateLine(line)
                        );
                    })
                }

                if (page === 0) {
                    $gallery.justifiedGallery({
                        rowHeight: 200,
                        maxRowHeight: 200
                    });
                } else {
                    $gallery.justifiedGallery('norewind');
                }


            },
            error: function (jqXHR, textStatus, err) {
                //location.reload();
            }
        });


    }


    setTimeout(function () {
        addNewLines(0);
    }, 1000);


    function generateLine(line) {
        let html = `<div class="mt-element-overlay">
                    <div class="row">
                        <div class="col-md-12">
                            <div class="mt-overlay-5"><img src="` + line.cover_picture + `"/>
                                <div class="mt-overlay">
                                    <h2>` + line.line_name_eng + `</h2>
                                    <p>
                                        <a class="uppercase" href="` + line.website + `">Learn More</a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;
        return html;
    }

    $(window).scroll(function () {
        if ($(window).scrollTop() + $(window).height() == $(document).height()) {
            addNewLines(10);
        }
    });


});

