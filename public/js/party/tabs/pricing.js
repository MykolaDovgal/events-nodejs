let parties_tables;

$(document).ready(function () {

	parties_tables = $('#party_pricing').DataTable({

		"ajax": "/api/party/prices/" + party.id,
		"columns": [

			{
				data: 'delete_button',
				render: function (data, type, full, meta) {
					return '<div class="text-center remove-column"><a class="btn-circle"><i class="fa fa-remove"></i></a></div>';
				},
				width: '5%'
			},
			{
				data: 'start_date',
				render: function (data, type, full, meta) {
					return `
										<div id="party_start_date_input" class="input-group date row_datetime">
											<input value="${data != undefined ? data : ''}" name="start_date" class="form-control" type="text" style="width: 100%"
												   data-date-format="yyyy/mm/dd hh:ii">
											<span class="input-group-addon"><i class="fa fa-times"></i></span>
											<span class="input-group-addon"><i class="fa fa-calendar"></i></span>
										</div>
				`;
				},
				width: '25%'
			},
			{
				data: 'end_date',
				render: function (data, type, full, meta) {
					return `
										<div id="party_start_date_input" class="input-group date row_datetime">
											<input value="${data != undefined ? data : ''}" name="end_date" class="form-control" type="text" style="width: 100%"
												   data-date-format="yyyy/mm/dd hh:ii">
											<span class="input-group-addon"><i class="fa fa-times"></i></span>
											<span class="input-group-addon"><i class="fa fa-calendar"></i></span>
										</div>
				`;
				},
				width: '25%'
			},
			{
				data: 'price',
				render: function (data, type, full, meta) {
					return `
							<input value="${data != undefined ? data : ''}" id="tkts_price" name="price" class="form-control" type="text" style="width: 100%">
				`;
				},
				width: '20%'
			},
			{
				data: 'currency',
				render: function (data, type, full, meta) {
					return `
						<span class="multiselect-native-select">
                             <select class="mt-multiselect btn btn-default mt-noicon" data-width="100%">
                                  		 <option value="USD">USD</option>      
                                         <option value="EUR">EUR</option>     
                                         <option value="UAH">UAH</option>     
                                         <option value="PLN">PLN</option>     
                                         <option value="PLN">PLN</option>   
                             </select>
                        </span>
				`;
				},
				width: '25%'
			}
		],
		"columnDefs": [
			{
				"targets": 'no-sort',
				"orderable": false
			}
		],
		autoWidth: false,
		scrollY: 400,
		scroller: true,
		responsive: true,

		"dom": "<'row' <'col-md-12'> > t <'row'<'col-md-12'>>",
	});

	$('body').on('mousedown',".row_datetime", function(){
		$(this).datetimepicker({
			format: 'yyyy-mm-dd hh:ii',
			autoclose: true,
			useCurrent: false,
			setDate: Date.now()
		});
	});

	$('#party_add_price').click( () => {
		parties_tables.row.add([
		'','',''
		]).draw();
	});
});