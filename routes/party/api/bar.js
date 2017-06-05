const express = require('express')
const router = express.Router()
const Promise = require('bluebird')
const moment = require('moment')
const fs = require('fs')
const config = require('config')

const default_image_user = config.get('images:default_image_user')
const Party = require('models/Party')
const User = require('models/user')

router.get('/party/:id/bars', (req, res, next) => {
	Promise.props({
		parties: Party.findOne({ id: req.params.id }).select('bar').execAsync()
	}).then((results) => {
		let data = []
		results.parties.bar.forEach((bar) => {
			data.push({
				_id: bar._id,
				bar_name_eng: bar.bar_name_eng || '',
				bar_name_ol: bar.bar_name_ol || '',
				drinkCategories: bar.drinkCategories || []
			})
		})

		res.json(data)
	}).catch((err) => {
		next(err)
	})
})

router.post('/party/bar/update', (req, res, next) => {
	let body = req.body

	Promise.props({
		party: Party.update({ 'bar': { $elemMatch: { _id: body.pk } } }, { '$set': { ['bar.$.' + body.name]: body['value'], } }).execAsync()
	}).then((results) => {
		res.status(200).send(body['value'])
	}).catch((err) => {
		next(err)
	})
})

router.post('/party/bar/add', (req, res, next) => {
	let body = req.body

	Promise.props({
		party: Party.findOneAndUpdate({ id: body.partyId }, { $push: { bar: { bar_name_eng: body.name, drinksCategories: [] } } }).execAsync()
	}).then((results) => {
		Party.findOne({ id: body.partyId }).select('bar').then((doc) => {
			res.status(200).send(doc.bar[doc.bar.length - 1]._id)
		}).catch((err) => {
			next(err)
		})
	}).catch((err) => {
		next(err)
	})
})

router.post('/party/bar/delete', (req, res, next) => {
	let body = req.body

	Promise.props({
		party: Party.findOneAndUpdate({ id: body.partyId }, { $pull: { bar: { _id: body.barId } } }).execAsync()
	}).then((results) => {
		res.sendStatus(200)
	}).catch((err) => {
		next(err)
	})
})

router.get('/party/:partyId/bar/:barId/tenders', (req, res, next) => {
	Promise.props({
		party: Party.findOne({ id: req.params.partyId }, 'bar')
	}).then((results) => {
		let bar = results.party.bar.find(bar => {
			return bar._id == req.params.barId // barId, not the _id
		})

		User.find({
			id:
			{
				$in: bar.party_managers.map(object => {
					return object.userId
				})
			}
		}).exec().then((results) => {
			results.forEach(function (user) {
				if (!fs.existsSync('public' + user.profile_picture_circle) && !user.profile_picture_circle.includes('http') || user.profile_picture_circle === '')
					user.profile_picture_circle = default_image_user
			})
			let data = { data: results }
			res.json(data)
		})
	}).catch((err) => {
		next(err)
	})
})

router.post('/party/bar/tenders/add', (req, res, next) => {
	let body = req.body

	Promise.props({
		party: Party.findOne({ id: parseInt(body.partyId) }, 'bar')
	}).then((results) => {
		results.party.bar.find((bar) => {
			return bar._id == body.barId
		}).party_managers.push({ userId: body.userId })
		results.party.save()
		res.sendStatus(200)
	}).catch((err) => {
		next(err)
	})
})

router.post('/party/bar/tenders/delete', (req, res, next) => {
	let body = req.body

	Promise.props({
		party: Party.findOne({ id: parseInt(body.partyId) }, 'bar')
	}).then((results) => {
		results.party.bar.find((bar) => {
			return bar._id == body.barId
		}).party_managers.pull({ userId: body.userId })
		results.party.save()
		res.sendStatus(200)
	}).catch((err) => {
		next(err)
	})
})

router.post('/party/bar/category/add', (req, res, next) => {
	let body = req.body

	Promise.props({
		party: Party.findOne({ 'bar': { $elemMatch: { _id: body.barId } } }).execAsync()
	}).then((results) => {
		let bar = results.party.bar.find(function (bar) {
			return bar._id == body.barId
		})
		bar.drinkCategories.push({ category_name: body.categoryName })
		results.party.save()
		res.send(bar.drinkCategories[bar.drinkCategories.length - 1]._id)
	}).catch((err) => {
		next(err)
	})
})

router.post('/party/bar/category/update', (req, res, next) => {
	let body = req.body

	Promise.props({
		party: Party.findOne({ 'bar.drinkCategories._id': body.pk }).execAsync()
	}).then((results) => {
		results.party.bar.forEach(bar => {
			let category = bar.drinkCategories.find(category => {
				return category._id == body.pk
			})
			category ? category.category_name = body.value : 'kek'
		})
		results.party.save()
		res.sendStatus(200)
	})
})

router.post('/party/bar/category/delete', (req, res, next) => {
	let body = req.body

	Promise.props({
		party: Party.findOne({ 'bar.drinkCategories._id': body.categoryId }).execAsync()
	}).then((results) => {
		let category
		results.party.bar.forEach(bar => {
			bar.drinkCategories.pull({ _id: body.categoryId })
		})
		results.party.save()
		res.sendStatus(200)
	})
})

router.post('/party/bar/drinks/add', (req, res, next) => {
	let body = req.body

	Promise.props({
		party: Party.findOne({ 'bar.drinkCategories._id': body.categoryId }).execAsync()
	}).then((results) => {
		let category = results.party.bar.find(bar => {
			return bar._id == body.barId
		}).drinkCategories.find(category => {
			return category._id == body.categoryId
		})
		category.drinks.push({})
		results.party.save()
		res.sendStatus(200)
	})
})

router.get('/party/bar/:barId/drinks/:categoryId', (req, res, next) => {// REWORK
	Promise.props({
		party: Party.findOne({ 'bar.drinkCategories._id': req.params.categoryId }).execAsync()
	}).then((results) => {
		let drinks = results.party.bar.find(bar => {
			return bar._id == req.params.barId
		}).drinkCategories.find(category => {
			return category._id == req.params.categoryId
		}).drinks
		res.json({ data: drinks })
	}).catch(err => {
		next(err)
	})
})

module.exports = router
