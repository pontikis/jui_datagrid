<?php
$dbcon_settings = array(
	'rdbms' => 'ADODB', // one of "ADODB", "MYSQL", "MYSQLi", "MYSQL_PDO", "POSTGRES" (at this time only "ADODB" and "POSTGRES" are implemented)
	'use_prepared_statements' => true,
	'php_adodb_driver' => 'pdo_mysql', // ADODB drivers tested: mysql, mysqlt, mysqli, pdo_mysql, postgres
	'php_adodb_dsn_options_persist' => '0', // do not change if you are not sure
	'php_adodb_dsn_options_misc' => '', // do not set fetchmode here, it is set to ADODB_FETCH_ASSOC
	'php_adodb_dsn_custom' => '',
	'db_server' => 'MYSQL_SERVERNAME_OR_IP',
	'db_name' => 'DBNAME',
	'db_user' => 'MYSQL_USER',
	'db_passwd' => 'MYSQL_PASSWORD',
	'db_port' => '',
	'query_after_connection' => '' // e.g. 'SET NAMES UTF8'
);
?>