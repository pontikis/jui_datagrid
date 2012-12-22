<?php
$selectCountSQL = 'SELECT count(id) as totalrows FROM customers';
$selectSQL = 'SELECT c.id, c.lastname, c.firstname, g.gender ' .
	'FROM customers c INNER JOIN lk_genders g ON (c.lk_genders_id = g.id)';

include('inc_fetch_data.php');
?>