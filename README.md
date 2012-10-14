jui_datagrid
============

jQuery datagrid plugin using jQuery UI

Copyright Christos Pontikis http://pontikis.net

It is using jui_pagination plugin (which requires jquery-ui)
* Requires jquery, jquery-ui slider, jquery-ui CSS (tested with jquery 1.8.2 and jquery-ui 1.9.0)
* For touch event support jquery.ui.touch-punch.min.js could be used (see folder /lib/jui_pagination/lib)

Current Release: ** STILL UNDER DEVELOPMENT... **

License [MIT][mit]
[mit]: https://raw.github.com/pontikis/jui_datagrid/dev/MIT_LICENSE

Usage:
------

HTML (head section)
------------------
```html
<link rel="stylesheet" href="/path/to/jqueryui_theme/jquery-ui.css">
<link rel="stylesheet" href="/path/to/jquery.jui_pagination.css">
<link rel="stylesheet" href="/path/to/jquery.jui_datagrid.css">
<!--  if custom classes used -->
<link rel="stylesheet" href="/path/to/custom.css">

<script type="text/javascript" src="/path/to/jquery.js" type="text/javascript"></script>
<script type="text/javascript" src="/path/to/jquery-ui.js" type="text/javascript"></script>

<!--  if touch event support for touch devices is needed (see folder /lib) -->
<script src="/path/to/jquery.ui.touch-punch.min.js" type="text/javascript"></script>

<script type="text/javascript" src="/path/to/jquery.jui_pagination.js" type="text/javascript"></script>
<script type="text/javascript" src="/path/to/jquery.jui_datagrid.js" type="text/javascript"></script>

```

JS code
-------

### Common
```javascript
$("#element_id").jui_datagrid({
    ajax_fetch_data_url: 'ajax_fetch_data2.php'
});
```

Preview:

![jui_datagrid sample][sample]
[sample]: https://raw.github.com/pontikis/jui_datagrid/dev/demo/images/sample.png "jui_datagrid common usage"


JSON data structure
-------------------

TODO


Options
-------
```javascript
$("#element_id").jui_datagrid({
    ajax_fetch_data_url: 'some_server_url', // REQUIRED

    // DEFAULTS
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

    rscNoRecords: 'No records found...'
});
```

Default styling needs jquery-ui Themes CSS: http://jqueryui.com/themeroller/

Methods
------

### getDefaults
```javascript
$("#element_id").jui_datagrid('getDefaults');
```
### getOption
```javascript
$("#element_id").jui_datagrid('getOption', 'option_name');
```

### getAllOptions
```javascript
$("#element_id").jui_datagrid('getAllOptions');
```

### setOption
```javascript
$("#element_id").jui_datagrid('setOption', 'option_name', option_value, reinit);
```

#### Alternative way to set one or more options
```javascript
$("#element_id").jui_datagrid({option1_name: option1_value, etc});
```

### destroy
```javascript
$("#element_id").jui_datagrid('destroy');
```

### setUIstyle
```javascript
$("#element_id").jui_datagrid('setUIstyle');
```