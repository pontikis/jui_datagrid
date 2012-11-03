$(function() {

    // theme switcher ----------------------------------------------------------
    $("#ui-theme-switcher").change(function() {
        var theme_url = $(this).val();
        $("#ui-theme").attr("href", theme_url);
    });

    // demo grid1 --------------------------------------------------------------
    $("#demo_grid1").jui_datagrid({
        ajaxFetchDataURL: 'ajax/ajax_fetch_data1.php',
        containerClass: 'grid1_container ui-state-default ui-corner-all',
        title: 'Customers',
        onDelete: function() {
            alert('Delete pressed');
        },
        onCellClick: function(event, data) {
            //alert('cell: col ' + data.col + ' row ' + data.row);
        },
        onRowClick: function(event, row_index) {
            //alert('tr ' + row_index);
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
    $("#demo_grid2").jui_datagrid({
        ajaxFetchDataURL: 'ajax/ajax_fetch_data2.php',
        containerClass: 'grid2_container ui-state-default ui-corner-all',
        paginationOptions: {
            sliderAnimation: false
        }
    });


});