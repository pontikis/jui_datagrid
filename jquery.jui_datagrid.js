/**
 * jquery plugin which displays data in tabular format (datagrid)
 * Requires jquery, jquery-ui Themes CSS
 * It uses jui_pagination plugin (which requires jquery-ui)
 * Copyright 2012 Christos Pontikis http://pontikis.net
 * Project page https://github.com/pontikis/jui_datagrid
 * Release 1.00 - ??/10/2012
 * License MIT
 */
"use strict";
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

                // bind events
                elem.unbind("onShow").bind("onShow", elem.jui_datagrid('getOption', 'onShow'));

                // initialize
                var section_id, section_html;
                section_id = settings.datagrid_id_prefix + container_id;
                if($("#" + section_id).length == 0) {
                    section_html = '<div id="' + section_id + '">';
                    section_html += '</div>';
                    elem.append(section_html);
                }
                section_id = settings.pagination_id_prefix + container_id;
                if(typeof ($("#" + section_id).data('jui_pagination')) == 'undefined') {
                    section_html = '<div id="' + section_id + '">';
                    section_html += '</div>';
                    elem.append(section_html);
                }

                // fetch data and display datagrid
                $.ajax({
                    type: 'POST',
                    url: settings.ajax_fetch_data_url,
                    data: {
                        page_num: settings.page_num,
                        rows_per_page: settings.rows_per_page
                    },
                    success: function(data) {
                        var a_data = $.parseJSON(data);
                        display_datagrid(container_id, a_data);
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

                datagrid_id_prefix: 'dg_',
                table_id_prefix: 'tbl_',
                pagination_id_prefix: 'pag_',

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
         * TODO also destroy jui_pagination
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
        var rows_per_page = elem.jui_datagrid('getOption', 'rows_per_page');
        var total_pages = Math.ceil(total_rows / rows_per_page);
        var datagrid_id = elem.jui_datagrid('getOption', 'datagrid_id_prefix') + container_id;
        var pagination_id = elem.jui_datagrid('getOption', 'pagination_id_prefix') + container_id;

        if(total_rows > 0) {
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

            $("#" + datagrid_id).html(tbl);


            if(elem.jui_datagrid('getOption', 'apply_UI_style')) {
                elem.jui_datagrid('setUIStyle',
                    elem.jui_datagrid('getOption', 'table_class'),
                    elem.jui_datagrid('getOption', 'tr_hover_class'),
                    elem.jui_datagrid('getOption', 'th_class'),
                    elem.jui_datagrid('getOption', 'td_class'),
                    elem.jui_datagrid('getOption', 'tr_last_class'));
            }


            $("#" + pagination_id).show();
            $("#" + pagination_id).jui_pagination({
                currentPage: $("#" + container_id).jui_datagrid('getOption', 'page_num'),
                visiblePageLinks: 5,
                totalPages: total_pages,
                containerClass: 'paginator1',
                onChangePage: function(event, page_number) {
                    elem.data('jui_datagrid').page_num = page_number;
                    elem.jui_datagrid({'page_num': page_number});
                }
            });


            // trigger event
            elem.triggerHandler("onShow");

        } else {
            $("#" + datagrid_id).html(elem.jui_datagrid('getOption', 'rscNoRecords'));
            $("#" + pagination_id).hide();
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