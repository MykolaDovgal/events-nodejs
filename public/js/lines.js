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
		$('#form-line-country-select').on({
			change: function () {
				appendSelectItem($(this).val());
			}
		});
	});
	
	function appendSelectItem(countryName) {
		$('#form-line-city-select').html(CountryToCities[countryName].join(""));
	}



});