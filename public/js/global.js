/**
 * Created by tegos on 06.06.2017.
 */

let xeditable = {
	validators: {
		notEmpty: function (value) {
			if (value === null || value === '') {
				return 'Empty values not allowed';
			}
		}
	}
};

let dataTableHelper = {
	eventForUpdateTable: function (selector_button, tableInstance) {
		$(selector_button).click(function () {
			dataTableHelper.updateTable(tableInstance)
		});
	},
	updateTable: function (tableInstance) {
		tableInstance.clear().draw();
		setTimeout(function () {
			tableInstance.ajax.reload();
			tableInstance.columns.adjust().draw();
		}, 100);
	},
	eventForSearchInTable: function (selector_input_search, tableInstance) {
		$(selector_input_search).keyup(function () {
			tableInstance.search($(this).val()).draw();
		});
	},
};

let serialize = function (obj, prefix) {
	let str = [], p;
	for (p in obj) {
		if (obj.hasOwnProperty(p)) {
			let k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
			str.push((v !== null && typeof v === "object") ?
				serialize(v, k) :
				encodeURIComponent(k) + "=" + encodeURIComponent(v));
		}
	}
	return str.join("&");
};