jui_pagination
==============

jQuery pagination plugin (using jQuery UI)

Copyright Christos Pontikis http://pontikis.net

* Requires jquery, jquery-ui slider, jquery-ui CSS (tested with jquery 1.8.2 and jquery-ui 1.9.0)
* For touch event support jquery.ui.touch-punch.min.js could be used (see folder /lib)

Current Release 1.00 (13 Oct 2012). Download [here].

License [MIT][mit]

[mit]: https://raw.github.com/pontikis/jui_pagination/master/MIT_LICENSE
[here]: https://github.com/pontikis/jui_pagination/zipball/v1.0.0

Usage:
------

HTML (head section)
------------------
```html
<link rel="stylesheet" href="/path/to/jqueryui_theme/jquery-ui.css">
<link rel="stylesheet" href="/path/to/jquery.jui_pagination.css">
<!--  if custom classes used -->
<link rel="stylesheet" href="/path/to/custom.css">

<script type="text/javascript" src="/path/to/jquery.js" type="text/javascript"></script>
<script type="text/javascript" src="/path/to/jquery-ui.js" type="text/javascript"></script>

<!--  if touch event support for touch devices is needed (see folder /lib) -->
<script src="/path/to/jquery.ui.touch-punch.min.js" type="text/javascript"></script>

<script type="text/javascript" src="/path/to/jquery.jui_pagination.js" type="text/javascript"></script>
```

JS code
-------

### Common
```javascript
$("#element_id").jui_pagination({
    totalPages: 103, // REQUIRED
    containerClass: 'some_class' // NOT MANDATORY
    visiblePageLinks: 10,  // default = 10

    onChangePage: function(event, page_num) {
        $("#result").html('Page changed to: ' + page_num);
    }
});
```

Preview:

![jui_pagination sample][sample]
[sample]: https://raw.github.com/pontikis/jui_pagination/master/demo/images/sample.png "jui_pagination common usage"


### Nav pane and slider inside their own divs
```javascript
$("#element_id").jui_pagination({
    totalPages: 24, // REQUIRED
    containerClass: 'some_class' // NOT MANDATORY
    visiblePageLinks: 5  // default = 10

    navPaneElementID: 'some_div_id',
    navPaneClass: 'custom_class_for_pane nav-pane ui-widget ui-widget-header ui-corner-all',

    sliderElementID: 'some_div_id',
    sliderClass: 'custom_class_for_slider',
    sliderOrientation: 'vertical',

    onChangePage: function(event, page_num) {
        $("#result").html('Page changed to: ' + page_num);
    }
});
```

Preview:

![jui_pagination sample][sample1]
[sample1]: https://raw.github.com/pontikis/jui_pagination/master/demo/images/sample1.png "jui_pagination with pane and slider inside their own divs"


Options
-------
```javascript
$("#element_id").jui_pagination({
    totalPages: 100, // REQUIRED

    containerClass: 'some_class', // NOT MANDATORY

    // DEFAULTS
    currentPage: 1,
    visiblePageLinks: 10,

    useNavPane: true,
    navPaneElementID: false,

    useSlider: true,
    sliderElementID: false,
    useSliderWithPagesCount: 0,
    sliderOrientation: 'horizontal',

    labelPage: 'Page',
    labelTotalPages: 'Total',

    navPaneClass: 'nav-pane ui-widget ui-widget-header ui-corner-all',
    navCurrentPageClass: 'current-page',
    navButtonClass: 'nav-button ui-widget-header',
    navDotsLeftClass: 'nav-dots-left',
    navPagesClass: 'nav-pages',
    navItemClass: 'nav-item ui-widget-header',
    navItemSelectedClass: 'nav-item ui-state-highlight ui-widget-header',
    navItemHoverClass: 'ui-state-hover',
    navDotsRightClass: 'nav-dots-right',
    navTotalPagesClass: 'total-pages',
    sliderClass: 'nav-slider',

    nav_pane_id_prefix: 'nav_pane_',
    nav_current_page_id_prefix: 'current_',
    nav_top_id_prefix: 'top_',
    nav_prev_id_prefix: 'prev_',
    nav_dots_left_id_prefix: 'dots_left_',
    nav_pages_id_prefix: 'pages_',
    nav_item_id_prefix: 'page_',
    nav_dots_right_id_prefix: 'dots_right_',
    nav_next_id_prefix: 'next_',
    nav_last_id_prefix: 'last_',
    nav_total_id_prefix: 'total_',
    divider_id_prefix: 'clear_',
    slider_id_prefix: 'sld_',
});
```

Default styling needs jquery-ui Themes CSS: http://jqueryui.com/themeroller/

Methods
------

### getDefaults
```javascript
$("#element_id").jui_pagination('getDefaults');
```
### getOption
```javascript
$("#element_id").jui_pagination('getOption', 'option_name');
```

### getAllOptions
```javascript
$("#element_id").jui_pagination('getAllOptions');
```

### setOption
```javascript
$("#element_id").jui_pagination('setOption', 'option_name', option_value, reinit);
```

#### Alternative way to set one or more options
```javascript
$("#element_id").jui_pagination({option1_name: option1_value, etc});
```

### destroy
```javascript
$("#element_id").jui_pagination('destroy');
```

Events
------

### onChangePage
```javascript
$("#element_id").jui_pagination({
    onChangePage: function() {
        // your code here
    }
});
```

Demo
----

JSFIDDLE demo DEMO http://jsfiddle.net/pontikis/zwL4F/ (not working with Internet Explorer)