let stageCount = 0;
let usersSet;
let isMusicInit = false;
let selectedResults;

$(document).ready(function () {

	usersSet = initUsersDataSet();



	$('#music_tab_btn').on('click',function () {
		if(!isMusicInit){
			initStages();
			isMusicInit = true;
		}
	});


	$('#party_add_stage').on('click',() => {
		generateStageTab();
	});

	$('body').on('click','.edit_stage_btn_flag',function () {
		let stageName = $(this).parent('.panel-heading').find('a.editable');
		stageName.editable('toggleDisabled');
		let isCollapse = stageName.attr('data-toggle') == 'collapse' ? '' : 'collapse';
		stageName.attr('data-toggle', isCollapse);
	}).on('click','.delete_stage_btn_flag',function () {
		deleteStage.apply(this);
	}).on('click','.add_dj_btn_flag',function () {
		addDjs.apply(this);
	}).on('click','.init_table_flag',function () {
		// window.setTimeout(function () {
		// 	setStageTable($(this).attr('id'),$(this).data('pk'))
		// },3000)
	});




});

let generateStageTab = function () {

	$.ajax({
		url: '/api//party/music/stage/add',
		type: 'POST',
		data: {partyId: party.id},
		success: function (item) {
			let stageTemplate = getStageTabTemplate(stageCount,item);
			$('#music_accordion_container').append(stageTemplate);
			setStageNameEditable(stageCount);
			setStageTable('party_stage_'+ stageCount +'_djs',item._id);
			setTypeahead('party_stage_'+ stageCount +'_djs_search');
			stageCount+=1;

		}
	});


};

let setStageNameEditable = function (counter) {

	$('#party_stage_' + counter+ '_name').editable({
		url: '/api/party/music/stage/update',
		type: 'text',
		title: 'Enter title',
	});
};

let setStageTable = function (stage_table_id,_id) {

	$('#' + stage_table_id).DataTable({

		"ajax": "/api/party/music/stage/"+ _id +"/djs",

		"columns": [
			{
				data: 'delete_button',
				render: function (data, type, full, meta) {
					console.log(full);
					return '<div class="text-center remove-column"><a class="btn-circle"><i class="fa fa-remove"></i></a></div>';
				},
				width: '5%'
			},
			{
				data: 'profile_picture_circle',
				render: function (data, type, full, meta) {
					return '<div class="text-center"><img class="profile-picture" src="' + data + '"/></div>';
				},
				width: '20%'
			},
			{
				"data": 'id',
				width: '20%'
			},
			{
				"data": 'username',
				width: '20%'
			},
			{
				"data": 'name',
				width: '20%'
			},

			{
				"data": 'soundcloud',
				render: function (data, type, full, meta) {
					return '<div class="text-center"><a href="#">${data}</a></div>';
				},
				width: '15%'
			}
		],
		"columnDefs": [
			{
				"targets": 'no-sort',
				"orderable": false
			}
		],
		scrollY: 200,
		scroller: true,
		responsive: false,
		"dom": "<'row' <'col-md-12'> > t <'row'<'col-md-12'>>",
	});

};

let getStageTabTemplate = function (counter,tabItem) {

	return $(`
					<div id="${tabItem._id}" class="panel panel-default tab_flag">

					    <div class="panel-heading">
					        <a id="party_stage_${counter}_name" class="editable editable-click init_table_flag" data-name="stage_name"
					           href="#stage_${counter}_body" 
					           style="margin:10px;display: inline-block" data-type="text" data-pk="${tabItem._id}" data-counter="${counter}"
					           data-parent="#music_accordion_container">${tabItem.stage_name}</a>
					           
					        <button id="enable_stage_${counter}_edit" class="edit_stage_btn_flag" type="button">
					            <i class="fa fa-pencil"></i>
					        </button>
					        
					        <button id="enable_stage_${counter}_delete" data-id="${tabItem._id}" class="delete_stage_btn_flag" type="button">
					            <i class="fa fa-trash-o"></i>
					        </button>
					        
					    </div>
					
					    <div id="stage_${counter}_body" class="panel-collapse collapse">
					
					        <div class="accordion-content">
					
					            <div class="row">
					
					                <div class="col-md-6">
					
					                    <div class="border-line block-manager">
					                        <div class="portlet-title">
					                            <div class="title-block caption font-red">
					                                <i class="fa fa-user" aria-hidden="true"></i>
					                                <span class="caption-subject bold">DJs</span>
					                            </div>
					                        </div>
					
					                        <div class="portlet-body table-both-scroll">
					                            <table class="table table-striped table-bordered table-hover order-column"
					                                   id="party_stage_${counter}_djs">
					                                <thead>
					                                <th class="no-sort"></th>
					                                <th>Pic</th>
					                                <th>User ID</th>
					                                <th>User Name</th>
					                                <th>Name</th>
					                                <th>Soundcloud</th>
					                                </thead>
					                            </table>
					
					                            <div class="input-add">
					                                <div class="input-group">
														<span class="input-group-addon">
															<i class="fa fa-search" aria-hidden="true"></i>
														</span>
							                                    <input type="text" id="party_stage_${counter}_djs_search" placeholder="DJs name"
							                                           name="djs_search" class="form-control"/>
							                                           
							                            <span class="input-group-addon btn-manager_user">
															<button id="party_stage_${counter}_djs_add"
                                                                    type="button"
                                                                    class="btn btn-icon-only green pull-right add_dj_btn_flag">
																<i class="fa fa-plus"></i>
															</button>
														</span>
					                                </div>
					                                <div class="col-md-2">
					
					                                </div>
					                            </div>
					
					                        </div>
					                    </div>
					
					                </div>
					
					            </div>
					
					        </div>
					
					    </div>

					</div>
			`);
};

let initStages = function () {

	$.ajax({
		url: '/api/party/'+ party.id + '/music/stages',
		type: 'GET',
		success: function (data) {
			data.forEach((item) => {

				let stageTemplate = getStageTabTemplate(stageCount,item);
				$('#music_accordion_container').append(stageTemplate);
				setStageNameEditable(stageCount);
				setTypeahead('party_stage_'+ stageCount +'_djs_search');
				setStageTable('party_stage_'+ stageCount +'_djs',item._id);
				stageCount+=1;

			});
		}
	});

};

let deleteStage = function () {
	let stageItemId = $(this).data('id');
	$.ajax({
		url: '/api/party/music/stage/delete',
		type: 'POST',
		data: {_id: stageItemId},
		success: function (data) {
			$('#' + stageItemId).remove();
		},
	});

};

let initUsersDataSet = function () {

	//user dataset for search
	return new Bloodhound({
		datumTokenizer : function(datum) {
			let idTokens = Bloodhound.tokenizers.whitespace(datum.id);
			let lastNameTokens = Bloodhound.tokenizers.whitespace(datum.name);
			let firstNameTokens = Bloodhound.tokenizers.whitespace(datum.username);

			return idTokens.concat(lastNameTokens).concat(firstNameTokens);
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
};

let setTypeahead = function (inputId) {

	$('#' + inputId).typeahead({
			hint: true,
			highlight: true,
			minLength: 1
		},
		{
			display: 'name',
			source: usersSet,
			templates: {
				suggestion: function (item) {
					return  '<div class="col-md-12">' +
						'<div class="col-md-4" style="float:left;"><img style="width:50px;height:50px;border-radius: 50%;" src="' + item.picture + '"/></div>' +
						'<div> ID:(' + item.id + ') <strong>' + item.name + '</strong>'  + '</div>' +
						'</div>';
				}
			}
		}).bind('typeahead:select', (ev, suggestion) => selectedResults = suggestion);
};

let addDjs = function () {

	let parent = $(this).parents('.tab_flag');
	selectedResults.stageId = parent.attr('id');
	let table = parent.find('table')[1];

	$.ajax({
		url: '/api/party/music/stage/djs/add',
		type: 'POST',
		data: selectedResults ,
		success: function (data) {
			updateTable($(table).attr('id'));
		},
		error: function (jqXHR, textStatus, err) {
		}
	}).then(function () {
	});
	selectedResults = {};

};

let updateTable = function(tableId) {
	let table = $('#'+ tableId).DataTable();
	table.clear().draw();
	setTimeout(function () {
		table.ajax.reload();
		table.columns.adjust().draw();
	}, 1000);
};

