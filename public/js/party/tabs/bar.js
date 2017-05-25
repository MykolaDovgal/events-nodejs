let barCount = 0;
isBarInit = false

$(document).ready(() => {
    $('#bar_tab_btn').on('click', () => {
		if(!isBarInit){
			initBars();
			isBarInit = true;
		}
	});

    $('#party_add_bar').on('click',() => {
		generateBarTab();
	});

    $('body').on('click', '.edit_bar_btn_flag', function () {
		let barName = $(this).parent('.panel-heading').find('a.editable');
		barName.editable('toggleDisabled');
		let isCollapse = barName.attr('data-toggle') == 'collapse' ? '' : 'collapse';
		barName.attr('data-toggle', isCollapse);
	}).on('click', '.delete_bar_btn_flag', function () {
		deleteBar.apply(this);
	});

    let generateBarTab = () => {
        $.ajax({
            url: '/api/party/bar/add',
            type: 'POST',
            data: {partyId: party.id},
            success: (_id) => {
                let barTemplate = getBarTabTemplate(barCount, {bar_name_eng: 'Bar ' + barCount, _id: _id});
                $('#bar_accordion_container').append(barTemplate);
                setBarEditable(barCount);
                barCount+=1;
            }
		});
	};

    let setBarEditable = counter => {
        $('#bar_' + counter + '_name').editable({
            url: '/api/party/bar/update',
            type: 'text',
            title: 'Enter title',
        });
    };

    let initBars = () => {
        $.ajax({
            url: '/api/party/'+ party.id + '/bars',
            type: 'GET',
            success: (data) => {
                let accordion = $('#bar_accordion_container');
                accordion.empty();
                barCount=0;
                data.forEach((item) => {
                    let barTemplate = getBarTabTemplate(barCount,item);
                    accordion.append(barTemplate);
                    setBarEditable(barCount);
                    barCount+=1;
                });
            }
        });
    };

    function deleteBar() {
        console.log(this);
        let barId = $(this).data('id');
        console.log(barId);
        bootbox.confirm({
            size: "small",
            message: "Are you sure you want to remove this bar?",
            callback: function(result) {
                if (result) {
                    $.ajax({
                        url: '/api/party/bar/delete',
                        type: 'POST',
                        data: {partyId: party.id, barId: barId},
                        success: (_id) => {
                            initBars();
                        }
                    });
                }
            }
        }) 
    }

    let getBarTabTemplate = (counter, bar) => {
        return $(`
            <div id="${bar._id}" class="panel panel-default">	
                <div class="panel-heading">
                    <a id="bar_${counter}_name" class="editable editable-click editable-disabled" data-name="bar_name_eng" href="#bar_${counter}_body"
                        style="margin:10px;display: inline-block" data-type="text" data-pk="${bar._id}"
                        data-parent="#bar_accordion_container">${bar.bar_name_eng}</a>
                    <button id="enable_bar_${counter}_edit" class="edit_bar_btn_flag" type="button">
                        <i class="fa fa-pencil"></i>
                    </button>
                    <button id="delete_bar_${counter}" data-id="${bar._id}" class="delete_bar_btn_flag" type="button">
                        <i bar-id="${bar._id}" class="fa fa-trash"></i>
                    </button>
                </div>
                <div id="bar_${counter}_body" class="panel-collapse in container" style="margin-top: 40px">
                    <div class="row">
                        <div class="col-md-5">
                            <div class="portlet light bordered">
                                <div class="portlet-title">
                                    <div class="title-block caption font-red">
                                        <i class="fa fa-star font-red" aria-hidden="true"></i>
                                        <span class="caption-subject bold">Bar Tenders</span>
                                    </div>
                                    <div class="tools"></div>
                                </div>
                                <div class="portlet-body table-both-scroll">
                                    <table class="table table-striped table-bordered table-hover order-column"
                                            id="table-events">
                                        <thead>
                                        <th>#</th>
                                        <th>Pic</th>
                                        <th>User Name</th>
                                        <th>Name</th>
                                        </thead>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-7">
                            <div class="portlet light bordered">
                                <div class="portlet-title">
                                    <div class="title-block caption font-red">
                                        <i class="fa fa-star font-red" aria-hidden="true"></i>
                                        <span class="caption-subject bold">Drinks</span>
                                    </div>
                                    <div class="tools"></div>
                                </div>
                                <div class="portlet-body table-both-scroll">
                                    <table class="table table-striped table-bordered table-hover order-column"
                                            id="table-events">
                                        <thead>
                                        <th>#</th>
                                        <th>Drink</th>
                                        <th>Serve Method</th>
                                        <th>Volume</th>
                                        <th>Price</th>
                                        <th>Currency</th>
                                        <th>In Stock</th>                             
                                        </thead>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `);
    };
});