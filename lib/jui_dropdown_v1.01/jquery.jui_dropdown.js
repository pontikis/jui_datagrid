/**
 * jquery plugin creates a simple dropdown menu
 * Requires jquery, jquery-ui, jquery-ui CSS
 * Copyright 2012 Christos Pontikis http://pontikis.net
 * Project page https://github.com/pontikis/jui_dropdown
 * Release 1.01 (5 Nov 2012)
 * License MIT
 */
"use strict";
(function($) {

    var pluginName = 'jui_dropdown';

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
                    var defaults = elem.jui_dropdown('getDefaults');
                    settings = $.extend({}, defaults, options);
                } else {
                    settings = $.extend({}, settings, options);
                }
                elem.data(pluginName, settings);

                // bind events
                elem.unbind("onSelect").bind("onSelect", settings.onSelect);

                elem.removeClass().addClass(settings.containerClass);

                var launcher_id = settings.launcher_id;
                var launcher_container_id = settings.launcher_container_id;
                var menu_id = settings.menu_id;
                var elem_launcher = $("#" + launcher_id);
                var elem_launcher_container = $("#" + launcher_container_id);
                var elem_menu = $("#" + menu_id);

                elem_launcher_container.removeClass(settings.launcherContainerClass).addClass(settings.launcherContainerClass);
                elem_launcher.removeClass(settings.launcherClass).addClass(settings.launcherClass);
                elem_menu.removeClass(settings.menuClass).addClass(settings.menuClass);

                if($.ui.version < "1.9.00") {
                    elem_menu.menu().hide();

                    elem_menu.off('click', "li").on('click', "li", function() {
                        elem.triggerHandler('onSelect', {index: parseInt($(this).index("#" + menu_id + " li")) + 1, id: $(this).attr("id")})
                    });
                } else {
                    elem_menu.menu({
                        select: function(event, ui) {
                            elem.triggerHandler('onSelect', {index: parseInt(ui.item.index("#" + menu_id + " li")) + 1, id: ui.item.attr("id")})
                        }
                    }).hide();
                }

                if(settings.launcher_is_UI_button) {
                    elem_launcher.button({
                        text: settings.launcherUIShowText,
                        icons: {
                            primary: settings.launcherUIPrimaryIconClass,
                            secondary: settings.launcherUISecondaryIconClass
                        }
                    });
                }

                elem.off('click', "#" + launcher_id).on('click', "#" + launcher_id, function() {

                    if(!settings.launcher_is_UI_button && settings.toggle_launcher) {
                        elem_launcher.addClass(settings.launcherSelectedClass);
                    }

                    elem_menu.show().position({
                        my: settings.my_position,
                        at: settings.at_position,
                        of: elem_launcher_container
                    });

                    $(document).one("click", function() {
                        elem_menu.hide();
                        if(!settings.launcher_is_UI_button && settings.toggle_launcher) {
                            elem_launcher.removeClass(settings.launcherSelectedClass);
                        }
                    });

                    return false;
                });

            });

        },

        /**
         * Get default values
         * Usage: $(element).jui_dropdown('getDefaults');
         * @return {Object}
         */
        getDefaults: function() {
            return  {
                launcherContainerClass: 'launcherContainerClass',
                launcherClass: 'launcherClass',
                launcherSelectedClass: 'launcherSelectedClass ui-widget-header ui-corner-all',
                menuClass: 'menuClass',
                launcher_is_UI_button: true,
                launcherUIShowText: true,
                launcherUIPrimaryIconClass: '',
                launcherUISecondaryIconClass: 'ui-icon-triangle-1-s',

                my_position: 'left top',
                at_position: 'left bottom',
                toggle_launcher: false,

                onSelect: function() {
                }
            };
        },

        /**
         * Get any option set to plugin using its name (as string)
         * Usage: $(element).jui_dropdown('getOption', some_option);
         * @param opt
         * @return {*}
         */
        getOption: function(opt) {
            var elem = this;
            return elem.data(pluginName)[opt];
        },

        /**
         * Get all options
         * Usage: $(element).jui_dropdown('getAllOptions');
         * @return {*}
         */
        getAllOptions: function() {
            var elem = this;
            return elem.data(pluginName);
        },

        /**
         * Set option
         * Usage: $(element).jui_dropdown('setOption', 'oprion_name',  'oprion_value',  reinit);
         * @param opt
         * @param val
         * @param reinit
         */
        setOption: function(opt, val, reinit) {
            var elem = this;
            elem.data(pluginName)[opt] = val;
            if(reinit) {
                elem.jui_dropdown('init');
            }
        },

        /**
         * Refresh plugin
         * Usage: $(element).jui_dropdown('refresh');
         * @return {*|jQuery}
         */
        refresh: function() {
            var elem = this;
            elem.jui_dropdown();
        },

        /**
         * Destroy plugin
         * Usage: $(element).jui_dropdown('destroy');
         * @return {*|jQuery}
         */
        destroy: function() {
            return $(this).each(function() {
                var $this = $(this);

                $this.removeData(pluginName);
            });
        }
    };

    /* private methods ------------------------------------------------------ */

    $.fn.jui_dropdown = function(method) {

        if(this.size() != 1) {
            var err_msg = 'You must use this plugin ' + pluginName + ' with a unique element (at once)';
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