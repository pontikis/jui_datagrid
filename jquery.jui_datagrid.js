/**
 * jquery plugin which displays data in tabular format (datagrid)
 * Requires jquery, jquery-ui, jquery-ui themes
 * It uses jui_dropdown and jui_pagination plugin
 * Copyright 2012 Christos Pontikis http://pontikis.net
 * Project page https://github.com/pontikis/jui_datagrid
 * UPCOMING Release: 1.00 (?? Nov 2012)
 * License MIT
 */
"use strict";
(function($) {

    var pluginName = 'jui_datagrid';
    var pluginStatus = 'jui_datagrid_status';

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
                if(typeof(settings) === 'undefined') {
                    var defaults = elem.jui_datagrid('getDefaults');
                    settings = $.extend({}, defaults, options);
                } else {
                    settings = $.extend({}, settings, options);
                }
                elem.data(pluginName, settings);

                // initialize plugin status
                if(typeof  elem.data(pluginStatus) === 'undefined') {
                    elem.data(pluginStatus, {});
                    elem.data(pluginStatus)['a_selected_ids'] = [];
                    elem.data(pluginStatus)['count_selected_ids'] = 0;
                }

                if(settings.rowSelectionMode == 'single' || settings.rowSelectionMode == false) {
                    elem.data(pluginStatus)['a_selected_ids'] = [];
                    elem.data(pluginStatus)['count_selected_ids'] = 0;
                }

                var container_id = elem.attr("id");

                // bind events
                elem.unbind("onCellClick").bind("onCellClick", settings.onCellClick);
                elem.unbind("onRowClick").bind("onRowClick", settings.onRowClick);
                elem.unbind("onDelete").bind("onDelete", settings.onDelete);
                elem.unbind("onDisplay").bind("onDisplay", settings.onDisplay);

                // initialize plugin html
                var header_id, datagrid_id, tools_id, pagination_id, pref_dialog_id, elem_html;
                header_id = create_id(settings.header_id_prefix, container_id);
                datagrid_id = create_id(settings.datagrid_id_prefix, container_id);
                tools_id = create_id(settings.tools_id_prefix, container_id);
                pagination_id = create_id(settings.pagination_id_prefix, container_id);
                pref_dialog_id = create_id(settings.pref_dialog_id_prefix, container_id);

                if(!elem.data(pluginStatus)['initialize']) {

                    elem_html = '<div id="' + header_id + '">' + settings.title + '</div>';
                    elem_html += '<div id="' + datagrid_id + '"></div>';
                    elem_html += '<div id="' + tools_id + '"></div>';
                    elem_html += '<div id="' + pagination_id + '"></div>';
                    elem_html += '<div id="' + pref_dialog_id + '"></div>';
                    elem.html(elem_html);

                    elem.data(pluginStatus)['initialize'] = true;
                }

                var elem_header = $("#" + header_id);
                var elem_grid = $("#" + datagrid_id);
                var elem_tools = $("#" + tools_id);
                var elem_pag = $("#" + pagination_id);
                var elem_pref_dialog = $("#" + pref_dialog_id);

                // apply style
                elem.removeClass().addClass(settings.containerClass);

                if(typeof settings.title === 'undefined') {
                    elem_header.hide();
                } else {
                    elem_header.show().text(settings.title).removeClass().addClass(settings.headerClass);
                }
                elem_grid.removeClass().addClass(settings.datagridClass);
                elem_tools.removeClass().addClass(settings.toolsClass);
                elem_pag.removeClass().addClass(settings.paginationClass);

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
                        var row_primary_key = a_data['row_primary_key'];
                        var total_rows = a_data['total_rows'];
                        var page_data = a_data['page_data'];

                        if(total_rows == 0) {
                            display_no_data(container_id);
                            display_tools(container_id, total_rows);
                        } else {
                            display_grid(container_id, total_rows, page_data, row_primary_key);
                            apply_grid_style(container_id);
                            apply_selections(container_id);
                            display_tools(container_id, total_rows);
                            display_pagination(container_id, total_rows);
                        }

                        /**
                         * *****************************************************
                         * EVENTS HANDLING
                         * *****************************************************
                         */
                        var selector, tools_id, drop_select_id;

                        // GRID EVENTS -------------------------------------
                        if(total_rows > 0) {
                            var table_id = create_id(elem.jui_datagrid('getOption', 'table_id_prefix'), container_id);
                            var elem_table = $("#" + table_id);
                            var col_index, row_index;

                            /* click on cell */
                            selector = "tbody tr td";
                            elem_table.off('click', selector).on('click', selector, function() {
                                col_index = $(this).index() + 1;
                                row_index = $(this).parent("tr").index() + 1;
                                elem.triggerHandler("onCellClick", {col: col_index, row: row_index});
                            });

                            /* click on row */
                            selector = "tbody tr";
                            elem_table.off('click', selector).on('click', selector, function() {

                                if(settings.rowSelectionMode != false) {
                                    // get row id
                                    var prefix_len = (table_id + '_tr_').length;
                                    var row_id = parseInt($(this).attr("id").substr(prefix_len));

                                    if(settings.rowSelectionMode == 'single') {
                                        // deselect all rows
                                        elem.data(pluginStatus)['a_selected_ids'] = [];
                                        elem.data(pluginStatus)['count_selected_ids'] = 0;
                                        elem_table.find("td").removeClass(settings.selectedTrTdClass);
                                    }

                                    var idx = $.inArray(row_id, elem.data(pluginStatus)['a_selected_ids']);
                                    if(idx > -1) { // deselect row
                                        elem.data(pluginStatus)['a_selected_ids'].splice(idx, 1);
                                        elem.data(pluginStatus)['count_selected_ids'] -= 1;
                                        $(this).children("td").removeClass(settings.selectedTrTdClass);
                                    } else {  // select row
                                        elem.data(pluginStatus)['a_selected_ids'].push(row_id);
                                        elem.data(pluginStatus)['count_selected_ids'] += 1;
                                        $(this).children("td").addClass(settings.selectedTrTdClass);
                                    }

                                    // update selected rows counter
                                    var selected_rows = elem.data(pluginStatus)['count_selected_ids'];
                                    tools_id = create_id(elem.jui_datagrid('getOption', 'tools_id_prefix'), container_id);
                                    drop_select_id = tools_id + '_drop_select';

                                    $("#" + drop_select_id + '_launcher').button({
                                        label: rsc_jui_dg.tb_selected_label + ': ' + selected_rows
                                    });

                                }

                                elem.triggerHandler("onRowClick", {});
                            });
                        }

                        // TOOLBAR EVENTS --------------------------------------

                        /* click on Preferences button */
                        if(settings.showPrefButton) {

                            selector = "#" + create_id(settings.tools_id_prefix, container_id) + '_' + 'pref';
                            elem.off('click', selector).on('click', selector, function() {

                                create_dialog_pref(container_id, pref_dialog_id);

                                var pref_tabs_id = create_id(settings.pref_tabs_id_prefix, container_id);
                                $("#" + pref_tabs_id).tabs({
                                    // just to prevent 'outline' in active tab (mainly in Chrome)
                                    create: function(event, ui) {
                                        $("#" + pref_tabs_id + ' li a').blur();
                                    },
                                    activate: function(event, ui) {
                                        $("#" + pref_tabs_id + ' li a').blur();
                                    }
                                });

                            });

                            // PREFERENCES EVENTS ------------------------------
                            var a_id_ext, a_opt, i;

                            // tools tab
                            a_id_ext = ['_btn_select', '_btn_refresh', '_btn_delete', '_btn_print', '_btn_export', '_btn_filters'];
                            a_opt = ['showSelectButtons', 'showRefreshButton', 'showDeleteButton', 'showPrintButton', 'showExportButton', 'showFiltersButton'];
                            for(i in a_id_ext) {
                                util_pref(elem, elem_pref_dialog, "#" + pref_dialog_id + a_id_ext[i], a_opt[i]);
                            }

                            // navigation tab
                            a_id_ext = ['_slider', '_goto_page', '_rows_per_page', '_rows_info', '_nav_buttons'];
                            a_opt = ['useSlider', 'showGoToPage', 'showRowsPerPage', 'showRowsInfo', 'showNavButtons'];
                            for(i in a_id_ext) {
                                util_pref_nav(elem, elem_pref_dialog, "#" + pref_dialog_id + a_id_ext[i], a_opt[i]);
                            }

                        }

                        /* Selection dropdown */
                        if(settings.showSelectButtons && settings.rowSelectionMode == 'multiple') {

                            tools_id = create_id(elem.jui_datagrid('getOption', 'tools_id_prefix'), container_id);
                            drop_select_id = tools_id + '_drop_select';

                            $("#" + drop_select_id).jui_dropdown({
                                onSelect: function(event, data) {
                                    console.log(data.index);
                                }
                            });

                            //elem_table.find("td").addClass(settings.selectedTrTdClass);
                            //elem_table.find("td").removeClass(settings.selectedTrTdClass);

                        }

                        /* click on Refresh button */
                        if(settings.showRefreshButton) {
                            selector = "#" + create_id(settings.tools_id_prefix, container_id) + '_' + 'refresh';
                            elem.off('click', selector).on('click', selector, function() {
                                $("#" + container_id).jui_datagrid('refresh');
                            });
                        }

                        /* click on Delete button */
                        if(settings.showDeleteButton) {
                            selector = "#" + create_id(settings.tools_id_prefix, container_id) + '_' + 'delete';
                            elem.off('click', selector).on('click', selector, function() {
                                elem.triggerHandler("onDelete");
                            });
                        }

                        // PAGINATION events -----------------------------------
                        if(total_rows > 0) {

                            var currentPage = settings.pageNum;
                            var rowsPerPage = settings.rowsPerPage;
                            var maxRowsPerPage = settings.maxRowsPerPage;
                            var elem_pagination = $("#" + pagination_id);
                            var showRowsInfo = elem.jui_datagrid('getPaginationOption', 'showRowsInfo');

                            elem_pagination.jui_pagination({

                                onSetRowsPerPage: function(event, rpp) {
                                    if(isNaN(rpp) || rpp <= 0) {
                                        elem.jui_datagrid('refresh');
                                    } else {
                                        maxRowsPerPage = parseInt(maxRowsPerPage);
                                        if(maxRowsPerPage > 0) {
                                            if(rpp > maxRowsPerPage) {
                                                rpp = maxRowsPerPage;
                                            }
                                        }
                                        elem.jui_datagrid({
                                            pageNum: 1,
                                            rowsPerPage: rpp
                                        });
                                    }
                                },
                                onChangePage: function(event, page_number) {
                                    elem.jui_datagrid({
                                        pageNum: page_number
                                    });
                                },
                                onDisplay: function() {
                                    if(showRowsInfo) {
                                        var page_first_row = ((currentPage - 1) * rowsPerPage) + 1;
                                        var page_last_row = Math.min(page_first_row + rowsPerPage - 1, total_rows);
                                        var rows_info = page_first_row + '-' + page_last_row + ' ' + rsc_jui_dg.rows_info_of + ' ' + total_rows + ' ' + rsc_jui_dg.rows_info_records;
                                        $(this).jui_pagination('setRowsInfo', rows_info);
                                    }
                                }
                            });
                        }

                        // JUI_DATAGRID completed
                        // trigger event onDisplay
                        elem.triggerHandler("onDisplay");

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
            return {
                pageNum: 1,
                rowsPerPage: 10,
                maxRowsPerPage: 100,

                rowSelectionMode: 'multiple', // 'multiple', 'single', 'false'

                // toolbar options
                showPrefButton: true,
                showSelectButtons: true,
                showRefreshButton: true,
                showDeleteButton: true,
                showPrintButton: true,
                showExportButton: true,
                showFiltersButton: true,
                showPrefButtonText: false,
                showRefreshButtonText: false,
                showDeleteButtonText: true,
                showPrintButtonText: false,
                showExportButtonText: false,
                showFiltersButtonText: false,

                // select dropdown options
                dropdownSelectOptions: {
                    menuClass: 'dropdown_select_menu',
                    launcherClass: 'dropdown_select_launcher'
                }, // 'launcher_id', 'launcher_container_id', 'menu_id', 'onSelect' will be ignored

                // pagination options
                usePagination: true,
                paginationOptions: {
                    visiblePageLinks: 5,
                    useSlider: true,
                    showGoToPage: false,
                    showRowsPerPage: true,
                    showRowsInfo: true,
                    showPreferences: false,
                    disableSelectionNavPane: true
                }, // 'currentPage', 'rowsPerPage', 'totalPages', 'containerClass', 'onSetRowsPerPage', 'onChangePage', 'onDisplay' will be ignored

                // main divs classes
                containerClass: 'grid_container ui-state-default ui-corner-all',
                headerClass: 'grid_geader ui-widget-header ui-corner-top',
                datagridClass: 'grid_data',
                toolsClass: 'grid_tools ui-state-default ui-corner-all',
                paginationClass: 'grid_pagination',

                // data table classes
                applyUIGridStyle: true,
                tableClass: 'grid_table',
                trHoverClass: 'ui-state-hover trhover',
                thClass: 'ui-state-default',
                tdClass: 'ui-widget-content',

                selectedTrTdClass: 'ui-state-highlight',

                //toolbar classes
                tbButtonContainer: 'tbBtnContainer',
                tbPrefIconClass: 'ui-icon-gear',
                tbRefreshIconClass: 'ui-icon-refresh',
                tbDeleteIconClass: 'ui-icon-trash',
                tbPrintIconClass: 'ui-icon-print',
                tbExportIconClass: 'ui-icon-extlink',
                tbFiltersIconClass: 'ui-icon-search',

                // elements id prefix
                datagrid_id_prefix: 'dg_',
                header_id_prefix: 'header_',
                table_id_prefix: 'tbl_',
                tools_id_prefix: 'tools_',
                pagination_id_prefix: 'pag_',

                pref_dialog_id_prefix: 'pref_dlg_',
                pref_tabs_id_prefix: 'pref_tabs_',

                onCellClick: function() {
                },
                onRowClick: function() {
                },
                onDelete: function() {
                },
                onDisplay: function() {
                }
            };
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
         * Refresh plugin
         * Usage: $(element).jui_datagrid('refresh');
         * @return {*|jQuery}
         */
        refresh: function() {
            var elem = this;
            elem.jui_datagrid();
        },

        /**
         * Destroy plugin
         * Usage: $(element).jui_datagrid('destroy');
         * @return {*|jQuery}
         */
        destroy: function() {
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
         */
        setGridStyle: function(tableClass, trHoverClass, thClass, tdClass) {
            var elem = this;
            var table_selector = '#' + create_id($(elem).jui_datagrid('getOption', 'table_id_prefix'), elem.attr("id"));

            $(table_selector).removeClass().addClass(tableClass);

            if(trHoverClass != '') {
                $(table_selector).on('mouseover mouseout', 'tbody tr', function(event) {
                    $(this).children().toggleClass(trHoverClass, event.type == 'mouseover');
                });
            }

            $(table_selector).find("th").removeClass().addClass(thClass);
            $(table_selector).find("td").removeClass().addClass(tdClass);
        },

        /**
         * Get all pagination options
         * Usage: $(element).jui_datagrid('getAllPaginationOptions');
         * @return {*}
         */
        getPaginationOption: function(opt) {
            var datagrid_container_id = this.attr("id");
            var pagination_id = $("#" + datagrid_container_id).jui_datagrid('getOption', 'pagination_id_prefix') + datagrid_container_id;
            return $("#" + pagination_id).jui_pagination('getOption', opt);
        },

        /**
         * Get all pagination options
         * Usage: $(element).jui_datagrid('getAllPaginationOptions');
         * @return {*}
         */
        getAllPaginationOptions: function() {
            var datagrid_container_id = this.attr("id");
            var pagination_id = $("#" + datagrid_container_id).jui_datagrid('getOption', 'pagination_id_prefix') + datagrid_container_id;
            return $("#" + pagination_id).jui_pagination('getAllOptions');
        }

    };

    /* private methods ------------------------------------------------------ */

    /**
     * Create element id
     * @param prefix
     * @param plugin_container_id
     * @return {*}
     */
    var create_id = function(prefix, plugin_container_id) {
        return prefix + plugin_container_id;
    };

    /**
     * DOM element with specified ID exists
     * @param elem_id
     * @return {Boolean}
     */
    var dom_element_exists = function(elem_id) {
        return ($("#" + elem_id).length === 0 ? false : true);
    };

    /**
     * jQuery UI widget exists on element with specified ID
     * @param elem_id
     * @param widget_type
     * @return {Boolean}
     */
    var jui_widget_exists = function(elem_id, widget_type) {
        if(!dom_element_exists(elem_id)) {
            return false;
        } else {
            return (typeof $("#" + elem_id).data(widget_type) === 'object' ? true : false)
        }
    };

    /**
     *
     * @param elem
     * @param elem_pref_dialog
     * @param selector
     * @param prop_name
     */
    var util_pref_nav = function(elem, elem_pref_dialog, selector, prop_name) {
        elem_pref_dialog.off('click', selector).on('click', selector, function() {
            var obj_pref_pag = {};
            obj_pref_pag[prop_name] = $(this).is(":checked");
            elem.jui_datagrid({
                paginationOptions: obj_pref_pag
            })
        });
    };

    /**
     *
     * @param elem
     * @param elem_pref_dialog
     * @param selector
     * @param prop_name
     */
    var util_pref = function(elem, elem_pref_dialog, selector, prop_name) {
        elem_pref_dialog.off('click', selector).on('click', selector, function() {
            var obj_pref = {};
            obj_pref[prop_name] = $(this).is(":checked");
            elem.jui_datagrid(obj_pref)
        });
    };

    /**
     *
     * @param chk_id
     * @param chk_label
     * @return {String}
     */
    var util_pref_li = function(chk_id, chk_label) {
        var li_html;
        li_html = '<li>';
        li_html += '<input type="checkbox" id="' + chk_id + '" /><label for="' + chk_id + '">' + chk_label + '</label>';
        li_html += '</li>';
        return li_html;
    };

    /**
     * Create preferences
     * @param plugin_container_id
     */
    var create_preferences = function(plugin_container_id) {
        var elem = $("#" + plugin_container_id);
        var prefix = elem.jui_datagrid('getOption', 'pref_dialog_id_prefix');
        var dialog_id = create_id(prefix, plugin_container_id);
        prefix = elem.jui_datagrid('getOption', 'pref_tabs_id_prefix');
        var tabs_id = create_id(prefix, plugin_container_id);

        var pref_html = '';


        pref_html += '<div id="' + tabs_id + '">';

        /* TABS ------------------------------------------------------------- */
        pref_html += '<ul>';
        pref_html += '<li><a href="#' + tabs_id + '_grid">' + rsc_jui_dg.pref_tab_grid + '</a></li>';
        pref_html += '<li><a href="#' + tabs_id + '_tools">' + rsc_jui_dg.pref_tab_tools + '</a></li>';
        pref_html += '<li><a href="#' + tabs_id + '_nav">' + rsc_jui_dg.pref_tab_nav + '</a></li>';
        pref_html += '</ul>';

        /* TAB GRID --------------------------------------------------------- */
        pref_html += '<div id="' + tabs_id + '_grid">';
        pref_html += 'Under construction 1';
        pref_html += '</div>';

        /* TAB TOOLS -------------------------------------------------------- */
        pref_html += '<div id="' + tabs_id + '_tools">';

        pref_html += '<ul style="list-style-type: none;">';
        pref_html += util_pref_li(dialog_id + '_btn_select', rsc_jui_dg.pref_show_select);
        pref_html += util_pref_li(dialog_id + '_btn_refresh', rsc_jui_dg.pref_show_refresh);
        pref_html += util_pref_li(dialog_id + '_btn_delete', rsc_jui_dg.pref_show_delete);
        pref_html += util_pref_li(dialog_id + '_btn_print', rsc_jui_dg.pref_show_print);
        pref_html += util_pref_li(dialog_id + '_btn_export', rsc_jui_dg.pref_show_export);
        pref_html += util_pref_li(dialog_id + '_btn_filters', rsc_jui_dg.pref_show_filters);
        pref_html += '</ul>';

        pref_html += '</div>';

        /* TAB NAV ---------------------------------------------------------- */
        pref_html += '<div id="' + tabs_id + '_nav">';

        pref_html += '<ul style="list-style-type: none;">';
        pref_html += util_pref_li(dialog_id + '_slider', rsc_jui_pag.pref_show_slider);
        pref_html += util_pref_li(dialog_id + '_goto_page', rsc_jui_pag.pref_show_goto_page);
        pref_html += util_pref_li(dialog_id + '_rows_per_page', rsc_jui_pag.pref_show_rows_per_page);
        pref_html += util_pref_li(dialog_id + '_rows_info', rsc_jui_pag.pref_show_rows_info);
        pref_html += util_pref_li(dialog_id + '_nav_buttons', rsc_jui_pag.pref_show_nav_buttons);
        pref_html += '</ul>';

        pref_html += '</div>';

        pref_html += '</div>';

        $("#" + dialog_id).html(pref_html);

        var a_id_ext, a_opt, i;
        /* TAB TOOLS set values --------------------------------------------- */
        a_id_ext = ['_btn_select', '_btn_refresh', '_btn_delete', '_btn_print', '_btn_export', '_btn_filters'];
        a_opt = ['showSelectButtons', 'showRefreshButton', 'showDeleteButton', 'showPrintButton', 'showExportButton', 'showFiltersButton'];

        for(i in a_id_ext) {
            $("#" + dialog_id + a_id_ext[i]).attr("checked", elem.jui_datagrid('getOption', a_opt[i]));
        }

        /* TAB NAV set values ----------------------------------------------- */
        a_id_ext = ['_slider', '_goto_page', '_rows_per_page', '_rows_info', '_nav_buttons'];
        a_opt = ['useSlider', 'showGoToPage', 'showRowsPerPage', 'showRowsInfo', 'showNavButtons'];

        for(i in a_id_ext) {
            $("#" + dialog_id + a_id_ext[i]).attr("checked", elem.jui_datagrid('getPaginationOption', a_opt[i]));
        }

    };


    /**
     *
     * @param plugin_container_id
     * @param dialog_id
     */
    var create_dialog_pref = function(plugin_container_id, dialog_id) {

        var elem_pref_dialog = $("#" + dialog_id);

        if(jui_widget_exists(dialog_id, 'dialog')) {
            elem_pref_dialog.dialog('destroy');
        }

        elem_pref_dialog.dialog({
            autoOpen: true,
            width: 400,
            height: 350,
            position: {
                my: "top",
                at: "top",
                of: '#' + plugin_container_id
            },
            title: rsc_jui_dg.preferences,
            buttons: [
                {
                    text: rsc_jui_dg.preferences_close,
                    click: function() {
                        $(this).dialog("close");
                        $(this).dialog("destroy");
                    }
                }
            ],
            open: create_preferences(plugin_container_id)
        });

    };

    /**
     * Display datagrid
     * @param container_id
     * @param total_rows
     * @param page_data
     */
    var display_grid = function(container_id, total_rows, page_data, row_primary_key) {

        var elem = $("#" + container_id);
        var page_rows = page_data.length;
        var datagrid_id = create_id(elem.jui_datagrid('getOption', 'datagrid_id_prefix'), container_id);
        var table_id = create_id(elem.jui_datagrid('getOption', 'table_id_prefix'), container_id);

        var tbl = '<table id="' + table_id + '">';

        tbl += '<thead>';
        tbl += '<tr id="' + table_id + '_tr_0">';
        $.each(page_data[0], function(index) {
            tbl += '<th>' + index + '</th>';
        });
        tbl += '<tr>';
        tbl += '</thead>';

        tbl += '<tbody>';
        for(var i = 0; i < page_rows; i++) {
            tbl += '<tr id="' + table_id + '_tr_' + page_data[i][row_primary_key] + '">';
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
                elem.jui_datagrid('getOption', 'tdClass'));
        }

    };

    /**
     *
     * @param container_id
     */
    var apply_selections = function(container_id) {
        var elem = $("#" + container_id);
        var rowSelectionMode = elem.jui_datagrid('getOption', 'rowSelectionMode');
        var selectedTrTdClass = elem.jui_datagrid('getOption', 'selectedTrTdClass');
        var table_id = create_id(elem.jui_datagrid('getOption', 'table_id_prefix'), container_id);
        var elem_table = $("#" + table_id);
        var prefix_len = (table_id + '_tr_').length;

        if(rowSelectionMode == 'multiple') {
            var selector_rows = '#' + table_id + ' tbody tr';
            $(selector_rows).each(function() {
                // get row id
                var row_id = parseInt($(this).attr("id").substr(prefix_len));

                var idx = $.inArray(row_id, elem.data(pluginStatus)['a_selected_ids']);
                if(idx > -1) {
                    $(this).children("td").addClass(selectedTrTdClass);
                }
            });

        } else {
            elem.data(pluginStatus)['a_selected_ids'] = [];
            elem.data(pluginStatus)['count_selected_ids'] = 0;
            elem_table.find("td").removeClass(selectedTrTdClass);
        }
    };

    /**
     * Display tools
     * @param container_id
     */
    var display_tools = function(container_id, total_rows) {

        var elem = $("#" + container_id);
        var tools_id = create_id(elem.jui_datagrid('getOption', 'tools_id_prefix'), container_id);
        var toolsClass = elem.jui_datagrid('getOption', 'toolsClass');

        var rowSelectionMode = elem.jui_datagrid('getOption', 'rowSelectionMode');

        var tbButtonContainer = elem.jui_datagrid('getOption', 'tbButtonContainer');

        var showPrefButton = elem.jui_datagrid('getOption', 'showPrefButton');
        var showPrefButtonText = elem.jui_datagrid('getOption', 'showPrefButtonText');
        var tbPrefIconClass = elem.jui_datagrid('getOption', 'tbPrefIconClass');

        var showSelectButtons = elem.jui_datagrid('getOption', 'showSelectButtons');

        var showRefreshButton = elem.jui_datagrid('getOption', 'showRefreshButton');
        var showRefreshButtonText = elem.jui_datagrid('getOption', 'showRefreshButtonText');
        var tbRefreshIconClass = elem.jui_datagrid('getOption', 'tbRefreshIconClass');

        var showDeleteButton = elem.jui_datagrid('getOption', 'showDeleteButton');
        var showDeleteButtonText = elem.jui_datagrid('getOption', 'showDeleteButtonText');
        var tbDeleteIconClass = elem.jui_datagrid('getOption', 'tbDeleteIconClass');

        var showPrintButton = elem.jui_datagrid('getOption', 'showPrintButton');
        var showPrintButtonText = elem.jui_datagrid('getOption', 'showPrintButtonText');
        var tbPrintIconClass = elem.jui_datagrid('getOption', 'tbPrintIconClass');

        var showExportButton = elem.jui_datagrid('getOption', 'showExportButton');
        var showExportButtonText = elem.jui_datagrid('getOption', 'showExportButtonText');
        var tbExportIconClass = elem.jui_datagrid('getOption', 'tbExportIconClass');

        var showFiltersButton = elem.jui_datagrid('getOption', 'showFiltersButton');
        var showFiltersButtonText = elem.jui_datagrid('getOption', 'showFiltersButtonText');
        var tbFiltersIconClass = elem.jui_datagrid('getOption', 'tbFiltersIconClass');

        var tools_html = '';

        if(showPrefButton) {
            tools_html += '<div class="' + tbButtonContainer + '">';

            var pref_id = tools_id + '_' + 'pref';
            tools_html += '<button id="' + pref_id + '">' + rsc_jui_dg.preferences + '</button>';

            tools_html += '</div>';
        }
        if(total_rows > 0) {
            if(showSelectButtons && rowSelectionMode == 'multiple') {

                var drop_select_id = tools_id + '_drop_select';
                var selected_rows = elem.data(pluginStatus)['count_selected_ids'];

                tools_html += '<div class="' + tbButtonContainer + '">';

                tools_html += '<div id="' + drop_select_id + '">';

                tools_html += '<div id="' + drop_select_id + '_launcher_container' + '">';
                tools_html += '<button id="' + drop_select_id + '_launcher' + '">' + rsc_jui_dg.tb_selected_label + ': ' + selected_rows + '</button>';
                tools_html += '</div>';

                tools_html += '<ul id="' + drop_select_id + '_menu' + '">';
                tools_html += '<li id="' + drop_select_id + '_all_in_page' + '"><a href="javascript:void(0);">' + rsc_jui_dg.tb_select_all_in_page + '</a></li>';
                tools_html += '<li id="' + drop_select_id + '_none_in_page' + '"><a href="javascript:void(0);">' + rsc_jui_dg.tb_select_none_in_page + '</a></li>';
                tools_html += '<li id="' + drop_select_id + '_inv_in_page' + '"><a href="javascript:void(0);">' + rsc_jui_dg.tb_select_inverse_in_page + '</a></li>';
                tools_html += '<hr>';
                tools_html += '<li id="' + drop_select_id + '_none' + '"><a href="javascript:void(0);">' + rsc_jui_dg.tb_select_none + '</a></li>';
                tools_html += '</ul>';

                tools_html += '</div>';

                tools_html += '</div>';
            }
        }

        if(showRefreshButton) {
            tools_html += '<div class="' + tbButtonContainer + '">';

            var refresh_id = tools_id + '_' + 'refresh';
            tools_html += '<button id="' + refresh_id + '">' + rsc_jui_dg.tb_refresh + '</button>';

            tools_html += '</div>';
        }

        if(total_rows > 0) {
            if(showDeleteButton) {
                tools_html += '<div class="' + tbButtonContainer + '">';

                var delete_id = tools_id + '_' + 'delete';
                tools_html += '<button id="' + delete_id + '">' + rsc_jui_dg.tb_delete + '</button>';

                tools_html += '</div>';
            }
        }

        if(total_rows > 0) {
            if(showPrintButton || showExportButton) {
                tools_html += '<div class="' + tbButtonContainer + '">';
            }

            if(showPrintButton) {
                var print_id = tools_id + '_' + 'print';
                tools_html += '<button id="' + print_id + '">' + rsc_jui_dg.tb_print + '</button>';
            }

            if(showExportButton) {
                var export_id = tools_id + '_' + 'export';
                tools_html += '<button id="' + export_id + '">' + rsc_jui_dg.tb_export + '</button>';
            }


            if(showPrintButton || showExportButton) {
                tools_html += '</div>';
            }
        }

        if(showFiltersButton) {
            tools_html += '<div class="' + tbButtonContainer + '">';

            var filters_id = tools_id + '_' + 'filters';
            tools_html += '<button id="' + filters_id + '">' + rsc_jui_dg.tb_filters + '</button>';

            tools_html += '</div>';
        }


        $("#" + tools_id).html(tools_html);

        if(showPrefButton) {
            $("#" + pref_id).button({
                label: rsc_jui_dg.preferences,
                text: showPrefButtonText,
                icons: {
                    primary: tbPrefIconClass
                }
            });
        }

        if(total_rows > 0) {
            if(showSelectButtons && rowSelectionMode == 'multiple') {

                var elem_dropdown_select = $("#" + drop_select_id);

                // fixed dropdown options
                var launcher_id = drop_select_id + '_launcher';
                var launcher_container_id = drop_select_id + '_launcher_container';
                var menu_id = drop_select_id + '_menu';

                // CREATE DROPDOWN OPTIONS
                var given_dropdown_select_options = elem.jui_datagrid('getOption', 'dropdownSelectOptions');
                // remove unacceptable settings
                var internal_defined = ['launcher_id', 'launcher_container_id', 'menu_id', 'onSelect'];
                for(var i in internal_defined) {
                    if(typeof(given_dropdown_select_options[internal_defined[i]]) != 'undefined') {
                        delete given_dropdown_select_options[internal_defined[i]];
                    }
                }

                var dropdown_select_options = elem_dropdown_select.data('jui_dropdown');
                if(typeof(dropdown_select_options) === 'undefined') {
                    var default_options = elem.jui_datagrid('getDefaults');
                    var default_dropdown_select_options = default_options.dropdownSelectOptions;
                    dropdown_select_options = $.extend({}, default_dropdown_select_options, given_dropdown_select_options);

                } else {
                    dropdown_select_options = $.extend({}, dropdown_select_options, given_dropdown_select_options);
                }

                var internal_pagination_options = {
                    launcher_id: launcher_id,
                    launcher_container_id: launcher_container_id,
                    menu_id: menu_id
                };

                dropdown_select_options = $.extend({}, dropdown_select_options, internal_pagination_options);

                elem_dropdown_select.jui_dropdown(dropdown_select_options);

            }
        }

        if(showRefreshButton) {
            $("#" + refresh_id).button({
                label: rsc_jui_dg.tb_refresh,
                text: showRefreshButtonText,
                icons: {
                    primary: tbRefreshIconClass
                }
            });
        }
        if(total_rows > 0) {
            if(showDeleteButton) {
                $("#" + delete_id).button({
                    label: rsc_jui_dg.tb_delete,
                    text: showDeleteButtonText,
                    icons: {
                        primary: tbDeleteIconClass
                    }
                });
            }
        }

        if(total_rows > 0) {
            if(showPrintButton) {
                $("#" + print_id).button({
                    label: rsc_jui_dg.tb_print,
                    text: showPrintButtonText,
                    icons: {
                        primary: tbPrintIconClass
                    }
                });
            }

            if(showExportButton) {
                $("#" + export_id).button({
                    label: rsc_jui_dg.tb_export,
                    text: showExportButtonText,
                    icons: {
                        primary: tbExportIconClass
                    }
                });
            }
        }

        if(showFiltersButton) {
            $("#" + filters_id).button({
                label: rsc_jui_dg.tb_filters,
                text: showFiltersButtonText,
                icons: {
                    primary: tbFiltersIconClass
                }
            });
        }

    };

    /**
     * Display pagination
     * @param container_id
     * @param total_rows
     */
    var display_pagination = function(container_id, total_rows) {

        var elem = $("#" + container_id);

        // fixed pagination options
        var currentPage = elem.jui_datagrid('getOption', 'pageNum');
        var rowsPerPage = elem.jui_datagrid('getOption', 'rowsPerPage');
        var maxRowsPerPage = elem.jui_datagrid('getOption', 'maxRowsPerPage');
        var total_pages = Math.ceil(total_rows / rowsPerPage);
        var paginationClass = elem.jui_datagrid('getOption', 'paginationClass');

        var pagination_id = create_id(elem.jui_datagrid('getOption', 'pagination_id_prefix'), container_id);
        var elem_pagination = $("#" + pagination_id);

        // CREATE PAGINATION OPTIONS
        var given_pagination_options = elem.jui_datagrid('getOption', 'paginationOptions');
        // remove unacceptable settings
        var internal_defined = ['currentPage', 'rowsPerPage', 'totalPages', 'containerClass', 'onSetRowsPerPage', 'onChangePage', 'onDisplay'];
        for(var i in internal_defined) {
            if(typeof(given_pagination_options[internal_defined[i]]) != 'undefined') {
                delete given_pagination_options[internal_defined[i]];
            }
        }

        var pagination_options = elem_pagination.data('jui_pagination');
        if(typeof(pagination_options) === 'undefined') {
            var default_options = elem.jui_datagrid('getDefaults');
            var default_pagination_options = default_options.paginationOptions;
            pagination_options = $.extend({}, default_pagination_options, given_pagination_options);

        } else {
            pagination_options = $.extend({}, pagination_options, given_pagination_options);
        }

        var internal_pagination_options = {
            currentPage: currentPage,
            rowsPerPage: rowsPerPage,
            totalPages: total_pages,
            containerClass: paginationClass
        };

        pagination_options = $.extend({}, pagination_options, internal_pagination_options);

        elem_pagination.jui_pagination(pagination_options);

    };

    /**
     * Display datagrid with no rows
     * @param container_id
     */
    var display_no_data = function(container_id) {

        var elem = $("#" + container_id);
        var datagrid_id = elem.jui_datagrid('getOption', 'datagrid_id_prefix') + container_id;
        var pagination_id = elem.jui_datagrid('getOption', 'pagination_id_prefix') + container_id;

        $("#" + datagrid_id).html(rsc_jui_dg.no_records_found);
        $("#" + pagination_id).hide();

    };


    $.fn.jui_datagrid = function(method) {

        if(this.size() != 1) {
            var err_msg = 'You must use this plugin (' + pluginName + ') with a unique element (at once)';
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