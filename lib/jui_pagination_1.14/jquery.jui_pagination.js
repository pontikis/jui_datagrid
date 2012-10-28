/**
 * jquery pagination plugin
 * Requires jquery, jquery-ui slider, jquery-ui CSS
 * For touch event support jquery.ui.touch-punch.min.js could be used (see folder /lib)
 * Copyright 2012 Christos Pontikis http://pontikis.net
 * Project page https://github.com/pontikis/jui_pagination
 * UPCOMING Release 1.14 (?? Oct 2012)
 * License MIT
 */
"use strict";
(function($) {

    var pluginName = 'jui_pagination';

    /* public methods ------------------------------------------------------- */
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
                    var defaults = elem.jui_pagination('getDefaults');
                    settings = $.extend({}, defaults, options);
                } else {
                    settings = $.extend({}, settings, options);
                }
                elem.data(pluginName, settings);

                var container_id = elem.attr("id");

                // simple validation
                validate_input(container_id);

                if(elem.data('error_occured')) {
                    elem.html('');
                    elem.data('error_occured', false);
                }

                // bind events
                elem.unbind("onChangePage").bind("onChangePage", settings.onChangePage);
                elem.unbind("onSetRowsPerPage").bind("onSetRowsPerPage", settings.onSetRowsPerPage);
                elem.unbind("onDisplay").bind("onDisplay", settings.onDisplay);

                // retrieve options
                var totalPages = settings.totalPages;
                var currentPage = settings.currentPage;
                var visiblePageLinks = settings.visiblePageLinks;
                var rowsPerPage = settings.rowsPerPage;

                var useNavPane = settings.useNavPane;
                var navPaneElementID = settings.navPaneElementID;

                var useSlider = settings.useSlider;
                var sliderElementID = settings.sliderElementID;
                var useSliderWithPagesCount = settings.useSliderWithPagesCount;
                var sliderOrientation = settings.sliderOrientation;

                var showGoToPage = settings.showGoToPage;
                var showNavButtons = settings.showNavButtons;
                var showLabelCurrentPage = settings.showLabelCurrentPage;
                var showCurrentPage = settings.showCurrentPage;
                var showNavPages = settings.showNavPages;
                var navPagesMode = settings.navPagesMode;
                var showLabelTotalPages = settings.showLabelTotalPages;
                var showTotalPages = settings.showTotalPages;
                var showRowsPerPage = settings.showRowsPerPage;
                var showRowsInfo = settings.showRowsInfo;
                var showPreferences = settings.showPreferences;

                var nav_pane_display_order = settings.nav_pane_display_order;

                var containerClass = settings.containerClass;
                var navPaneClass = settings.navPaneClass;
                var navGoToPageClass = settings.navGoToPageClass;
                var navButtonTopClass = settings.navButtonTopClass;
                var navButtonPrevClass = settings.navButtonPrevClass;
                var navCurrentPageLabelClass = settings.navCurrentPageLabelClass;
                var navCurrentPageClass = settings.navCurrentPageClass;
                var navPagesClass = settings.navPagesClass;
                var navTotalPagesLabelClass = settings.navTotalPagesLabelClass;
                var navTotalPagesClass = settings.navTotalPagesClass;
                var navButtonNextClass = settings.navButtonNextClass;
                var navButtonLastClass = settings.navButtonLastClass;
                var navRowsPerPageClass = settings.navRowsPerPageClass;
                var navInfoClass = settings.navInfoClass;
                var preferencesClass = settings.preferencesClass;
                var sliderClass = settings.sliderClass;

                var nav_pane_id = (!navPaneElementID ? create_id(settings.nav_pane_id_prefix, container_id) : navPaneElementID);
                var goto_page_id = create_id(settings.nav_goto_page_id_prefix, container_id);
                var current_label_id = create_id(settings.nav_current_page_label_id_prefix, container_id);
                var current_id = create_id(settings.nav_current_page_id_prefix, container_id);
                var nav_top_id = create_id(settings.nav_top_id_prefix, container_id);
                var nav_prev_id = create_id(settings.nav_prev_id_prefix, container_id);
                var nav_pages_id = create_id(settings.nav_pages_id_prefix, container_id);
                var nav_item_id_prefix = create_id(settings.nav_item_id_prefix, container_id) + '_';
                var nav_next_id = create_id(settings.nav_next_id_prefix, container_id);
                var nav_last_id = create_id(settings.nav_last_id_prefix, container_id);
                var total_label_id = create_id(settings.nav_total_pages_label_id_prefix, container_id);
                var total_id = create_id(settings.nav_total_pages_id_prefix, container_id);
                var rows_per_page_id = create_id(settings.nav_rows_per_page_id_prefix, container_id);
                var rows_info_id = create_id(settings.nav_rows_info_id_prefix, container_id);
                var preferences_id = create_id(settings.preferences_id_prefix, container_id);
                var pref_dialog_id = create_id(settings.pref_dialog_id_prefix, container_id);
                var slider_id = (!sliderElementID ? create_id(settings.slider_id_prefix, container_id) : sliderElementID);

                var disableSelectionNavPane = settings.disableSelectionNavPane;

                if(useSlider) {
                    var pageLimit = (useSliderWithPagesCount == 0 ? visiblePageLinks : Math.max(useSliderWithPagesCount, visiblePageLinks));
                    if(totalPages <= pageLimit) {
                        useSlider = false;
                    }
                }

                // set container style
                if(containerClass != '') {
                    elem.removeClass().addClass(containerClass);
                } else {
                    elem.removeClass(containerClass);
                }

                /* CREATE PANEL --------------------------------------------- */
                if(useNavPane) {

                    if(!navPaneElementID) {
                        if($("#" + nav_pane_id).length == 0) {
                            elem.html('<div id="' + nav_pane_id + '"></div>' + elem.html());
                        }
                    }

                    var nav_pane_html = '';

                    if(showPreferences) {
                        nav_pane_html += '<div id="' + preferences_id +
                            '" title="' + rsc_jui_pag.preferences_title + '">'
                            + rsc_jui_pag.preferences_text + '</div>';
                    }

                    $.each(nav_pane_display_order, function(index, value) {

                        if(value == 'go_to_page') {
                            if(showGoToPage) {
                                nav_pane_html += '<input type="text" id="' + goto_page_id + '" title="' + rsc_jui_pag.go_to_page_title + '">';
                            }
                        } else if(value == 'back_buttons') {
                            if(showNavButtons) {
                                nav_pane_html += '<div id="' + nav_top_id + '">' + rsc_jui_pag.go_top_text + '</div>';
                                nav_pane_html += '<div id="' + nav_prev_id + '">' + rsc_jui_pag.go_prev_text + '</div>';
                            }
                        } else if(value == 'current_page_label') {
                            if(showLabelCurrentPage) {
                                nav_pane_html += '<div id="' + current_label_id + '">' + rsc_jui_pag.current_page_label + '</div>';
                            }
                        } else if(value == 'current_page') {
                            if(showCurrentPage) {
                                nav_pane_html += '<div id="' + current_id + '">' + currentPage + '</div>';
                            }
                        } else if(value == 'nav_items') {
                            if(showNavPages) {
                                nav_pane_html += '<div id="' + nav_pages_id + '"></div>';
                            }
                        } else if(value == 'total_pages_label') {
                            if(showLabelTotalPages) {
                                nav_pane_html += '<div id="' + total_label_id + '">' + rsc_jui_pag.total_pages_label + '</div>';
                            }
                        } else if(value == 'total_pages') {
                            if(showTotalPages) {
                                nav_pane_html += '<div id="' + total_id + '">' + totalPages + '</div>';
                            }
                        } else if(value == 'forward_buttons') {
                            if(showNavButtons) {
                                nav_pane_html += '<div id="' + nav_next_id + '">' + rsc_jui_pag.go_next_text + '</div>';
                                nav_pane_html += '<div id="' + nav_last_id + '">' + rsc_jui_pag.go_last_text + '</div>';
                            }
                        } else if(value == 'rows_per_page') {
                            if(showRowsPerPage) {
                                nav_pane_html += '<input type="text" id="' + rows_per_page_id + '" ' +
                                    'value="' + rowsPerPage + '" ' +
                                    'title="' + rsc_jui_pag.rows_per_page_title + '">';
                            }
                        } else if(value == 'rows_info') {
                            if(showRowsInfo) {
                                nav_pane_html += '<div id="' + rows_info_id + '"></div>';
                            }
                        }

                    });

                    // set nav_pane_html
                    $("#" + nav_pane_id).html(nav_pane_html);

                    // apply style
                    $("#" + nav_pane_id).removeClass().addClass(navPaneClass);

                    $("#" + goto_page_id).removeClass().addClass(navGoToPageClass);

                    $("#" + current_label_id).removeClass().addClass(navCurrentPageLabelClass);
                    $("#" + current_id).removeClass().addClass(navCurrentPageClass);

                    $("#" + nav_top_id).removeClass().addClass(navButtonTopClass);
                    $("#" + nav_prev_id).removeClass().addClass(navButtonPrevClass);

                    $("#" + nav_pages_id).removeClass().addClass(navPagesClass);

                    $("#" + nav_next_id).removeClass().addClass(navButtonNextClass);
                    $("#" + nav_last_id).removeClass().addClass(navButtonLastClass);

                    $("#" + total_label_id).removeClass().addClass(navTotalPagesLabelClass);
                    $("#" + total_id).removeClass().addClass(navTotalPagesClass);

                    $("#" + rows_per_page_id).removeClass().addClass(navRowsPerPageClass);

                    $("#" + rows_info_id).removeClass().addClass(navInfoClass);

                    $("#" + preferences_id).removeClass().addClass(preferencesClass);

                    create_nav_items(container_id);

                    // panel enents
                    var selector;
                    if(showNavButtons) {

                        // click on go to top button
                        selector = "#" + nav_top_id;
                        $("#" + nav_pane_id).off('click', selector).on('click', selector, function() {
                            settings.currentPage = 1;
                            change_page(container_id, settings.currentPage, true, true);
                        });

                        // click on go to prev button
                        selector = "#" + nav_prev_id;
                        $("#" + nav_pane_id).off('click', selector).on('click', selector, function() {
                            if(settings.currentPage > 1) {
                                settings.currentPage = parseInt(settings.currentPage) - 1;
                                change_page(container_id, settings.currentPage, true, true);
                            }
                        });

                        // click on go to next button
                        selector = "#" + nav_next_id;
                        $("#" + nav_pane_id).off('click', selector).on('click', selector, function() {
                            if(settings.currentPage < settings.totalPages) {
                                settings.currentPage = parseInt(settings.currentPage) + 1;
                                change_page(container_id, settings.currentPage, true, true);
                            }
                        });

                        // click on go to end button
                        selector = "#" + nav_last_id;
                        $("#" + nav_pane_id).off('click', selector).on('click', selector, function() {
                            settings.currentPage = parseInt(settings.totalPages);
                            change_page(container_id, settings.currentPage, true, true);
                        });

                    }

                    // click on nav page item
                    selector = '[id^="' + nav_item_id_prefix + '"]';
                    $("#" + nav_pane_id).off('click', selector).on('click', selector, function(event) {
                        var len = nav_item_id_prefix.length;
                        settings.currentPage = parseInt($(event.target).attr("id").substr(len));
                        if(navPagesMode == 'continuous') {
                            change_page(container_id, settings.currentPage, false, true);
                        } else if(navPagesMode == 'first-last-always-visible') {
                            change_page(container_id, settings.currentPage, true, true);
                        }
                    });

                    // go to page event
                    if(showGoToPage) {
                        selector = "#" + goto_page_id;
                        $("#" + nav_pane_id).off('keypress', selector).on('keypress', selector, function(event) {
                            if(event.which === 13) {
                                var gtp = parseInt($(event.target).val());
                                $("#" + goto_page_id).val('');
                                if(!isNaN(gtp) && gtp > 0) {
                                    settings.currentPage = gtp;
                                    if(settings.currentPage > settings.totalPages) {
                                        settings.currentPage = settings.totalPages;
                                    }
                                    change_page(container_id, settings.currentPage, true, true);
                                } else {
                                    elem.triggerHandler("onChangePage", settings.currentPage);
                                }
                            } else {
                                if(!(event.which === 8 || event.which === 0 || (event.shiftKey === false && (event.which > 47 && event.which < 58)))) {
                                    event.preventDefault();
                                }
                            }
                        });
                    }

                    // rows per page event
                    if(showRowsPerPage) {
                        selector = "#" + rows_per_page_id;
                        $("#" + nav_pane_id).off('keypress', selector).on('keypress', selector, function(event) {
                            if(event.which === 13) {
                                var rpp = parseInt($(event.target).val());
                                if(!isNaN(rpp) && rpp > 0) {
                                    settings.rowsPerPage = rpp;
                                } else {
                                    $("#" + rows_per_page_id).val(settings.rowsPerPage);
                                }
                                elem.triggerHandler("onSetRowsPerPage", rpp);
                            } else {
                                if(!(event.which === 8 || event.which === 0 || (event.shiftKey === false && (event.which > 47 && event.which < 58)))) {
                                    event.preventDefault();
                                }
                            }
                        });
                    }


                    if(disableSelectionNavPane) {
                        disableSelection($("#" + nav_pane_id));
                    }

                } else {
                    $("#" + nav_pane_id).removeClass();
                    $("#" + nav_pane_id).html('');
                }

                /* CREATE SLIDER -------------------------------------------- */
                if(useSlider) {

                    if(!sliderElementID) {
                        if($("#" + slider_id).length == 0) {
                            elem.append('<div id="' + slider_id + '"></div>');
                        }
                    }

                    $("#" + slider_id).removeClass(sliderClass).addClass(sliderClass);

                    $("#" + slider_id).slider({
                        min: 1,
                        max: totalPages,
                        value: (sliderOrientation == 'horizontal' ? currentPage : totalPages - currentPage + 1),
                        animate: 'slow',
                        range: (sliderOrientation == 'horizontal' ? 'min' : 'max'),
                        orientation: sliderOrientation,
                        stop: function(event, ui) {
                            settings.currentPage = (sliderOrientation == 'horizontal' ? parseInt(ui.value) : parseInt(totalPages) - parseInt(ui.value) + 1);
                            change_page(container_id, settings.currentPage, true, false);
                        }
                    });

                } else {
                    if(typeof($("#" + slider_id).data("slider")) == 'object') {
                        $("#" + slider_id).slider('destroy');
                        $("#" + slider_id).html('');
                    }
                }

                /* CREATE PREFERENCES DIALOG -------------------------------- */
                if(showPreferences) {

                    if($('#' + pref_dialog_id).length == 0) {
                        var pref_html = '<div id="' + pref_dialog_id + '"></div>';
                        elem.append(pref_html);
                    }

                    selector = "#" + preferences_id;
                    $("#" + nav_pane_id).off('click', selector).on('click', selector, function() {

                        if(typeof($("#" + pref_dialog_id).data('dialog')) == 'object') {
                            $("#" + pref_dialog_id).dialog('destroy');
                        }

                        $("#" + pref_dialog_id).dialog({
                            autoOpen: true,
                            show: "blind",
                            hide: "explode",
                            position: {
                                my: "top",
                                at: "bottom",
                                of: '#' + container_id
                            },
                            title: rsc_jui_pag.preferences_title,
                            buttons: [
                                {
                                    text: rsc_jui_pag.preferences_close,
                                    click: function() {
                                        $(this).dialog("close");
                                        $(this).dialog("destroy");
                                    }
                                }
                            ],
                            open: create_preferences(container_id)
                        })
                    });

                    selector = "#" + pref_dialog_id + '_slider';
                    $("#" + pref_dialog_id).off('click', selector).on('click', selector, function(event) {
                        var state = $(event.target).is(":checked");
                        elem.jui_pagination({
                            useSlider: state
                        })
                    });

                    selector = "#" + pref_dialog_id + '_goto_page';
                    $("#" + pref_dialog_id).off('click', selector).on('click', selector, function(event) {
                        var state = $(event.target).is(":checked");
                        elem.jui_pagination({
                            showGoToPage: state
                        })
                    });

                    selector = "#" + pref_dialog_id + '_rows_per_page';
                    $("#" + pref_dialog_id).off('click', selector).on('click', selector, function(event) {
                        var state = $(event.target).is(":checked");
                        elem.jui_pagination({
                            showRowsPerPage: state
                        })
                    });
                }

                elem.triggerHandler('onDisplay');

            });

        },

        /**
         * Get default values
         * Usage: $(element).jui_pagination('getDefaults');
         * @return {Object}
         */
        getDefaults: function() {
            return {
                currentPage: 1,
                visiblePageLinks: 5,
                maxVisiblePageLinks: 20,
                rowsPerPage: 10,

                useNavPane: true,
                navPaneElementID: false, // if given, nav pane appears outside container inside specified element
                nav_pane_display_order: [
                    'go_to_page',
                    'back_buttons',
                    'current_page_label',
                    'current_page',
                    'nav_items',
                    'total_pages_label',
                    'total_pages',
                    'forward_buttons',
                    'rows_per_page',
                    'rows_info'
                ],

                useSlider: false,
                sliderElementID: false, // if given, slider appears outside container inside specified element
                useSliderWithPagesCount: 0, // show slider over specified number of pages
                sliderOrientation: 'horizontal',

                showGoToPage: false,
                showNavButtons: false,
                showLabelCurrentPage: true,
                showCurrentPage: false,
                showNavPages: true,
                navPagesMode: 'first-last-always-visible', // alternative mode is 'continuous'
                showLabelTotalPages: false,
                showTotalPages: false,
                showRowsPerPage: false,
                showRowsInfo: false,
                showPreferences: true,

                navPaneClass: 'nav-pane ui-state-default ui-corner-all',
                navGoToPageClass: 'goto-page ui-state-default ui-corner-all',
                navButtonTopClass: 'nav-button-top ui-icon ui-icon-seek-first',
                navButtonPrevClass: 'nav-button-prev ui-icon ui-icon-seek-prev',
                navCurrentPageLabelClass: 'current-page-label',
                navCurrentPageClass: 'current-page',
                navDotsLeftClass: 'nav-dots-left',
                navPagesClass: 'nav-pages',
                navItemClass: 'nav-item ui-state-default ui-corner-all',
                navItemSelectedClass: 'nav-item ui-state-default ui-corner-all ui-state-highlight',
                navItemHoverClass: 'ui-state-hover', // if empty, no hover applied
                navDotsRightClass: 'nav-dots-right',
                navTotalPagesLabelClass: 'total-pages-label',
                navTotalPagesClass: 'total-pages',
                navButtonNextClass: 'nav-button-next  ui-icon ui-icon-seek-next',
                navButtonLastClass: 'nav-button-last  ui-icon ui-icon-seek-end',
                navRowsPerPageClass: 'rows-per-page  ui-state-default ui-corner-all',
                navInfoClass: 'rows-info',
                sliderClass: 'nav-slider',
                preferencesClass: 'preferences ui-icon ui-icon-signal',

                nav_pane_id_prefix: 'nav_pane_',
                nav_goto_page_id_prefix: 'goto_page_',
                nav_current_page_label_id_prefix: 'current_page_lbl_',
                nav_current_page_id_prefix: 'current_page_',
                nav_top_id_prefix: 'top_',
                nav_prev_id_prefix: 'prev_',
                nav_dots_left_id_prefix: 'dots_left_',
                nav_pages_id_prefix: 'pages_',
                nav_item_id_prefix: 'page_',
                nav_dots_right_id_prefix: 'dots_right_',
                nav_next_id_prefix: 'next_',
                nav_last_id_prefix: 'last_',
                nav_total_pages_label_id_prefix: 'total_pages_lbl_',
                nav_total_pages_id_prefix: 'total_pages_',
                nav_rows_per_page_id_prefix: 'rows_per_page_',
                nav_rows_info_id_prefix: 'rows_info_',
                slider_id_prefix: 'sld_',
                preferences_id_prefix: 'pref_',
                pref_dialog_id_prefix: 'pref_dlg_',

                disableSelectionNavPane: false, // disable text selection and double click (jquery >= 1.8)

                onChangePage: function() {
                },
                onSetRowsPerPage: function() {
                },
                onDisplay: function() {
                }
            };
        },

        /**
         * Get any option set to plugin using its name (as string)
         * Usage: $(element).jui_pagination('getOption', some_option);
         * @param opt
         * @return {*}
         */
        getOption: function(opt) {
            var elem = this;
            return elem.data(pluginName)[opt];
        },

        /**
         * Get all options
         * Usage: $(element).jui_pagination('getAllOptions');
         * @return {*}
         */
        getAllOptions: function() {
            var elem = this;
            return elem.data(pluginName);
        },

        /**
         * Set option
         * Usage: $(element).jui_pagination('setOption', 'oprion_name',  'oprion_value',  reinit);
         * @param opt
         * @param val
         * @param reinit
         */
        setOption: function(opt, val, reinit) {
            var elem = this;
            elem.data(pluginName)[opt] = val;
            if(reinit) {
                elem.jui_pagination('init');
            }
        },

        /**
         * Destroy plugin
         * Usage: $(element).jui_pagination('destroy');
         * @return {*|jQuery}
         */
        destroy: function() {
            return $(this).each(function() {
                var $this = $(this);

                $this.removeData(pluginName);
            });
        },

        /**
         * Set rows info
         * Usage: $(element).jui_pagination('setRowsInfo', info_html);
         * @param info_html
         */
        setRowsInfo: function(info_html) {
            var elem = this;
            var rows_info_id = create_id(elem.jui_pagination('getOption', 'nav_rows_info_id_prefix'), $(this).attr("id"));
            $("#" + rows_info_id).html(info_html);
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
     * Disable selection (jquery 1.8)
     * http://stackoverflow.com/questions/2700000/how-to-disable-text-selection-using-jquery
     * @param element
     * @return {*}
     */
    var disableSelection = function(element) {
        return element
            .attr('unselectable', 'on')
            .css('user-select', 'none')
            .on('selectstart', false);
    };

    /**
     * Validate input values
     * @param container_id
     */
    var validate_input = function(container_id) {
        var err_msg;
        var totalPages = $("#" + container_id).jui_pagination('getOption', 'totalPages');
        if(parseInt(totalPages) <= 0 || isNaN(parseInt(totalPages))) {
            err_msg = 'Invalid totalPages';
            $("#" + container_id).html('<span style="color: red;">' + 'ERROR: ' + err_msg + '</span>');
            $("#" + container_id).data('error_occured', true);
            $.error(err_msg);
        }

        var currentPage = $("#" + container_id).jui_pagination('getOption', 'currentPage');
        if(parseInt(currentPage) <= 0 || isNaN(parseInt(currentPage))) {
            err_msg = 'Invalid currentPage';
            $("#" + container_id).html('<span style="color: red;">' + 'ERROR: ' + err_msg + '</span>');
            $("#" + container_id).data('error_occured', true);
            $.error(err_msg);
        }

        var visiblePageLinks = $("#" + container_id).jui_pagination('getOption', 'visiblePageLinks');
        if(parseInt(visiblePageLinks) <= 0 || isNaN(parseInt(visiblePageLinks))) {
            err_msg = 'Invalid visiblePageLinks';
            $("#" + container_id).html('<span style="color: red;">' + 'ERROR: ' + err_msg + '</span>');
            $("#" + container_id).data('error_occured', true);
            $.error(err_msg);
        }

        if(parseInt(currentPage) > parseInt(totalPages)) {
            err_msg = 'Invalid currentPage > totalPages';
            $("#" + container_id).html('<span style="color: red;">' + 'ERROR: ' + err_msg + '</span>');
            $("#" + container_id).data('error_occured', true);
            $.error(err_msg);
        }

/*        if(parseInt(visiblePageLinks) > parseInt(totalPages)) {
            err_msg = 'Invalid visiblePageLinks > totalPages';
            $("#" + container_id).html('<span style="color: red;">' + 'ERROR: ' + err_msg + '</span>');
            $("#" + container_id).data('error_occured', true);
            $.error(err_msg);
        }*/

        var maxVisiblePageLinks = $("#" + container_id).jui_pagination('getOption', 'maxVisiblePageLinks');
        if(parseInt(visiblePageLinks) > parseInt(maxVisiblePageLinks)) {
            err_msg = 'Invalid visiblePageLinks > maxVisiblePageLinks';
            $("#" + container_id).html('<span style="color: red;">' + 'ERROR: ' + err_msg + '</span>');
            $("#" + container_id).data('error_occured', true);
            $.error(err_msg);
        }
    };


    /**
     * Create preferences
     * @param plugin_container_id
     */
    var create_preferences = function(plugin_container_id) {
        var prefix = $("#" + plugin_container_id).jui_pagination('getOption', 'pref_dialog_id_prefix');
        var dialog_id = create_id(prefix, plugin_container_id);
        var pref_id;
        var state;

        var pref_html = '';
        pref_html += '<ul style="list-style-type: none;">';

        pref_id = dialog_id + '_slider';
        pref_html += '<li>';
        pref_html += '<input type="checkbox" id="' + pref_id + '" /><label for="' + pref_id + '">' + rsc_jui_pag.pref_show_slider + '</label>';
        pref_html += '</li>';

        pref_id = dialog_id + '_goto_page';
        pref_html += '<li>';
        pref_html += '<input type="checkbox" id="' + pref_id + '" /><label for="' + pref_id + '">' + rsc_jui_pag.pref_show_goto_page + '</label>';
        pref_html += '</li>';

        pref_id = dialog_id + '_rows_per_page';
        pref_html += '<li>';
        pref_html += '<input type="checkbox" id="' + pref_id + '" /><label for="' + pref_id + '">' + rsc_jui_pag.pref_show_rows_per_page + '</label>';
        pref_html += '</li>';

        pref_html += '</ul>';

        $("#" + dialog_id).html(pref_html);

        pref_id = dialog_id + '_slider';
        state = $("#" + plugin_container_id).jui_pagination('getOption', 'useSlider');
        $("#" + pref_id).attr("checked", state);

        pref_id = dialog_id + '_goto_page';
        state = $("#" + plugin_container_id).jui_pagination('getOption', 'showGoToPage');
        $("#" + pref_id).attr("checked", state);

        pref_id = dialog_id + '_rows_per_page';
        state = $("#" + plugin_container_id).jui_pagination('getOption', 'showRowsPerPage');
        $("#" + pref_id).attr("checked", state);
    };

    /**
     * Create nagivation pages
     * @param container_id
     */
    var create_nav_items = function(container_id) {

        // retrieve options
        var elem = $("#" + container_id);
        var s = $(elem).jui_pagination('getAllOptions');

        var navPagesMode = s.navPagesMode;

        var totalPages = s.totalPages;
        var currentPage = s.currentPage;
        var visiblePageLinks = s.visiblePageLinks;

        var showNavPages = s.showNavPages;
        var showNavButtons = s.showNavButtons;

        var navItemClass = s.navItemClass;
        var navItemSelectedClass = s.navItemSelectedClass;
        var navItemHoverClass = s.navItemHoverClass;
        var navDotsLeftClass = s.navDotsLeftClass;
        var navDotsRightClass = s.navDotsRightClass;

        var nav_top_id = create_id(s.nav_top_id_prefix, container_id);
        var nav_prev_id = create_id(s.nav_prev_id_prefix, container_id);
        var nav_dots_left_id = create_id(s.nav_dots_left_id_prefix, container_id);
        var nav_pages_id = create_id(s.nav_pages_id_prefix, container_id);
        var nav_item_id_prefix = create_id(s.nav_item_id_prefix, container_id) + '_';
        var nav_dots_right_id = create_id(s.nav_dots_right_id_prefix, container_id);
        var nav_next_id = create_id(s.nav_next_id_prefix, container_id);
        var nav_last_id = create_id(s.nav_last_id_prefix, container_id);

        var selector = '';
        var i;
        var nav_html = '';
        var goto = parseInt(currentPage);

        if(navPagesMode == 'continuous') {

            var nav_start, nav_end, mod, offset, totalSections;
            nav_start = goto;

            // detect possible offset to navigation pages
            if(totalPages < visiblePageLinks) {
                nav_start = 1;
                nav_end = totalPages;
            } else {
                totalSections = Math.ceil(totalPages / visiblePageLinks);
                if(nav_start > visiblePageLinks * (totalSections - 1)) {
                    nav_start = totalPages - visiblePageLinks + 1;
                } else {
                    mod = nav_start % visiblePageLinks;
                    if(mod == 0) {
                        offset = -visiblePageLinks + 1;
                    } else {
                        offset = -mod + 1;
                    }
                    nav_start += offset;
                }
                nav_end = nav_start + visiblePageLinks - 1;
            }

            // store nav_start nav_end
            elem.data('nav_start', nav_start);
            elem.data('nav_end', nav_end);

            // show - hide nav controls
            if(showNavButtons) {
                var tmp = (showNavPages ? nav_start : goto);
                selector = "#" + nav_top_id + ', ' + "#" + nav_prev_id;
                if(tmp > 1) {
                    $(selector).show();
                } else {
                    $(selector).hide();
                }

                tmp = (showNavPages ? nav_end : goto);
                selector = "#" + nav_next_id + ', ' + "#" + nav_last_id;
                if(tmp < totalPages) {
                    $(selector).show();
                } else {
                    $(selector).hide();
                }
            }

            // create nav pages html
            if(nav_start > 1) {
                nav_html += '<div id="' + nav_dots_left_id + '">...</div>';
            }
            for(i = nav_start; i <= nav_end; i++) {
                nav_html += '<div id="' + nav_item_id_prefix + i + '">' + i + '</div>';
            }
            if(nav_end < totalPages) {
                nav_html += '<div id="' + nav_dots_right_id + '">...</div>';
            }
            $("#" + nav_pages_id).html(nav_html);


        } else if(navPagesMode == 'first-last-always-visible') {

            if(totalPages <= 5) {
                for(i = 1; i <= totalPages; i++) {
                    nav_html += '<div id="' + nav_item_id_prefix + i + '">' + i + '</div>';
                }
            } else {

                var pageLinks = visiblePageLinks;
                if(pageLinks < 5) {
                    pageLinks = 5;
                }
                if(pageLinks > totalPages) {
                    pageLinks = totalPages;
                }

                var median_links = pageLinks - 2;
                var left_links = Math.floor((median_links - 1) / 2);
                var right_links = Math.ceil((median_links - 1) / 2);

                // create nav pages html
                if(goto <= median_links) {
                    for(i = 1; i <= median_links + 1; i++) {
                        nav_html += '<div id="' + nav_item_id_prefix + i + '">' + i + '</div>';
                    }
                    nav_html += '<div id="' + nav_dots_right_id + '">...</div>';
                    nav_html += '<div id="' + nav_item_id_prefix + totalPages + '">' + totalPages + '</div>';
                } else if(goto > totalPages - median_links) {
                    nav_html += '<div id="' + nav_item_id_prefix + '1' + '">1</div>';
                    nav_html += '<div id="' + nav_dots_left_id + '">...</div>';
                    for(i = totalPages - median_links; i <= totalPages; i++) {
                        nav_html += '<div id="' + nav_item_id_prefix + i + '">' + i + '</div>';
                    }
                } else {
                    nav_html += '<div id="' + nav_item_id_prefix + '1' + '">1</div>';
                    nav_html += '<div id="' + nav_dots_left_id + '">...</div>';
                    for(i = goto - left_links; i <= goto + right_links; i++) {
                        nav_html += '<div id="' + nav_item_id_prefix + i + '">' + i + '</div>';
                    }
                    nav_html += '<div id="' + nav_dots_right_id + '">...</div>';
                    nav_html += '<div id="' + nav_item_id_prefix + totalPages + '">' + totalPages + '</div>';
                }

            }

            $("#" + nav_pages_id).html(nav_html);

            // show - hide nav controls
            if(showNavButtons) {
                selector = "#" + nav_top_id + ', ' + "#" + nav_prev_id;
                if(goto > 1) {
                    $(selector).show();
                } else {
                    $(selector).hide();
                }

                selector = "#" + nav_next_id + ', ' + "#" + nav_last_id;
                if(goto < totalPages) {
                    $(selector).show();
                } else {
                    $(selector).hide();
                }
            }
        }

        // apply style for navigation items (pages)
        $("#" + nav_dots_left_id).removeClass().addClass(navDotsLeftClass);
        $("#" + nav_dots_right_id).removeClass().addClass(navDotsRightClass);

        $('[id^="' + nav_item_id_prefix + '"]').removeClass().addClass(navItemClass);
        $("#" + nav_item_id_prefix + goto).removeClass().addClass(navItemSelectedClass);

        if(navItemHoverClass != '') {
            $('[id^="' + nav_item_id_prefix + '"]').hover(
                function() {
                    $(this).addClass(navItemHoverClass);
                },
                function() {
                    $(this).removeClass(navItemHoverClass);
                }
            );
        }
    };

    /**
     * Update current page
     * @param container_id
     * @param goto_page
     * @param update_slider
     */
    var update_current_page = function(container_id, goto_page, update_slider) {

        // retrieve options
        var elem = $("#" + container_id);
        var s = $(elem).jui_pagination('getAllOptions');

        var totalPages = s.totalPages;

        var showCurrentPage = s.showCurrentPage;

        var sliderElementID = s.sliderElementID;
        var slider_id = (!sliderElementID ? create_id(s.slider_id_prefix, container_id) : sliderElementID);
        var sliderOrientation = s.sliderOrientation;

        var current_id = create_id(s.nav_current_page_id_prefix, container_id);
        var nav_item_id_prefix = create_id(s.nav_item_id_prefix, container_id) + '_';

        var navItemClass = s.navItemClass;
        var navItemSelectedClass = s.navItemSelectedClass;

        // change selected page, applying appropriate styles
        $('[id^="' + nav_item_id_prefix + '"]').removeClass().addClass(navItemClass);
        $("#" + nav_item_id_prefix + goto_page).removeClass().addClass(navItemSelectedClass);

        // update current page indicator
        if(showCurrentPage) {
            $("#" + current_id).text(goto_page);
        }

        // update slider if exists
        if(update_slider) {
            if(typeof($("#" + slider_id).data("slider")) == 'object') {
                $("#" + slider_id).slider({
                    'value': (sliderOrientation == 'horizontal' ? goto_page : totalPages - goto_page + 1)
                });
            }
        }

        // trigger event onChangePage
        elem.triggerHandler("onChangePage", goto_page);
    };

    /**
     * Change page
     * @param container_id
     * @param goto_page
     * @param update_nav_items
     * @param update_slider
     */
    var change_page = function(container_id, goto_page, update_nav_items, update_slider) {
        if(update_nav_items) {
            create_nav_items(container_id);
        }
        update_current_page(container_id, goto_page, update_slider);
    };

    $.fn.jui_pagination = function(method) {

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