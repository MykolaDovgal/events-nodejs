let stageCount = 2;

$(document).ready(function () {

	FormEditable.init();

	$('#party_add_stage').on('click',() => {
		generateStageTab();
	});

});

let generateStageTab = function () {

	let stageTemplate;

	$.ajax({
		url: '/api//party/music/stage/add',
		type: 'POST',
		data: {partyId: party.id},
		success: function (_id) {

			stageTemplate = $(`
					<div class="panel panel-default">
			
			            <div class="panel-heading">
			                <a id="party_stage_${stageCount}_name" class="editable editable-click editable-disabled" href="#stage_${stageCount}_body"
			                   style="margin:10px;display: inline-block" data-type="text" data-pk="${_id}"
			                   data-parent="#music_accordion_container">LOOOOOOOOOOOOOOOOOOOOOL</a>
			                <button id="enable_stage_${stageCount}_edit" class="edit_btn_flag" type="button">
			                    <i class="fa fa-pencil"></i>
			                </button>
			            </div>
			
			            <div id="stage_${stageCount}_body" class="panel-collapse in">
			                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium alias, harum impedit obcaecati perspiciatis quas quisquam voluptatum! Alias, aliquid asperiores commodi delectus, in ipsum, magnam molestiae nesciunt praesentium ullam ut?
			                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium alias, harum impedit obcaecati perspiciatis quas quisquam voluptatum! Alias, aliquid asperiores commodi delectus, in ipsum, magnam molestiae nesciunt praesentium ullam ut?
			                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium alias, harum impedit obcaecati perspiciatis quas quisquam voluptatum! Alias, aliquid asperiores commodi delectus, in ipsum, magnam molestiae nesciunt praesentium ullam ut?
			                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium alias, harum impedit obcaecati perspiciatis quas quisquam voluptatum! Alias, aliquid asperiores commodi delectus, in ipsum, magnam molestiae nesciunt praesentium ullam ut?
			                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium alias, harum impedit obcaecati perspiciatis quas quisquam voluptatum! Alias, aliquid asperiores commodi delectus, in ipsum, magnam molestiae nesciunt praesentium ullam ut?
			                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium alias, harum impedit obcaecati perspiciatis quas quisquam voluptatum! Alias, aliquid asperiores commodi delectus, in ipsum, magnam molestiae nesciunt praesentium ullam ut?
			
			            </div>
			
			        </div>
			`);

			$('#music_accordion_container').append(stageTemplate);

			$('#party_stage_' + stageCount+ '_name').editable({
				type: 'text',
				name: 'stageTab',
				title: 'Enter title',
				// success: function(data) {
				// 	$('#english_title').text(data);
				// }
			});

			$('body').on('click','.edit_btn_flag',function () {
				let stageName = $(this).find('a.editable');
				stageName.editable('toggleDisabled');
				let isCollapse = stageName.attr('data-toggle') == 'collapse' ? '' : 'collapse';
				stageName.attr('data-toggle', isCollapse);
			});
			stageCount+=1;
		},
		error: function (jqXHR, textStatus, err) {
		}
	}).then(function () {
	});


};

let FormEditable = function () {

	let initEditables = function () {

		//global settings
		$.fn.editable.defaults.inputclass = 'form-control';
		$.fn.editable.defaults.url = '/api/party/music/update';
		$.fn.editable.defaults.mode = 'inline';


		$('#party_stage_1_name').editable({
			type: 'text',
			name: 'stageTab',
			title: 'Enter title',
			// success: function(data) {
			// 	$('#english_title').text(data);
			// }
		});

	};

	return {
		//main function to initiate the module
		init: function () {
			// init editable elements

			initEditables();

			// init editable toggler
			$('#enable_stage_1_edit').click(function () {
				let stageName = $('#party_stage_1_name');
				stageName.editable('toggleDisabled');
				let isCollapse = stageName.attr('data-toggle') == 'collapse' ? '' : 'collapse';
				stageName.attr('data-toggle', isCollapse);
			});

		}
	};
}();