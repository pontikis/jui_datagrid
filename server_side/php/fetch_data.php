<?php
/**
 * Sample php file getting totalrows and database data for current page
 *
 */

// initialize ------------------------------------------------------------------
$total_rows = null;
$a_data = null;
$last_error = null;
$last_filter_error = array();
$debug_message = array();
$result = array(
	'total_rows' => $total_rows,
	'page_data' => $a_data,
	'error' => $last_error,
	'filter_error' => $last_filter_error,
	'debug_message' => $debug_message
);

// get params ------------------------------------------------------------------
$page_num = $_POST['page_num'];
$rows_per_page = $_POST['rows_per_page'];

$columns = $_POST['columns'];

$filter_rules = array();
if(isset($_POST['filter_rules'])) {
	$filter_rules = $_POST['filter_rules'];
}

$sorting = array();
if(isset($_POST['sorting'])) {
	$sorting = $_POST['sorting'];
}

$debug_mode = ($_POST['debug_mode'] == "yes" ? true : false);

// -----------------------------------------------------------------------------
$jdg = new jui_datagrid($debug_mode);
$conn = $jdg->db_connect($db_settings);
if($conn === false) {
	$last_error = $jdg->get_last_error();
} else {
	$where = $jdg->get_whereSQL($conn, $filter_rules);

	if(array_key_exists('error_message', $where)) {
		$last_filter_error = $where;
	} else {
		$whereSQL = $where['sql'];
		$bind_params = $where['bind_params'];

		$total_rows = $jdg->get_total_rows($conn, $selectCountSQL, $whereSQL, $bind_params);

		if($total_rows === false) {
			$last_error = $jdg->get_last_error();
		} else {
			$a_data = $jdg->fetch_page_data($conn, $columns, $page_num, $rows_per_page, $selectSQL, $sorting, $whereSQL, $bind_params);
			if($a_data === false) {
				$last_error = $jdg->get_last_error();
			}
		}
	}
	$jdg->db_disconnect($conn);
}

// return JSON -----------------------------------------------------------------
$result['total_rows'] = $total_rows;
$result['page_data'] = $a_data;
$result['error'] = $last_error;
$result['filter_error'] = $last_filter_error;
$result['debug_message'] = $jdg->get_debug_message();
$json = json_encode($result);
print $json;
?>
