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
     * Display datagrid
     * @param container_id
     * @param a_dg
     */
    var display_datagrid = function(container_id, a_dg) {

        var elem = $("#" + container_id);

        var dg_data = a_dg['dg_data'];
        var page_rows = dg_data.length;
        var total_rows = a_dg['total_rows'];

        if(total_rows > 0) {
            var container_id = elem.attr("id");
            var table_id = elem.jui_datagrid('getOption', 'table_id_prefix') + container_id;

            var tbl = '<table id="' + table_id + '">';

            tbl += '<thead>';
            tbl += '<tr>';
            $.each(dg_data[0], function(index, value) {
                tbl += '<th>' + index + '</th>';
            });
            tbl += '<tr>';
            tbl += '</thead>';

            tbl += '<tbody>';
            for(var i = 0; i < page_rows; i++) {
                tbl += '<tr>';
                $.each(dg_data[i], function(index, value) {
                    tbl += '<td>' + value + '</td>';
                });
                tbl += '</tr>';
            }
            tbl += '<tbody>';

            tbl += '</table>';

            elem.html(tbl);

            var paginator_id = elem.jui_datagrid('getOption', 'paginator_id_prefix') + container_id;
            var pag = '<div id="' + paginator_id + '">';
            pag += '</div>';

            elem.append(pag);

            $("#" + paginator_id).jui_pagination({
                currentPage: 1,
                visiblePageLinks: 10,
                totalPages: 100
            });


            if(elem.jui_datagrid('getOption', 'apply_UI_style')) {
                elem.jui_datagrid('setUIStyle',
                    elem.jui_datagrid('getOption', 'table_class'),
                    elem.jui_datagrid('getOption', 'tr_hover_class'),
                    elem.jui_datagrid('getOption', 'th_class'),
                    elem.jui_datagrid('getOption', 'td_class'),
                    elem.jui_datagrid('getOption', 'tr_last_class'));
            }

            // bind event
            elem.bind("onShow", elem.jui_datagrid('getOption', 'onShow'));
            // trigger event
            elem.triggerHandler("onShow");
        } else {
            elem.html(elem.jui_datagrid('getOption', 'rscNoRecords'));
        }

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
                        paginator_id_prefix: 'pag_',
                        page_num: 1,
                        rows_per_page: 10,
                        rscNoRecords: 'No records found...',
                        onShow: function() {
                        }
                    };
                    settings = $.extend({}, defaults, options);
                    elem.data(pluginName, settings);
                } else {
                    settings = $.extend({}, settings, options);
                }

                // fetch data and display datagrid
                var rows_per_page = elem.jui_datagrid('getOption', 'rows_per_page');
                var page_num = elem.jui_datagrid('getOption', 'page_num');
                var ajax_fetch_data_url = elem.jui_datagrid('getOption', 'ajax_fetch_data_url');

                $.ajax({
                    type: 'POST',
                    url: ajax_fetch_data_url,
                    data: {
                        page_num: page_num,
                        rows_per_page: rows_per_page
                    },
                    success: function(data) {
                        var a_data = $.parseJSON(data);
                        display_datagrid(elem.attr("id"), a_data);
                    }
                });
            });
        },

        /**
         * Get any option set to plugin using its name (as string)
         * Usage: $(element).jui_datagrid('getOption', some_option);
         * @param opt
         * @return {*}
         */
        getOption: function(opt) {
            var elem = this;
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
            var elem = this;
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