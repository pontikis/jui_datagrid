$(function() {
    /*$('#switcher').themeswitcher();*/

    $("#ui-theme-switcher").change(function() {
        var theme_url = $(this).val();
        $("#ui-theme").attr("href", theme_url);
    })


    $("#demo_grid1").jui_datagrid({
        //applyUIGridStyle: false,
        ajaxFetchDataURL: 'ajax/ajax_fetch_data1.php',
        onDisplayPagination: function(e, pagination_id) {
            $("#" + pagination_id).jui_pagination({
                visiblePageLinks: 5,
                containerClass: 'grid_pagination'
            });
        }
    });


    $("#pag_update").click(function() {
        var options = {
            visiblePageLinks: 10,
            useSlider: false
        };
        $("#demo_grid1").jui_datagrid('setPaginationOptions', options);
    });

    $("#pag_restore").click(function() {
        var options = {
            visiblePageLinks: 5,
            useSlider: true
        };
        $("#demo_grid1").jui_datagrid('setPaginationOptions', options);
    });


    $("#set_UI_style").click(function() {

/*        var tableClass = 'ui-styled-table';
        var trHoverClass = 'ui-state-hover';
        var thClass = 'ui-state-default';
        var tdClass = 'ui-widget-content';
        var trLastClass = 'last-child';

        $("#demo_grid1").jui_datagrid('setGridStyle', tableClass, trHoverClass, thClass, tdClass, trLastClass);*/

        $("#demo_grid1").jui_datagrid({applyUIGridStyle: true});

    });


    $("#get_option").click(function() {
        var test1 = $("#demo_grid1").jui_datagrid('getOption', 'trLastClass');
        alert(test1);
    });


    $("#demo_grid2").jui_datagrid({
        ajaxFetchDataURL: 'ajax/ajax_fetch_data2.php'
    });


});