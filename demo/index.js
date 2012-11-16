$(function() {

    // theme switcher ----------------------------------------------------------
    $("#ui-theme-switcher").change(function() {
        var theme_url = $(this).val();
        $("#ui-theme").attr("href", theme_url);
    });

    // demo grid1 --------------------------------------------------------------
    $("#demo_grid1").jui_datagrid({

        columns: [
            {field: "lastname", visible: "yes", "header": 'Lastname', "headerClass": "th_lastname", "dataClass": "td_lastname"},
            {field: "firstname", visible: "yes", "header": 'Firstname', "headerClass": "th_firstname", "dataClass": "td_firstname"},
            {field: "email", visible: "yes", "header": 'Email', "headerClass": "th_email", "dataClass": "td_email"},
            {field: "gender", visible: "yes", "header": 'G', "headerClass": "th_gender", "dataClass": "td_gender"}
        ],

        sorting: [
            {"sortingName": "Code", field: "customer_id", order: ""},
            {"sortingName": "Lastname", field: "lastname", order: "ascending"},
            {"sortingName": "Firstname", field: "firstname", order: "ascending"}
        ],

        filters: [
            {"filterName": "", "filterType": "", field: "", operator: "",
                value: "", value_range: {lower: "", upper: ""}, value_array: [],
                foreignKey: {ref_table: "", ref_pk: "", ref_col: "", condition: ""},
                ajax_autocomplete_url: ""
            }
        ],

        ajaxFetchDataURL: 'ajax/ajax_fetch_data1.php',

        containerClass: 'grid1_container ui-state-default ui-corner-all',
        datagridClass: 'grid1_data ui-widget-content',

        autoSetColumnsWidth: false,

        caption: 'Customers',

        onDelete: function() {
            alert('Delete pressed');
        },
        onCellClick: function(event, data) {
            //console.log('cell: col ' + data.col + ' row ' + data.row);
        },
        onRowClick: function(event, data) {
            //console.log('tr click');
        },
        onDisplay: function() {

            //$("#tbl_demo_grid1").find('tbody tr').find('td:eq(3)').css({"font-weight": "bold", "color": "red"});
            //console.log('test ' + $("#tbl_demo_grid1").find('tbody tr:eq(1)').find('td:eq(2)').length);
            //$("#tbl_demo_grid1").find('tbody tr').find('td:eq(3)').html('<a href="http://google.com" target="_blank">google</a>');
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

    // demo grid2 --------------------------------------------------------------
    $("#dlg_demo_grid2").dialog({
        autoOpen: false,
        title: "Customers dialog",
        width: 750,
        height: 380,
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
            {"sortingName": "Lastname", field: "lastname", order: ""},
            {"sortingName": "Firstname", field: "firstname", order: ""}
        ],

        ajaxFetchDataURL: 'ajax/ajax_fetch_data2.php',

        containerClass: 'grid2_container ui-state-default ui-corner-all',
        datagridClass: 'grid2_data ui-widget-content',

        paginationOptions: {
            sliderAnimation: false
        }
    });


    $("#dlg_demo_grid2_opener").button({
        icons: {
            primary: 'ui-icon-newwin'
        }
    });

    $("#dlg_demo_grid2_opener").click(function() {
        $("#dlg_demo_grid2").dialog("open");
        return false;
    });


});