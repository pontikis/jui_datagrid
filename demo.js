$(function() {
    //$('#switcher').themeswitcher();

    $("#demo_grid1").jui_datagrid({
    });


    $("#set_UI_style").click(function() {

        var table_class = 'ui-styled-table';
        var tr_hover_class = 'ui-state-hover';
        var th_class = 'ui-state-default';
        var td_class = 'ui-widget-content';
        var tr_last_class = 'last-child';

        $("#demo_grid1").jui_datagrid('setUIStyle', 'dg_demo_grid1', table_class, tr_hover_class, th_class, td_class, tr_last_class);
    });


    $("#get_option").click(function() {
        alert($("#demo_grid1").jui_datagrid('setUIStyle'));
    });

});