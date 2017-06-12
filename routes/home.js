'use strict';
/**
 * Module dependencies.
 */
let _ = require('underscore');
let express = require('express');
let mongoose = require('mongoose');
let Promise = require('bluebird');

require('rootpath')();

let User = require('models/User');
let Line = require('models/Line');
let Party = require('models/Party');
let Event = require('models/Event');
let Bar = require('models/Bar');


Promise.promisifyAll(mongoose);

module.exports = function (req, res, next) {

	Promise.props({
		barCounter: Bar.countByDate(),
		userAllCount: User.count().execAsync(),
		userAllActiveCount: User.count({active: true}).execAsync(),
		lineActiveCount: Line.count({active: true}).execAsync(),
		lineUnActiveCount: Line.count({active: false}).execAsync(),
		partyCount: Party.count().execAsync(),
		partyCountToday: Party.countByDate(),
		partyCountPast: Party.countByDate('lt'),
		partyCountFuture: Party.countByDate('gt'),
		eventCount: Event.count().execAsync(),
		eventCountToday: Event.countByDate(),
		eventCountPast: Event.countByDate('lt'),
		eventCountFuture: Event.countByDate('gt'),

	})
		.then(function (results) {
			let data = {
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
				eventCount: results.eventCount,
				eventCountToday: results.eventCountToday,
				eventCountPast: results.eventCountPast,
				eventCountFuture: results.eventCountFuture,
				barCountOpen: results.barCounter.open,
				barCountClose: results.barCounter.close,
				barCountAll: results.barCounter.all
			};
			res.render('pages/home', data);
		})
		.catch(function (err) {
			res.send(err);
		});
};
