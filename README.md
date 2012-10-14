jui_datagrid
============

jui_datagrid is an Ajax-enabled jQuery plugin, useful to manipulate data in tabular format. As a javascript control, it can be integrated with any server-side technology (e.g. PHP, Perl, ASP, JSP and more).

jui_datagrid API is simple and powerful.

Copyright Christos Pontikis http://pontikis.net

* Requires jquery, jquery-ui slider, jquery-ui CSS (tested with jquery 1.8.2 and jquery-ui 1.9.0)
* For touch event support jquery.ui.touch-punch.min.js could be used (see folder /lib/jui_pagination/lib)
* It is using jui_pagination plugin (usage and documentation [here][jui_pagination])
[jui_pagination]: https://github.com/pontikis/jui_pagination

UPCOMING Release: 1.00

License [MIT][mit]
[mit]: https://raw.github.com/pontikis/jui_datagrid/dev/MIT_LICENSE


Features
--------

* Diplay tabular data
* Ajax enabled, gets data in JSON format using any server-side technology
* Powerful pagination
* CSS based themes compatible with jQuery-UI Theming

TODO list
---------

Available [here][todo]
[todo]:https://github.com/pontikis/jui_datagrid/issues?labels=feature&milestone=1&page=1&state=open

Bug report
----------

Available [here][bugs]
[bugs]:https://github.com/pontikis/jui_datagrid/issues?labels=bug&milestone=1&page=1&state=open

Usage
-----

### HTML (head section)

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

### JS code

```javascript
$("#element_id").jui_datagrid({
    ajaxFetchDataURL: 'some_server_url',
    onDisplayPagination: function(e, pagination_id) {
        $("#" + pagination_id).jui_pagination({
            visiblePageLinks: 5
        });
    }
});
```

Preview:

![jui_datagrid sample][sample]
[sample]: https://raw.github.com/pontikis/jui_datagrid/dev/demo/images/sample.png "jui_datagrid common usage"


### JSON data structure

```json
{
    "total_rows": "200",
    "page_data": [
        {
            "id": "111",
            "lastname": "Diaz",
            "firstname": "Kai",
            "email": "odio.Aliquam@Phasellus.org",
            "gender": "female"
        },
        {
            "id": "112",
            "lastname": "Snider",
            "firstname": "Nelle",
            "email": "vulputate@nonlobortis.org",
            "gender": "female"
        },
        ...
    ]
}
```

Options
-------
```javascript
$("#element_id").jui_datagrid({
    ajaxFetchDataURL: 'some_server_url', // REQUIRED

    // DEFAULTS
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
});
```

Default styling needs jquery-ui Themes CSS: http://jqueryui.com/themeroller/

Methods
-------

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

### setGridStyle
```javascript
$("#element_id").jui_datagrid('setGridStyle', tableClass, trHoverClass, thClass, tdClass, trLastClass);
```

### setPaginationOptions
```javascript
$("#element_id").jui_datagrid('setPaginationOptions', pag_options);
```

### getPaginationOptions
```javascript
$("#element_id").jui_datagrid('getPaginationOptions');
```

Events
------

### onDisplayPagination
```javascript
$("#element_id").jui_pagination({
    onDisplayPagination: function() {
        // your code here
    }
});
```