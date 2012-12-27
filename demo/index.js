$(function() {

    var elem_dlg_log1 = $("#dlg_demo_grid1_log"),
        log,
        elem_dlg_demo_grid2_opener = $("#dlg_demo_grid2_opener");


    // detect timezone
    $.ajax({
        type: 'POST',
        url: "ajax/ajax_get_server_timezone.php",
        success: function(data) {
            $('#tz_info').html('<strong>SERVER timezone: </strong>' + data + ' <strong>Detected USER timezone: </strong>' + getTimezoneName() + ' ' + getTZoffset());
        }
    });


    // theme switcher ----------------------------------------------------------
    $("#ui-theme-switcher").change(function() {
        var theme_url = $(this).val();
        $("#ui-theme").attr("href", theme_url);
    });

    // demo grid1 --------------------------------------------------------------
    $("#demo_grid1").jui_datagrid({

        columns: [
            {field: "customer_id", visible: "no", "header": 'Code', "headerClass": "th_code", "dataClass": "td_code"},
            {field: "lastname", visible: "yes", "header": 'Lastname', "headerClass": "th_lastname", "dataClass": "td_lastname"},
            {field: "firstname", visible: "yes", "header": 'Firstname', "headerClass": "th_firstname", "dataClass": "td_firstname"},
            {field: "email", visible: "no", "header": 'Email', "headerClass": "th_email", "dataClass": "td_email"},
            {field: "gender", visible: "yes", "header": 'Gender', "headerClass": "th_gender", "dataClass": "td_gender"},
            {field: "date_of_birth", visible: "yes", "header": 'Date of birth', "headerClass": "th_date_of_birth", "dataClass": "th_date_of_birth",
                column_value_conversion: {
                    function_name: "date_decode",
                    args: [
                        {"col_index": 5},
                        {"value": "DD/MM/YYYY"}
                    ]
                }
            },
            {field: "date_updated", visible: "yes", "header": 'Date updated', "headerClass": "th_date_updated", "dataClass": "th_date_updated",
                column_value_conversion_server_side: {
                    function_name: "UTC_timestamp_to_local_datetime",
                    args: [
                        {"col_index": 6},
                        {"value": "Europe/Athens"},
                        {"value": "d/m/Y H:m:s"}
                    ]
                }
            }
        ],

        sorting: [
            {sortingName: "Code", field: "customer_id", order: "none"},
            {sortingName: "Lastname", field: "lastname", order: "ascending"},
            {sortingName: "Firstname", field: "firstname", order: "ascending"},
            {sortingName: "Date of birth", field: "date_of_birth", order: "none"},
            {sortingName: "Date updated", field: "date_updated", order: "none"}
        ],

        filterOptions: {
            filters: [
                {
                    filterName: "Lastname", "filterType": "text", field: "lastname", filterLabel: "Last name",
                    excluded_operators: ["in", "not_in"],
                    filter_interface: [
                        {
                            filter_element: "input",
                            filter_element_attributes: {"type": "text"}
                        }
                    ]
                },
                {
                    filterName: "Firstname", "filterType": "text", field: "firstname", filterLabel: "First name",
                    excluded_operators: ["in", "not_in"],
                    filter_interface: [
                        {
                            filter_element: "input",
                            filter_element_attributes: {"type": "text"}
                        }
                    ]
                },
                {
                    filterName: "Gender", "filterType": "number", field: "lk_genders_id", filterLabel: "Gender",
                    excluded_operators: ["equal", "not_equal", "less", "less_or_equal", "greater", "greater_or_equal"],
                    filter_interface: [
                        {
                            filter_element: "input",
                            filter_element_attributes: {type: "checkbox"}
                        }
                    ],
                    lookup_values: [
                        {lk_option: "Male", lk_value: "1"},
                        {lk_option: "Female", lk_value: "2", lk_selected: "yes"}
                    ]
                },
                {
                    filterName: "DateOfBirth", "filterType": "date", field: "date_of_birth", filterLabel: "Date of birth",
                    excluded_operators: ["in", "not_in"],
                    filter_interface: [
                        {
                            filter_element: "input",
                            filter_element_attributes: {
                                type: "text",
                                title: "Set the date using format: dd/mm/yyyy"
                            },
                            filter_widget: "datepicker",
                            filter_widget_properties: {
                                dateFormat: "dd/mm/yy",
                                changeMonth: true,
                                changeYear: true
                            }
                        }
                    ],
                    validate_dateformat: ["DD/MM/YYYY"],
                    filter_value_conversion_server_side: {
                        function_name: "date_encode",
                        args: [
                            {"filter_value": "yes"},
                            {"value": "d/m/Y"}
                        ]
                    }
                },
                {
                    filterName: "DateUpdated", "filterType": "date", field: "date_updated", filterLabel: "Datetime updated",
                    excluded_operators: ["in", "not_in"],
                    filter_interface: [
                        {
                            filter_element: "input",
                            filter_element_attributes: {
                                type: "text",
                                title: "Set the date and time using format: dd/mm/yyyy hh:mm:ss"
                            },
                            filter_widget: "datetimepicker",
                            filter_widget_properties: {
                                dateFormat: "dd/mm/yy",
                                timeFormat: "HH:mm:ss",
                                changeMonth: true,
                                changeYear: true,
                                showSecond: true
                            }
                        }
                    ],
                    validate_dateformat: ["DD/MM/YYYY HH:mm:ss"],
                    filter_value_conversion: {
                        function_name: "local_datetime_to_UTC_timestamp",
                        args: [
                            {"filter_value": "yes"},
                            {"value": "DD/MM/YYYY HH:mm:ss"}
                        ]
                    }
                }
            ],

            decimal_separator: ","
        },

        dlgFiltersClass: 'grid1_filters',

        ajaxFetchDataURL: 'ajax/ajax_fetch_data1.php',
        row_primary_key: 'customer_id',

        containerClass: 'grid1_container ui-state-default ui-corner-all',
        datagridClass: 'grid1_data ui-widget-content',

        caption: 'Customers',

        debug_mode: "yes",

        onDelete: function() {
            var a_sel = $(this).jui_datagrid("getSelectedIDs"),
                sel = a_sel.length;
            if(sel == 0) {
                log = 'Nothing selected...';
                create_log(elem_dlg_log1, log);
            } else {
                log = sel + ' Row(s) with ID: ' + a_sel + ' will be deleted.';
                create_log(elem_dlg_log1, log);
            }
        },
        onCellClick: function(event, data) {
            log = 'Click on cell: col ' + data.col + ' row ' + data.row + '.';
            create_log(elem_dlg_log1, log);
        },
        onRowClick: function(event, data) {
            log = 'Row with ID ' + data.row_id + ' ' + data.row_status + '.';
            create_log(elem_dlg_log1, log);
        },
        onDatagridError: function(event, data) {
            log = 'ERROR: ' + data.err_description + ' (' + data.err_code + ').';
            create_log(elem_dlg_log1, log, true);
            if(data.hasOwnProperty("elem_filter")) {
                data.elem_filter.focus();
            }
        },
        onDebug: function(event, data) {
            create_log(elem_dlg_log1, data.debug_message, false, true);
        },
        onDisplay: function() {
            log = 'Datagrid created.';
            create_log(elem_dlg_log1, log);
        }
    });

    $("#selection_multiple").click(function() {
        $("#demo_grid1").jui_datagrid({
            rowSelectionMode: 'multiple'
        })
    });

    $("#selection_single").click(function() {
        $("#demo_grid1").jui_datagrid({
            rowSelectionMode: 'single'
        })
    });

    $("#selection_false").click(function() {
        $("#demo_grid1").jui_datagrid({
            rowSelectionMode: false
        })
    });


    elem_dlg_log1.dialog({
        autoOpen: true,
        width: 250,
        height: 200,
        position: {
            my: "left",
            at: "right",
            of: '#demo_grid1'
        },
        title: "Log demo_grid1"
    });

    $("#log_show").click(function() {
        elem_dlg_log1.dialog("open");
        return false;
    });

    $("#log_hide").click(function() {
        elem_dlg_log1.dialog("close");
        return false;
    });

    $("#log_clear").click(function() {
        elem_dlg_log1.html('');
    });

    // demo grid2 --------------------------------------------------------------
    $("#dlg_demo_grid2").dialog({
        autoOpen: false,
        title: "Customers dialog",
        width: 750,
        height: 390,
        hide: "fade",
        zIndex: 500,
        open: function() {
            // just to fix column widths
            $("#demo_grid2").jui_datagrid('refresh');
        }
    });

    $("#demo_grid2").jui_datagrid({

        columns: [
            {field: "id", visible: "no", "header": 'Code', "headerClass": "", "dataClass": ""},
            {field: "lastname", visible: "yes", "header": 'Lastname', "headerClass": "", "dataClass": ""},
            {field: "firstname", visible: "yes", "header": 'Firstname', "headerClass": "", "dataClass": ""},
            {field: "gender", visible: "yes", "header": 'Gender', "headerClass": "", "dataClass": ""}
        ],

        sorting: [
            {"sortingName": "Code", field: "id", order: "ascending"},
            {"sortingName": "Lastname", field: "lastname", order: "none"},
            {"sortingName": "Firstname", field: "firstname", order: "none"}
        ],

        ajaxFetchDataURL: 'ajax/ajax_fetch_data2.php',
        row_primary_key: 'id',

        containerClass: 'grid2_container ui-state-default ui-corner-all',
        datagridClass: 'grid2_data ui-widget-content',

        paginationOptions: {
            sliderAnimation: false
        }
    });


    elem_dlg_demo_grid2_opener.button({
        icons: {
            primary: 'ui-icon-newwin'
        }
    });

    elem_dlg_demo_grid2_opener.click(function() {
        $("#dlg_demo_grid2").dialog("open");
        return false;
    });


});

function create_log(elem_log, log, is_error, is_debug) {
    var line_number = parseInt(elem_log.find("p").length) + 1;
    if(is_error) {
        elem_log.prepend('<p style="color: red;">' + line_number + ') ' + log);
    } else if(is_debug) {
        var log_len = log.length, d;

        var debug_html = '<p>' + line_number + ') DEBUG LOG:';
        debug_html += '<ul>';
        for(d = 0; d < log_len; d++) {
            debug_html += '<li>' + log[d];
        }
        debug_html += '</ul>';

        elem_log.prepend(debug_html);
    } else {
        elem_log.prepend('<p>' + line_number + ') ' + log);
    }

}


/**
 * Converts date (no time) string of YYYYMMDD to date dtring of given format
 *
 * @param {String} date_str
 * @param {String} dateformat
 * @return {String}
 */
function date_decode(date_str, dateformat) {

    if(date_str == null || date_str.length == 0) {
        return '';
    }

    var year = date_str.substr(0, 4),
        month = date_str.substr(4, 2),
        day = date_str.substr(6, 2);

    var a = moment([year, month - 1, day]);
    return a.format(dateformat);
}


/**
 * Convert local timezone date string to UTC timestamp
 *
 * Alternative syntax using jquery (instead of moment.js):
 *     var date = $.datepicker.parseDateTime(dateformat, timeformat, date_str);
 *
 * @see http://stackoverflow.com/questions/948532/how-do-you-convert-a-javascript-date-to-utc
 * @param {String} date_str
 * @param {String} dateformat
 * @return {String}
 */
function local_datetime_to_UTC_timestamp(date_str, dateformat) {

    // avoid date overflow in user input (moment("14/14/2005", "DD/MM/YYYY") => Tue Feb 14 2006)
    if(moment(date_str, dateformat).isValid() == false) {
        throw new Error("Invalid date");
    }

    // parse date string using given dateformat and create a javascript date object
    var date = moment(date_str, dateformat).toDate();

    // use javascript getUTC* functions to conv ert to UTC
    return  date.getUTCFullYear() +
        PadDigits(date.getUTCMonth() + 1, 2) +
        PadDigits(date.getUTCDate(), 2) +
        PadDigits(date.getUTCHours(), 2) +
        PadDigits(date.getUTCMinutes(), 2) +
        PadDigits(date.getUTCSeconds(), 2);

}

/**
 * Add leading zeros
 * @param {Number} n
 * @param {Number} totalDigits
 * @return {String}
 */
function PadDigits(n, totalDigits) {
    n = n.toString();
    var pd = '';
    if(totalDigits > n.length) {
        for(i = 0; i < (totalDigits - n.length); i++) {
            pd += '0';
        }
    }
    return pd + n.toString();
}

/**
 * @see http://stackoverflow.com/questions/2853474/can-i-get-the-browser-time-zone-in-asp-net-or-do-i-have-to-rely-on-js-operations
 * @return {String}
 */
function getTimezoneName() {
    var tmSummer = new Date(Date.UTC(2005, 6, 30, 0, 0, 0, 0));
    var so = -1 * tmSummer.getTimezoneOffset();
    var tmWinter = new Date(Date.UTC(2005, 12, 30, 0, 0, 0, 0));
    var wo = -1 * tmWinter.getTimezoneOffset();

    if(-660 == so && -660 == wo) return 'Pacific/Midway';
    if(-600 == so && -600 == wo) return 'Pacific/Tahiti';
    if(-570 == so && -570 == wo) return 'Pacific/Marquesas';
    if(-540 == so && -600 == wo) return 'America/Adak';
    if(-540 == so && -540 == wo) return 'Pacific/Gambier';
    if(-480 == so && -540 == wo) return 'US/Alaska';
    if(-480 == so && -480 == wo) return 'Pacific/Pitcairn';
    if(-420 == so && -480 == wo) return 'US/Pacific';
    if(-420 == so && -420 == wo) return 'US/Arizona';
    if(-360 == so && -420 == wo) return 'US/Mountain';
    if(-360 == so && -360 == wo) return 'America/Guatemala';
    if(-360 == so && -300 == wo) return 'Pacific/Easter';
    if(-300 == so && -360 == wo) return 'US/Central';
    if(-300 == so && -300 == wo) return 'America/Bogota';
    if(-240 == so && -300 == wo) return 'US/Eastern';
    if(-240 == so && -240 == wo) return 'America/Caracas';
    if(-240 == so && -180 == wo) return 'America/Santiago';
    if(-180 == so && -240 == wo) return 'Canada/Atlantic';
    if(-180 == so && -180 == wo) return 'America/Montevideo';
    if(-180 == so && -120 == wo) return 'America/Sao_Paulo';
    if(-150 == so && -210 == wo) return 'America/St_Johns';
    if(-120 == so && -180 == wo) return 'America/Godthab';
    if(-120 == so && -120 == wo) return 'America/Noronha';
    if(-60 == so && -60 == wo) return 'Atlantic/Cape_Verde';
    if(0 == so && -60 == wo) return 'Atlantic/Azores';
    if(0 == so && 0 == wo) return 'Africa/Casablanca';
    if(60 == so && 0 == wo) return 'Europe/London';
    if(60 == so && 60 == wo) return 'Africa/Algiers';
    if(60 == so && 120 == wo) return 'Africa/Windhoek';
    if(120 == so && 60 == wo) return 'Europe/Amsterdam';
    if(120 == so && 120 == wo) return 'Africa/Harare';
    if(180 == so && 120 == wo) return 'Europe/Athens';
    if(180 == so && 180 == wo) return 'Africa/Nairobi';
    if(240 == so && 180 == wo) return 'Europe/Moscow';
    if(240 == so && 240 == wo) return 'Asia/Dubai';
    if(270 == so && 210 == wo) return 'Asia/Tehran';
    if(270 == so && 270 == wo) return 'Asia/Kabul';
    if(300 == so && 240 == wo) return 'Asia/Baku';
    if(300 == so && 300 == wo) return 'Asia/Karachi';
    if(330 == so && 330 == wo) return 'Asia/Calcutta';
    if(345 == so && 345 == wo) return 'Asia/Katmandu';
    if(360 == so && 300 == wo) return 'Asia/Yekaterinburg';
    if(360 == so && 360 == wo) return 'Asia/Colombo';
    if(390 == so && 390 == wo) return 'Asia/Rangoon';
    if(420 == so && 360 == wo) return 'Asia/Almaty';
    if(420 == so && 420 == wo) return 'Asia/Bangkok';
    if(480 == so && 420 == wo) return 'Asia/Krasnoyarsk';
    if(480 == so && 480 == wo) return 'Australia/Perth';
    if(540 == so && 480 == wo) return 'Asia/Irkutsk';
    if(540 == so && 540 == wo) return 'Asia/Tokyo';
    if(570 == so && 570 == wo) return 'Australia/Darwin';
    if(570 == so && 630 == wo) return 'Australia/Adelaide';
    if(600 == so && 540 == wo) return 'Asia/Yakutsk';
    if(600 == so && 600 == wo) return 'Australia/Brisbane';
    if(600 == so && 660 == wo) return 'Australia/Sydney';
    if(630 == so && 660 == wo) return 'Australia/Lord_Howe';
    if(660 == so && 600 == wo) return 'Asia/Vladivostok';
    if(660 == so && 660 == wo) return 'Pacific/Guadalcanal';
    if(690 == so && 690 == wo) return 'Pacific/Norfolk';
    if(720 == so && 660 == wo) return 'Asia/Magadan';
    if(720 == so && 720 == wo) return 'Pacific/Fiji';
    if(720 == so && 780 == wo) return 'Pacific/Auckland';
    if(765 == so && 825 == wo) return 'Pacific/Chatham';
    if(780 == so && 780 == wo) return 'Pacific/Enderbury'
    if(840 == so && 840 == wo) return 'Pacific/Kiritimati';
    return 'US/Pacific';
}

/**
 *
 * @return {String}
 */
function getTZoffset() {
    var today = new Date();
    var offset = -(today.getTimezoneOffset() / 60);
    if(parseInt(offset) < 0) {
        return 'GMT ' + offset;
    } else {
        return 'GMT +' + offset;
    }

}
