/**
 * @fileOverview jui_filter_rules is a jQuery plugin, useful to create dataset filter rules as JSON object and the relevant WHERE SQL.
 *               <p>License MIT
 *               <br />Copyright 2012 Christos Pontikis <a href="http://pontikis.net">http://pontikis.net</a>
 *               <br />Project page <a href="https://github.com/pontikis/jui_filter_rules">https://github.com/pontikis/jui_filter_rules</a>
 * @version 1.0.0
 * @author Christos Pontikis http://pontikis.net
 * @requires jquery, (optional but highly recommended moment.js, jquery-ui)
 */

/**
 * See <a href="http://jquery.com">http://jquery.com</a>.
 * @name $
 * @class
 * See the jQuery Library  (<a href="http://jquery.com">http://jquery.com</a>) for full details.  This just
 * documents the function and classes that are added to jQuery by this plug-in.
 */

/**
 * See <a href="http://jquery.com">http://jquery.com</a>
 * @name fn
 * @class
 * See the jQuery Library  (<a href="http://jquery.com">http://jquery.com</a>) for full details.  This just
 * documents the function and classes that are added to jQuery by this plug-in.
 * @memberOf $
 */

/**
 * Pseudo-Namespace containing private methods (for documentation purposes)
 * @name _private_methods
 * @namespace
 */
"use strict";
(function($) {

    var pluginName = 'jui_filter_rules',
        pluginStatus = 'jui_filter_rules_status',
        filter_types = [
            "text",
            "number",
            "date"
        ], operators = [
            {type: "equal", accept_values: "yes", apply_to: ["text", "number", "date"], group: "equality"},
            {type: "not_equal", accept_values: "yes", apply_to: ["text", "number", "date"], group: "equality"},
            {type: "in", accept_values: "yes", apply_to: ["text", "number", "date"], group: "multiple_choice"},
            {type: "not_in", accept_values: "yes", apply_to: ["text", "number", "date"], group: "multiple_choice"},
            {type: "less", accept_values: "yes", apply_to: ["number", "date"], group: "inequality"},
            {type: "less_or_equal", accept_values: "yes", apply_to: ["number", "date"], group: "inequality"},
            {type: "greater", accept_values: "yes", apply_to: ["number", "date"], group: "inequality"},
            {type: "greater_or_equal", accept_values: "yes", apply_to: ["number", "date"], group: "inequality"},
            {type: "begins_with", accept_values: "yes", apply_to: ["text"], group: "substring"},
            {type: "not_begins_with", accept_values: "yes", apply_to: ["text"], group: "substring"},
            {type: "contains", accept_values: "yes", apply_to: ["text"], group: "substring"},
            {type: "not_contains", accept_values: "yes", apply_to: ["text"], group: "substring"},
            {type: "ends_with", accept_values: "yes", apply_to: ["text"], group: "substring"},
            {type: "not_ends_with", accept_values: "yes", apply_to: ["text"], group: "substring"},
            {type: "is_empty", accept_values: "no", apply_to: ["text"], group: "empty_string"},
            {type: "is_not_empty", accept_values: "no", apply_to: ["text"], group: "empty_string"},
            {type: "is_null", accept_values: "no", apply_to: ["text", "number", "date"], group: "null"},
            {type: "is_not_null", accept_values: "no", apply_to: ["text", "number", "date"], group: "null"}
        ];


    /* public methods ------------------------------------------------------- */
    var methods = {

        /**
         * @lends $.fn.jui_filter_rules
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
                    var defaults = elem.jui_filter_rules('getDefaults');
                    settings = $.extend({}, defaults, options);
                } else {
                    settings = $.extend({}, settings, options);
                }
                elem.data(pluginName, settings);

                // initialize plugin status
                if(typeof  elem.data(pluginStatus) === 'undefined') {
                    elem.data(pluginStatus, {});
                    elem.data(pluginStatus)['rule_id'] = 0;
                }

                var container_id = elem.attr("id");

                // simple validation
                validate_input(container_id);

                // bind events
                elem.unbind("onValidationError").bind("onValidationError", settings.onValidationError);

                var filters = settings.filters,

                    filters_list_id_prefix = create_id(settings.filters_list_id_prefix, container_id) + '_',
                    operators_container_id_prefix = create_id(settings.operators_container_id_prefix, container_id) + '_',
                    operators_list_id_prefix = create_id(settings.operators_list_id_prefix, container_id) + '_',
                    operator,
                    filter_value_container_id_prefix = create_id(settings.filter_value_container_id_prefix, container_id) + '_',
                    group_tools_id_prefix = create_id(settings.group_tools_id_prefix, container_id) + '_',
                    rule_tools_id_prefix = create_id(settings.rule_tools_id_prefix, container_id) + '_',
                    filters_list_id, operators_list_id, operators_container_id, filter_value_container_id,
                    elem_filters_list, elem_operators_list, elem_operators_container, elem_filter_value_container,
                    selector, len, rule_id, filter_index, group_selected, tool_selected;

                if(elem.data(pluginStatus)['rule_id'] == 0) {
                    if(filters.length > 0) {
                        elem.html(createRulesGroup(container_id));
                    }
                }

                elem.addClass(settings.containerClass);

                /* EVENTS --------------------------------------------------- */
                // rule group actions
                selector = '[id^="' + group_tools_id_prefix + '"]';
                elem.off('change', selector).on('change', selector, function() {
                    len = group_tools_id_prefix.length;
                    rule_id = $(this).attr("id").substr(len);
                    group_selected = $(this).val();

                    switch(group_selected) {
                        case "rule_insert_before":
                            $(this).closest("dt").parent("dl").before(createRule(container_id));
                            break;
                        case "rule_insert_after":
                            $(this).closest("dt").parent("dl").after(createRule(container_id));
                            break;
                        case "rule_insert_inside":
                            $(this).closest("dt").next("dd:first").find("ul:first").prepend(createRule(container_id));
                            break;
                        case "group_insert_before":
                            $(this).closest("dl").before(createRulesGroup(container_id));
                            break;
                        case "group_insert_after":
                            $(this).closest("dl").after(createRulesGroup(container_id));
                            break;
                        case "group_insert_inside":
                            $(this).closest("dt").next("dd:first").find("ul:first").prepend(createRulesGroup(container_id));
                            break;
                        case "group_delete":
                            $(this).closest("dl").remove();
                            break;
                    }

                    $(this).prop("selectedIndex", 0);

                });

                // rule actions
                selector = '[id^="' + rule_tools_id_prefix + '"]';
                elem.off('change', selector).on('change', selector, function() {
                    len = rule_tools_id_prefix.length;
                    rule_id = $(this).attr("id").substr(len);
                    tool_selected = $(this).val();

                    switch(tool_selected) {
                        case "rule_insert_before":
                            $(this).closest("li").before(createRule(container_id));
                            break;
                        case "rule_insert_after":
                            $(this).closest("li").after(createRule(container_id));
                            break;
                        case "rule_clear":
                            filters_list_id = filters_list_id_prefix + rule_id;
                            operators_container_id = operators_container_id_prefix + rule_id;
                            filter_value_container_id = filter_value_container_id_prefix + rule_id;
                            elem_filters_list = $("#" + filters_list_id);
                            elem_operators_container = $("#" + operators_container_id);
                            elem_filter_value_container = $("#" + filter_value_container_id);

                            elem_filters_list.prop("selectedIndex", 0);
                            elem_operators_container.html('');
                            elem_filter_value_container.html('');
                            break;
                        case "rule_delete":
                            $(this).closest("li").remove();
                            break;
                        case "group_insert_before":
                            $(this).closest("li").before(createRulesGroup(container_id));
                            break;
                        case "group_insert_after":
                            $(this).closest("li").after(createRulesGroup(container_id));
                            break;
                    }

                    $(this).prop("selectedIndex", 0);

                });

                // change filter
                selector = '[id^="' + filters_list_id_prefix + '"]';
                elem.off('change', selector).on('change', selector, function() {
                    len = filters_list_id_prefix.length;
                    rule_id = $(this).attr("id").substr(len);
                    filter_index = $(this).prop('selectedIndex') - 1;

                    operators_container_id = operators_container_id_prefix + rule_id;
                    operators_list_id = operators_list_id_prefix + rule_id;
                    filter_value_container_id = filter_value_container_id_prefix + rule_id;
                    elem_operators_container = $("#" + operators_container_id);
                    elem_filter_value_container = $("#" + filter_value_container_id);

                    elem_filter_value_container.show();
                    if(filter_index >= 0) {
                        elem_operators_container.html(create_operators_list(container_id, rule_id, $(this).val()));
                        elem_operators_list = $("#" + operators_list_id);
                        create_filter_value(container_id, rule_id, $(this).val(), elem_operators_list.val());
                    } else {
                        elem_operators_container.html('');
                        elem_filter_value_container.html('');
                    }
                });

                // change operator
                selector = '[id^="' + operators_list_id_prefix + '"]';
                elem.off('change', selector).on('change', selector, function() {
                    len = operators_list_id_prefix.length;
                    rule_id = $(this).attr("id").substr(len);

                    filters_list_id = filters_list_id_prefix + rule_id;
                    operators_list_id = operators_list_id_prefix + rule_id;
                    filter_value_container_id = filter_value_container_id_prefix + rule_id;
                    elem_filters_list = $("#" + filters_list_id);
                    elem_operators_list = $("#" + operators_list_id);
                    elem_filter_value_container = $("#" + filter_value_container_id);

                    operator = getOperator($(this).val());
                    if(operator.accept_values !== "yes") {
                        elem_filter_value_container.hide();
                    } else {
                        elem_filter_value_container.show();
                        if(elem_filter_value_container.html() == '') {
                            create_filter_value(container_id, rule_id, elem_filters_list.val(), elem_operators_list.val());
                        }
                    }
                });
            });

        },

        /**
         * Get default values
         * @example $(element).jui_filter_rules('getDefaults');
         * @return {Object}
         */
        getDefaults: function() {
            return {
                filters: [],

                filter_widget_locale: "",
                decimal_separator: ".",
                htmlentities: false,

                // styles
                containerClass: "filter_rules_container",

                rulesGroupContainerClass: "rules_group_container",
                rulesGroupHeaderClass: "rules_group_header",
                rulesGroupBodyClass: "rules_group_body",

                rulesGroupConditionContainerClass: "rules_group_condition_container",
                rulesGroupConditionListClass: "rules_group_condition_list",

                rulesGroupToolsContainerClass: "rules_group_tools_container",
                rulesGroupToolsListClass: "rules_group_tools_list",

                rulesListClass: "rules_list",
                rulesListLiClass: "rules_list_li",
                rulesListLiErrorClass: "rules_list_error_li",

                filterContainerClass: "filter_container",
                filterListClass: "filter_list",

                operatorsListContainerClass: "operators_list_container",
                operatorsListClass: "operators_list",

                filterValueContainerClass: "filter_value_container",
                filterInputTextClass: "filter_input_text",
                filterInputNumberClass: "filter_input_number",
                filterInputDateClass: "filter_input_date",
                filterInputCheckboxClass: "filter_input_checkbox",
                filterInputRadioClass: "filter_input_radio",
                filterSelectClass: "filter_select",

                filterGroupListClass: "filter_group_list",
                filterGroupListItemHorizontalClass: "filter_group_list_item_horizontal",
                filterGroupListItemVerticalClass: "filter_group_list_item_vertical",

                ruleToolsContainerClass: "rule_tools_container",
                ruleToolsClass: "rule_tools_list",

                // elements id prefix
                group_tools_id_prefix: "group_tools_",
                rule_li_id_prefix: "rule_",
                filters_list_id_prefix: "filters_list_",
                operators_container_id_prefix: "oper_wrap_",
                operators_list_id_prefix: "oper_list_",
                filter_value_container_id_prefix: "flt_wrap_",
                filter_element_id_prefix: "flt_",
                filter_element_name_prefix: "flt_name_",
                rule_tools_id_prefix: "rule_tools_",

                onValidationError: function() {
                }
            };
        },

        /**
         * Get any option set to plugin using its name (as string)
         * @example $(element).jui_filter_rules('getOption', some_option);
         * @param opt
         * @return {*}
         */
        getOption: function(opt) {
            var elem = this;
            return elem.data(pluginName)[opt];
        },

        /**
         * Get all options
         * @example $(element).jui_filter_rules('getAllOptions');
         * @return {*}
         */
        getAllOptions: function() {
            var elem = this;
            return elem.data(pluginName);
        },

        /**
         * Set option
         * @example $(element).jui_filter_rules('setOption', 'option_name',  'option_value',  reinit);
         * @param opt {string} option names
         * @param val
         * @param reinit {boolean}
         */
        setOption: function(opt, val, reinit) {
            var elem = this;
            elem.data(pluginName)[opt] = val;
            if(reinit) {
                elem.jui_filter_rules('init');
            }
        },

        /**
         * Destroy plugin
         * @example $(element).jui_filter_rules('destroy');
         * @return {*|jQuery}
         */
        destroy: function() {
            return $(this).each(function() {
                var $this = $(this);

                $this.removeData(pluginName);
            });
        },

        /**
         * Get rules
         * @example $(element).jui_filter_rules("getRules", 0, []);
         * @param rules_group_index (Number} the index of rules group
         * @param a_rules {Array} rules array
         * @return {*} rules array of false (on validation error)
         */
        getRules: function(rules_group_index, a_rules) {
            var elem = this,
                container_id = elem.attr("id"),
                rules_group, group_logical_operator,
                a_group_rules, a_group_rules_len, r, group_rule,
                current_rule, filter_name, filter_operator, current_filter, current_filter_value,
                rule_li_id_prefix = create_id(elem.jui_filter_rules("getOption", "rule_li_id_prefix"), container_id) + '_',
                rule_li_id_prefix_len = rule_li_id_prefix.length, rule_id,
                pos;

            rules_group = elem.find("dl").eq(rules_group_index);
            group_logical_operator = rules_group.find("dt:first").find("select:first").val();

            a_group_rules = rules_group.find("dd:first").find("ul:first").children().get();
            a_group_rules_len = a_group_rules.length;
            for(r = 0; r < a_group_rules_len; r++) {
                group_rule = a_group_rules[r];

                current_rule = {};
                if(group_rule.tagName == 'LI') {
                    // no filter set
                    if($(group_rule).find("select:first").prop("selectedIndex") == 0) {
                        continue;
                    }

                    rule_id = $(group_rule).attr("id").substr(rule_li_id_prefix_len);
                    current_rule.condition = {};

                    filter_name = $(group_rule).find("select:first").val();
                    current_filter = remove_obj_empty_props(getFilterByName(container_id, filter_name));
                    filter_operator = $(group_rule).find("select").eq(1).val();

                    current_rule.condition.filterType = current_filter.filterType;
                    current_rule.condition.field = current_filter.field;
                    current_rule.condition.operator = filter_operator;
                    current_filter_value = get_filter_value(container_id, rule_id, current_filter, filter_operator);
                    if(current_filter_value === false) {
                        return false;
                    } else {
                        current_rule.condition.filterValue = current_filter_value;
                    }

                    if(getOperator(filter_operator).accept_values == "yes") {
                        current_rule.filter_value_conversion_server_side = current_filter.filter_value_conversion_server_side;
                    }

                    current_rule.logical_operator = group_logical_operator;
                    a_rules.push(current_rule);
                } else if(group_rule.tagName == 'DL') {
                    current_rule.condition = [];
                    current_rule.logical_operator = group_logical_operator;
                    a_rules.push(current_rule);
                    pos = a_rules.length - 1;

                    rules_group_index = parseInt(rules_group_index) + 1;
                    elem.jui_filter_rules("getRules", rules_group_index, a_rules[pos].condition);

                    // cleanup empty groups
                    cleanup_empty_groups(a_rules);
                }
            }

            return a_rules;
        }
    };

    /* private methods ------------------------------------------------------ */

    /**
     * @lends _private_methods
     */

    /**
     * Validate input values
     * @param container_id
     */
    var validate_input = function(container_id) {
        var elem = $("#" + container_id),
            err_msg, i,
            filters = elem.jui_filter_rules("getOption", "filters"),
            filters_len = filters.length,
            filternames = [];

        // unique filter name
        for(i = 0; i < filters_len; i++) {
            filternames.push(filters[i].filterName);
        }
        if(array_has_duplicates(filternames)) {
            err_msg = 'Filternames are not unique...';
            elem.html('<span style="color: red;">' + 'ERROR: ' + err_msg + '</span>');
            $.error(err_msg);
        }

    };

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
     * Check array for duplicated values
     * @param arr
     * @return {Boolean}
     */
    var array_has_duplicates = function(arr) {

        var x = {}, len = arr.length, i;
        for(i = 0; i < len; i++) {
            if(x[arr[i]] === true) {
                return true;
            }
            x[arr[i]] = true;
        }
        return false;
    };

    /**
     *
     * @param value
     * @return {*}
     */
    var htmlEncode = function(value) {
        if(value) {
            return jQuery('<div />').text(value).html();
        } else {
            return '';
        }
    };

    /**
     *
     * @param value
     * @return {*}
     */
    var htmlDecode = function(value) {
        if(value) {
            return $('<div />').html(value).text();
        } else {
            return '';
        }
    };


    /**
     * Remove empty object properties
     * @param obj
     * @return {Object}
     */
    var remove_obj_empty_props = function(obj) {
        var obj_clone = {}, prop;
        for(prop in obj) {
            if(obj.hasOwnProperty(prop)) {
                if(obj[prop] !== "") {
                    obj_clone[prop] = obj[prop];
                }
            }
        }
        return obj_clone;
    };

    /**
     * Remove empty rule groups
     * @param {Array} a_rules
     */
    var cleanup_empty_groups = function(a_rules) {
        var i, condition, len = a_rules.length;
        for(i = 0; i < len; i++) {
            condition = a_rules[i].condition;
            if($.isArray(condition)) {
                if(condition.length == 0) {
                    a_rules.splice(i, 1);
                } else {
                    cleanup_empty_groups(condition);
                }
            }
        }

    };

    /**
     * Get filter attributes by filter name
     * @param {String} container_id
     * @param {String} filter_name
     * @return {*} filter object or undefined
     */
    var getFilterByName = function(container_id, filter_name) {
        var elem = $("#" + container_id),
            i, filters = elem.jui_filter_rules("getOption", "filters"),
            filters_len = filters.length,
            flt = undefined;

        for(i = 0; i < filters_len; i++) {
            if(filters[i].filterName == filter_name) {
                flt = filters[i];
                break;
            }
        }
        return flt;
    };

    /**
     * Get operators for filter type
     * @param filterName {string}
     * @return {Array}
     */
    var getOperators = function(container_id, filterName) {
        var elem = $("#" + container_id),
            filters = elem.jui_filter_rules("getOption", "filters"),
            filter, filter_type, excluded_operators,
            operators_len = operators.length,
            i, oper = [], item;

        filter = getFilterByName(container_id, filterName);
        filter_type = filter.filterType;
        excluded_operators = (filter.excluded_operators === undefined ? [] : filter.excluded_operators);

        for(i = 0; i < operators_len; i++) {
            if($.inArray(operators[i].type, excluded_operators) > -1) {
                continue;
            }
            if($.inArray(filter_type, operators[i].apply_to) > -1) {
                item = {};
                item.operator_type = operators[i].type;
                item.operator_label = rsc_jui_fr['operator_' + operators[i].type];
                item.group = operators[i].group;
                oper.push(item);
            }
        }
        return oper;

    };

    /**
     * Get operator attributes
     * @param operator_type
     * @return {*} operator object or undefined
     */
    var getOperator = function(operator_type) {
        var i,
            operators_len = operators.length,
            oper = undefined;

        for(i = 0; i < operators_len; i++) {
            if(operators[i].type == operator_type) {
                oper = operators[i];
                break;
            }
        }
        return oper;
    };

    /**
     * Create rules group condition select (AND - OR)
     * @return {String}
     */
    var create_group_condition = function(container_id) {
        var elem = $("#" + container_id),
            rulesGroupConditionContainerClass = elem.jui_filter_rules('getOption', 'rulesGroupConditionContainerClass'),
            rulesGroupConditionListClass = elem.jui_filter_rules('getOption', 'rulesGroupConditionListClass'),
            gc_html = '';

        gc_html += '<div class="' + rulesGroupConditionContainerClass + '">';
        gc_html += '<select class="' + rulesGroupConditionListClass + '">';
        gc_html += '<option value="AND">' + rsc_jui_fr.rules_group_AND + ':' + '</option>';
        gc_html += '<option value="OR">' + rsc_jui_fr.rules_group_OR + ':' + '</option>';
        gc_html += '</select>';
        gc_html += '</div>';
        return gc_html;

    };

    /**
     * Cgeate rules group tools dropdown list
     * @param container_id {String}
     * @return {String}
     */
    var create_rules_group_tools = function(container_id) {
        var elem = $("#" + container_id),
            rule_id = parseInt(elem.data(pluginStatus)["rule_id"]),

            rulesGroupToolsContainerClass = elem.jui_filter_rules("getOption", "rulesGroupToolsContainerClass"),
            rulesGroupToolsListClass = elem.jui_filter_rules("getOption", "rulesGroupToolsListClass"),

            group_tools_id = create_id(elem.jui_filter_rules("getOption", "group_tools_id_prefix"), container_id) + '_' + rule_id,

            disabled_html = (rule_id == 0 ? ' disabled="disabled"' : ''),
            shrink_class_html = ($.browser.msie && parseInt($.browser.version) < 9 ? '' : ' tools_list_shrink'),
            tools_html = '';

        tools_html += '<div class="' + rulesGroupToolsContainerClass + '">';
        tools_html += '<select id="' + group_tools_id + '" class="' + rulesGroupToolsListClass + shrink_class_html + '">';

        tools_html += '<option value="please_select">' + rsc_jui_fr.tools_please_select + '</option>';

        tools_html += '<optgroup label="' + rsc_jui_fr.rule + '">';
        tools_html += '<option value="rule_insert_before"' + disabled_html + '>' + rsc_jui_fr.rule_insert_before + '</option>';
        tools_html += '<option value="rule_insert_after"' + disabled_html + '>' + rsc_jui_fr.rule_insert_after + '</option>';
        tools_html += '<option value="rule_insert_inside">' + rsc_jui_fr.rule_insert_inside + '</option>';
        tools_html += '</optgroup>';

        tools_html += '<optgroup label="' + rsc_jui_fr.group + '">';
        tools_html += '<option value="group_insert_before"' + disabled_html + '>' + rsc_jui_fr.group_insert_before + '</option>';
        tools_html += '<option value="group_insert_after"' + disabled_html + '>' + rsc_jui_fr.group_insert_after + '</option>';
        tools_html += '<option value="group_insert_inside">' + rsc_jui_fr.group_insert_inside + '</option>';
        tools_html += '<option value="group_delete"' + disabled_html + '>' + rsc_jui_fr.group_delete + '</option>';
        tools_html += '</optgroup>';

        tools_html += '</select>';
        tools_html += '</div>';

        return tools_html;
    };

    /**
     * Create filters list
     * @param container_id {string}
     * @return {String} filter list html
     */
    var create_filters_list = function(container_id) {
        var elem = $("#" + container_id),
            rule_id = parseInt(elem.data(pluginStatus)["rule_id"]),
            filters = elem.jui_filter_rules('getOption', 'filters'),
            filters_len = filters.length,
            filterContainerClass = elem.jui_filter_rules("getOption", "filterContainerClass"),
            filterListClass = elem.jui_filter_rules("getOption", "filterListClass"),
            filters_list_id = create_id(elem.jui_filter_rules("getOption", "filters_list_id_prefix"), container_id) + '_' + rule_id,
            i, f_html = '';

        f_html += '<div class="' + filterContainerClass + '">';
        f_html += '<select id="' + filters_list_id + '" class="' + filterListClass + '">';
        f_html += '<option value="no_filter">' + rsc_jui_fr.filter_please_select + '</option>';
        for(i = 0; i < filters_len; i++) {
            f_html += '<option value="' + filters[i].filterName + '">' + filters[i].filterLabel + '</option>';
        }
        f_html += '</select>';
        f_html += '</div>';

        return f_html;

    };

    /**
     * Create operator list
     * @param container_id
     * @param rule_id
     * @param filterName
     */
    var create_operators_list = function(container_id, rule_id, filterName) {
        var elem = $("#" + container_id),
            operators_container_id = create_id(elem.jui_filter_rules("getOption", "operators_container_id_prefix"), container_id) + '_' + rule_id,
            elem_operators_container = $("#" + operators_container_id),
            operatorsListClass = elem.jui_filter_rules("getOption", "operatorsListClass"),
            operators_list_id_prefix = create_id(elem.jui_filter_rules("getOption", "operators_list_id_prefix"), container_id) + '_',
            operators_list_id = operators_list_id_prefix + rule_id,
            oper, i, len, oper_html = '', operators_group = '';

        oper = getOperators(container_id, filterName);
        len = oper.length;

        oper_html += '<select id="' + operators_list_id + '" class="' + operatorsListClass + '">';
        for(i = 0; i < len; i++) {
            if(oper[i].group !== operators_group) {
                oper_html += '<optgroup label="&raquo;">';
                operators_group = oper[i].group;
            }
            oper_html += '<option value="' + oper[i].operator_type + '"' + '>' + oper[i].operator_label + '</option>';
            if(i < len - 1 && oper[parseInt(i) + 1].group !== operators_group) {
                oper_html += '</optgroup>';
            }
        }
        oper_html += '</select>';

        elem_operators_container.html(oper_html);
    };


    /**
     * Create inputs or widgets for the user to set filter values
     * @param container_id {String}
     * @param rule_id {String}
     * @param filterName {String}
     * @param operator_type {String}
     * @return {Boolean}
     */
    var create_filter_value = function(container_id, rule_id, filterName, operator_type) {
        var elem = $("#" + container_id),
            operator = getOperator(operator_type),
            filter_value_container_id = create_id(elem.jui_filter_rules("getOption", "filter_value_container_id_prefix"), container_id) + '_' + rule_id,
            elem_filter_value_container = $("#" + filter_value_container_id),
            filters = elem.jui_filter_rules('getOption', 'filters'),
            filter = remove_obj_empty_props(getFilterByName(container_id, filterName)),
            filter_type = filter.filterType,
            filter_interface = filter.filter_interface,
            filter_interface_len = filter_interface.length, i,
            filter_element, filter_element_id, filter_element_name, filter_input_type = "", filter_element_attributes, fe_attr,
            a_ignore_attributes = ["id", "name"],
            class_name_default = "",
            filter_lookup_data, filter_lookup_data_len, lk, selected_html, lookup_values_ajax_url = "",
            vertical_orientation = "no", group_list_item_class,
            group_list_class = elem.jui_filter_rules("getOption", "filterGroupListClass"),
            filterGroupListItemHorizontalClass = elem.jui_filter_rules("getOption", "filterGroupListItemHorizontalClass"),
            filterGroupListItemVerticalClass = elem.jui_filter_rules("getOption", "filterGroupListItemVerticalClass"),
            filter_widget_locale = elem.jui_filter_rules("getOption", "filter_widget_locale"),
            f_html = '';

        if(operator.accept_values !== "yes") {
            elem_filter_value_container.html('');
            return true;
        }

        if(filter.hasOwnProperty("lookup_values_ajax_url")) {
            lookup_values_ajax_url = filter["lookup_values_ajax_url"];

            $.ajax({
                url: lookup_values_ajax_url,
                success: (function(data) {
                    filter_lookup_data = $.parseJSON(data);
                    elem_filter_value_container.html(create_filter_value_html());
                    apply_widgets();
                })
            });

        } else {
            if(filter.hasOwnProperty("lookup_values")) {
                filter_lookup_data = filter["lookup_values"];
            }
            elem_filter_value_container.html(create_filter_value_html());
            apply_widgets();
        }

        // ---------------------------------------------------------------------
        function create_filter_value_html() {
            for(i = 0; i < filter_interface_len; i++) {

                filter_element = filter_interface[i].filter_element;
                filter_element_attributes = remove_obj_empty_props(filter_interface[i].filter_element_attributes);
                if(filter_element == "input") {
                    filter_input_type = filter_element_attributes["type"];
                }
                setFilterElementIgnoreProperties();

                if(filter_input_type == "checkbox" || filter_input_type == "radio") {

                    setFilterGroupClass();
                    filter_lookup_data_len = filter_lookup_data.length;
                    f_html += '<ul class="' + group_list_class + '">';
                    for(lk = 0; lk < filter_lookup_data_len; lk++) {
                        f_html += '<li class="' + group_list_item_class + '">';
                        f_html += '<' + filter_element;
                        setFilterElementID(lk);
                        f_html += ' id="' + filter_element_id + '"';
                        if(filter_input_type == "radio") {
                            setFilterElementName();
                            f_html += ' name="' + filter_element_name + '"';
                        }
                        setFilterElementAttributes();
                        f_html += ' value="' + filter_lookup_data[lk]["lk_value"] + '"';
                        selected_html = (filter_lookup_data[lk]["lk_selected"] == 'yes' ? ' checked="checked"' : '');
                        f_html += selected_html;
                        f_html += '>';
                        f_html += '<label for="' + filter_element_id + '">' + filter_lookup_data[lk]["lk_option"] + '</label>';
                        f_html += '</li>';
                    }
                    f_html += '</ul>';

                } else {
                    f_html += '<' + filter_element;
                    setFilterElementID(i);
                    f_html += ' id="' + filter_element_id + '"';
                    setFilterElementAttributes();
                    f_html += '>';
                    if(filter_element == "select") {
                        createFilterElementSelectOptions();
                    }
                    if(filter_element == "div") {
                        f_html += '</div>';
                    }
                }
            }
            return f_html;
        }

        // ---------------------------------------------------------------------
        function setFilterElementID(group_index) {
            filter_element_id = create_id(elem.jui_filter_rules("getOption", "filter_element_id_prefix"), container_id)
                + '_' + rule_id
                + '_' + group_index;
        }

        // ---------------------------------------------------------------------
        function setFilterElementName() {
            filter_element_name = create_id(elem.jui_filter_rules("getOption", "filter_element_name_prefix"), container_id) + '_' + rule_id;
        }

        // ---------------------------------------------------------------------
        function setFilterElementIgnoreProperties() {
            if(filter_element == "input") {
                if(filter_input_type == "text") {
                    a_ignore_attributes = ["id", "name"]
                } else if(filter_input_type == "radio") {
                    a_ignore_attributes = ["id", "name", "value", "checked"]
                } else if(filter_input_type == "checkbox") {
                    a_ignore_attributes = ["id", "name", "value", "checked"]
                }
            } else if(filter_element == "select") {
                a_ignore_attributes = ["id", "name", "value"]
            }
        }

        // ---------------------------------------------------------------------
        function setFilterElementDefaultClass() {
            var class_option = "";
            class_name_default = "";

            if(filter_element == "input") {
                if(filter_input_type == "text") {
                    if(filter_type == "text") {
                        class_option = "filterInputTextClass";
                    } else if(filter_type == "number") {
                        class_option = "filterInputNumberClass";
                    } else if(filter_type == "date") {
                        class_option = "filterInputDateClass";
                    }
                } else if(filter_input_type == "radio") {
                    class_option = "filterInputRadioClass";
                } else if(filter_input_type == "checkbox") {
                    class_option = "filterInputCheckboxClass";
                }
            } else if(filter_element == "select") {
                class_option = "filterSelectClass";
            }
            if(class_option !== "") {
                class_name_default = elem.jui_filter_rules('getOption', class_option);
            }
        }

        // ---------------------------------------------------------------------
        function setFilterElementAttributes() {
            for(fe_attr in filter_element_attributes) {
                if(filter_element_attributes.hasOwnProperty(fe_attr)) {
                    if($.inArray(fe_attr, a_ignore_attributes) > -1) {
                        continue;
                    }
                    f_html += ' ' + fe_attr + '="' + filter_element_attributes[fe_attr] + '"';
                }
            }
            if(!filter_element_attributes.hasOwnProperty("class")) {
                setFilterElementDefaultClass();
                if(class_name_default !== "") {
                    f_html += ' class="' + class_name_default + '"';
                }
            }
        }

        // ---------------------------------------------------------------------
        function createFilterElementSelectOptions() {
            filter_lookup_data_len = filter_lookup_data.length;

            for(lk = 0; lk < filter_lookup_data_len; lk++) {
                selected_html = (filter_lookup_data[lk]["lk_selected"] == 'yes' ? ' selected="selected"' : '');
                f_html += '<option value="' + filter_lookup_data[lk]["lk_value"] + '"' + selected_html + '>' + filter_lookup_data[lk]["lk_option"] + '</option>';
            }
            f_html += '</select>';
        }

        // ---------------------------------------------------------------------
        function setFilterGroupClass() {
            vertical_orientation = "no";
            if(filter_interface[i].hasOwnProperty("vertical_orientation")) {
                vertical_orientation = filter_interface[i].vertical_orientation;
            }
            group_list_item_class = (vertical_orientation == "yes" ? filterGroupListItemVerticalClass : filterGroupListItemHorizontalClass);
        }

        // ---------------------------------------------------------------------
        function apply_widgets() {

            if(filter_input_type == "checkbox" || filter_input_type == "radio") {
                return true;
            }

            for(i = 0; i < filter_interface_len; i++) {
                if(!filter_interface[i].hasOwnProperty("filter_widget")) {
                    continue;
                }

                filter_element_id = create_id(elem.jui_filter_rules("getOption", "filter_element_id_prefix"), container_id) + '_' + rule_id
                    + '_' + i;
                var elem_filter = $("#" + filter_element_id);
                var filter_widget = filter_interface[i]["filter_widget"];
                var filter_widget_properties = filter_interface[i]["filter_widget_properties"];

                if(filter_widget == "datepicker") {
                    elem_filter.datepicker(
                        filter_widget_properties,
                        $.datepicker.regional[ filter_widget_locale ]
                    );
                }
                if(filter_widget == "datetimepicker") {
                    elem_filter.datetimepicker(
                        filter_widget_properties,
                        $.datepicker.regional[ filter_widget_locale ],
                        $.timepicker.regional[ filter_widget_locale ]);
                }

                if(filter_widget == "autocomplete") {
                    elem_filter.autocomplete(filter_widget_properties);
                }

                if(filter_widget == "spinner") {
                    elem_filter.spinner(filter_widget_properties);
                }

                if(filter_widget == "slider") {
                    elem_filter.slider(filter_widget_properties);
                }
            }

            return true;
        }

        // ---------------------------------------------------------------------
        return true;
    };

    /**
     * Create rule tools dropdown list
     * @param container_id {string}
     * @return {String}
     */
    var create_rule_tools = function(container_id) {
        var elem = $("#" + container_id),
            rule_id = parseInt(elem.data(pluginStatus)["rule_id"]),

            ruleToolsContainerClass = elem.jui_filter_rules("getOption", "ruleToolsContainerClass"),
            ruleToolsClass = elem.jui_filter_rules("getOption", "ruleToolsClass"),

            rule_tools_id = create_id(elem.jui_filter_rules("getOption", "rule_tools_id_prefix"), container_id) + '_' + rule_id,

            shrink_class_html = ($.browser.msie && parseInt($.browser.version) < 9 ? '' : ' tools_list_shrink'),
            tools_html = '';

        tools_html += '<div class="' + ruleToolsContainerClass + '">';
        tools_html += '<select id="' + rule_tools_id + '" class="' + ruleToolsClass + shrink_class_html + '">';

        tools_html += '<option value="please_select">' + rsc_jui_fr.tools_please_select + '</option>';

        tools_html += '<optgroup label="' + rsc_jui_fr.rule + '">';
        tools_html += '<option value="rule_insert_before">' + rsc_jui_fr.rule_insert_before + '</option>';
        tools_html += '<option value="rule_insert_after">' + rsc_jui_fr.rule_insert_after + '</option>';
        tools_html += '<option value="rule_clear">' + rsc_jui_fr.rule_clear + '</option>';
        tools_html += '<option value="rule_delete">' + rsc_jui_fr.rule_delete + '</option>';
        tools_html += '</optgroup>';

        tools_html += '<optgroup label="' + rsc_jui_fr.group + '">';
        tools_html += '<option value="group_insert_before">' + rsc_jui_fr.group_insert_before + '</option>';
        tools_html += '<option value="group_insert_after">' + rsc_jui_fr.group_insert_after + '</option>';
        tools_html += '</optgroup>';

        tools_html += '</select>';
        tools_html += '</div>';

        return tools_html;
    };


    /**
     * Create a group of rules (with the first rule)
     * @param container_id
     * @return {String}
     */
    var createRulesGroup = function(container_id) {
        var elem = $("#" + container_id),
            rulesGroupContainerClass = elem.jui_filter_rules("getOption", "rulesGroupContainerClass"),
            rulesGroupHeaderClass = elem.jui_filter_rules("getOption", "rulesGroupHeaderClass"),
            rulesGroupBodyClass = elem.jui_filter_rules("getOption", "rulesGroupBodyClass"),
            rulesListClass = elem.jui_filter_rules("getOption", "rulesListClass"),
            rg_html = '';

        rg_html += '<dl class="' + rulesGroupContainerClass + '">';

        rg_html += '<dt class="' + rulesGroupHeaderClass + '">';
        rg_html += create_group_condition(container_id);
        rg_html += create_rules_group_tools(container_id);
        rg_html += '</dt>';

        rg_html += '<dd class="' + rulesGroupBodyClass + '">';
        rg_html += '<ul class="' + rulesListClass + '">';
        rg_html += createRule(container_id);
        rg_html += '</ul>';
        rg_html += '</dd>';

        rg_html += '</dl>';

        return rg_html;

    };

    /**
     * Create rule
     * @param container_id {String}
     * @return {String}
     */
    var createRule = function(container_id) {
        var elem = $("#" + container_id),
            rulesListLiClass = elem.jui_filter_rules("getOption", "rulesListLiClass"),
            operatorsListContainerClass = elem.jui_filter_rules("getOption", "operatorsListContainerClass"),
            filterValueContainerClass = elem.jui_filter_rules("getOption", "filterValueContainerClass"),
            rule_li_id_prefix = create_id(elem.jui_filter_rules("getOption", "rule_li_id_prefix"), container_id) + '_',
            operators_container_id_prefix = create_id(elem.jui_filter_rules("getOption", "operators_container_id_prefix"), container_id) + '_',
            filter_value_container_id_prefix = create_id(elem.jui_filter_rules("getOption", "filter_value_container_id_prefix"), container_id) + '_',
            rule_li_id, operators_container_id, filter_value_container_id,
            r_html = '';

        var rule_id = parseInt(elem.data(pluginStatus)["rule_id"]) + 1;
        elem.data(pluginStatus)["rule_id"] = rule_id;

        operators_container_id = operators_container_id_prefix + rule_id;
        filter_value_container_id = filter_value_container_id_prefix + rule_id;
        rule_li_id = rule_li_id_prefix + rule_id;

        r_html += '<li id="' + rule_li_id + '" class="' + rulesListLiClass + '">';

        r_html += create_filters_list(container_id);

        r_html += '<div id="' + operators_container_id + '" class="' + operatorsListContainerClass + '">';
        r_html += '</div>';

        r_html += '<div id="' + filter_value_container_id + '" class="' + filterValueContainerClass + '">';
        r_html += '</div>';

        r_html += create_rule_tools(container_id);

        r_html += '</li>';

        return r_html;

    };


    /**
     * Get filter value
     * @param container_id
     * @param rule_id
     * @param filter
     * @param operator_type
     * @return {Array} or false if input validation failed
     */
    var get_filter_value = function(container_id, rule_id, filter, operator_type) {
        var elem = $("#" + container_id),
            filter_type = filter.filterType,
            filter_interface = filter.filter_interface,
            filter_interface_len = filter_interface.length, i,
            filter_element,
            filter_element_id_prefix = elem.jui_filter_rules("getOption", "filter_element_id_prefix"),
            filter_element_id, filter_input_type = "", filter_element_attributes,
            group_elems,
            operator = getOperator(operator_type),
            elem_rule_id = create_id(elem.jui_filter_rules("getOption", "rule_li_id_prefix"), container_id) + '_' + rule_id,
            elem_rule = $("#" + elem_rule_id),
            rulesListLiErrorClass = elem.jui_filter_rules("getOption", "rulesListLiErrorClass"),
            decimal_separator = elem.jui_filter_rules("getOption", "decimal_separator"),
            dc_regex_pattern = new RegExp(decimal_separator, "g"),
            htmlentities = elem.jui_filter_rules("getOption", "htmlentities"),
            elem_filter, filter_value = [], filter_value_len, v,
            filter_value_conversion, conversion_function = "", conversion_args = [], arg_len, a;

        elem_rule.removeClass(rulesListLiErrorClass);

        if(operator.accept_values !== "yes") {
            return filter_value;
        }

        for(i = 0; i < filter_interface_len; i++) {

            if(filter_interface[i].hasOwnProperty("returns_no_value")) {
                if(filter_interface[i]["returns_no_value"] == "yes") {
                    continue;
                }
            }

            filter_element = filter_interface[i].filter_element;
            filter_element_attributes = filter_interface[i].filter_element_attributes;

            if(filter_element == "input") {
                filter_input_type = filter_element_attributes["type"];
                if(filter_input_type == "text") {
                    filter_element_id = getFilterElementID(i);
                    elem_filter = $("#" + filter_element_id);
                    filter_value.push(elem_filter.val());
                }
                if(filter_input_type == "checkbox" || filter_input_type == "radio") {
                    group_elems = $('[id^="' + create_id(filter_element_id_prefix, container_id) + '_' + rule_id + '_' + '"]');
                    group_elems.each(function() {
                        if($(this).is(":checked"))
                            filter_value.push($(this).val());
                    })
                }
            }
            if(filter_element == "select") {
                filter_element_id = getFilterElementID(i);
                elem_filter = $("#" + filter_element_id);
                if(filter_element_attributes.hasOwnProperty("multiple")) {
                    filter_value = elem_filter.val();
                } else {
                    filter_value.push(elem_filter.val());
                }

            }
        }

        // No value validation
        filter_value_len = filter_value.length;
        for(v = 0; v < filter_value_len; v++) {
            if($.trim(filter_value[v]).length == 0) {
                elem_rule.addClass(rulesListLiErrorClass);
                elem.triggerHandler("onValidationError", {err_num: 1, err_description: rsc_jui_fr.error_no_value_given, elem_filter: elem_filter});
                return false;
            }
        }

        // Numeric validation
        if(filter_type == "number") {
            filter_value_len = filter_value.length;
            for(v = 0; v < filter_value_len; v++) {
                // set decimal separator
                filter_value[v] = filter_value[v].replace(dc_regex_pattern, ".");
                if(!$.isNumeric(filter_value[v])) {
                    elem_rule.addClass(rulesListLiErrorClass);
                    elem.triggerHandler("onValidationError", {err_num: 2, err_description: rsc_jui_fr.error_invalid_number, elem_filter: elem_filter});
                    return false;
                }
            }
        }

        // Date validation (using moment.js)
        if(filter_type == "date") {
            filter_value_len = filter_value.length;
            if(filter.hasOwnProperty("validate_dateformat")) {
                for(v = 0; v < filter_value_len; v++) {
                    if(moment(filter_value[v], filter.validate_dateformat).isValid() == false) {
                        elem_rule.addClass(rulesListLiErrorClass);
                        elem.triggerHandler("onValidationError", {err_num: 3, err_description: rsc_jui_fr.error_invalid_datetime, elem_filter: elem_filter});
                        return false;
                    }
                }
            }
        }

        // apply value conversion (if any)
        if(filter.hasOwnProperty("filter_value_conversion")) {
            filter_value_conversion = filter.filter_value_conversion;
            conversion_function = filter_value_conversion["function_name"];
            arg_len = filter_value_conversion["args"].length;
            for(a = 0; a < arg_len; a++) {
                conversion_args.push(filter_value_conversion["args"][a]);
            }

            filter_value_len = filter_value.length;
            for(v = 0; v < filter_value_len; v++) {
                if(v == 0) {
                    conversion_args.push(filter_value[v]);
                } else {
                    arg_len = conversion_args.length;
                    conversion_args[arg_len - 1] = filter_value[v];
                }
                try {
                    filter_value[v] = window[conversion_function].apply(null, conversion_args);
                }
                catch(err) {
                    elem_rule.addClass(rulesListLiErrorClass);
                    elem.triggerHandler("onValidationError", {err_num: 0, err_description: rsc_jui_fr.error_converting_value + ':\n\n' + err.message, elem_filter: elem_filter});
                    return false;
                }
            }
        }

        // encode html (against XSS attack)
        if(filter_type !== "number") {
            if(htmlentities) {
                filter_value_len = filter_value.length;
                for(v = 0; v < filter_value_len; v++) {
                    filter_value[v] = htmlEncode(filter_value[v]);
                }
            }
        }

        // ---------------------------------------------------------------------
        function getFilterElementID(group_index) {
            return create_id(filter_element_id_prefix, container_id) + '_' + rule_id + '_' + group_index;
        }

        return filter_value;

    };

    /**
     * jui_filter_rules - Create rules to filter dataset using jquery.
     *
     * @class jui_filter_rules
     * @memberOf $.fn
     */
    $.fn.jui_filter_rules = function(method) {

        // OPTIONAL
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