/**
 * jquery pagination plugin
 * Requires jquery, jquery-ui
 * Copyright 2012 Christos Pontikis (http://pontikis.net)
 * Project page https://github.com/pontikis/jui_pagination
 * Release 1.00 - ??/10/2012
 * License MIT
 */
(function($) {

    var pluginName = 'jui_pagination';

    // private methods

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
                        currentPage: 1,
                        visiblePageLinks: 10,
                        navPages_id_prefix: 'nav_',
                        slider_id_prefix: 'sld_',
                        next_id_prefix: 'next_',
                        last_id_prefix: 'last_',
                        top_id_prefix: 'top_',
                        prev_id_prefix: 'prev_',
                        onPageClick: function() {
                        }
                    };
                    settings = $.extend({}, defaults, options);
                    elem.data(pluginName, settings);
                } else {
                    settings = $.extend({}, settings, options);
                }

                var container_id = elem.attr("id");
                var nav_pages_id = elem.jui_pagination('getOption', 'navPages_id_prefix') + container_id;
                var slider_id = elem.jui_pagination('getOption', 'slider_id_prefix') + container_id;

                var nav_html = '';



                nav_html += '<div id="' + nav_pages_id + '" class="nav-pane ui-widget ui-widget-header ui-corner-all">';

                nav_html += '<div class="nav-item ui-widget-header"><a href="javascript:void(0);" class="nav-link">&laquo;</a></div>';
                nav_html += '<div class="nav-item ui-widget-header"><a href="javascript:void(0);" class="nav-link">&larr;</a></div>';

                nav_html += '<div class="nav-item ui-widget-header"><a href="javascript:void(0);" class="nav-link">1</a></div>';
                nav_html += '<div class="nav-item ui-widget-header">2</div>';
                nav_html += '<div class="nav-item ui-widget-header">3</div>';

                nav_html += '<div class="nav-item ui-widget-header"><a href="javascript:void(0);" class="nav-link">&rarr;</a></div>';
                nav_html += '<div class="nav-item ui-widget-header"><a href="javascript:void(0);" class="nav-link">&raquo;</a></div>';
                nav_html += '</div>';

                nav_html += '<div style="clear: both; padding-top: 5px; padding-bottom: 5px;"></div>';

                nav_html += '<div id="' + slider_id + '">';
                nav_html += '</div>';

                elem.html(nav_html);

                $("#" + slider_id).slider({});

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

    $.fn.jui_pagination = function(method) {

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