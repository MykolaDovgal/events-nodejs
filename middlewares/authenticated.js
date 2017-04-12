(function () {
    'use strict';

    /**
     * Module dependencies.
     */
    var _ = require('underscore');

    module.exports = function (req, res, next) {
        var allowed = ['/login'];
        var redirect = '/login';

        if (_.contains(allowed, req.originalUrl)) {
            return next();
        } else {
            req.isAuthenticated()
                ? next()
                : res.redirect(redirect);
        }

    };

})();