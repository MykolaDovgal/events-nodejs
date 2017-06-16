let attendees_table;
let isAttendeesInit = false;
let isFollowersInit = false;


$(document).ready(function () {

	$('#attendees_tab_btn').on('click', function () {
		if (!isAttendeesInit) {
			initAttendeesTable();
			isAttendeesInit = true;
		}
	});

	$('#followers_tab_btn').on('click', function () {
		if (!isFollowersInit) {
			initFollowersTable();
			isFollowersInit = true;
		}
	});

	$('#bar_attendees').on('click', 'td', function (event) {
		window.location = '/users/' + attendees_table.row(this).data().userId;
	});

	$('#bar_followers').on('click', 'td', function (event) {
		window.location = '/users/' + followers_table.row(this).data().userId;
	});
});


let initAttendeesTable = function () {

	attendees_table = $('#bar_attendees').DataTable({
		'ajax': {
			type: 'GET',
			'url': '/api/bar/' + bar.id + '/attendees',
			'data': function (d) {
				return d;
			},
			"dataSrc": function (json) {
				return json.data;
			}
		},
		"columns": [
			{
				'data': 'user_picture',
				render: function (data, type, full, meta) {
					return `<div class="text-center"><img class="profile-picture" src="${data}"/></div>`;
				}
			},
			{
				'data': 'userId',
				render: function (data, type, full, meta) {
					return `<div class="text-center">${data}</div>`;
				},
			},
			{
				'data': 'user_name',
				render: function (data, type, full, meta) {
					let text = data.length > 12 ? data.substr(0, 12) + '...' : data;
					return '<span title="' + data + '">' + text + '</span>'
				}
			},
			{
				'data': 'attend_mark_time',
				render: function (data, type, full, meta) {
					return `<div class="text-center">${data}</div>`;
				},
			},
			{
				'data': 'location_ver',
				render: function (data, type, full, meta) {
					return `<div class="text-center"><input disabled type="checkbox" ${data ? 'checked' : ''} ></div>`;
				},
			},
			{
				'data': 'location_ver_time',
				render: function (data, type, full, meta) {
					return `<div class="text-center">${data}</div>`;
				}
			},

		],
		"columnDefs": [
			{
				"targets": 'no-sort',
				"orderable": false
			}
		],
		autoWidth: false,
		scrollY: 400,
		scrollX: true,
		scroller: true,


		"dom": "<'row' <'col-md-12'  t >  <'col-md-12'i> >",
	});

	dataTableHelper.eventForUpdateTable('#update_attendees', attendees_table);
	dataTableHelper.eventForSearchInTable('#filter_bar_attendees_table', attendees_table);
};

let initFollowersTable = function () {

	let followers_table = $('#bar_followers').DataTable({
		'ajax': {
			type: 'GET',
			'url': '/api/bar/' + bar.id + '/followers',
			'data': function (d) {
				return d;
			},
			"dataSrc": function (json) {
				return json.data;
			}
		},
		"columns": [
			{
				'data': 'user_picture',
				render: function (data, type, full, meta) {
					return `<div class="text-center"><img class="profile-picture" src="${data}"/></div>`;
				}
			},
			{
				'data': 'userId',
				render: function (data, type, full, meta) {
					return `<div class="text-center">${data}</div>`;
				},
			},
			{
				'data': 'user_name',
				render: function (data, type, full, meta) {
					let text = data.length > 12 ? data.substr(0, 12) + '...' : data;
					return '<span title="' + data + '">' + text + '</span>'
				}
			},
			{
				'data': 'times_attended',
				render: function (data, type, full, meta) {
					return `<div class="text-center">${data}</div>`;
				},
			},
			{
				'data': 'last_attendence',
				render: function (data, type, full, meta) {
					return `<div class="text-center">${data}</div>`;
				},
			},
		],
		"columnDefs": [
			{
				"targets": 'no-sort',
				"orderable": false
			}
		],
		autoWidth: false,
		scrollY: 400,
		scrollX: true,
		scroller: true,
		"dom": "<'row' <'col-md-12'  t >  <'col-md-12'i> >",
	});

	dataTableHelper.eventForUpdateTable('#update_followers', followers_table);
	dataTableHelper.eventForSearchInTable('#filter_bar_followers_table', followers_table);
};