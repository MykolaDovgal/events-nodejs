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