/**
 * Created by tegos on 12.04.2017.
 */

var datetime = null,
    date = null;
var second_block, minutes_block, hour_block, date_text;

var updateTime = function () {
    if (datetime !== undefined) {
        date = moment(new Date());
        var second = date.format('ss');
        var minutes = date.format('mm');
        var hours = date.format('HH');

        var date = date.format('dddd, MMMM Do YYYY');

        second_block.text(second);
        minutes_block.text(minutes);
        hour_block.text(hours);

        date_text.text(date);
    }
};

$(document).ready(function () {
    datetime = $('#datetime');
    second_block = datetime.find('.second');
    minutes_block = datetime.find('.minute');
    hour_block = datetime.find('.hour');
    date_text = datetime.find('.data');

    updateTime();
    setInterval(updateTime, 1000);
});