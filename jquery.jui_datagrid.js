/**
 * jquery plugin which displays data in tabular format (datagrid)
 * Requires jquery, jquery-ui Themes CSS
 * Copyright 2012 Christos Pontikis (http://www.pontikis.net)
 * Project page https://github.com/pontikis/jui_datagrid
 * Release 1.00 - ??/10/2012
 * License GPLv3
 */
(function($) {
    $.fn.jui_datagrid = function(options) {

        var defaults = {
            css: 'ui-styled-table'
        };

        var options = $.extend(defaults, options);

        /**
         * @param table_id
         * @param table_class
         * @link http://stackoverflow.com/questions/2613632/jquery-ui-themes-and-html-tables
         */
        function ui_style_table(table_id, table_class) {
            var table_selector = '#' + table_id;
            $(table_selector).addClass(table_class);

            $(table_selector).on('mouseover mouseout', 'tbody tr', function(event) {
                $(this).children().toggleClass("ui-state-hover", event.type == 'mouseover');
            });

            $(table_selector).find("th").addClass("ui-state-default");
            $(table_selector).find("td").addClass("ui-widget-content");
            $(table_selector).find("tr:last-child").addClass("last-child");
        }


        return this.each(function() {
            obj = $(this);
            var current_obj_id = $(this).attr("id");
            var elem_table_selector = '#dg_' + current_obj_id;

            var tbl = '<table id="' + 'dg_' + current_obj_id + '">' +
                '<thead>' +
                '<tr><th>Header Column</th><th>Column 2</th><th>Column 3</th><th>Column 4</th></tr>' +
                '</thead>' +
                '<tbody>' +
                '<tr><th>Header</th><td>Cell 2</td><td>Cell 3</td><td>Cell 4</td></tr>' +
                '<tr><th>Header</th><td>Cell 2</td><td>Cell 3</td><td>Cell 4</td></tr>' +
                '<tr><th>Header</th><td>Cell 2</td><td>Cell 3</td><td>Cell 4</td></tr>' +
                '</tbody>' +
                '</table>';

            obj.html(tbl);

            ui_style_table('dg_' + current_obj_id, options.css);


        });

    };
})(jQuery);