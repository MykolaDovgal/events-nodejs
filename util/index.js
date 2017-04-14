/**
 * Created by tegos on 14.04.2017.
 */

var util = {
    isset: function (data) {
        return typeof data !== 'undefined' && data !== null;
    }
};

module.exports = util;