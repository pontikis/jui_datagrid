/**
 * jquery plugin which displays data in tabular format (datagrid)
 * Requires jquery, jquery-ui Themes CSS
 * It uses jui_pagination plugin (which requires jquery-ui)
 * Copyright 2012 Christos Pontikis http://pontikis.net
 * Project page https://github.com/pontikis/jui_datagrid
 * Release 1.00 - ??/10/2012
 * License MIT
 */
(function($) {

    var pluginName = 'jui_datagrid';

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

                /**
                 * settings and defaults
                 * using $.extend, settings modification will affect elem.data() and vive versa
                 */
                var settings = elem.data(pluginName);
                if(typeof(settings) == 'undefined') {
                    var defaults = elem.jui_datagrid('getDefaults');
                    settings = $.extend({}, defaults, options);
                } else {
                    settings = $.extend({}, settings, options);
                }
                elem.data(pluginName, settings);

                var container_id = elem.attr("id");

                // simple validation
                //validate_input(container_id);

                // bind events
                elem.unbind("onShow").bind("onShow", elem.jui_datagrid('getOption', 'onShow'));

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
         * Get default values
         * Usage: $(element).jui_datagrid('getDefaults');
         * @return {Object}
         */
        getDefaults: function() {
            var defaults = {
                page_num: 1,
                rows_per_page: 10,

                apply_UI_style: true,
                table_class: 'ui-styled-table',
                tr_hover_class: 'ui-state-hover',
                th_class: 'ui-state-default',
                td_class: 'ui-widget-content',
                tr_last_class: 'last-child',

                table_id_prefix: 'dg_',
                paginator_id_prefix: 'pag_',

                rscNoRecords: 'No records found...',

                onShow: function() {
                }
            };
            return defaults;
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
         * Get all options
         * Usage: $(element).myPlugin('getAllOptions');
         * @return {*}
         */
        getAllOptions: function() {
            var elem = this;
            return elem.data(pluginName);
        },

        /**
         * Set option
         * Usage: $(element).jui_datagrid('setOption', 'oprion_name',  'oprion_value',  reinit);
         * @param opt
         * @param val
         * @param reinit
         */
        setOption: function(opt, val, reinit) {
            var elem = this;
            elem.data(pluginName)[opt] = val;
            if(reinit) {
                elem.jui_datagrid('init');
            }
        },

        /**
         * Destroy plugin
         * Usage: $(element).jui_datagrid('destroy');
         * @param options
         * @return {*|jQuery}
         */
        destroy: function(options) {
            return $(this).each(function() {
                var $this = $(this);

                $this.removeData(pluginName);
            });
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
        }

    };

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
        var total_pages = Math.ceil(total_rows / 10);

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

            if(typeof ($("#" + paginator_id).data('jui_pagination')) == 'undefined') {

                var paginator_id = elem.jui_datagrid('getOption', 'paginator_id_prefix') + container_id;
                var pag = '<div id="' + paginator_id + '">';
                pag += '</div>';

                elem.append(pag);


                $("#" + paginator_id).jui_pagination({
                    //currentPage: 1,
                    visiblePageLinks: 10,
                    totalPages: total_pages,
                    containerClass: 'paginator1',
                    onChangePage: function() {
                        elem.data('jui_datagrid').page_num = $(this).jui_pagination('getOption', 'currentPage');
                        elem.jui_datagrid('init');
                    }
                });
            }



            if(elem.jui_datagrid('getOption', 'apply_UI_style')) {
                elem.jui_datagrid('setUIStyle',
                    elem.jui_datagrid('getOption', 'table_class'),
                    elem.jui_datagrid('getOption', 'tr_hover_class'),
                    elem.jui_datagrid('getOption', 'th_class'),
                    elem.jui_datagrid('getOption', 'td_class'),
                    elem.jui_datagrid('getOption', 'tr_last_class'));
            }

            // trigger event
            elem.triggerHandler("onShow");
        } else {
            elem.html(elem.jui_datagrid('getOption', 'rscNoRecords'));
        }

    };

    $.fn.jui_datagrid = function(method) {

        if(this.size() != 1) {
            var err_msg = 'You must use this plugin with a unique element (at once)';
            this.html('<span style="color: red;">' + 'ERROR: ' + err_msg + '</span>');
            $.error(err_msg);
        }

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