$(document).ready(function () {
	var genres = [];
	let genresCounter = 1;

	$.getJSON( '../data/genres.json', function( data ) {
		$.each( data, function( key, val ) {
			genres.push('<option value="'+ val +'">'+ val +'</option>');
		});
		$('#select_container > select').html(genres.join(""));
	});

	$('#add_genres_btn').on({
		click: function () {
			if(genresCounter <5){
				let selectItem = $('<select></select>').addClass('form-control').attr('name','genres'+genresCounter);
				$(selectItem).html(genres.join(""));
				$('#select_container').append(selectItem);
				genresCounter+=1;
			}
		}
	});



	var $uploadCrop;

	$uploadCrop = $('#change-demo').croppie({
		viewport: {
			width: 415,
			height: 240,
		},
		boundary: {
			width: 415,
			height: 240
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

	var form1 = $('#form_change_line');
	// submit handler
	form1.submit(function (e) {
		e.preventDefault();


		var formData1 = new FormData(form1[0]);

		console.log(form1);

		//set hidden cropped image
		$uploadCrop.croppie('result', {
			//type: 'canvas',
			type: 'blob',
			size: 'viewport',
			circle: false
		}).then(function (resp) {
			let x = $('lineChangeCity').val();
			let y = $('lineChangeCountry').val();
			formData1.append('userpic', resp, 'linepicture.png');
			formData1.append('city',x);
			formData1.append('country',y);

			console.log(formData1);

				$.ajax({
					url: '/line/update/',
					type: 'POST',
					cache: false,
					contentType: false,
					processData: false,
					data: formData1,

					success: function (data) {

					},
					error: function (jqXHR, textStatus, err) {

					}
				});
		});
		//return false;
	});







});