<?php
/*// prevent direct access
$isAjax = isset($_SERVER['HTTP_X_REQUESTED_WITH']) AND
	strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';
if(!$isAjax) {
	print 'Access denied - not an AJAX request...' . ' (' . __FILE__ . ')';
	exit;
}*/

require_once '../mysql/settings.php';
require_once '../lib/adodb_5.18a/adodb.inc.php';
require_once 'filter_functions.php';

$result = array();

// connect to database
$dsn = $mysql_driver . '://' . $mysql_user . ':' . rawurlencode($mysql_passwd) . '@' . $mysql_server . '/' . $mysql_db . '?fetchmode=' . ADODB_FETCH_ASSOC;
$conn = NewADOConnection($dsn);
$conn->execute('SET NAMES UTF8');

// get params
$page_num = $_POST['page_num'];
$rows_per_page = $_POST['rows_per_page'];
$sorting = $_POST['sorting'];
$filter_rules = $_POST['filter_rules'];

if(count($filter_rules) == 0) {
	$whereSQL = '';
} else {
	$a_rules = parse_rules($filter_rules, false, false);
	$whereSQL = $a_rules['sql'];
}

/*print '<pre>';
print_r($filter_rules);
echo $whereSQL;
exit;*/

$sortingSQL = '';
if(isset($sorting)) {
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
}




// get total_rows
$sql = 'SELECT count(id) as totalrows FROM customers' . ' ' . $whereSQL;
$rs = $conn->GetRow($sql);
if($rs === false) {
	die('Wrong SQL: ' . $sql . ' Error: ' . $conn->ErrorMsg());
} else {
	$total_rows = $rs['totalrows'];
}

// AVOID SelectLimit to use PREPARED STATEMENTS with pdo_mysql

// get data
$offset = ($page_num - 1) * $rows_per_page;
$sql = 'SELECT c.id as customer_id, c.lastname, c.firstname, c.email, g.gender ' .
	'FROM customers c INNER JOIN lk_genders g ON (c.lk_genders_id = g.id)' . ' ' .
	$whereSQL . ' ' .
	$sortingSQL;

$rs = $conn->SelectLimit($sql, $rows_per_page, $offset);
if($rs === false) {
	die('Wrong SQL: ' . $sql . ' Error: ' . $conn->ErrorMsg());
} else {
	$a_data = $rs->GetRows();
}


// free memory
if($rs)
	$rs->Close();
//database disconnect
if($conn)
	$conn->Close();

$result['row_primary_key'] = 'customer_id';
$result['total_rows'] = $total_rows;
$result['page_data'] = $a_data;

$json = json_encode($result);

print $json;

?>

