/**
 * Created by tegos on 08.05.2017.
 */

$(document).ready(function () {

    var line_managers_table = $('#table-line-managers').DataTable({
        "ajax": "/api/line/managers/" + line.id,
        "columns": [
            {
                "data": 'id',
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
                width: '50%'
            },
            {
                "data": 'permission_level',
                width: '20%'
            }
        ],
        scrollY: 200,
        scroller: true,
        responsive: false,
        "dom": "<'row' <'col-md-12'> > t <'row'<'col-md-12'>>",
    });


	//user dataset for search
	let users = new Bloodhound({
		datumTokenizer : function(datum) {
			let emailTokens = Bloodhound.tokenizers.whitespace(datum.id);
			let lastNameTokens = Bloodhound.tokenizers.whitespace(datum.name);
			let firstNameTokens = Bloodhound.tokenizers.whitespace(datum.username);

			return emailTokens.concat(lastNameTokens).concat(firstNameTokens);
		},
		queryTokenizer: Bloodhound.tokenizers.whitespace,
		prefetch: {
			url: '/api/users/usersname',
			cache: false ,
			transform: function(response) {
				return $.map(response, function(item) {
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
					return  '<div class="col-md-12">' +
								'<div class="col-md-4" style="float:left;"><img style="width:50px;height:50px;" src="' + item.picture + '"/></div>' +
								'<div> ID:(' + item.id + ') <strong>' + item.name + '</strong>'  + '</div>' +
							'</div>';
				}
			}
		}).bind('typeahead:select', (ev, suggestion) => selectedResult = suggestion);


	$('#add_manager_user').click(() => {
		selectedResult.lineId = line.id;
		let data = JSON.stringify(selectedResult);
		$.ajax({
			url: '/api/line/manager/add',
			type: 'POST',
			data: selectedResult ,
			success: function (data) {
				updateManagersTable();
			},
			error: function (jqXHR, textStatus, err) {
			}
		}).then(function () {
		});
		selectedResult = {};
		$('#user_search').val('');

	});

	function updateManagersTable() {
		line_managers_table.clear().draw();
		setTimeout(function () {
			line_managers_table.ajax.reload();
			line_managers_table.columns.adjust().draw();
		}, 1000);
	}

    $('#table-line-managers tbody').on('click', 'tr', function () {
        let self = this;
        bootbox.confirm({
	        size: "small",
	        message: "Are you sure you want to remove this user from managers?",
	        callback: function(result) {
		        console.log(line);
		        if (result) {
			        let data = JSON.stringify({ userId: line_managers_table.row(self).data().id, lineId: line.id });
			        $.ajax({
				        url: '/api/line/manager/delete',
				        type: 'POST',
				        dataType: 'json',
				        contentType: "application/json; charset=utf-8",
				        data: data,
				        //TODO fix this KOSTYL
				        success: function() {
					        updateManagersTable();
				        },
				        error: function() {
					        updateManagersTable();
				        }
			        });
		        }
	        }
        })     
    });
});