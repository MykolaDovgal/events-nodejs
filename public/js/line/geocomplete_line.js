/**
 * Created by tegos on 09.05.2017.
 */

$(document).ready(function () {


});

function initMap() {

    $("#geocomplete_line").geocomplete({
        map: '#map',
        details: '.geo-data',
        types: ['(cities)']

    }).on('geocode:result', function (e, result) {
        var geo_data = $('.geo-data');
        var data = {
            lat: $('#lat').val(),
            lng: $('#lng').val(),
            locality: $('#locality').val(),
            country: $('#country').val(),
            country_short: $('#country_short').val(),
        };

        console.log(data);

        $.ajax({
            url: '/line/update/address/' + line.id,
            type: 'POST',
            data: data,
            success: function (data) {
                if (data.status) {
                    toastr.success(data.msg);
                } else {
                    toastr.error(data.msg);
                }

            },
            error: function (jqXHR, textStatus, err) {
                console.error(err);
                toastr.error('Server error!');
            }
        });

    });

    $("#find_geocomplete").click(function () {
        $("#geocomplete_line").trigger("geocode");
    });


}