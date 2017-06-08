/**
 * Created by Nazarii Beseniuk on 6/7/2017.
 */

$(document).ready(function () {
    $('#button-open-upload').click(function () {
        $('#upload-picture-modal').modal('show');
    });

    let $uploadCrop;
    $uploadCrop = $('#upload-cover-picture').croppie({
        viewport: {
            width: 368,
            height: 200,
        },
        boundary: {
            width: 552,
            height: 300
        }
    });

    function readFile(input) {
		if (input.files && input.files[0]) {
			let reader = new FileReader();
			reader.onload = function (e) {
				$uploadCrop.croppie('bind', {
					url: e.target.result
				});
				$('.upload-demo').addClass('ready');
			};
			reader.readAsDataURL(input.files[0]);
		}
	}

	$('#button-upload-picture').on('click', function () {
		$uploadCrop.croppie('result', 'base64').then(function (base64) {
			$('#coverpic').attr("src", base64);
			setCoverPicture();
		});
	});

    $('#active-switch').on('switchChange.bootstrapSwitch', function (e, state) {
		let active = {name: 'active', value: state, pk: 1};
		$.ajax({
			url: '/bar/update/' + bar.id,
			type: 'POST',
			dataType: 'json',
			contentType: "application/json; charset=utf-8",
			data: JSON.stringify(active)
		});
	});


	$('#language_switch').on('switchChange.bootstrapSwitch', function (event, state) {
		if (state) {
			currentLanguage = 'Original';
		} else {
			currentLanguage = 'English';
		}
		$('.language_switch_container').toggle();
	});

	function setCoverPicture() {
		let formData = new FormData($('#form_change_picture')[0]);
		let progress_bar_j = $('#upload-picture-modal').find('.progress-bar');

		$uploadCrop.croppie('result', {
			type: 'blob',
			size: 'viewport'
		}).then(function (blob) {
			formData.append('cover_picture', blob, 'coverpic.png');
			$.ajax({
				xhr: function () {
					let xhr = new window.XMLHttpRequest();
					xhr.upload.addEventListener("progress", function (evt) {
						if (evt.lengthComputable) {
							let percentComplete = evt.loaded / evt.total;
							progress_bar_j.css({
								width: percentComplete * 100 + '%'
							});
							if (percentComplete === 1) {
								progress_bar_j.parent('.progress').addClass('hide');
							}
						}
					}, false);
					xhr.addEventListener("progress", function (evt) {
						if (evt.lengthComputable) {
							let percentComplete = evt.loaded / evt.total;
							console.log(percentComplete);
							progress_bar_j.css({
								width: percentComplete * 100 + '%'
							});
						}
					}, false);
					return xhr;
				},
				beforeSend: function () {
					progress_bar_j.parent('.progress').removeClass('hide');
					progress_bar_j.css({
						width: 0 + '%'
					});
				},
				url: '/bar/update/' + bar.id,
				type: 'POST',
				cache: false,
				contentType: false,
				processData: false,
				data: formData,
				success: function () {
					setTimeout(function () {
						$('#upload-picture-modal').modal('hide');
					}, 300);
					toastr.success('Saved!');
				},
				error: function (jqXHR, textStatus, err) {
					toastr.error('Server error!');
				}
			});
		});
	}
})
