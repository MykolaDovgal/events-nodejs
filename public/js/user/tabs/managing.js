/**
 * Created by Tegos on 17.06.2017.
 */

$(document).ready(function () {
	let lines;
	let events;
	let bars;
	let parties;

	$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
		setTimeout(() => {
			buildTables();
		}, 500);
	});

	let buildTables = function () {
		if (typeof lines === 'undefined') {
			lines = $('#table-lines').DataTable({
				"ajax": "/api/user/lines/" + user.id,
				"columns": [
					{
						data: 'id'
					},
					{
						data: 'name'
					},
					{
						data: 'country'
					},
					{
						data: 'city'
					},
				],
				scrollY: 300,
				scrollX: true,
				scroller: true,
				responsive: false,
				"dom": "<'row' <'col-md-12'>> t <'row'<'col-md-12'>>",
			});
			$('#table-lines tbody').on('click', 'tr', function () {
				let href = "/line/" + lines.row(this).data().id;
				window.open(href, '_blank');
			});
		}

		if (typeof events === 'undefined') {
			events = $('#table-events').DataTable({
				"ajax": "/api/user/events/" + user.id,
				"columns": [
					{
						data: 'id'
					},
					{
						data: 'name'
					},
					{
						data: 'country'
					},
					{
						data: 'city'
					},
				],
				scrollY: 300,
				scrollX: true,
				scroller: true,
				responsive: false,
				"dom": "<'row' <'col-md-12'>> t <'row'<'col-md-12'>>",
			});
			$('#table-events tbody').on('click', 'tr', function () {
				let href = "/event/" + events.row(this).data().id;
				window.open(href, '_blank');
			});
		}

		if (typeof bars === 'undefined') {
			bars = $('#table-bars').DataTable({
				"ajax": "/api/user/bars/" + user.id,
				"columns": [
					{
						data: 'id'
					},
					{
						data: 'name'
					},
					{
						data: 'country'
					},
					{
						data: 'city'
					},
				],
				scrollY: 300,
				scrollX: true,
				scroller: true,
				responsive: false,
				"dom": "<'row' <'col-md-12'>> t <'row'<'col-md-12'>>",
			});
			$('#table-bars tbody').on('click', 'tr', function () {
				let href = "/bar/" + bars.row(this).data().id;
				window.open(href, '_blank');
			});
		}

		if (typeof parties === 'undefined') {
			parties = $('#table-parties').DataTable({
				"ajax": "/api/user/parties/" + user.id,
				"columns": [
					{
						data: 'id'
					},
					{
						data: 'name'
					},
					{
						data: 'country'
					},
					{
						data: 'city'
					},
				],
				scrollY: 300,
				scrollX: true,
				scroller: true,
				responsive: false,
				"dom": "<'row' <'col-md-12'>> t <'row'<'col-md-12'>>",
			});
			$('#table-parties tbody').on('click', 'tr', function () {
				let href = "/party/" + parties.row(this).data().id;
				window.open(href, '_blank');
			});
		}
	}

});