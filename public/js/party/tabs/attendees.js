let attendees_table;
let isAttendeesInit = false;


$(document).ready(function () {

	$('#attendees_tab_btn').on('click',function () {
		if(!isAttendeesInit){
			initAttendeesTable();
			isAttendeesInit = true;
		}
	});

});



let initAttendeesTable = function () {

	attendees_table = $('#party_attendees').DataTable({
		"ajax": '/api/party/'+ party.id +'/attendees',
		"columns": [
			{
				'data': 'user_picture',
				width: '10%'
			},
			{
				'data': 'userId',
				width: '10%'
			},
			{
				'data': 'user_name',
				width: '10%'
			},
			{
				'data': 'attend_mark_time',
				width: '10%'
			},
			{
				'data': 'ticket_purchase',
				width: '10%'
			},
			{
				'data': 'ticket_checkin',
				width: '10%'
			},
			{
				'data': 'checkin_time',
				width: '10%'
			},
			{
				'data': 'location_ver',
				width: '10%'
			},
			{
				'data': 'location_ver_time',
				width: '10%'
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
		scroller: true,


		"dom": "<'row' <'col-md-12'> > t <'row'<'col-md-12'>>",
	});
};