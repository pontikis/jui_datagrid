/**
 * jquery plugin which displays data in tabular format (datagrid)
 * Requires jquery, jquery-ui Themes CSS
 * Copyright 2012 Christos Pontikis (http://www.pontikis.net)
 * Project page https://github.com/pontikis/jui_datagrid
 * Release 1.00 - ??/10/2012
 * License GPLv3
 */
(function($) {

    var methods = {
        init: function(options) {
            // Create some defaults, extending them with any options that were provided
            var settings = $.extend({
                table_id_prefix: 'dg_',
                apply_UI_style: true,
                table_class: 'ui-styled-table',
                tr_hover_class: 'ui-state-hover',
                th_class: 'ui-state-default',
                td_class: 'ui-widget-content',
                tr_last_class: 'last-child'
            }, options);

            return this.each(function() {
                var elem = $(this);
                var container_id = $(this).attr("id");
                var table_id = settings.table_id_prefix + container_id;

                var tbl = '<table id="' + table_id + '">' +
                    '<thead>' +
                    '<tr><th>Header Column</th><th>Column 2</th><th>Column 3</th><th>Column 4</th></tr>' +
                    '</thead>' +
                    '<tbody>' +
                    '<tr><th>Header</th><td>Cell 2</td><td>Cell 3</td><td>Cell 4</td></tr>' +
                    '<tr><th>Header</th><td>Cell 2</td><td>Cell 3</td><td>Cell 4</td></tr>' +
                    '<tr><th>Header</th><td>Cell 2</td><td>Cell 3</td><td>Cell 4</td></tr>' +
                    '</tbody>' +
                    '</table>';

                elem.html(tbl);
                if(settings.apply_UI_style) {
                    elem.jui_datagrid('setUIStyle', table_id, settings.table_class, settings.tr_hover_class, settings.th_class, settings.td_class, settings.tr_last_class);
                }

            });
        },
        setUIStyle: function(table_id, table_class, tr_hover_class, th_class, td_class, tr_last_class) {
            var table_selector = '#' + table_id;
            $(table_selector).addClass(table_class);

            if(tr_hover_class) {
                $(table_selector).on('mouseover mouseout', 'tbody tr', function(event) {
                    $(this).children().toggleClass(tr_hover_class, event.type == 'mouseover');
                });
            }

            $(table_selector).find("th").addClass(th_class);
            $(table_selector).find("td").addClass(td_class);
            $(table_selector).find("tr:last-child").addClass(tr_last_class);
        }
    };

    $.fn.jui_datagrid = function(method) {

        // Method calling logic
        if(methods[method]) {
            return methods[ method ].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if(typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.jui_datagrid');
        }

    };

})(jQuery);
