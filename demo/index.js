$(function() {

    // theme switcher ----------------------------------------------------------
    $("#ui-theme-switcher").change(function() {
        var theme_url = $(this).val();
        $("#ui-theme").attr("href", theme_url);
    });

    // demo grid1 --------------------------------------------------------------
    $("#demo_grid1").jui_datagrid({
        columns: {
            fields: ["customer_id", "lastname", "firstname", "email", "gender"],
            headers: ["Code", "Lastname", "Firstname", "Email", "Gender"],
            headerClasses: ["thclass1", "thclass2", "thclass3", "thclass4", "thclass5"],
            dataClasses: ["tdclass1", "tdclass2", "tdclass3", "tdclass4", "tdclass5"],
            sortColumnData: ["ascending", "", "", "", ""],
            columnsOrder: ["customer_id", "lastname", "firstname", "email", "gender"],
            columnsVisibility: [true, true, true, true, true]
        },
        ajaxFetchDataURL: 'ajax/ajax_fetch_data1.php',

        containerClass: 'grid1_container ui-state-default ui-corner-all',
        datagridClass: 'grid1_data ui-state-default',

        title: 'Customers',
        showRowIndex: true,
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
        height: 450,
        hide: "fade",
        zIndex: 500,
        open: function() {
            // just to fix column widths
            $("#demo_grid2").jui_datagrid('refresh');
        }
    });

    $("#demo_grid2").jui_datagrid({
        ajaxFetchDataURL: 'ajax/ajax_fetch_data2.php',

        containerClass: 'grid2_container ui-state-default ui-corner-all',
        datagridClass: 'grid2_data ui-state-default',
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