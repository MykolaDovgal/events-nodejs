/**
 * Created by tegos on 09.05.2017.
 */
let SelectedParty = {};
$(document).ready(function () {
	let event_parties_table;

	$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
		let target = $(e.target).attr("href");
		if ((target === '#parties_container')) {
			initTableParties();
		}
	});

	$('#submit_set_event_party').on('click',function () {
		sendUpdateEventAjax();
	});



	function initTableParties() {
		if (!$.fn.DataTable.isDataTable('#event_parties')) {

			event_parties_table = $('#event_parties').DataTable({

				"ajax": "/api/event/" + event.id + "/parties",
				"columns": [
					{
						data: 'id',
						width: '10%'
					},
					{
						data: 'lineId',
						width: '10%'
					},
					{
						data: 'club',
						width: '20%'
					},
					{
						data: 'date',
						width: '10%'
					},
					{
						data: 'open_time',
						width: '15%'
					},
					{
						data: 'attendees_count',
						width: '15%'
					},
					{
						data: 'video_stream_avbl',
						render: function (data, type, full, meta) {
							return `<div class="text-center"><input disabled type="checkbox" ${data === true ? 'checked' : ''} ></div>`;
						},
						width: '10%'
					},
					{
						data: 'tkts_avbl_here',
						render: function (data, type, full, meta) {
							return `<div class="text-center"><input disabled type="checkbox" ${data === true ? 'checked' : ''} ></div>`;
						},
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
				responsive: false,


				"dom": "<'row' <'col-md-12'  t >  <'col-md-12'i> >",
			});





			$('#event_parties tbody').on('click', "tr :not(a,i)", function (e) {
				let check = true;
				let tag = e.target.nodeName;
				let _t = this;
				if (tag === 'A' || tag === 'I') {
					check = false;
				}

				if (tag !== 'TD') {
					_t = $(this).parent('tr').get(0);
				}

				console.log(tag);
				let partyRow = event_parties_table.row(_t).data();
				console.log(partyRow);
				if (check) {
					window.open('/party/' + partyRow.id, '_blank');
					//window.location = '/party/' + partyRow.party_id;
				}
			});

		} else {
			updateTable();
		}


	}

	function updateTable() {
		event_parties_table.clear().draw();
		setTimeout(function () {
			event_parties_table.ajax.reload();
			event_parties_table.columns.adjust().draw();
		}, 1000);
	}


	//user dataset for search
	let parties = new Bloodhound({
		datumTokenizer: function (datum) {
			let emailTokens = Bloodhound.tokenizers.whitespace(datum.id);
			let titleOlTokens = Bloodhound.tokenizers.whitespace(datum.title_ol);
			let titleEngTokens = Bloodhound.tokenizers.whitespace(datum.title_eng);
			let dateTokens = Bloodhound.tokenizers.whitespace(datum.date);

			return emailTokens.concat(titleOlTokens).concat(titleEngTokens).concat(dateTokens);
		},
		queryTokenizer: Bloodhound.tokenizers.whitespace,
		prefetch: {
			url: '/api/parties/typeahead',
			cache: false,
			transform: function (response) {
				return $.map(response, function (item) {
					return {
						id: item.id,
						title_ol: item.title_ol,
						title_eng: item.title_eng,
						date: item.date,
						picture: item.picture
					};
				});
			}
		}
	});

	//display searched result
	$('#event_party_search').typeahead({
			hint: true,
			highlight: true,
			minLength: 1
		},
		{
			name: 'parties_dataset',
			display: 'title_eng',
			source: parties,
			templates: {
				suggestion: function (item) {
					return `<div class="col-md-12"> 
							<div class="col-md-4" style="float:left;"><img style="width:50px;height:50px;border-radius: 50%;" src=" ${item.picture} "/></div> 
							<div> ID: ${item.id} <strong> ${item.title_eng} </strong></div> 
						</div>`
				}
			}
		}).bind('typeahead:select', (ev, suggestion) => SelectedParty = suggestion);

	let sendUpdateEventAjax = function () {
		$.ajax({
			url: '/party/update/' + SelectedParty.id,
			type: 'POST',
			data: {name: 'eventId', value: +event.id},
			success: function (data) {
				updateTable();
			},
		});
	};

});


