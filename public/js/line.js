$(document).ready(function () {


    jQuery(document).ready(function () {
        FormEditable.init();
    });


	let loc = window.location.pathname.split('/');
	let id = loc[loc.length-1];
	let genres = [];
	let genresCounter = 0;
	let selectedResult = {};


    //genres setup
    $.getJSON('/data/genres.json', function (data,) {
        let selectItems = $('select[name="genres"]');

        data.forEach((item, i, arr) => {
            genres.push('<option value="' + item + '">' + item + '</option>');
        });


        //if user select genres previously
        if (selectItems.length > 0) {
            selectItems.each(function (key, value) {
                let tmpGenres = [];
                data.forEach(function (dataItem, i, arr) {
                    let optionItem = $('<option value="' + dataItem + '">' + dataItem + '</option>');
                    if ($(value).data('value') == dataItem) {
                        optionItem.attr('selected', true);
                    }
                    tmpGenres.push(optionItem);
                });
                $(value).html(tmpGenres);
                genresCounter += 1;
            });
        }
        else {
            generateDefaultSelect();
        }
    });


    $(document).on('change', 'select[name="genres"]', function () {
        updateGenres();
    });

    $('#add_genres_btn').on({
        click: function () {
            if (genresCounter < 5) {
                generateDefaultSelect();
            }
        }
    });

    function generateDefaultSelect() {
        let selectItem = $('<select></select>').addClass('form-control').attr('name', 'genres');
        selectItem.html(genres.join(""));
        $('#select_container').append(selectItem);
        genresCounter += 1;
    }

    function updateGenres() {
        let genresArray = [];
        let selectItems = $('#select_container > select');

        selectItems.each(function () {
            genresArray.push($(this).val());
        });

        $.ajax({
            url: '/line/update/' + id,
            type: 'POST',
            data: {name: 'music.music_genres', value: genresArray},
            success: function (data) {
            },
            error: function (jqXHR, textStatus, err) {
            }
        }).then(function () {
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
    let FormEditable = function () {
        let initEditables = function () {


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
            init: function () {
                // init editable elements


                initEditables();

                // init editable toggler
                $('#enable').click(function () {
                    $('#user .editable').editable('toggleDisabled');
                });

                // handle editable elements on hidden event fired
                $('#user .editable').on('hidden', function (e, reason) {
                    if (reason === 'save' || reason === 'nochange') {
                        var $next = $(this).closest('tr').next().find('.editable');
                        if ($('#autoopen').is(':checked')) {
                            setTimeout(function () {
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


    //notification ajax
    $('#button_send_notification').on({

        click: function () {

            let data = $('#notification_form').serialize();

            $.ajax({
                url: '/notification/add' + '/?' + data.toString(),
                type: 'POST',
                data: {},
                success: function (data) {
                    toastr.options.showMethod = 'slideDown';
                    toastr.success('Notification successfully sent!')
                },
                error: function (jqXHR, textStatus, err) {
                }
            }).then(function () {
            });
        }

    })

    $('#upload_button').click(function () {
        $('#cover_picture_upload').focus().trigger('click');
    });

    $('#cover_picture_upload').change(function () {
        if (this.files && this.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#cover_picture')
                    .attr('src', e.target.result).width('100%');
            };
            reader.readAsDataURL(this.files[0]);

            var formData = new FormData();
            formData.append('cover_picture', this.files[0], 'cover_picture.png');

            console.log(formData);

            $.ajax({
                url: '/line/update/' + id,
                type: 'POST',
                cache: false,
                contentType: false,
                processData: false,
                data: formData,
                success: function (data) {
                    toastr.success('Saved!');
                },
                error: function (jqXHR, textStatus, err) {
                    console.error(err);
                    toastr.error('Server error!');
                }
            });
        }
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
					return '<div>' + item.id + '    <strong>' + item.name + '</strong> -'  + '</div>';
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
			},
			error: function (jqXHR, textStatus, err) {
			}
		}).then(function () {
		});
		selectedResult = {};
		$('#user_search').val('');

	});




});