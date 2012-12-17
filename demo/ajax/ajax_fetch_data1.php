<?php
/**
 * Sample php file getting totalrows and database data for current page
 *
 */

// prevent direct access -------------------------------------------------------
$isAjax = isset($_SERVER['HTTP_X_REQUESTED_WITH']) AND
	strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';
if(!$isAjax) {
	print 'Access denied - not an AJAX request...' . ' (' . __FILE__ . ')';
	exit;
}

// initialize ------------------------------------------------------------------
require_once '../mysql/settings.php';
require_once '../lib/adodb_5.18a/adodb.inc.php';
require_once 'filter_functions.php';

$result = array();
// set true of false
define('USE_PREPARED_STATEMETS', true);

// connect to database (php ADODB abstraction layer) ---------------------------
$dsn = $mysql_driver . '://' . $mysql_user . ':' . rawurlencode($mysql_passwd) . '@' . $mysql_server . '/' . $mysql_db . '?fetchmode=' . ADODB_FETCH_ASSOC;
$conn = NewADOConnection($dsn);
$conn->execute('SET NAMES UTF8');

// get params ------------------------------------------------------------------
$page_num = $_POST['page_num'];
$rows_per_page = $_POST['rows_per_page'];

$filter_rules = array();
if(isset($_POST['filter_rules'])) {
	$filter_rules = $_POST['filter_rules'];
}

$sorting = array();
if(isset($_POST['sorting'])) {
	$sorting = $_POST['sorting'];
}

// WHERE SQL -------------------------------------------------------------------
if(count($filter_rules) == 0) {
	$whereSQL = '';
	$a_bind_params = array();
} else {
	$a_rules = parse_rules($filter_rules, USE_PREPARED_STATEMETS, false);
	$whereSQL = $a_rules['sql'];
	$a_bind_params = $a_rules['bind_params'];
}

/*print '<pre>';
print_r($whereSQL);
echo $a_bind_params;
exit;*/

// ORDER BY SQL ----------------------------------------------------------------
$sortingSQL = '';
foreach($sorting as $sort) {
	if($sort['order'] == 'ascending') {
		$sortingSQL .= $sort['field'] . ' ASC, ';
	} else if($sort['order'] == 'descending') {
		$sortingSQL .= ' ' . $sort['field'] . ' DESC, ';
	}
}
$len = mb_strlen($sortingSQL);
if($len > 0) {
	$sortingSQL = ' ORDER BY ' . substr($sortingSQL, 0, $len - 2) . ' ';
}

// get total_rows --------------------------------------------------------------
$sql = 'SELECT count(id) as totalrows FROM customers' . ' ' . $whereSQL;
if(USE_PREPARED_STATEMETS) {
	$stmt = $conn->Execute($sql, $a_bind_params);
	if($stmt === false) {
		trigger_error('Wrong SQL: ' . $sql . ' Error: ' . $conn->ErrorMsg(), E_USER_ERROR);
	} else {
		$rs = $stmt->GetRows();
		$total_rows = $rs[0]['totalrows'];
	}
} else {
	$rs = $conn->GetRow($sql);
	if($rs === false) {
		die('Wrong SQL: ' . $sql . ' Error: ' . $conn->ErrorMsg());
	} else {
		$total_rows = $rs['totalrows'];
	}
}

// get page data ---------------------------------------------------------------
$offset = ($page_num - 1) * $rows_per_page;
$sql = 'SELECT c.id as customer_id, c.lastname, c.firstname, c.email, g.gender ' .
	'FROM customers c INNER JOIN lk_genders g ON (c.lk_genders_id = g.id)' . ' ' .
	$whereSQL . ' ' .
	$sortingSQL;
if(USE_PREPARED_STATEMETS) { // SelectLimit cannot be used with PREPARED STATEMENTS in ADODB
	$sql .= ' LIMIT ' . $offset . ',' . $rows_per_page;
	$smtp = $conn->Execute($sql, $a_bind_params);
	if($smtp === false) {
		die('Wrong SQL: ' . $sql . ' Error: ' . $conn->ErrorMsg());
	} else {
		$a_data = $smtp->GetRows();
	}
} else {
	$rs = $conn->SelectLimit($sql, $rows_per_page, $offset);
	if($rs === false) {
		die('Wrong SQL: ' . $sql . ' Error: ' . $conn->ErrorMsg());
	} else {
		$a_data = $rs->GetRows();
	}
}

// disconnect Database ---------------------------------------------------------
/*if($rs)
	$rs->Close(); // free memory
if($conn)
	$conn->Close(); //database disconnect*/

// return JSON -----------------------------------------------------------------
$result['row_primary_key'] = 'customer_id';
$result['total_rows'] = $total_rows;
$result['page_data'] = $a_data;
$json = json_encode($result);
print $json;
?>

