let stageCount = 0;

$(document).ready(function () {

	FormEditable.init();

	$('#party_add_stage').on('click',() => {
		generateStageTab();
	});

	$('body').on('click','.edit_btn_flag',function () {
		let stageName = $(this).parent('.panel-heading').find('a.editable');
		stageName.editable('toggleDisabled');
		let isCollapse = stageName.attr('data-toggle') == 'collapse' ? '' : 'collapse';
		stageName.attr('data-toggle', isCollapse);
	});
});

let generateStageTab = function () {

	$.ajax({
		url: '/api//party/music/stage/add',
		type: 'POST',
		data: {partyId: party.id},
		success: function (_id) {

			let stageTemplate = getTabTemplate(stageCount,_id);
			$('#music_accordion_container').append(stageTemplate);
			setEditable(stageCount);
			stageCount+=1;

		}
	});


};

let setEditable = function (counter) {

	$('#party_stage_' + counter+ '_name').editable({
		type: 'text',
		name: 'stageTab',
		title: 'Enter title',
	});
};

let getTabTemplate = function (counter,_id) {

	return $(`
					<div class="panel panel-default">			
			            <div class="panel-heading">
			                <a id="party_stage_${counter}_name" class="editable editable-click editable-disabled" href="#stage_${counter}_body"
			                   style="margin:10px;display: inline-block" data-type="text" data-pk="${_id}"
			                   data-parent="#music_accordion_container">LOOOOOOOOOOOOOOOOOOOOOL</a>
			                <button id="enable_stage_${counter}_edit" class="edit_btn_flag" type="button">
			                    <i class="fa fa-pencil"></i>
			                </button>
			            </div>
			            <div id="stage_${counter}_body" class="panel-collapse in">
			                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium alias, harum impedit obcaecati perspiciatis quas quisquam voluptatum! Alias, aliquid asperiores commodi delectus, in ipsum, magnam molestiae nesciunt praesentium ullam ut?
			                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium alias, harum impedit obcaecati perspiciatis quas quisquam voluptatum! Alias, aliquid asperiores commodi delectus, in ipsum, magnam molestiae nesciunt praesentium ullam ut?
			                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium alias, harum impedit obcaecati perspiciatis quas quisquam voluptatum! Alias, aliquid asperiores commodi delectus, in ipsum, magnam molestiae nesciunt praesentium ullam ut?
			                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium alias, harum impedit obcaecati perspiciatis quas quisquam voluptatum! Alias, aliquid asperiores commodi delectus, in ipsum, magnam molestiae nesciunt praesentium ullam ut?
			                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium alias, harum impedit obcaecati perspiciatis quas quisquam voluptatum! Alias, aliquid asperiores commodi delectus, in ipsum, magnam molestiae nesciunt praesentium ullam ut?
			                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium alias, harum impedit obcaecati perspiciatis quas quisquam voluptatum! Alias, aliquid asperiores commodi delectus, in ipsum, magnam molestiae nesciunt praesentium ullam ut?
			
			            </div>			
			        </div>
			`);
};

let FormEditable = function () {

	return {
		init: function () {
			$.fn.editable.defaults.inputclass = 'form-control';
			$.fn.editable.defaults.url = '/api/party/music/update';
			$.fn.editable.defaults.mode = 'inline';
		}
	};
}();