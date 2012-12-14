$(function() {

    var elem_dlg_log1 = $("#dlg_demo_grid1_log"),
        log,
        elem_dlg_demo_grid2_opener = $("#dlg_demo_grid2_opener");

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
            {field: "email", visible: "yes", "header": 'Email', "headerClass": "th_email", "dataClass": "td_email"},
            {field: "gender", visible: "yes", "header": 'Gender', "headerClass": "th_gender", "dataClass": "td_gender"}
        ],

        sorting: [
            {sortingName: "Code", field: "customer_id", order: "none"},
            {sortingName: "Lastname", field: "lastname", order: "ascending"},
            {sortingName: "Firstname", field: "firstname", order: "ascending"}
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
                }
            ]
        },

        ajaxFetchDataURL: 'ajax/ajax_fetch_data1.php',

        containerClass: 'grid1_container ui-state-default ui-corner-all',
        datagridClass: 'grid1_data ui-widget-content',

        caption: 'Customers',

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

function create_log(elem_log, log_line) {
    var line_number = parseInt(elem_log.find("p").length) + 1;
    elem_log.prepend('<p>' + line_number + ') ' + log_line);
}