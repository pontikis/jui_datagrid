$(function() {
    //$('#switcher').themeswitcher();

    $("#demo_grid1").jui_datagrid({
        apply_UI_style: false
/*        onShow: function(msg) {
            alert('Hello world! ' + msg);
        }*/
    });

/*    $('#demo_grid1').jui_datagrid({
        onShow: function(msg) {
            alert('Hello world! ' + msg);
        }
    });*/


    $("#set_UI_style").click(function() {

        var table_class = 'ui-styled-table';
        var tr_hover_class = 'ui-state-hover';
        var th_class = 'ui-state-default';
        var td_class = 'ui-widget-content';
        var tr_last_class = 'last-child';

        $("#demo_grid1").jui_datagrid('setUIStyle', table_class, tr_hover_class, th_class, td_class, tr_last_class);
    });


    $("#get_option").click(function() {
        var test1 = $("#demo_grid1").jui_datagrid('getOption', 'tr_last_class');
        alert(test1);
    });

    $("#destroy").click(function() {
        $("#demo_grid1").jui_datagrid('destroy');
    });


});