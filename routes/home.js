'use strict';
/**
 * Module dependencies.
 */
var _ = require('underscore');
var express = require('express');
var mongoose = require('mongoose');
var Promise = require('bluebird');

require('rootpath')();

var User = require('models/user');
var Line = require('models/line');
var Party = require('models/Party');


Promise.promisifyAll(mongoose);

module.exports = function (req, res, next) {

	Promise.props({
		userAllCount: User.count().execAsync(),
		userAllActiveCount: User.count({active: true}).execAsync(),
		lineActiveCount: Line.count({active: true}).execAsync(),
		lineUnActiveCount: Line.count({active: false}).execAsync(),
		partyCount: Party.count().execAsync(),
		partyCountToday: Party.countByDate(),
		partyCountPast: Party.countByDate('lt'),
		partyCountFuture: Party.countByDate('gt')
	})
		.then(function (results) {
			//console.warn(results);
			var data = {
				title: 'Home',
				showMenu: true,
				userAllCount: results.userAllCount,
				userAllActiveCount: results.userAllActiveCount,
				lineActiveCount: results.lineActiveCount,
				lineUnActiveCount: results.lineUnActiveCount,
				partyCount: results.partyCount,
				partyCountToday: results.partyCountToday,
				partyCountPast: results.partyCountPast,
				partyCountFuture: results.partyCountFuture,
			};
			res.render('pages/home', data);
		})
		.catch(function (err) {
			res.send(err);
		});
};
