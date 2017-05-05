

$(document).ready(function () {

	jQuery(document).ready(function() {
		FormEditable.init();
	});
	let loc = window.location.pathname.split('/');
	let id = loc[loc.length-1];

	let genres = [];
	let genresCounter = 1;

	$.getJSON( '/data/genres.json', function( data ) {
		$.each( data, function( key, val ) {
			genres.push('<option value="'+ val +'">'+ val +'</option>');
		});
		$('select[name="genres0"]').html(genres.join(""));
	});

	$(document).on('change', 'select[name^="genres"]', function() {
		updateGenres();
	});


	$('#add_genres_btn').on({
		click: function () {
			if(genresCounter <5){
				let selectItem = $('<select></select>').addClass('form-control').attr('name','genres'+ genresCounter);
				selectItem.html(genres.join(""));
				$('#select_container').append(selectItem);
				genresCounter+=1;
			}
		}
	});
	function updateGenres() {
		let genresArray = [];
		let selectItems = $('#select_container > select');

		selectItems.each( function () {
			genresArray.push($(this).val());
		});

		$.ajax({
			url: '/line/update/'+ id,
			type: 'POST',
			data: {name : 'music.music_genres',  value :  genresArray },
			success: function (data) {
			},
			error: function (jqXHR, textStatus, err) {
			}
		}).then(function() {
		});
	}




	var $uploadCrop;
	$uploadCrop = $('#change-demo').croppie({
		viewport: {
			width: 368,
			height: 200,
		},
		boundary: {
			width: 368,
			height: 200
		}
	});
	$('#upload-profile-pic').on('change', function () {
		readFile(this);
	});
	function readFile(input) {
		if (input.files && input.files[0]) {
			var reader = new FileReader();
			reader.onload = function (e) {
				$uploadCrop.croppie('bind', {
					url: e.target.result
				});
				$('.upload-demo').addClass('ready');
			};
			reader.readAsDataURL(input.files[0]);
		}
	}



	//inline edit
	let FormEditable = function() {
		let initEditables = function() {


			//global settings
			$.fn.editable.defaults.inputclass = 'form-control';
			$.fn.editable.defaults.url = '/line/update';
			$.fn.editable.defaults.mode = 'inline';

			//editables element samples


			$('#line_name_eng').editable({
				url: '/line/update/' + id,
				type: 'text',
				pk: 1,
				name: 'line_name_eng',
				title: 'Enter title'
			});
			$('#line_name_ol').editable({
				url: '/line/update/' + id,
				type: 'text',
				pk: 1,
				name: 'line_name_ol',
				title: 'Enter title'
			});
			$('#line_facebook_page').editable({
				url: '/line/update/' + id,
				type: 'text',
				pk: 1,
				name: 'facebook_page',
				title: 'Enter link on facebook page'
			});
			$('#line_website').editable({
				url: '/line/update/' + id,
				type: 'text',
				pk: 1,
				name: 'website',
				title: 'Enter link on website'
			});
			$('#line_country').editable({
				url: '/line/update/' + id,
				type: 'text',
				pk: 1,
				name: 'country',
				title: 'Enter country'
			});
			$('#line_city').editable({
				url: '/line/update/' + id,
				type: 'text',
				pk: 1,
				name: 'city',
				title: 'Enter city'
			});
			$('#description_eng').editable({
				url: '/line/update/' + id,
				type: 'text',
				pk: 1,
				name: 'description_eng',
				title: 'Enter description'
			});



		};
		return {
			//main function to initiate the module
			init: function() {
				// init editable elements


				initEditables();

				// init editable toggler
				$('#enable').click(function() {
					$('#user .editable').editable('toggleDisabled');
				});

				// handle editable elements on hidden event fired
				$('#user .editable').on('hidden', function(e, reason) {
					if (reason === 'save' || reason === 'nochange') {
						var $next = $(this).closest('tr').next().find('.editable');
						if ($('#autoopen').is(':checked')) {
							setTimeout(function() {
								$next.editable('show');
							}, 300);
						} else {
							$next.focus();
						}
					}
				});


			}

		};
	}();


});