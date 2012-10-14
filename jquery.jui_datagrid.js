/**
 * jquery plugin which displays data in tabular format (datagrid)
 * Requires jquery, jquery-ui Themes CSS
 * It uses jui_pagination plugin (which requires jquery-ui)
 * Copyright 2012 Christos Pontikis http://pontikis.net
 * Project page https://github.com/pontikis/jui_datagrid
 * UPCOMING Release: 1.00 (?? Oct 2012)
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
                elem.unbind("onDisplayPagination").bind("onDisplayPagination", settings.onDisplayPagination);
                elem.unbind("onDisplay").bind("onDisplay", settings.onDisplay);

                // initialize plugin html
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
                    url: settings.ajaxFetchDataURL,
                    data: {
                        page_num: settings.pageNum,
                        rows_per_page: settings.rowsPerPage
                    },
                    success: function(data) {
                        var a_data = $.parseJSON(data);
                        var total_rows = a_data['total_rows'];
                        var page_data = a_data['page_data'];

                        if(total_rows == 0) {
                            display_no_data(container_id);
                        } else {
                            display_grid(container_id, total_rows, page_data);
                            apply_grid_style(container_id);
                            display_pagination(container_id, total_rows);

                            // trigger event
                            elem.triggerHandler("onDisplay");
                        }
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
                pageNum: 1,
                rowsPerPage: 10,

                applyUIGridStyle: true,
                tableClass: 'ui-styled-table',
                trHoverClass: 'ui-state-hover',
                thClass: 'ui-state-default',
                tdClass: 'ui-widget-content',
                trLastClass: 'last-child',

                datagrid_id_prefix: 'dg_',
                table_id_prefix: 'tbl_',
                pagination_id_prefix: 'pag_',

                rscNoRecords: 'No records found...',

                onDisplayPagination: function() {
                },
                onDisplay: function() {
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
         * Usage: $(element).jui_datagrid('getAllOptions');
         * @return {*}
         */
        getAllOptions: function() {
            var elem = this;
            return elem.data(pluginName);
        },

        /**
         * Set option
         * Usage: $(element).jui_datagrid('setOption', 'option_name',  'option_value',  reinit);
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
                var datagrid_container_id = $this.attr("id");
                var pagination_container_id = $this.jui_datagrid('getOption', 'pagination_id_prefix') + datagrid_container_id;

                $("#" + pagination_container_id).removeData();
                $this.removeData();
            });
        },

        /**
         * Apply styles to datagrid table
         * @param tableClass
         * @param trHoverClass
         * @param thClass
         * @param tdClass
         * @param trLastClass
         */
        setGridStyle: function(tableClass, trHoverClass, thClass, tdClass, trLastClass) {
            var elem = this;
            var table_selector = '#' + $(elem).jui_datagrid('getOption', 'table_id_prefix') + elem.attr("id");
            $(table_selector).addClass(tableClass);

            if(trHoverClass) {
                $(table_selector).on('mouseover mouseout', 'tbody tr', function(event) {
                    $(this).children().toggleClass(trHoverClass, event.type == 'mouseover');
                });
            }

            $(table_selector).find("th").addClass(thClass);
            $(table_selector).find("td").addClass(tdClass);
            $(table_selector).find("tr:last-child").addClass(trLastClass);
        },

        /**
         * Set pagination options
         * Usage: $(element).jui_datagrid('setPaginationOptions', pag_options);
         * @param pag_options
         */
        setPaginationOptions: function(pag_options) {
            var datagrid_container_id = this.attr("id");
            var pagination_id = $("#" + datagrid_container_id).jui_datagrid('getOption', 'pagination_id_prefix') + datagrid_container_id;
            $("#" + pagination_id).jui_pagination(pag_options);
        },

        /**
         * Get all pagination options
         * Usage: $(element).jui_datagrid('getPaginationOptions');
         * @return {*}
         */
        getPaginationOptions: function() {
            var datagrid_container_id = this.attr("id");
            var pagination_id = $("#" + datagrid_container_id).jui_datagrid('getOption', 'pagination_id_prefix') + datagrid_container_id;
            return $("#" + pagination_id).jui_pagination('getAllOptions');
        }

    };

    /* private methods ------------------------------------------------------ */

    /**
     * Display datagrid
     * @param container_id
     * @param total_rows
     * @param page_data
     */
    var display_grid = function(container_id, total_rows, page_data) {

        var elem = $("#" + container_id);
        var page_rows = page_data.length;
        var datagrid_id = elem.jui_datagrid('getOption', 'datagrid_id_prefix') + container_id;
        var table_id = elem.jui_datagrid('getOption', 'table_id_prefix') + container_id;

        var tbl = '<table id="' + table_id + '">';

        tbl += '<thead>';
        tbl += '<tr>';
        $.each(page_data[0], function(index, value) {
            tbl += '<th>' + index + '</th>';
        });
        tbl += '<tr>';
        tbl += '</thead>';

        tbl += '<tbody>';
        for(var i = 0; i < page_rows; i++) {
            tbl += '<tr>';
            $.each(page_data[i], function(index, value) {
                tbl += '<td>' + value + '</td>';
            });
            tbl += '</tr>';
        }
        tbl += '<tbody>';

        tbl += '</table>';

        $("#" + datagrid_id).html(tbl);

    };


    /**
     * Apply grid style
     * @param container_id
     */
    var apply_grid_style = function(container_id) {

        var elem = $("#" + container_id);
        if(elem.jui_datagrid('getOption', 'applyUIGridStyle')) {
            elem.jui_datagrid('setGridStyle',
                elem.jui_datagrid('getOption', 'tableClass'),
                elem.jui_datagrid('getOption', 'trHoverClass'),
                elem.jui_datagrid('getOption', 'thClass'),
                elem.jui_datagrid('getOption', 'tdClass'),
                elem.jui_datagrid('getOption', 'trLastClass'));
        }

    };

    /**
     * Display pagination
     * @param container_id
     * @param total_rows
     */
    var display_pagination = function(container_id, total_rows) {

        var elem = $("#" + container_id);
        var rowsPerPage = elem.jui_datagrid('getOption', 'rowsPerPage');
        var currentPage = elem.jui_datagrid('getOption', 'pageNum');
        var total_pages = Math.ceil(total_rows / rowsPerPage);
        var pagination_id = elem.jui_datagrid('getOption', 'pagination_id_prefix') + container_id;

        $("#" + pagination_id).show();

        if(typeof ($("#" + pagination_id).data('jui_pagination')) == 'undefined') {
            $("#" + pagination_id).jui_pagination({
                currentPage: currentPage,
                totalPages: total_pages,
                onChangePage: function(event, page_number) {
                    elem.data('jui_datagrid').pageNum = page_number;
                    elem.jui_datagrid({'pageNum': page_number});
                }
            });

            // trigger event
            elem.triggerHandler("onDisplayPagination", pagination_id);
        }

    };

    /**
     * Display datagrid with no rows
     * @param container_id
     */
    var display_no_data = function(container_id) {

        var elem = $("#" + container_id);
        var datagrid_id = elem.jui_datagrid('getOption', 'datagrid_id_prefix') + container_id;
        var pagination_id = elem.jui_datagrid('getOption', 'pagination_id_prefix') + container_id;

        $("#" + datagrid_id).html(elem.jui_datagrid('getOption', 'rscNoRecords'));
        $("#" + pagination_id).hide();

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