var global = {};

$(document).ready(function () {
	var CountryToCities = [];
	var form = $('#form_add_user');

	$.getJSON( '../data/countriesToCities.json', function( data ) {
		var selectCountry = [];
		$.each( data, function( key, val ) {
			var selectItem = [];
			selectCountry.push('<option value="'+ key +'">'+ key +'</option>');
				$.each(val,function (_key,_val) {
					selectItem.push('<option value="'+ _val +'">'+ _val +'</option>');
				});
			CountryToCities[key] = selectItem;
		});

		$('#form-line-country-select').html(selectCountry.join(""));

	});

	$('#form-line-country-select').on({
		change: function () {
			appendSelectItem($(this).val());
		}
	});

	function appendSelectItem(countryName) {
		$('#form-line-city-select').html(CountryToCities[countryName].join(""));
	}




	// lines scroll

	var $gallery = $('#lines-gallery');

	$gallery.justifiedGallery({
		rowHeight: 300,
		margins: 5
	});

	//$gallery.justifiedGallery('norewind');

	function addNewLines(page) {

		if (page === undefined || page < 1) {
			page = 1;
			global.page = page;
		} else {
			page = global.page;
		}

		$.ajax({
			url: '/api/lines/' + page + '/',
			type: 'POST',
			data: {},
			success: function (data) {
				var lines = data.data;

				if ($.isArray(lines) && lines.length) {
					lines.forEach(function (line) {
						$gallery.append(
							generateLine(line)
						);
					});

					$gallery.justifiedGallery('norewind');
					global.page++;
				}


			},
			error: function (jqXHR, textStatus, err) {
				//location.reload();
			}
		});


	}

	setTimeout(function () {
		addNewLines(0);
	}, 1000);

	function generateLine(line) {
		let html = `<div class="mt-element-overlay">
                    
                            <div class="mt-overlay-5"><img src="` + line.cover_picture + `"/>
                                <div class="mt-overlay">
                                    <h2>` + line.line_name_eng + `</h2>
                                    <p>
                                        <a class="uppercase" href="` + line.website + `">Learn More</a>
                                    </p>
                                </div>
                            
                    </div>
                </div>`;
		return html;
	}

	$(window).scroll(function () {
		if ($(window).scrollTop() + $(window).height() == $(document).height()) {
			addNewLines(2);
		}
	});

});