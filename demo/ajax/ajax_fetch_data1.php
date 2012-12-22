<?php
// prevent direct access (optional) --------------------------------------------
$isAjax = isset($_SERVER['HTTP_X_REQUESTED_WITH']) AND
	strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';
if(!$isAjax) {
	print 'Access denied - not an AJAX request...' . ' (' . __FILE__ . ')';
	exit;
}
// required --------------------------------------------------------------------
require_once '../mysql/settings.php';
require_once '../lib/adodb_5.18a/adodb.inc.php';
require_once '../../lib/jui_filter_rules_v1.00/server_side/php/jui_filter_rules.php';
require_once '../../server_side/php/jui_datagrid.php';

$db_settings = $dbcon_settings;
$selectCountSQL = 'SELECT count(id) as totalrows FROM customers';
$selectSQL = 'SELECT c.id as customer_id, c.lastname, c.firstname, c.email, g.gender ' .
	'FROM customers c INNER JOIN lk_genders g ON (c.lk_genders_id = g.id)';

include('../../server_side/php/fetch_data.php');
?>
