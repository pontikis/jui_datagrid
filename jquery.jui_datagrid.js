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

    var pluginName = 'jui_datagrid',
        pluginStatus = 'jui_datagrid_status';

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

                    if($.browser.mozilla || ($.browser.msie && parseInt($.browser.version) >= 10)) {
                        elem.data(pluginStatus)['fix_border_collapse_td_width'] = 0;
                    } else {
                        elem.data(pluginStatus)['fix_border_collapse_td_width'] = settings.fix_border_collapse_td_width;
                    }
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
                var caption_id = create_id(settings.caption_id_prefix, container_id),
                    datagrid_header_id = create_id(settings.datagrid_header_id_prefix, container_id),
                    datagrid_id = create_id(settings.datagrid_id_prefix, container_id),
                    tools_id = create_id(settings.tools_id_prefix, container_id),
                    pagination_id = create_id(settings.pagination_id_prefix, container_id),
                    pref_dialog_id = create_id(settings.pref_dialog_id_prefix, container_id),
                    sort_dialog_id = create_id(settings.sort_dialog_id_prefix, container_id),
                    elem_html;

                if(!elem.data(pluginStatus)['initialize']) {

                    elem_html = '<div id="' + caption_id + '">' + settings.caption + '</div>';
                    elem_html += '<div id="' + datagrid_header_id + '"></div>';
                    elem_html += '<div id="' + datagrid_id + '"></div>';
                    elem_html += '<div id="' + tools_id + '"></div>';
                    elem_html += '<div id="' + pagination_id + '"></div>';
                    elem_html += '<div id="' + pref_dialog_id + '"></div>';
                    elem_html += '<div id="' + sort_dialog_id + '"></div>';
                    elem.html(elem_html);

                    elem.data(pluginStatus)['initialize'] = true;
                }

                var elem_caption = $("#" + caption_id),
                    elem_grid_header = $("#" + datagrid_header_id),
                    elem_grid = $("#" + datagrid_id),
                    elem_tools = $("#" + tools_id),
                    elem_pag = $("#" + pagination_id),
                    elem_pref_dialog = $("#" + pref_dialog_id),
                    elem_sort_dialog = $("#" + sort_dialog_id);

                // apply style
                elem.removeClass().addClass(settings.containerClass);

                if(typeof settings.caption === 'undefined') {
                    elem_caption.hide();
                } else {
                    elem_caption.show().text(settings.caption).removeClass().addClass(settings.captionClass);
                }
                elem_grid_header.removeClass().addClass(settings.datagridHeaderClass);
                elem_grid.removeClass().addClass(settings.datagridClass);
                elem_tools.removeClass().addClass(settings.toolsClass);
                elem_pag.removeClass().addClass(settings.paginationClass);

                elem_pref_dialog.removeClass().addClass(settings.dlgPrefClass);
                elem_sort_dialog.removeClass().addClass(settings.dlgSortClass);

                // fetch data and display datagrid
                $.ajax({
                    type: 'POST',
                    url: settings.ajaxFetchDataURL,
                    data: {
                        page_num: settings.pageNum,
                        rows_per_page: settings.rowsPerPage,
                        sorting: settings.sorting
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
                            apply_selections(container_id, row_primary_key);
                            display_tools(container_id, total_rows, row_primary_key);
                            display_pagination(container_id, total_rows);
                        }

                        /**
                         * *****************************************************
                         * EVENTS HANDLING
                         * *****************************************************
                         */
                        var selector, tools_id, drop_select_id, row_prefix_len;

                        // GRID EVENTS -------------------------------------
                        if(total_rows > 0) {
                            var table_id = create_id(elem.jui_datagrid('getOption', 'table_id_prefix'), container_id),
                                elem_table = $("#" + table_id),
                                col_index, row_index;
                            row_prefix_len = (table_id + '_tr_').length;

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

                                if(row_primary_key) {
                                    var row_id = parseInt($(this).attr("id").substr(row_prefix_len)),
                                        row_status;

                                    if(settings.rowSelectionMode === false) {
                                        rows_all_deselect(container_id);
                                        row_status = 'clicked';
                                    } else {
                                        if(settings.rowSelectionMode == 'single') {
                                            rows_all_deselect(container_id);
                                            row_status = 'selected';
                                        }

                                        var idx = $.inArray(row_id, elem.data(pluginStatus)['a_selected_ids']);
                                        if(idx > -1) {
                                            row_deselect(container_id, row_id, idx);
                                            row_status = 'deselected';
                                        } else {
                                            row_select(container_id, row_id);
                                            row_status = 'selected';
                                        }
                                    }
                                    update_selected_rows_counter(container_id);
                                }

                                elem.triggerHandler("onRowClick", {row_id: row_id, row_status: row_status});
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

                                var col_order_list_id = create_id(elem.jui_datagrid('getOption', 'col_order_list_id_prefix'), container_id),
                                    elem_col_order = $("#" + col_order_list_id),
                                    startPos, newPos, columns, newColumns, col_visible_index;

                                elem_col_order.sortable({
                                    cancel: ".ui-state-disabled",
                                    start: function(event, ui) {
                                        startPos = ui.item.index();
                                    },
                                    stop: function(event, ui) {
                                        newPos = ui.item.index();
                                        if(newPos !== startPos) {

                                            columns = elem.jui_datagrid("getOption", "columns");
                                            newColumns = [];

                                            if(newPos > startPos) {
                                                for(i in columns) {
                                                    if(i < startPos || i > newPos) {
                                                        newColumns[i] = columns[i];
                                                    }
                                                    if(i >= startPos && i < newPos) {
                                                        newColumns[i] = columns[parseInt(i) + 1];
                                                    }
                                                    if(i == newPos) {
                                                        newColumns[i] = columns[startPos];
                                                    }
                                                }
                                            }

                                            if(newPos < startPos) {
                                                for(i in columns) {
                                                    if(i > startPos || i < newPos) {
                                                        newColumns[i] = columns[i];
                                                    }
                                                    if(i <= startPos && i > newPos) {
                                                        newColumns[i] = columns[parseInt(i) - 1];
                                                    }
                                                    if(i == newPos) {
                                                        newColumns[i] = columns[startPos];
                                                    }
                                                }
                                            }

                                            elem.jui_datagrid({
                                                columns: newColumns
                                            });

                                        }
                                    }
                                }).disableSelection();

                                selector = 'input[type=checkbox]';
                                elem_col_order.off('click', selector).on('click', selector, function() {
                                    col_visible_index = parseInt($(this).index("#" + col_order_list_id + ' ' + selector));

                                    $("#" + col_order_list_id + ' li').eq(col_visible_index).toggleClass("ui-state-disabled");

                                    newColumns = elem.jui_datagrid("getOption", "columns");
                                    newColumns[col_visible_index]["visible"] = $(this).is(":checked") ? 'yes' : 'no';
                                    elem.jui_datagrid({
                                        columns: newColumns
                                    });

                                });

                            });

                            // PREFERENCES EVENTS ------------------------------
                            var a_id_ext, a_opt, i;

                            // tools grid
                            a_id_ext = ['_row_numbers'];
                            a_opt = ['showRowNumbers'];
                            for(i in a_id_ext) {
                                util_pref(elem, elem_pref_dialog, "#" + pref_dialog_id + a_id_ext[i], a_opt[i]);
                            }

                            // tools tab
                            a_id_ext = ['_btn_select', '_btn_refresh', '_btn_delete', '_btn_print', '_btn_export', '_btn_sorting', '_btn_filters'];
                            a_opt = ['showSelectButtons', 'showRefreshButton', 'showDeleteButton', 'showPrintButton', 'showExportButton', 'showSortingButton', 'showFiltersButton'];
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
                        if(settings.showSelectButtons && settings.rowSelectionMode == 'multiple' && row_primary_key) {
                            row_prefix_len = (table_id + '_tr_').length;
                            var elem_row = $("#" + table_id + ' tbody tr');
                            tools_id = create_id(elem.jui_datagrid('getOption', 'tools_id_prefix'), container_id);
                            drop_select_id = tools_id + '_drop_select';
                            var SELECT = {
                                'all_in_page': 1,
                                'none_in_page': 2,
                                'inv_in_page': 3,
                                'none': 4
                            };

                            $("#" + drop_select_id).jui_dropdown({
                                onSelect: function(event, data) {
                                    var do_select = data.index;
                                    switch(do_select) {
                                        case SELECT.all_in_page:
                                        case SELECT.none_in_page:
                                        case SELECT.inv_in_page:
                                            elem_row.each(function() {
                                                // get row id
                                                var row_id = parseInt($(this).attr("id").substr(row_prefix_len));
                                                var idx = $.inArray(row_id, elem.data(pluginStatus)['a_selected_ids']);

                                                if(do_select == SELECT.all_in_page) {
                                                    if(idx > -1) {
                                                    } else {
                                                        row_select(container_id, row_id);
                                                    }
                                                } else if(do_select == SELECT.none_in_page) {
                                                    if(idx > -1) {
                                                        row_deselect(container_id, row_id, idx);
                                                    }
                                                } else if(do_select == SELECT.inv_in_page) {
                                                    if(idx > -1) {
                                                        row_deselect(container_id, row_id, idx);
                                                    } else {
                                                        row_select(container_id, row_id);
                                                    }
                                                }
                                            });
                                            break;
                                        case SELECT.none:
                                            rows_all_deselect(container_id);
                                            break;
                                    }
                                    update_selected_rows_counter(container_id);
                                }
                            });
                        }

                        /* click on Refresh button */
                        if(settings.showRefreshButton) {
                            selector = "#" + create_id(settings.tools_id_prefix, container_id) + '_' + 'refresh';
                            elem.off('click', selector).on('click', selector, function() {
                                $("#" + container_id).jui_datagrid('refresh');
                            });
                        }

                        /* click on Delete button */
                        if(settings.showDeleteButton && row_primary_key) {
                            selector = "#" + create_id(settings.tools_id_prefix, container_id) + '_' + 'delete';
                            elem.off('click', selector).on('click', selector, function() {
                                elem.triggerHandler("onDelete");
                            });
                        }

                        /* click on sorting button*/
                        if(settings.showSortingButton) {

                            selector = "#" + create_id(settings.tools_id_prefix, container_id) + '_' + 'sorting';
                            elem.off('click', selector).on('click', selector, function() {

                                create_dialog_sort(container_id, sort_dialog_id);

                                var sorting_list_id = create_id(elem.jui_datagrid('getOption', 'sorting_list_id_prefix'), container_id),
                                    elem_sorting = $("#" + sorting_list_id),
                                    startPos, newPos, sorting, newSorting, col_visible_index;

                                elem_sorting.sortable({
                                    cancel: ".ui-state-disabled",
                                    start: function(event, ui) {
                                        startPos = ui.item.index();
                                    },
                                    stop: function(event, ui) {
                                        newPos = ui.item.index();
                                        if(newPos !== startPos) {

                                            sorting = elem.jui_datagrid("getOption", "sorting");
                                            newSorting = [];

                                            if(newPos > startPos) {
                                                for(i in sorting) {
                                                    if(i < startPos || i > newPos) {
                                                        newSorting[i] = sorting[i];
                                                    }
                                                    if(i >= startPos && i < newPos) {
                                                        newSorting[i] = sorting[parseInt(i) + 1];
                                                    }
                                                    if(i == newPos) {
                                                        newSorting[i] = sorting[startPos];
                                                    }
                                                }
                                            }

                                            if(newPos < startPos) {
                                                for(i in sorting) {
                                                    if(i > startPos || i < newPos) {
                                                        newSorting[i] = sorting[i];
                                                    }
                                                    if(i <= startPos && i > newPos) {
                                                        newSorting[i] = sorting[parseInt(i) - 1];
                                                    }
                                                    if(i == newPos) {
                                                        newSorting[i] = sorting[startPos];
                                                    }
                                                }
                                            }

                                            elem.jui_datagrid({
                                                sorting: newSorting
                                            });

                                        }
                                    }
                                }).disableSelection();

                                selector = 'input[type=radio]';
                                elem_sorting.off('click', selector).on('click', selector, function() {
                                    var radio_index = parseInt($(this).index("#" + sorting_list_id + ' ' + selector));
                                    console.log(radio_index);
                                    //console.log($(this).parent("li").index());

/*                                    radio_index = parseInt($(this).index("#" + sorting_list_id + ' ' + selector));

                                    $("#" + col_order_list_id + ' li').eq(col_visible_index).toggleClass("ui-state-disabled");

                                    newSorting = elem.jui_datagrid("getOption", "sorting");
                                    newSorting[col_visible_index]["visible"] = $(this).is(":checked") ? 'yes' : 'no';
                                    elem.jui_datagrid({
                                        sorting: newSorting
                                    });*/

                                });

                            });
                        }

                        // PAGINATION events -----------------------------------
                        if(total_rows > 0) {

                            var currentPage = settings.pageNum,
                                rowsPerPage = settings.rowsPerPage,
                                maxRowsPerPage = settings.maxRowsPerPage,
                                elem_pagination = $("#" + pagination_id),
                                showRowsInfo = elem.jui_datagrid('getPaginationOption', 'showRowsInfo');

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
                                        var page_first_row = ((currentPage - 1) * rowsPerPage) + 1,
                                            page_last_row = Math.min(page_first_row + rowsPerPage - 1, total_rows),
                                            rows_info = page_first_row + '-' + page_last_row + ' ' + rsc_jui_dg.rows_info_of + ' ' + total_rows + ' ' + rsc_jui_dg.rows_info_records;
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

                columns: [
                    {field: "", visible: "no", "header": '', "headerClass": "", "dataClass": ""}
                ],

                sorting: [
                    {"sortingName": "", field: "", order: ""}
                ],

                filters: [
                    {"filterName": "", "filterType": "", field: "", operator: "",
                        value: "", value_range: {lower: "", upper: ""}, value_array: [],
                        foreignKey: {ref_table: "", ref_pk: "", ref_col: "", condition: ""},
                        ajax_autocomplete_url: ""
                    }
                ],

                pageNum: 1,
                rowsPerPage: 10,
                maxRowsPerPage: 100,

                rowSelectionMode: 'multiple', // 'multiple', 'single', 'false'

                autoSetColumnsWidth: true,
                showRowNumbers: false,
                showSortingIndicator: true,

                // toolbar options
                showPrefButton: true,
                showSelectButtons: true,
                showRefreshButton: true,
                showDeleteButton: true,
                showPrintButton: true,
                showExportButton: true,
                showSortingButton: true,
                showFiltersButton: true,
                showPrefButtonText: false,
                showRefreshButtonText: false,
                showDeleteButtonText: false,
                showPrintButtonText: false,
                showExportButtonText: false,
                showSortingButtonText: false,
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
                captionClass: 'grid_caption ui-widget-header ui-corner-top',
                datagridHeaderClass: 'grid_header ui-state-default',
                datagridClass: 'grid_data ui-widget-content',
                toolsClass: 'grid_tools ui-state-default ui-corner-all',
                paginationClass: 'grid_pagination',

                // data table classes
                headerTableClass: 'grid_header_table',
                dataTableClass: 'grid_data_table',
                trHoverTrClass: '',
                trHoverTdClass: 'ui-state-hover',
                thClass: 'grid_th_common ui-state-default',
                tdClass: 'grid_td_common ui-widget-content',
                thRowNumberClass: 'grid_th_common grid_th_row_number ui-state-default',
                tdRowNumberClass: 'grid_td_common grid_td_row_number ui-widget-content',

                rowIndexHeaderClass: '',
                rowIndexClass: '',

                selectedTrTrClass: '',
                selectedTrTdClass: 'ui-state-highlight',

                //toolbar classes
                tbButtonContainer: 'tbBtnContainer',
                tbPrefIconClass: 'ui-icon-gear',
                tbRefreshIconClass: 'ui-icon-refresh',
                tbDeleteIconClass: 'ui-icon-trash',
                tbPrintIconClass: 'ui-icon-print',
                tbExportIconClass: 'ui-icon-extlink',
                tbSortingIconClass: 'ui-icon ui-icon-carat-2-n-s',
                tbFiltersIconClass: 'ui-icon-search',

                //sortable list classes
                sortableListClass: 'grid_sortable_list',
                sortableListLiClass: 'ui-state-default grid_sortable_list_li',
                sortableListLiDisabledClass: 'ui-state-disabled',
                sortableListLiIconClass: 'ui-icon ui-icon-arrowthick-2-n-s grid_sortable_list_li_icon',

                // common list
                commonListClass: 'grid_common_list',

                // dialog Preferences
                dlgPrefClass: 'dlg_pref',
                dlgPrefButtonClass: 'dlg_pref_button',

                // dialog Preferences
                dlgSortClass: 'dlg_sort',
                dlgSortButtonClass: 'dlg_sort_button',

                // elements id prefix
                caption_id_prefix: 'caption_',
                datagrid_header_id_prefix: 'dgh_',
                datagrid_id_prefix: 'dg_',
                table_id_prefix: 'tbl_',
                header_table_id_prefix: 'tblh_',
                tools_id_prefix: 'tools_',
                pagination_id_prefix: 'pag_',

                pref_dialog_id_prefix: 'pref_dlg_',
                pref_tabs_id_prefix: 'pref_tabs_',

                //column order list prefix
                col_order_list_id_prefix: 'col_order_',
                col_visible_chk_id_prefix: 'col_visible_',

                sort_dialog_id_prefix: 'sort_dlg_',

                //sorting list prefix
                sorting_list_id_prefix: 'sort_criteria_',
                sort_radio_name_prefix: 'sort_order_',
                sort_asc_radio_id_prefix: 'sort_asc_',
                sort_desc_radio_id_prefix: 'sort_desc_',
                sort_none_radio_id_prefix: 'sort_none_',

                fix_border_collapse_td_width: 1, // FF, MSIE >= 10 seems to return correct computed td width while Chrome <=23, MSIE <=9 and Opera one pixel less

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
                var $this = $(this),
                    datagrid_container_id = $this.attr("id"),
                    pagination_container_id = $this.jui_datagrid('getOption', 'pagination_id_prefix') + datagrid_container_id;

                $("#" + pagination_container_id).removeData();
                $this.removeData();
            });
        },


        /**
         *
         * @return {*}
         */
        getSelectedIDs: function() {
            var elem = this;
            return elem.data(pluginStatus)["a_selected_ids"];
        },

        /**
         *
         * @return {*}
         */
        getGridElemTableID: function() {
            var elem = this;
            return create_id(elem.jui_datagrid("getOption", "table_id_prefix"), elem.attr("id"));
        },


        /**
         *
         * @return {*}
         */
        getGridElemHeaderTableID: function() {
            var elem = this;
            return create_id(elem.jui_datagrid("getOption", "header_table_id_prefix"), elem.attr("id"));
        },


        /**
         *
         * @param col_index
         * @param headerClass
         * @param dataClass
         * @param sync_col_width
         */
        setPageColClass: function(col_index, headerClass, dataClass, sync_col_width) {
            var elem = this,
                container_id = elem.attr("id"),
                header_table_selector = '#' + create_id(elem.jui_datagrid('getOption', 'header_table_id_prefix'), container_id),
                data_table_selector = '#' + create_id(elem.jui_datagrid('getOption', 'table_id_prefix'), container_id);

            $(header_table_selector + ' th').eq(col_index).addClass(headerClass);
            $(data_table_selector + ' tr').each(function() {
                $(this).find("td").eq(col_index).addClass(dataClass);
            });

            if(sync_col_width) {
                sync_thead_tbody_column_width(container_id);
            }

        },

        /**
         *
         * @param col_index
         * @param headerClass
         * @param dataClass
         * @param sync_col_width
         */
        removePageColClass: function(col_index, headerClass, dataClass, sync_col_width) {
            var elem = this,
                container_id = elem.attr("id"),
                header_table_selector = '#' + create_id(elem.jui_datagrid('getOption', 'header_table_id_prefix'), container_id),
                data_table_selector = '#' + create_id(elem.jui_datagrid('getOption', 'table_id_prefix'), container_id);

            $(header_table_selector + ' th').eq(col_index).removeClass(headerClass);
            $(data_table_selector + ' tr').each(function() {
                $(this).find("td").eq(col_index).removeClass(dataClass);
            });

            if(sync_col_width) {
                sync_thead_tbody_column_width(container_id);
            }

        },

        /**
         * Get all pagination options
         * Usage: $(element).jui_datagrid('getAllPaginationOptions');
         * @return {*}
         */
        getPaginationOption: function(opt) {
            var datagrid_container_id = this.attr("id"),
                pagination_id = $("#" + datagrid_container_id).jui_datagrid('getOption', 'pagination_id_prefix') + datagrid_container_id;
            return $("#" + pagination_id).jui_pagination('getOption', opt);
        },

        /**
         * Get all pagination options
         * Usage: $(element).jui_datagrid('getAllPaginationOptions');
         * @return {*}
         */
        getAllPaginationOptions: function() {
            var datagrid_container_id = this.attr("id"),
                pagination_id = $("#" + datagrid_container_id).jui_datagrid('getOption', 'pagination_id_prefix') + datagrid_container_id;
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
     *
     * @param elem_btn
     * @param label_text
     * @param show_label
     * @param icon_class
     */
    var util_tools_btn = function(elem_btn, label_text, show_label, icon_class) {
        elem_btn.button({
            label: label_text,
            text: show_label,
            icons: {
                primary: icon_class
            }
        });
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
     *
     * @param sorting
     * @param field
     * @return {String}
     */
    var get_sorting_indicator = function(sorting, field) {
        var sorting_indicator = '';
        for (var i in sorting) {
            if(sorting[i].field == field) {
                if(sorting[i].order == 'ascending') {
                    sorting_indicator = '&nbsp;&uarr;';
                } else if(sorting[i].order == 'descending') {
                    sorting_indicator = '&nbsp;&darr;';
                }
                break;
            }
        }
        return sorting_indicator;
    }

    /**
     * Create preferences
     * @param plugin_container_id
     */
    var create_preferences = function(plugin_container_id) {
        var elem = $("#" + plugin_container_id),
            pref_dialog_id_prefix = elem.jui_datagrid('getOption', 'pref_dialog_id_prefix'),
            dialog_id = create_id(pref_dialog_id_prefix, plugin_container_id),
            pref_tabs_id_prefix = elem.jui_datagrid('getOption', 'pref_tabs_id_prefix'),
            tabs_id = create_id(pref_tabs_id_prefix, plugin_container_id),

            commonListClass = elem.jui_datagrid('getOption', 'commonListClass'),

            columns = elem.jui_datagrid('getOption', 'columns'),

            sortableListClass = elem.jui_datagrid('getOption', 'sortableListClass'),
            sortableListLiClass = elem.jui_datagrid('getOption', 'sortableListLiClass'),
            sortableListLiDisabledClass = elem.jui_datagrid('getOption', 'sortableListLiDisabledClass'),
            sortableListLiIconClass = elem.jui_datagrid('getOption', 'sortableListLiIconClass'),
            col_order_list_id = create_id(elem.jui_datagrid('getOption', 'col_order_list_id_prefix'), plugin_container_id),
            col_visible_chk_id_prefix = create_id(elem.jui_datagrid('getOption', 'col_visible_chk_id_prefix'), plugin_container_id) + '_',
            col_visible_id, col_checked, col_disabled,

            i,
            pref_html = '',

            a_id_ext, a_opt;

        pref_html += '<div id="' + tabs_id + '">';

        /* TABS ------------------------------------------------------------- */
        pref_html += '<ul>';
        pref_html += '<li><a href="#' + tabs_id + '_grid">' + rsc_jui_dg.pref_tab_grid + '</a></li>';
        pref_html += '<li><a href="#' + tabs_id + '_tools">' + rsc_jui_dg.pref_tab_tools + '</a></li>';
        pref_html += '<li><a href="#' + tabs_id + '_nav">' + rsc_jui_dg.pref_tab_nav + '</a></li>';
        pref_html += '</ul>';

        /* TAB GRID --------------------------------------------------------- */
        pref_html += '<div id="' + tabs_id + '_grid">';

        pref_html += '<ul class="' + commonListClass + '" style="margin-bottom: 20px;">';
        pref_html += util_pref_li(dialog_id + '_row_numbers', rsc_jui_dg.pref_show_row_numbers);
        pref_html += '</ul>';

        pref_html += '<p>' + rsc_jui_dg.pref_col_order_visibility + '</p>';
        pref_html += '<ul id="' + col_order_list_id + '" class="' + sortableListClass + '">';
        for(i in columns) {
            col_disabled = columns[i]["visible"] == 'no' ? ' ' + sortableListLiDisabledClass : '';
            col_checked = columns[i]["visible"] == 'no' ? '' : ' checked="checked"';
            col_visible_id = col_visible_chk_id_prefix + i;
            pref_html += '<li class="' + sortableListLiClass + col_disabled + '">' +
                '<span class="' + sortableListLiIconClass + '"></span>' +
                '<input type="checkbox" id="' + col_visible_id + '"' + col_checked + '>' +
                '<label for="' + col_visible_id + '">' + columns[i].header + '</label>' +
                '</li>';
        }
        pref_html += '</ul>';

        pref_html += '</div>';

        /* TAB TOOLS -------------------------------------------------------- */
        pref_html += '<div id="' + tabs_id + '_tools">';

        pref_html += '<ul style="list-style-type: none;">';
        pref_html += util_pref_li(dialog_id + '_btn_select', rsc_jui_dg.pref_show_select);
        pref_html += util_pref_li(dialog_id + '_btn_refresh', rsc_jui_dg.pref_show_refresh);
        pref_html += util_pref_li(dialog_id + '_btn_delete', rsc_jui_dg.pref_show_delete);
        pref_html += util_pref_li(dialog_id + '_btn_print', rsc_jui_dg.pref_show_print);
        pref_html += util_pref_li(dialog_id + '_btn_export', rsc_jui_dg.pref_show_export);
        pref_html += util_pref_li(dialog_id + '_btn_sorting', rsc_jui_dg.pref_show_sorting);
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

        /* TAB GRID set values --------------------------------------------- */
        a_id_ext = ['_row_numbers'];
        a_opt = ['showRowNumbers'];

        for(i in a_id_ext) {
            $("#" + dialog_id + a_id_ext[i]).attr("checked", elem.jui_datagrid('getOption', a_opt[i]));
        }

        /* TAB TOOLS set values --------------------------------------------- */
        a_id_ext = ['_btn_select', '_btn_refresh', '_btn_delete', '_btn_print', '_btn_export', '_btn_sorting', '_btn_filters'];
        a_opt = ['showSelectButtons', 'showRefreshButton', 'showDeleteButton', 'showPrintButton', 'showExportButton', 'showSortingButton', 'showFiltersButton'];

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

        var elem = $("#" + plugin_container_id),
            elem_pref_dialog = $("#" + dialog_id),
            dlgPrefButtonClass = elem.jui_datagrid("getOption", "dlgPrefButtonClass");

        if(jui_widget_exists(dialog_id, 'dialog')) {
            elem_pref_dialog.dialog('destroy');
        }

        elem_pref_dialog.dialog({
            autoOpen: true,
            width: 400,
            height: 'auto',
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
            open: create_preferences(plugin_container_id),
            create: function() {
                $(this).closest(".ui-dialog")
                    .find(".ui-button")
                    .addClass(dlgPrefButtonClass);
            }
        });

    };


    /**
     * Create sorting
     * @param plugin_container_id
     */
    var create_sorting = function(plugin_container_id) {
        var elem = $("#" + plugin_container_id),
            sort_dialog_id_prefix = elem.jui_datagrid('getOption', 'sort_dialog_id_prefix'),
            dialog_id = create_id(sort_dialog_id_prefix, plugin_container_id),

            commonListClass = elem.jui_datagrid('getOption', 'commonListClass'),

            sorting = elem.jui_datagrid('getOption', 'sorting'),

            sortableListClass = elem.jui_datagrid('getOption', 'sortableListClass'),
            sortableListLiClass = elem.jui_datagrid('getOption', 'sortableListLiClass'),
            sortableListLiDisabledClass = elem.jui_datagrid('getOption', 'sortableListLiDisabledClass'),
            sortableListLiIconClass = elem.jui_datagrid('getOption', 'sortableListLiIconClass'),

            sorting_list_id = create_id(elem.jui_datagrid('getOption', 'sorting_list_id_prefix'), plugin_container_id),
            sort_radio_name_prefix = create_id(elem.jui_datagrid('getOption', 'sort_radio_name_prefix'), plugin_container_id) + '_',
            sort_radio_name,
            sort_asc_radio_id_prefix = create_id(elem.jui_datagrid('getOption', 'sort_asc_radio_id_prefix'), plugin_container_id) + '_',
            sort_desc_radio_id_prefix = create_id(elem.jui_datagrid('getOption', 'sort_desc_radio_id_prefix'), plugin_container_id) + '_',
            sort_none_radio_id_prefix = create_id(elem.jui_datagrid('getOption', 'sort_none_radio_id_prefix'), plugin_container_id) + '_',
            sort_asc_radio_id, sort_desc_radio_id, sort_none_radio_id,
            sort_asc_radio_checked, sort_desc_radio_checked, sort_none_radio_checked,
            col_visible_id,
            col_checked, criterion_disabled,

            i,
            sort_html = '';


        //sort_html += '<ul class="' + commonListClass + '" style="margin-bottom: 20px;">';
        //sort_html += util_pref_li(dialog_id + '_row_numbers', rsc_jui_dg.pref_show_row_numbers);
        //sort_html += '</ul>';

        //sort_html += '<p>' + rsc_jui_dg.pref_col_order_visibility + '</p>';
        sort_html += '<ul id="' + sorting_list_id + '" class="' + sortableListClass + '">';
        for(i in sorting) {
            criterion_disabled = sorting[i]["order"] == '' ? ' ' + sortableListLiDisabledClass : '';

            sort_radio_name = sort_radio_name_prefix + i;
            sort_asc_radio_id = sort_asc_radio_id_prefix + i;
            sort_desc_radio_id = sort_desc_radio_id_prefix + i;
            sort_none_radio_id = sort_none_radio_id_prefix + i;

            sort_asc_radio_checked = sorting[i]["order"] == 'ascending' ? ' checked="checked"' : '';
            sort_desc_radio_checked = sorting[i]["order"] == 'descending' ? ' checked="checked"' : '';
            sort_none_radio_checked = sorting[i]["order"] == '' ? ' checked="checked"' : '';

            sort_html += '<li class="' + sortableListLiClass + criterion_disabled + '">' +
                '<span class="' + sortableListLiIconClass + '"></span>' +
                sorting[i].sortingName +

                '<span style="float: right;">' +
                '<input type="radio" name="' + sort_radio_name + '" id="' + sort_asc_radio_id + '"' + sort_asc_radio_checked + '>' +
                '<label for="' + sort_asc_radio_id + '">' + rsc_jui_dg.sort_ascending + '</label>' +
                '<input type="radio" name="' + sort_radio_name + '" id="' + sort_desc_radio_id + '"' + sort_desc_radio_checked + '>' +
                '<label for="' + sort_desc_radio_id + '">' + rsc_jui_dg.sort_descending + '</label>' +
                '<input type="radio" name="' + sort_radio_name + '" id="' + sort_none_radio_id + '"' + sort_none_radio_checked + '>' +
                '<label for="' + sort_none_radio_id + '">' + rsc_jui_dg.sort_none + '</label>' +
                '</span>' +

                '</li>';
        }
        sort_html += '</ul>';

        $("#" + dialog_id).html(sort_html);
    };


    /**
     *
     * @param plugin_container_id
     * @param dialog_id
     */
    var create_dialog_sort = function(plugin_container_id, dialog_id) {

        var elem = $("#" + plugin_container_id),
            elem_sort_dialog = $("#" + dialog_id),
            dlgSortButtonClass = elem.jui_datagrid("getOption", "dlgSortButtonClass");

        if(jui_widget_exists(dialog_id, 'dialog')) {
            elem_sort_dialog.dialog('destroy');
        }

        elem_sort_dialog.dialog({
            autoOpen: true,
            width: 500,
            height: 'auto',
            position: {
                my: "top",
                at: "top",
                of: '#' + plugin_container_id
            },
            title: rsc_jui_dg.sorting,
            buttons: [
                {
                    text: rsc_jui_dg.sorting_close,
                    click: function() {
                        $(this).dialog("close");
                        $(this).dialog("destroy");
                    }
                }
            ],
            open: create_sorting(plugin_container_id),
            create: function() {
                $(this).closest(".ui-dialog")
                    .find(".ui-button")
                    .addClass(dlgSortButtonClass);
            }
        });

    };


    /**
     * Display datagrid
     * @param container_id
     * @param total_rows
     * @param page_data
     */
    var display_grid = function(container_id, total_rows, page_data, row_primary_key) {

        var elem = $("#" + container_id),
            columns = elem.jui_datagrid('getOption', 'columns'),
            sorting = elem.jui_datagrid('getOption', 'sorting'),
            pageNum = parseInt(elem.jui_datagrid('getOption', 'pageNum')),
            rowsPerPage = parseInt(elem.jui_datagrid('getOption', 'rowsPerPage')),
            showRowNumbers = elem.jui_datagrid('getOption', 'showRowNumbers'),
            page_rows = page_data.length,
            datagrid_header_id = create_id(elem.jui_datagrid('getOption', 'datagrid_header_id_prefix'), container_id),
            datagrid_id = create_id(elem.jui_datagrid('getOption', 'datagrid_id_prefix'), container_id),
            elem_datagrid_header = $("#" + datagrid_header_id),
            elem_datagrid = $("#" + datagrid_id),
            header_table_id = create_id(elem.jui_datagrid('getOption', 'header_table_id_prefix'), container_id),
            table_id = create_id(elem.jui_datagrid('getOption', 'table_id_prefix'), container_id),
            showSortingIndicator = elem.jui_datagrid('getOption', 'showSortingIndicator'),
            sortingIndicator,
            row_id_html, i, row, col, tblh_html, tbl_html, idx, row_index, offset;

        offset = ((pageNum - 1) * rowsPerPage);

        tblh_html = '';
        tblh_html += '<table id="' + header_table_id + '">';

        tblh_html += '<thead>';
        row_id_html = (row_primary_key ? ' id="' + header_table_id + '_tr_0"' : '');
        tblh_html += '<tr' + row_id_html + '>';

        if(showRowNumbers) {
            tblh_html += '<th>' + rsc_jui_dg.row_index_header + '</th>';
        }

        for(i in columns) {
            if(columns[i].visible == "yes") {
                sortingIndicator = '';
                if(showSortingIndicator) {
                    sortingIndicator = get_sorting_indicator(sorting, columns[i].field);
                }
                tblh_html += '<th>' + columns[i].header + sortingIndicator + '</th>';
            }
        }
        tblh_html += '</tr>';
        tblh_html += '</thead>';

        tblh_html += '</table>';

        elem_datagrid_header.html(tblh_html);


        tbl_html = '';
        tbl_html += '<table id="' + table_id + '">';

        tbl_html += '<tbody>';
        for(row in page_data) {
            row_id_html = (row_primary_key ? ' id="' + table_id + '_tr_' + page_data[row][row_primary_key] + '"' : '');
            tbl_html += '<tr' + row_id_html + '>';

            if(showRowNumbers) {
                row_index = offset + parseInt(row) + 1;
                tbl_html += '<td>' + row_index + '</td>';
            }

            for(i in columns) {
                if(columns[i].visible == 'yes') {
                    tbl_html += '<td>' + page_data[row][columns[i].field] + '</td>';
                }
            }

            tbl_html += '</tr>';
        }
        tbl_html += '<tbody>';

        tbl_html += '</table>';

        elem_datagrid.html(tbl_html);

    };


    /**
     * Apply grid style
     * @param container_id
     */
    var apply_grid_style = function(container_id) {

        var elem = $("#" + container_id),

            header_table_selector = '#' + create_id(elem.jui_datagrid('getOption', 'header_table_id_prefix'), container_id),
            data_table_selector = '#' + create_id(elem.jui_datagrid('getOption', 'table_id_prefix'), container_id),
            elem_header_table = $(header_table_selector),
            elem_data_table = $(data_table_selector),

            headerTableClass = elem.jui_datagrid('getOption', 'headerTableClass'),
            dataTableClass = elem.jui_datagrid('getOption', 'dataTableClass'),
            trHoverTrClass = elem.jui_datagrid('getOption', 'trHoverTrClass'),
            trHoverTdClass = elem.jui_datagrid('getOption', 'trHoverTdClass'),
            thClass = elem.jui_datagrid('getOption', 'thClass'),
            tdClass = elem.jui_datagrid('getOption', 'tdClass'),
            thRowNumberClass = elem.jui_datagrid('getOption', 'thRowNumberClass'),
            tdRowNumberClass = elem.jui_datagrid('getOption', 'tdRowNumberClass'),

            columns = elem.jui_datagrid('getOption', 'columns'),
            showRowNumbers = elem.jui_datagrid('getOption', 'showRowNumbers'),

            headerClass, dataClass, i,
            col_index = showRowNumbers ? 1 : 0;

        // COMMON STYLES
        // header table style --------------------------------------------------
        elem_header_table.removeClass(headerTableClass).addClass(headerTableClass);
        elem_header_table.find("th").removeClass(thClass).addClass(thClass);

        // data table style ----------------------------------------------------
        elem_data_table.removeClass(dataTableClass).addClass(dataTableClass);
        elem_data_table.find("td").removeClass(tdClass).addClass(tdClass);

        if(showRowNumbers) {
            elem_header_table.find("th:first").removeClass(thRowNumberClass).addClass(thRowNumberClass);
            elem_data_table.find("tr").find("td:first").removeClass(tdRowNumberClass).addClass(tdRowNumberClass);
        }


        if(trHoverTrClass != '') {
            elem_data_table.on('mouseover mouseout', 'tbody tr', function(event) {
                $(this).toggleClass(trHoverTrClass, event.type == 'mouseover');
            });
        }
        if(trHoverTdClass != '') {
            elem_data_table.on('mouseover mouseout', 'tbody tr', function(event) {
                $(this).children().toggleClass(trHoverTdClass, event.type == 'mouseover');
            });
        }

        // COLUMN STYLES
        // apply given styles --------------------------------------------------
        for(i in columns) {
            if(columns[i].visible == 'yes') {
                headerClass = columns[i]['headerClass'];
                dataClass = columns[i]['dataClass'];
                elem.jui_datagrid("setPageColClass", col_index, headerClass, dataClass, false);
                col_index++;
            }
        }

        sync_thead_tbody_column_width(container_id);

    };


    /**
     *
     * @param plugin_container_id
     * @param row_primary_key
     */
    var apply_selections = function(plugin_container_id, row_primary_key) {

        if(row_primary_key) {
            var elem = $("#" + plugin_container_id),
                rowSelectionMode = elem.jui_datagrid('getOption', 'rowSelectionMode'),
                selectedTrTrClass = elem.jui_datagrid('getOption', 'selectedTrTrClass'),
                selectedTrTdClass = elem.jui_datagrid('getOption', 'selectedTrTdClass'),
                table_id = create_id(elem.jui_datagrid('getOption', 'table_id_prefix'), plugin_container_id),
                row_prefix_len = (table_id + '_tr_').length;

            if(rowSelectionMode == 'multiple') {
                var selector_rows = '#' + table_id + ' tbody tr';
                $(selector_rows).each(function() {
                    // get row id
                    var row_id = parseInt($(this).attr("id").substr(row_prefix_len));

                    var idx = $.inArray(row_id, elem.data(pluginStatus)['a_selected_ids']);
                    if(idx > -1) {
                        style_row_selected($(this), true, selectedTrTrClass, selectedTrTdClass);
                    }
                });

            } else {
                rows_all_deselect(plugin_container_id);
            }
        } else {
            rows_all_deselect(plugin_container_id);
        }

    };

    /**
     * Display tools
     * @param container_id
     */
    var display_tools = function(container_id, total_rows, row_primary_key) {

        var elem = $("#" + container_id),
            tools_id = create_id(elem.jui_datagrid('getOption', 'tools_id_prefix'), container_id),
            toolsClass = elem.jui_datagrid('getOption', 'toolsClass'),

            rowSelectionMode = elem.jui_datagrid('getOption', 'rowSelectionMode'),

            tbButtonContainer = elem.jui_datagrid('getOption', 'tbButtonContainer'),

            showPrefButton = elem.jui_datagrid('getOption', 'showPrefButton'),
            showPrefButtonText = elem.jui_datagrid('getOption', 'showPrefButtonText'),
            tbPrefIconClass = elem.jui_datagrid('getOption', 'tbPrefIconClass'),

            showSelectButtons = elem.jui_datagrid('getOption', 'showSelectButtons'),

            showRefreshButton = elem.jui_datagrid('getOption', 'showRefreshButton'),
            showRefreshButtonText = elem.jui_datagrid('getOption', 'showRefreshButtonText'),
            tbRefreshIconClass = elem.jui_datagrid('getOption', 'tbRefreshIconClass'),

            showDeleteButton = elem.jui_datagrid('getOption', 'showDeleteButton'),
            showDeleteButtonText = elem.jui_datagrid('getOption', 'showDeleteButtonText'),
            tbDeleteIconClass = elem.jui_datagrid('getOption', 'tbDeleteIconClass'),

            showPrintButton = elem.jui_datagrid('getOption', 'showPrintButton'),
            showPrintButtonText = elem.jui_datagrid('getOption', 'showPrintButtonText'),
            tbPrintIconClass = elem.jui_datagrid('getOption', 'tbPrintIconClass'),

            showExportButton = elem.jui_datagrid('getOption', 'showExportButton'),
            showExportButtonText = elem.jui_datagrid('getOption', 'showExportButtonText'),
            tbExportIconClass = elem.jui_datagrid('getOption', 'tbExportIconClass'),

            showSortingButton = elem.jui_datagrid('getOption', 'showSortingButton'),
            showSortingButtonText = elem.jui_datagrid('getOption', 'showSortingButtonText'),
            tbSortingIconClass = elem.jui_datagrid('getOption', 'tbSortingIconClass'),

            showFiltersButton = elem.jui_datagrid('getOption', 'showFiltersButton'),
            showFiltersButtonText = elem.jui_datagrid('getOption', 'showFiltersButtonText'),
            tbFiltersIconClass = elem.jui_datagrid('getOption', 'tbFiltersIconClass');

        var tools_html = '';

        if(showPrefButton) {
            tools_html += '<div class="' + tbButtonContainer + '">';

            var pref_id = tools_id + '_' + 'pref';
            tools_html += '<button id="' + pref_id + '">' + rsc_jui_dg.preferences + '</button>';

            tools_html += '</div>';
        }
        if(total_rows > 0) {
            if(showSelectButtons && rowSelectionMode == 'multiple' && row_primary_key) {

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
            if(showDeleteButton && row_primary_key) {
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

        if(showSortingButton) {
            tools_html += '<div class="' + tbButtonContainer + '">';

            var sorting_id = tools_id + '_' + 'sorting';
            tools_html += '<button id="' + sorting_id + '">' + rsc_jui_dg.tb_sorting + '</button>';

            tools_html += '</div>';
        }

        if(showFiltersButton) {
            tools_html += '<div class="' + tbButtonContainer + '">';

            var filters_id = tools_id + '_' + 'filters';
            tools_html += '<button id="' + filters_id + '">' + rsc_jui_dg.tb_filters + '</button>';

            tools_html += '</div>';
        }


        $("#" + tools_id).html(tools_html);

        if(showPrefButton) {
            util_tools_btn($("#" + pref_id), rsc_jui_dg.preferences, showPrefButtonText, tbPrefIconClass);
        }

        if(total_rows > 0) {
            if(showSelectButtons && rowSelectionMode == 'multiple' && row_primary_key) {

                var elem_dropdown_select = $("#" + drop_select_id),

                // fixed dropdown options
                    launcher_id = drop_select_id + '_launcher',
                    launcher_container_id = drop_select_id + '_launcher_container',
                    menu_id = drop_select_id + '_menu',

                // CREATE DROPDOWN OPTIONS
                    given_dropdown_select_options = elem.jui_datagrid('getOption', 'dropdownSelectOptions'),
                // remove unacceptable settings
                    internal_defined = ['launcher_id', 'launcher_container_id', 'menu_id', 'onSelect'];
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
            util_tools_btn($("#" + refresh_id), rsc_jui_dg.tb_refresh, showRefreshButtonText, tbRefreshIconClass);
        }

        if(total_rows > 0) {
            if(showDeleteButton) {
                util_tools_btn($("#" + delete_id), rsc_jui_dg.tb_delete, showDeleteButtonText, tbDeleteIconClass);
            }
        }

        if(total_rows > 0) {
            if(showPrintButton) {
                util_tools_btn($("#" + print_id), rsc_jui_dg.tb_print, showPrintButtonText, tbPrintIconClass);
            }

            if(showExportButton) {
                util_tools_btn($("#" + export_id), rsc_jui_dg.tb_export, showExportButtonText, tbExportIconClass);
            }
        }

        if(showSortingButton) {
            util_tools_btn($("#" + sorting_id), rsc_jui_dg.tb_sorting, showSortingButtonText, tbSortingIconClass);
        }

        if(showFiltersButton) {
            util_tools_btn($("#" + filters_id), rsc_jui_dg.tb_filters, showFiltersButtonText, tbFiltersIconClass);
        }

    };

    /**
     * Display pagination
     * @param container_id
     * @param total_rows
     */
    var display_pagination = function(container_id, total_rows) {

        var elem = $("#" + container_id),

        // fixed pagination options
            currentPage = elem.jui_datagrid('getOption', 'pageNum'),
            rowsPerPage = elem.jui_datagrid('getOption', 'rowsPerPage'),
            maxRowsPerPage = elem.jui_datagrid('getOption', 'maxRowsPerPage'),
            total_pages = Math.ceil(total_rows / rowsPerPage),
            paginationClass = elem.jui_datagrid('getOption', 'paginationClass'),

            pagination_id = create_id(elem.jui_datagrid('getOption', 'pagination_id_prefix'), container_id),
            elem_pagination = $("#" + pagination_id),

        // CREATE PAGINATION OPTIONS
            given_pagination_options = elem.jui_datagrid('getOption', 'paginationOptions'),
        // remove unacceptable settings
            internal_defined = ['currentPage', 'rowsPerPage', 'totalPages', 'containerClass', 'onSetRowsPerPage', 'onChangePage', 'onDisplay'];
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

        var elem = $("#" + container_id),
            datagrid_id = elem.jui_datagrid('getOption', 'datagrid_id_prefix') + container_id,
            pagination_id = elem.jui_datagrid('getOption', 'pagination_id_prefix') + container_id;

        $("#" + datagrid_id).html(rsc_jui_dg.no_records_found);
        $("#" + pagination_id).hide();

    };

    /**
     *
     * @param elem_row
     * @param status
     * @param trClass
     * @param tdClass
     */
    var style_row_selected = function(elem_row, status, trClass, tdClass) {
        if(status == true) {
            if(trClass) {
                elem_row.addClass(trClass);
            }
            if(tdClass) {
                elem_row.children("td").addClass(tdClass);
            }
        } else {
            if(trClass) {
                elem_row.removeClass(trClass);
            }
            if(tdClass) {
                elem_row.children("td").removeClass(tdClass);
            }
        }
    };


    /**
     *
     * @param plugin_container_id
     * @param row_id
     */
    var row_select = function(plugin_container_id, row_id) {
        var elem = $("#" + plugin_container_id),
            table_id_prefix = elem.jui_datagrid('getOption', 'table_id_prefix'),
            table_id = create_id(table_id_prefix, plugin_container_id),
            elem_row = $("#" + table_id + '_tr_' + row_id),
            selectedTrTrClass = elem.jui_datagrid('getOption', 'selectedTrTrClass'),
            selectedTrTdClass = elem.jui_datagrid('getOption', 'selectedTrTdClass');

        elem.data(pluginStatus)['a_selected_ids'].push(row_id);
        elem.data(pluginStatus)['count_selected_ids'] += 1;
        style_row_selected(elem_row, true, selectedTrTrClass, selectedTrTdClass);
    };

    /**
     *
     * @param plugin_container_id
     * @param row_id
     * @param row_idx
     */
    var row_deselect = function(plugin_container_id, row_id, row_idx) {
        var elem = $("#" + plugin_container_id),
            table_id_prefix = elem.jui_datagrid('getOption', 'table_id_prefix'),
            table_id = create_id(table_id_prefix, plugin_container_id),
            elem_row = $("#" + table_id + '_tr_' + row_id),
            selectedTrTrClass = elem.jui_datagrid('getOption', 'selectedTrTrClass'),
            selectedTrTdClass = elem.jui_datagrid('getOption', 'selectedTrTdClass');

        elem.data(pluginStatus)['a_selected_ids'].splice(row_idx, 1);
        elem.data(pluginStatus)['count_selected_ids'] -= 1;
        style_row_selected(elem_row, false, selectedTrTrClass, selectedTrTdClass);
    };

    /**
     *
     * @param plugin_container_id
     */
    var rows_all_deselect = function(plugin_container_id) {
        var elem = $("#" + plugin_container_id),
            table_id_prefix = elem.jui_datagrid('getOption', 'table_id_prefix'),
            table_id = create_id(table_id_prefix, plugin_container_id),
            elem_table = $("#" + table_id),
            selectedTrTrClass = elem.jui_datagrid('getOption', 'selectedTrTrClass'),
            selectedTrTdClass = elem.jui_datagrid('getOption', 'selectedTrTdClass');

        elem.data(pluginStatus)['a_selected_ids'] = [];
        elem.data(pluginStatus)['count_selected_ids'] = 0;
        elem_table.find("tr").removeClass(selectedTrTrClass);
        elem_table.find("td").removeClass(selectedTrTdClass);
    };

    /**
     *
     * @param plugin_container_id
     */
    var update_selected_rows_counter = function(plugin_container_id) {
        var elem = $("#" + plugin_container_id),
            selected_rows = elem.data(pluginStatus)['count_selected_ids'],
            tools_id = create_id(elem.jui_datagrid('getOption', 'tools_id_prefix'), plugin_container_id),
            drop_select_id = tools_id + '_drop_select';

        $("#" + drop_select_id + '_launcher').button({
            label: rsc_jui_dg.tb_selected_label + ': ' + selected_rows
        });
    };

    /**
     *
     * @param container_id
     */
    var sync_thead_tbody_column_width = function(container_id) {

        var elem = $("#" + container_id),
            header_table_selector = '#' + create_id(elem.jui_datagrid('getOption', 'header_table_id_prefix'), container_id),
            data_table_selector = '#' + create_id(elem.jui_datagrid('getOption', 'table_id_prefix'), container_id),
            cols = $(header_table_selector + ' th').length,
            cols_except_last = cols - 1,
            i, th_cow, td_first_row_cow, // cow = computed outer width
            fix_columns_width_needed = false,

            cw, cw_min, elem_th, elem_td, // cw = computed width
            a_col_cw = [],
            fix_width = parseInt(elem.data(pluginStatus)['fix_border_collapse_td_width']);


        // try to detect id header columns width need syncronization with data table columns
        for(i = 0; i < cols_except_last; i++) {
            th_cow = $(header_table_selector + ' th').eq(i).width();
            td_first_row_cow = $(data_table_selector).find("tr").eq(0).find("td").eq(i).width();
            if(th_cow !== td_first_row_cow) {
                fix_columns_width_needed = true;
                break;
            }
        }

        if(fix_columns_width_needed) {

            // define column min-widths
            $(header_table_selector).addClass("shrink");
            for(i = 0; i < cols; i++) {
                elem_th = $(header_table_selector).find("tr").eq(0).find("th").eq(i);
                cw_min = elem_th.width();

                elem_td = $(data_table_selector).find("tr").eq(0).find("td").eq(i);
                elem_td.css("min-width", cw_min + 'px');
            }
            $(header_table_selector).removeClass("shrink");

            // set equal width to header and data table
            $(header_table_selector).width($(data_table_selector).width());

            // apply first tr td widths to header
            for(i = 0; i < cols; i++) {
                var elem_cur = $(data_table_selector).find("tr").eq(0).find("td").eq(i);
                cw = elem_cur.width() + fix_width;
                a_col_cw.push(cw);
                $(header_table_selector + ' th').eq(i).width(cw);
            }

            // TODO re-apply first tr td widths to data table?
            /*            for(i = 0; i < cols; i++) {
             $(data_table_selector + ' tr').eq(0).find("td").eq(i).width(a_col_cw[i]);
             }*/

        }
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