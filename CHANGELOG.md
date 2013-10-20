jui_datagrid
==============

jui_datagrid is an Ajax-enabled jQuery plugin, useful to manipulate database data in tabular format. Fully customizable, simple but powerful API, jQuery themes compatible, localization support. It has a modular design, so it is using jui_pagination plugin for paging and jui_filter_rules plugin for searching.

Project page: [https://pontikis.net/labs/jui_datagrid][HOME]
[HOME]: http://pontikis.net/labs/jui_datagrid

Copyright Christos Pontikis [http://pontikis.net][copyright]
[copyright]: http://pontikis.net

License [MIT][mit]
[mit]: https://raw.github.com/pontikis/jui_datagrid/master/MIT_LICENSE


Release 0.9.1 (20 Oct 2013)
---------------------------
* ajax_page_data.dist.php, jui_datagrid ajax fetch page data template script
* php class: get_page_data() method added
* php class: MySQLi support
* php class: MySQL_PDO support
* php class: MySQL support
* php class: a database connection can be passed when php class is initialized (jui_datagrid can still connect to database for you)
* getDropdownLauncherID - utility function, useful to apply CSS fix to jui_dropdown launcher for third party themes (e.g. jQuery-UI-bootstrap)
* onChangeSelectedRows event added, useful to apply CSS fix to jui_dropdown launcher for third party themes (e.g. jQuery-UI-bootstrap)
* $.browser is not used anymore, as it removed in jQuery >= 1.9, so latest jquery can be used. Browser detection using bowser (https://github.com/ded/bowser). In next version browser detection will be probaly replaced by feature detection using Modernizr

Release 0.9.0 (29 Jan 2013)
---------------------------
* Display tabular data
* CSS based themes compatible with jQuery-UI Theming
* Fully configurable
* Get data in JSON format using AJAX (any server-side technology)
* Change columns order
* Show/hide columns
* Style columns
* Flexible data sorting
* Single or multi-select rows
* Powerful pagination
* Powerful filters
* Preferences dialog available to user
* Localization
