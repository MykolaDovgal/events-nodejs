/**
 * Created by tegos on 09.05.2017.
 */

$(document).ready(function () {


});

function initMap() {

    var geocomplete_line = $("#geocomplete_line").geocomplete({
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

        $.ajax({
            url: '/line/update/address/' + line.id,
            type: 'POST',
            data: data,
            success: function (req) {
                if (req.status) {
	                $('#place_title').text('in ' + data['country'] + ', ' + data['locality']);
                    toastr.success(req.msg);
                } else {
                    toastr.error(req.msg);
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

    let center = {lat: 0, lng: 0};
    try {
        center = {lat: line.address.latitude || 0, lng: line.address.longitude || 0};
    } catch (e) {

    }

    let map = geocomplete_line.geocomplete("map");

    map.setCenter(center);
    new google.maps.Marker({
        position: center,
        map: map
    });


}