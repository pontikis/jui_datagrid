<?php
/**
 * Sample php file getting totalrows and database data for current page
 *
 */

// initialize ------------------------------------------------------------------
$total_rows = null;
$a_data = null;
$last_error = null;
$result = array(
	'total_rows' => $total_rows,
	'page_data' => $a_data,
	'error' => $last_error
);

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

// -----------------------------------------------------------------------------
$jdg = new jui_datagrid();
$conn = $jdg->db_connect($db_settings);
if($conn === false) {
	$last_error = $jdg->get_last_error();
} else {
	$where = $jdg->get_whereSQL($conn, $filter_rules);
	$whereSQL = $where['sql'];
	$bind_params = $where['bind_params'];

	$total_rows = $jdg->get_total_rows($conn, $selectCountSQL, $whereSQL, $bind_params);

	if($total_rows === false) {
		$last_error = $jdg->get_last_error();
	} else {
		$a_data = $jdg->fetch_page_data($conn, $page_num, $rows_per_page, $selectSQL, $sorting, $whereSQL, $bind_params);
		if($a_data === false) {
			$last_error = $jdg->get_last_error();
		}
	}

	$jdg->db_disconnect($conn);
}

// return JSON -----------------------------------------------------------------
$result['total_rows'] = $total_rows;
$result['page_data'] = $a_data;
$result['error'] = $last_error;
$json = json_encode($result);
print $json;
?>
