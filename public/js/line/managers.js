let selectedResult;

$(document).ready(function () {

	let line_managers_table;

	jQuery(document).ready(function () {
		initLineManagerTable();
	});


	let initLineManagerTable = function () {
		line_managers_table = $('#table-line-managers').DataTable({
			"ajax": "/api/line/managers/" + line.id,
			"columns": [
				{
					data: 'delete_button',
					render: function (data, type, full, meta) {
						return '<div class="text-center remove-column"><a class="btn-circle"><i class="fa fa-remove"></i></a></div>';
					},
					width: '5%'
				},
				{
					'data': 'id',
					width: '10%'
				},
				{
					data: 'profile_picture_circle',
					render: function (data, type, full, meta) {
						return '<div class="text-center"><img class="profile-picture" src="' + data + '"/></div>';
					},
					width: '20%'
				},
				{
					"data": 'username',
					width: '45%'
				},
				{
					"data": 'permission_level',
					render: function (data, type, full, meta) {
						let className = 'permission_level editable';
						if (!data || data.length < 1 || data === 'Empty') {
							className += ' editable-empty';
						}
						return `<a class="` + className + `" data-pk="${full.id}" data-name="permission_level" data-value="` + data + `" data-original-title="Select permission level">` + (data || 'Empty') + `</a>`;
					},
					width: '20%'
				}
			],
			"columnDefs": [
				{
					"targets": 'no-sort',
					"orderable": false
				}
			],
			scrollY: 200,
			scrollX: true,
			scroller: true,
			responsive: false,
			"dom": "<'row' <'col-md-12'> > t <'row'<'col-md-12'>>",
		});
		initPartyManagerTableEditable('table-line-managers');
	};

	//user dataset for search
	let users = new Bloodhound({
		datumTokenizer: function (datum) {
			let emailTokens = Bloodhound.tokenizers.whitespace(datum.id);
			let lastNameTokens = Bloodhound.tokenizers.whitespace(datum.name);
			let firstNameTokens = Bloodhound.tokenizers.whitespace(datum.username);

			return emailTokens.concat(lastNameTokens).concat(firstNameTokens);
		},
		queryTokenizer: Bloodhound.tokenizers.whitespace,
		prefetch: {
			url: '/api/users/usersname',
			cache: false,
			transform: function (response) {
				return $.map(response, function (item) {
					return {
						id: item.id,
						name: item.name,
						username: item.username,
						picture: item.picture
					};
				});
			}
		}
	});

	//display searched result
	$('#user_search').typeahead({
			hint: true,
			highlight: true,
			minLength: 1
		},
		{
			name: 'users_dataset',
			display: 'name',
			source: users,
			templates: {
				suggestion: function (item) {
					return '<div class="col-md-12">' +
						'<div class="pull-left">' +
						'<img class="img-circle" style="width:20px;height:20px;" src="' + item.picture + '"/></div>' +
						'<div class="pull-right"> ID:(' + item.id + ') <strong>' + item.name + '</strong>' + '</div>' +
						'</div>';
				}
			}
		}).bind('typeahead:select', (ev, suggestion) => selectedResult = suggestion);


	$('#add_manager_user').click(() => {
		selectedResult.lineId = line.id;

		$.ajax({
			url: '/api/line/manager/add',
			type: 'POST',
			data: selectedResult,
			success: function (data) {
				updateManagersTable();

				bootbox.confirm({
					size: "small",
					message: "Do you want to add this user as manager to all line's parties?",
					callback: function (result) {
						if (result) {
							addUserToLineParties();
						}
					}
				});
			},
			error: function (jqXHR, textStatus, err) {
			}
		});


	});

	function updateManagersTable() {
		line_managers_table.clear().draw();
		setTimeout(function () {
			line_managers_table.ajax.reload();
			line_managers_table.columns.adjust().draw();
		}, 1000);
	}

	let addUserToLineParties = function () {
		let lineId = line.id;
		let userId = selectedResult.id;
		let data = {lineId, userId};

		$.ajax({
			url: '/api/line/manager/addToParties',
			type: 'POST',
			data: data,
			success: function (data) {
				let count;
				try {
					count = data.update.nModified;
				} catch (e) {
					count = 0;
				}
				let message = '';
				let start_message = 'User added to ';
				let end_message = 'Line does not contain any parties or user already is manager for these line\'s parties';
				if (count > 0) {
					end_message = (count === 1) ? ' party' : ' parties';
					message = start_message + count + end_message;
				} else {
					message = end_message;
				}

				bootbox.alert({
					size: 'small',
					message: message
				});
			}
		});

		selectedResult = {};
		$('#user_search').val('');

	};


	let lock = false;

	$('#table-line-managers tbody').on('click', 'td', function (event) {
		if (!lock)
			window.location = '/users/' + line_managers_table.row(this).data().id;
	});

	$('#table-line-managers tbody').on('click', 'td > div.remove-column', function (event) {
		lock = true;
		let parent = this.parentElement;
		bootbox.confirm({
			size: "small",
			message: "Are you sure you want to remove this user from managers?",
			callback: function (result) {
				if (result) {
					let data = JSON.stringify({userId: line_managers_table.row(parent).data().id, lineId: line.id});
					$.ajax({
						url: '/api/line/manager/delete',
						type: 'POST',
						dataType: 'json',
						contentType: "application/json; charset=utf-8",
						data: data,
						//TODO fix this KOSTYL
						success: function () {
							updateManagersTable();
						},
						error: function () {
							updateManagersTable();
						}
					});
				}
			}
		});
		setTimeout(function () {
			lock = false
		}, 150);
	});

	let initPartyManagerTableEditable = function (tableId) {
		let table = $('#' + tableId);

		table.editable({
			mode: 'popup',
			name: 'permission_level',
			container: 'body',
			placement: 'right',
			selector: '.permission_level',
			url: '/api/line/manager/update',
			type: 'select',
			source: sourceOfPermissionLevel,
			title: 'Select permission level',
			params: function (params) {
				params.lineId = line.id;
				return params;
			},
		});


	}
});