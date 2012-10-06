/**
 * jquery plugin which displays data in tabular format (datagrid)
 * Requires jquery, jquery-ui Themes CSS
 * Copyright 2012 Christos Pontikis (http://www.pontikis.net)
 * Project page https://github.com/pontikis/jui_datagrid
 * Release 1.00 - ??/10/2012
 * License GPLv3
 */
(function($) {

    var pluginName = 'jui_datagrid';

    // private methods
    /**
     *
     * @param url
     */
    var fetch_data = function(url) {
        var dg_data = [];
        $.ajax({
            type: 'POST',
            url: url,
            data: {
                rows_per_page: 10,
                start_id: 0
            },
            success: function(data) {
                dg_data = $.parseJSON(data);
            }
        });
        return dg_data;
    };

    // public methods
    var methods = {

        /**
         * @constructor
         * @param options
         * @return {*}
         */
        init: function(options) {

            var elem = this;

            return this.each(function() {

                var settings = elem.data(pluginName);
                if(typeof(settings) == 'undefined') {
                    var defaults = {
                        table_id_prefix: 'dg_',
                        apply_UI_style: true,
                        table_class: 'ui-styled-table',
                        tr_hover_class: 'ui-state-hover',
                        th_class: 'ui-state-default',
                        td_class: 'ui-widget-content',
                        tr_last_class: 'last-child',
                        onShow: function() {
                        }
                    };
                    settings = $.extend({}, defaults, options);
                    elem.data(pluginName, settings);
                } else {
                    settings = $.extend({}, settings, options);
                }

                var container_id = elem.attr("id");
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
                    elem.jui_datagrid('setUIStyle', settings.table_class, settings.tr_hover_class, settings.th_class, settings.td_class, settings.tr_last_class);
                }

                // bind event
                elem.bind("onShow", settings.onShow);
                // trigger event
                elem.triggerHandler("onShow");

            });
        },

        /**
         * Get any option set to plugin using its name (as string)
         * Usage: $(element).jui_datagrid('getOption', some_option);
         * @param opt
         * @return {*}
         */
        getOption: function(opt) {
            var elem = $(this);
            return elem.data(pluginName)[opt];
        },

        /**
         * Apply UI styles to datagrid table
         * @param table_class
         * @param tr_hover_class
         * @param th_class
         * @param td_class
         * @param tr_last_class
         */
        setUIStyle: function(table_class, tr_hover_class, th_class, td_class, tr_last_class) {
            var elem = $(this);
            var table_selector = '#' + $(elem).jui_datagrid('getOption', 'table_id_prefix') + elem.attr("id");
            $(table_selector).addClass(table_class);

            if(tr_hover_class) {
                $(table_selector).on('mouseover mouseout', 'tbody tr', function(event) {
                    $(this).children().toggleClass(tr_hover_class, event.type == 'mouseover');
                });
            }

            $(table_selector).find("th").addClass(th_class);
            $(table_selector).find("td").addClass(td_class);
            $(table_selector).find("tr:last-child").addClass(tr_last_class);
        },

        /**
         * Destroy plugin
         * @param options
         * @return {*|jQuery}
         */
        destroy: function(options) {
            return $(this).each(function() {
                var $this = $(this);

                $this.removeData(pluginName);
            });
        }
    };

    $.fn.jui_datagrid = function(method) {

        // Method calling logic
        if(methods[method]) {
            return methods[ method ].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if(typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.' + pluginName);
        }

    };

})(jQuery);