<?php
/**
 * ajax_page_data.dist.php, jui_datagrid ajax fetch page data template script
 *
 * Sample php file getting totalrows and page data
 *
 * @version 0.9.1 (20 Oct 2013)
 * @author Christos Pontikis http://pontikis.net
 * @license  http://opensource.org/licenses/MIT MIT license
 **/

// PREVENT DIRECT ACCESS (OPTIONAL) --------------------------------------------
$isAjax = isset($_SERVER['HTTP_X_REQUESTED_WITH']) AND
strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';
if(!$isAjax) {
	print 'Access denied - not an AJAX request...' . ' (' . __FILE__ . ')';
	exit;
}

// REQUIRED --------------------------------------------------------------------
require_once '/path/to/jui_filter_rules.php';                       // CONFIGURE
require_once '/path/to/jui_datagrid.php';                           // CONFIGURE

/**
 *  Database Settings you have to provide as an argument to jui_datagrid class
 *
 *  MANDATORY:
 *  rdbms
 *  use_prepared_statements, pst_placeholder (if use_prepared_statements is false, pst_placeholder is ignored)
 *  db_conn (connection object) or database connection settings
 *
 */
$db_settings = array(
	/**
	 * MYSQL support is provided for historical reasons. This extension is deprecated as of PHP 5.5.0,
	 * and will be removed in the future.
	 * Instead, the MySQLi or PDO_MySQL extension should be used.
	 *
	 * http://www.php.net/manual/en/intro.mysql.php
	 *
	 * PREPARED STATEMENTS with MYSQLi: mysqlnd needed in order to work (http://www.php.net/manual/en/book.mysqlnd.php).
	 *                                  Additionally you have to set "numberType" option for each number filter (integer or double)
	 *
	 */
	'rdbms' => 'MYSQLi', // one of "MYSQLi", "MYSQL_PDO", "MYSQL", "ADODB", "POSTGRES"
	'use_prepared_statements' => true, // this setting is ignored with MYSQL (as old MYSQL extension does not support prepared statements)
	'pst_placeholder' => 'question_mark', // one of "question_mark" (?) or "numbered" ($1, $2 ...)

	/**
	 * if you provide db_conn (database connection object)
	 */
	'db_conn' => null,

	/**
	 * if you DO NOT provide db_conn (database connection object)
	 * you have to provide database connection settings. jui_datagrid will establish a database connection
	 */
	'db_server' => 'DB_SERVERNAME_OR_IP',
	'db_name' => 'DBNAME',
	'db_user' => 'DB_USER',
	'db_passwd' => 'DB_PASSWORD',
	'db_port' => '',

	'php_adodb_driver' => 'pdo_mysql', // ADODB drivers tested: mysqli, mysqlt, mysql, pdo_mysql, postgres
	'php_adodb_dsn_options_persist' => '0', // do not change if you are not sure
	'php_adodb_dsn_options_misc' => '', // do not set fetchmode here, as ADODB_FETCH_ASSOC is used
	'php_adodb_dsn_custom' => '',

	/**
	 * additional options
	 */
	'query_after_connection' => '', // e.g. 'SET NAMES UTF8'
	'encoding' => 'utf8' // if defined, it is applied after connection to MYSQLi $conn->set_charset() or MYSQL mysql_set_charset()
);

/**
 * Page settings
 */
$page_settings = array(
	"selectCountSQL" => "SQL_HERE",                                 // CONFIGURE
	"selectSQL" => "SQL_HERE",                                      // CONFIGURE
	"page_num" => $_POST['page_num'],
	"rows_per_page" => $_POST['rows_per_page'],
	"columns" => $_POST['columns'],
	"sorting" =>  isset($_POST['sorting']) ? $_POST['sorting'] : array(),
	"filter_rules" => isset($_POST['filter_rules']) ? $_POST['filter_rules'] : array()
);

$jdg = new jui_datagrid($db_settings, $page_settings, $_POST['debug_mode'] == "yes" ? true : false);
echo json_encode($jdg->get_page_data());
?>