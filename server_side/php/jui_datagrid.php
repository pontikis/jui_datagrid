<?php
/**
 * jui_datagrid, helper class for jquery.jui_datagrid plugin, handles server operations (mainly through AJAX requests).
 *
 * see ajax_page_data.dist.php for usage instructions
 *
 * @version 0.9.1 (20 Oct 2013)
 * @author Christos Pontikis http://pontikis.net
 * @license  http://opensource.org/licenses/MIT MIT license
 **/
class jui_datagrid {

	/** @var null|object Database connection */
	private $db_conn;
	/** @var string Last error occured */
	private $last_error;
	/** @var string Last filter error occured */
	private $last_filter_error;
	/** @var string Debug message */
	private $debug_message;

	/**
	 * Constructor
	 *
	 * @param Array $db_settings database settings
	 * @param Array $page_settings page settings
	 * @param bool $debug_mode
	 *
	 * Currently "MYSQLi", "MYSQL_PDO", "MYSQL","POSTGRES", "ADODB" are implemented.
	 * ADODB drivers tested: mysqli, pdo_mysql, mysqlt, mysql, postgres.
	 */
	public function __construct($db_settings, $page_settings, $debug_mode = false) {
		// initialize
		$this->db_settings = $db_settings;
		$this->page_settings = $page_settings;
		$this->debug_mode = $debug_mode;
		$this->db_conn = null;
		$this->last_error = null;
		$this->last_filter_error = array();
		$this->debug_message = array();
	}

	/**
	 * Get last error
	 *
	 * @return null|string
	 */
	public function get_last_error() {
		return $this->last_error;
	}

	/**
	 * Get last filter error
	 *
	 * @return array|string
	 */
	public function get_last_filter_error() {
		return $this->last_filter_error;
	}

	/**
	 * Get debug message
	 *
	 * @return array|string
	 */
	public function get_debug_message() {
		return $this->debug_message;
	}

	/**
	 * Create database connection
	 *
	 * @return object|bool database connection or false
	 */
	public function db_connect() {

		$rdbms = $this->db_settings['rdbms'];
		$charset = $this->db_settings['charset'];

		// RDBMS not supported
		if(!in_array($rdbms, array("MYSQLi", "MYSQL_PDO", "MYSQL", "POSTGRES", "ADODB"))) {
			$this->last_error = 'Database (' . $rdbms . ') not supported';
			return false;
		}

		// ADODB driver not supported
		if($rdbms == "ADODB" && !in_array($this->db_settings['php_adodb_driver'], array("mysql", "mysqlt", "mysqli", "pdo_mysql", "postgres"))) {
			$this->last_error = 'ADODB driver ' . $this->db_settings['php_adodb_driver'] . ') not supported';
			return false;
		}

		// CONNECT to database
		if($rdbms == "MYSQLi") {
			$conn = new mysqli($this->db_settings['db_server'], $this->db_settings['db_user'], $this->db_settings['db_passwd'], $this->db_settings['db_name']);
			if($conn->connect_error) {
				$this->last_error = 'Cannot connect to database. ' . $conn->connect_error;
			}
			if($charset) {
				$conn->set_charset($charset);
			}
			if($this->db_settings['query_after_connection']) {
				$conn->query($this->db_settings['query_after_connection']);
			}

		} else if($rdbms == "MYSQL_PDO") {

			try {
				$conn = new PDO('mysql:host=' . $this->db_settings['db_server'] . ';dbname=' . $this->db_settings['db_name'], $this->db_settings['db_user'], $this->db_settings['db_passwd']);
				$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			} catch(PDOException $e) {
				$this->last_error = 'Cannot connect to database. ' . $e->getMessage();
			}

		} else if($rdbms == "MYSQL") {
			$conn = mysql_connect($this->db_settings['db_server'], $this->db_settings['db_user'], $this->db_settings['db_passwd']);
			mysql_select_db($this->db_settings['db_name']);
			if($conn === false) {
				$this->last_error = 'Cannot connect to database. ' . mysql_error();
			}
			if($charset) {
				mysql_set_charset($charset);
			}
			if($this->db_settings['query_after_connection']) {
				mysql_query($this->db_settings['query_after_connection']);
			}

		} else if($rdbms == "POSTGRES") {
			$dsn = 'host=' . $this->db_settings['db_server'] . ' port=' . $this->db_settings['db_port'] . ' dbname=' . $this->db_settings['db_name'] .
				' user=' . $this->db_settings['db_user'] . ' password=' . rawurlencode($this->db_settings['db_passwd']);
			$conn = pg_connect($dsn);
			if($conn === false) {
				$this->last_error = 'Cannot connect to database. ' . pg_last_error($conn);
			}
			if($this->db_settings['query_after_connection']) {
				$conn->pg_query($this->db_settings['query_after_connection']);
			}

		} else if($rdbms == "ADODB") {

			switch($this->db_settings['php_adodb_driver']) {
				case 'mysql':
				case 'mysqlt':
				case 'mysqli':
				case 'pdo_mysql':
				case 'postgres':
					$dsn = $this->db_settings['php_adodb_driver'] . '://' . $this->db_settings['db_user'] . ':' . rawurlencode($this->db_settings['db_passwd']) .
						'@' . $this->db_settings['db_server'] . '/' .
						$this->db_settings['db_name'] .
						'?persist=' . $this->db_settings['php_adodb_dsn_options_persist'] . '&fetchmode=' . ADODB_FETCH_ASSOC . $this->db_settings['php_adodb_dsn_options_misc'];
					$conn = NewADOConnection($dsn);
					break;
				case 'firebird':
					$dsn = $this->db_settings['php_adodb_driver'] . '://' . $this->db_settings['db_user'] . ':' . rawurlencode($this->db_settings['db_passwd']) .
						'@' . $this->db_settings['db_server'] . '/' . $this->db_settings['db_name'] .
						'?persist=' . $this->db_settings['php_adodb_dsn_options_persist'] . '&fetchmode=' . ADODB_FETCH_ASSOC . $this->db_settings['php_adodb_dsn_options_misc'];
					$conn = NewADOConnection($dsn);
					break;
				case 'sqlite':
				case 'oci8':
					$conn = NewADOConnection($this->db_settings['php_adodb_dsn_custom']);
					break;
				case 'access':
				case 'db2':
					$conn =& ADONewConnection($this->db_settings['php_adodb_driver']);
					$conn->Connect($this->db_settings['php_adodb_dsn_custom']);
					break;
				case 'odbc_mssql':
					$conn =& ADONewConnection($this->db_settings['php_adodb_driver']);
					$conn->Connect($this->db_settings['php_adodb_dsn_custom'], $this->db_settings['db_user'], $this->db_settings['db_passwd']);
					break;
			}

			if($conn === false) {
				$this->last_error = 'Cannot connect to database'; // TODO improve connection error
			}

			if($conn !== false) {
				if($this->db_settings['query_after_connection']) {
					$conn->execute($this->db_settings['query_after_connection']);
				}
			}
		}

		return $conn;

	}


	/**
	 * @return bool|object database connection
	 */
	private function get_db_conn() {

		if($this->db_conn) {
			return $this->db_conn;
		} else {
			if(array_key_exists('db_conn', $this->db_settings) && $this->db_settings['db_conn']) {
				$conn = $this->db_settings['db_conn'];
			} else {
				$conn = $this->db_connect($this->db_settings);
			}

			$this->db_conn = $conn;
			return $conn;
		}
	}

	/**
	 * Gets whereSQL and bind_params array using jui_filter_rules class
	 *
	 * @param $filter_rules
	 * @return array
	 */
	public function get_whereSQL($filter_rules) {

		$conn = $this->get_db_conn();
		if(!$conn) {
			return false;
		}

		$rdbms = $this->db_settings['rdbms'];
		$use_prepared_statements = $this->db_settings['use_prepared_statements'];
		$pst_placeholder = $this->db_settings['pst_placeholder'];

		if(count($filter_rules) == 0) {
			$result = array('sql' => '', 'bind_params' => array());
		} else {
			$jfr = new jui_filter_rules($conn, $use_prepared_statements, $pst_placeholder, $rdbms);
			$res = $jfr->parse_rules($filter_rules);
			$result = array("sql" => $res["sql"], "bind_params" => $res["bind_params"]);

			$last_jfr_error = $jfr->get_last_error();
			if(!is_null($last_jfr_error['error_message'])) {
				$result = $last_jfr_error;
			}
		}

		if($this->debug_mode) {
			array_push($this->debug_message, 'WHERE  SQL: ' . $result['sql']);
			array_push($this->debug_message, 'BIND PARAMS: ' . print_r($result['bind_params'], true));
			if($use_prepared_statements) {
				$bind_params_type = '';
				foreach($res["bind_params"] as $bind_param) {
					$bind_params_type .= gettype($bind_param) . ' ';
				}
				array_push($this->debug_message, 'BIND PARAMS TYPE: ' . $bind_params_type);
			}
			array_push($this->debug_message, 'PREPARED STATEMENTS: ' . ($use_prepared_statements ? "yes" : "no"));
			if(!is_null($last_jfr_error['error_message'])) {
				array_push($this->debug_message, 'FILTER ERROR: ' . print_r($last_jfr_error['error_message'], true));
			}
		}

		return $result;
	}

	/**
	 * Get sorting SQL (ORDER BY clause)
	 *
	 * @param array $sorting
	 * @return string
	 */
	private function get_sortingSQL($sorting) {
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

		if($this->debug_mode) {
			array_push($this->debug_message, 'sortingSQL: ' . $sortingSQL);
		}
		return $sortingSQL;
	}

	/**
	 * Gets total rows count
	 *
	 * @param string $selectCountSQL
	 * @param string $whereSQL
	 * @param array $a_bind_params
	 * @return int|bool Total rows or false
	 */
	public function get_total_rows($selectCountSQL, $whereSQL, $a_bind_params) {

		$total_rows = false;

		$conn = $this->get_db_conn();
		if(!$conn) {
			return $total_rows;
		}

		$rdbms = $this->db_settings['rdbms'];
		$use_prepared_statements = $this->db_settings['use_prepared_statements'];

		$sql = $selectCountSQL . ' ' . $whereSQL;

		if($rdbms == "MYSQLi") {
			if($use_prepared_statements && $whereSQL) {
				/* Bind parameters. Types: s = string, i = integer, d = double,  b = blob */
				$a_params = array();

				$param_type = '';
				$n = count($a_bind_params);
				for($i = 0; $i < $n; $i++) {
					$php_type = gettype($a_bind_params[$i]);
					if($php_type == "string") {
						$param_type .= 's';
					} else if($php_type == "integer") {
						$param_type .= 'i';
					} else if($php_type == "double") {
						$param_type .= 'd';
					}
				}
				$a_params[] = & $param_type;

				for($i = 0; $i < $n; $i++) {
					$a_params[] = & $a_bind_params[$i];
				}

				/* Prepare statement */
				$stmt = $conn->prepare($sql);
				if($stmt === false) {
					$this->last_error = 'Wrong SQL: ' . $sql . ' Error: ' . $conn->errno . ' ' . $conn->error;
				}

				/**
				 * $stmt->bind_param('s', $param); does not accept params array
				 * and if call_user_func_array will be used, array params need to passed by reference
				 */
				call_user_func_array(array($stmt, 'bind_param'), $a_params);

				/* Execute statement */
				$stmt->execute();

				$stmt->bind_result($total_rows);
				$stmt->fetch();

			} else {
				$res = $conn->query($sql);
				if($res === false) {
					$this->last_error = 'Wrong SQL: ' . $sql . ' Error: ' . $conn->errno . ' ' . $conn->error;
				} else {
					$res->data_seek(0);
					$rs = $res->fetch_array(MYSQLI_ASSOC);
					$total_rows = $rs['totalrows'];
				}
			}

		} else if($rdbms == "MYSQL_PDO") {
			if($use_prepared_statements) {
				try {
					$stmt = $conn->prepare($sql);
					$stmt->execute($a_bind_params);
					$rs = $stmt->fetch(PDO::FETCH_ASSOC);
					$total_rows = $rs['totalrows'];
				} catch(PDOException $e) {
					$this->last_error = 'Wrong SQL: ' . $sql . ' Error: ' . $e->getMessage();
				}
			} else {
				try {
					$res = $conn->query($sql);
					$rs = $res->fetch(PDO::FETCH_ASSOC);
					$total_rows = $rs['totalrows'];

				} catch(PDOException $e) {
					$this->last_error = 'Wrong SQL: ' . $sql . ' Error: ' . $e->getMessage();
				}
			}

		} else if($rdbms == "MYSQL") {
			$res = mysql_query($sql);
			if($res === false) {
				$this->last_error = 'Wrong SQL: ' . $sql . ' Error: ' . mysql_error();
			} else {
				$rs = mysql_fetch_array($res, MYSQL_ASSOC);
				$total_rows = $rs['totalrows'];
			}

		} else if($rdbms == "POSTGRES") {
			if($use_prepared_statements) {
				$rs = pg_query_params($conn, $sql, $a_bind_params);
				if($rs === false) {
					$this->last_error = 'Wrong SQL: ' . $sql . ' Error: ' . pg_last_error();
				} else {
					$total_rows = pg_fetch_result($rs, 0, 0);
				}
			} else {
				$rs = pg_query($conn, $sql);
				if($rs === false) {
					$this->last_error = 'Wrong SQL: ' . $sql . ' Error: ' . pg_last_error();
				} else {
					$total_rows = pg_fetch_result($rs, 0, 0);
				}
			}

		} else if($rdbms == "ADODB") {
			if($use_prepared_statements) {
				$stmt = $conn->Execute($sql, $a_bind_params);
				if($stmt === false) {
					$this->last_error = 'Wrong SQL: ' . $sql . ' Error: ' . $conn->ErrorMsg();
				} else {
					$rs = $stmt->GetRows();
					$total_rows = $rs[0]['totalrows'];
				}
			} else {
				$rs = $conn->GetRow($sql);
				if($rs === false) {
					$this->last_error = 'Wrong SQL: ' . $sql . ' Error: ' . $conn->ErrorMsg();
				} else {
					$total_rows = $rs['totalrows'];
				}
			}
		}

		if($this->debug_mode) {
			array_push($this->debug_message, 'RDBMS: ' . $rdbms);
			array_push($this->debug_message, 'selectCountSQL: ' . $selectCountSQL);
			array_push($this->debug_message, 'total_rows: ' . $total_rows);
		}

		return $total_rows;
	}


	/**
	 * Fetch page data
	 *
	 * @param int $page_num
	 * @param int $rows_per_page
	 * @param array $columns
	 * @param string $selectSQL
	 * @param string $whereSQL
	 * @param array $a_bind_params
	 * @param string $sortingSQL
	 * @return array|bool Page data or false
	 */
	public function fetch_page_data($page_num, $rows_per_page, $columns, $selectSQL, $whereSQL, $a_bind_params, $sortingSQL) {

		$a_data = array();

		$conn = $this->get_db_conn();
		if(!$conn) {
			return false;
		}

		$rdbms = $this->db_settings['rdbms'];
		$use_prepared_statements = $this->db_settings['use_prepared_statements'];

		$sql = $selectSQL . ' ' . $whereSQL . ' ' . $sortingSQL;

		$offset = ($page_num - 1) * $rows_per_page;

		if($rdbms == "MYSQLi") {
			$sql .= ' LIMIT ' . $offset . ',' . $rows_per_page;
			if($use_prepared_statements && $whereSQL && function_exists('mysqli_fetch_all')) {

				/* Bind parameters. Types: s = string, i = integer, d = double,  b = blob */
				$a_params = array();

				$param_type = '';
				$n = count($a_bind_params);
				for($i = 0; $i < $n; $i++) {
					$php_type = gettype($a_bind_params[$i]);
					if($php_type == "string") {
						$param_type .= 's';
					} else if($php_type == "integer") {
						$param_type .= 'i';
					} else if($php_type == "double") {
						$param_type .= 'd';
					}
				}
				$a_params[] = & $param_type;

				for($i = 0; $i < $n; $i++) {
					$a_params[] = & $a_bind_params[$i];
				}

				/* Prepare statement */
				$stmt = $conn->prepare($sql);
				if($stmt === false) {
					$this->last_error = 'Wrong SQL: ' . $sql . ' Error: ' . $conn->errno . ' ' . $conn->error;
				}

				/**
				 * $stmt->bind_param('s', $param); does not accept params array
				 * and if call_user_func_array will be used, array params need to passed by reference
				 */
				call_user_func_array(array($stmt, 'bind_param'), $a_params);

				/* Execute statement */
				$stmt->execute();

				$res = $stmt->get_result();
				while($row = $res->fetch_array(MYSQLI_ASSOC)) {
					array_push($a_data, $row);
				}
			} else {
				$res = $conn->query($sql);
				if($res === false) {
					$this->last_error = 'Wrong SQL: ' . $sql . ' Error: ' . $conn->ErrorMsg();
				} else {
					$res->data_seek(0);
					while($row = $res->fetch_assoc()) {
						array_push($a_data, $row);
					}
				}
			}

		} else if($rdbms == "MYSQL_PDO") {
			$sql .= ' LIMIT ' . $offset . ',' . $rows_per_page;
			if($use_prepared_statements) {
				try {
					$stmt = $conn->prepare($sql);
					$stmt->execute($a_bind_params);
					$a_data = $stmt->fetchAll(PDO::FETCH_ASSOC);
				} catch(PDOException $e) {
					$this->last_error = 'Wrong SQL: ' . $sql . ' Error: ' . $e->getMessage();
				}
			} else {
				try {
					$res = $conn->query($sql);
					$a_data = $res->fetchAll(PDO::FETCH_ASSOC);
				} catch(PDOException $e) {
					$this->last_error = 'Wrong SQL: ' . $sql . ' Error: ' . $e->getMessage();
				}
			}

		} else if($rdbms == "MYSQL") {
			$sql .= ' LIMIT ' . $offset . ',' . $rows_per_page;
			$res = mysql_query($sql);
			if($res === false) {
				$this->last_error = 'Wrong SQL: ' . $sql . ' Error: ' . $conn->ErrorMsg();
			} else {
				while($row = mysql_fetch_array($res, MYSQL_ASSOC)) {
					array_push($a_data, $row);
				}
			}

		} else if($rdbms == "POSTGRES") {
			$sql .= ' LIMIT ' . $rows_per_page . ' OFFSET ' . $offset;
			if($use_prepared_statements) {
				$rs = pg_query_params($conn, $sql, $a_bind_params);
				if($rs === false) {
					$this->last_error = 'Wrong SQL: ' . $sql . ' Error: ' . pg_last_error();
				} else {
					$a_data = pg_fetch_all($rs);
				}
			} else {
				$rs = pg_query($conn, $sql);
				if($rs === false) {
					$this->last_error = 'Wrong SQL: ' . $sql . ' Error: ' . pg_last_error();
				} else {
					$a_data = pg_fetch_all($rs);
				}
			}

		} else if($rdbms == "ADODB") {
			if($use_prepared_statements) { // SelectLimit cannot be used with PREPARED STATEMENTS in ADODB
				switch($this->db_settings['php_adodb_driver']) {
					/**  \todo implement misc ADODB drivers */
					case "mysql":
					case "mysqlt":
					case "mysqli":
					case "pdo_mysql":
						$sql .= ' LIMIT ' . $offset . ',' . $rows_per_page;
						break;
					case "postgres":
						$sql .= ' LIMIT ' . $rows_per_page . ' OFFSET ' . $offset;
				}
				$smtp = $conn->Execute($sql, $a_bind_params);
				if($smtp === false) {
					$this->last_error = 'Wrong SQL: ' . $sql . ' Error: ' . $conn->ErrorMsg();
				} else {
					$a_data = $smtp->GetRows();
				}
			} else {
				$rs = $conn->SelectLimit($sql, $rows_per_page, $offset);
				if($rs === false) {
					$this->last_error = 'Wrong SQL: ' . $sql . ' Error: ' . $conn->ErrorMsg();
				} else {
					$a_data = $rs->GetRows();
				}
			}
		}

		// apply column value conversion (if any)
		$rows = count($a_data);
		if($rows > 0) {
			foreach($columns as $column) {
				if($column['visible'] == 'yes') {
					if(array_key_exists('column_value_conversion_server_side', $column)) {

						$column_value_conversion_server_side = $column['column_value_conversion_server_side'];
						if(is_array($column_value_conversion_server_side)) {
							$function_name = $column_value_conversion_server_side['function_name'];
							$args = $column_value_conversion_server_side['args'];
							$arg_len = count($args);

							for($i = 0; $i < $rows; $i++) {

								// create arguments values for this row
								$conversion_args = array();
								for($a = 0; $a < $arg_len; $a++) {
									if(array_key_exists("col_index", $args[$a])) {
										$col_idx = $args[$a]["col_index"];
										array_push($conversion_args, $a_data[$i][$columns[$col_idx]["field"]]);
									}
									if(array_key_exists("value", $args[$a])) {
										array_push($conversion_args, $args[$a]["value"]);
									}
								}
								// execute user function and assign return value to this column cell
								try {
									$a_data[$i][$column['field']] = call_user_func_array($function_name, $conversion_args);
								} catch(Exception $e) {
									$this->last_error = 'Column value (' . $a_data[$i][$column['field']] . ') conversion error server side: ' . $e->getMessage();
									$a_data = false;
									break;
								}
							}
						}

					}
				}

			}
		}

		if($this->debug_mode) {
			array_push($this->debug_message, 'selectSQL: ' . $selectSQL);
		}
		return $a_data;

	}


	/**
	 * Get page data
	 *
	 * @return array
	 */
	public function get_page_data() {

		// initialize
		$result = array(
			'total_rows' => null,
			'page_data' => null,
			'error' => null,
			'filter_error' => array(),
			'debug_message' => array()
		);

		$where = $this->get_whereSQL($this->page_settings['filter_rules']);
		if(array_key_exists('error_message', $where)) {
			$this->last_filter_error = $where;
		} else {

			$total_rows = $this->get_total_rows($this->page_settings['selectCountSQL'],
				$where['sql'], $where['bind_params']);

			if($total_rows !== false) {

				// calculate sortingSQL
				$sortingSQL = $this->get_sortingSQL($this->page_settings['sorting']);

				$a_data = $this->fetch_page_data(
					$this->page_settings['page_num'],
					$this->page_settings['rows_per_page'],
					$this->page_settings['columns'],
					$this->page_settings['selectSQL'],
					$where['sql'], $where['bind_params'],
					$sortingSQL);
			}
		}

		$this->db_disconnect();

		$result['total_rows'] = $total_rows;
		$result['page_data'] = $a_data;
		$result['error'] = $this->get_last_error();
		$result['filter_error'] = $this->get_last_filter_error();
		$result['debug_message'] = $this->get_debug_message();

		return $result;
	}

	/**
	 * Disconnect database
	 */
	public function db_disconnect() {

		$conn = $this->db_conn;
		if($conn) {

			$rdbms = $this->db_settings['rdbms'];
			if($rdbms == "MYSQLi") {
				$conn->close();
			} else if($rdbms == "MYSQL_PDO") {
				$conn = null;
			} else if($rdbms == "MYSQL") {
				mysql_close($conn);
			} else if($rdbms == "POSTGRES") {
				pg_close($conn);
			} else if($rdbms == "ADODB") {
				$conn->Close();
			}
		}
	}

}