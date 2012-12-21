<?php
$selectCountSQL = 'SELECT count(id) as totalrows FROM customers';
$selectSQL = 'SELECT c.id, c.lastname, c.firstname, g.gender ' .
	'FROM customers c INNER JOIN lk_genders g ON (c.lk_genders_id = g.id)';

include('inc_fetch_data.php');

// return JSON -----------------------------------------------------------------
$result['row_primary_key'] = 'id';
$result['total_rows'] = $total_rows;
$result['page_data'] = $a_data;
$result['error'] = $error;
$json = json_encode($result);
print $json;
?>