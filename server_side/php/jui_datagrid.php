<?php
/**
 * jui_datagrid, helper class for jquery.jui_datagrid plugin, handles server operations (mainly through AJAX requests).
 **/
class jui_datagrid {

	/** @var array Database connection settings */
	private $db_settings;
	/** @var string Last error occured */
	private $last_error;

	/**
	 * Constructor
	 */
	public function __construct() {
		// initialize
		$this->db_settings = null;
		$this->last_error = null;
	}

	public function get_last_error() {
		return $this->last_error;
	}

	/**
	 * Create database connection
	 *
	 * Supported RDMBS: "ADODB", "MYSQL", "MYSQLi", "MYSQL_PDO", "POSTGRES"
	 * Currently only "ADODB" and "POSTGRES" are implemented. ADODB drivers tested: mysql, mysqlt, mysqli, pdo_mysql, postgres.
	 * \todo implement misc RDBMS
	 *
	 * @param Array $db_settings database settings
	 * @return object|bool database connection or false
	 */
	public function db_connect($db_settings) {
		$db_type = $db_settings['rdbms'];

		if(!in_array($db_type, array("ADODB", "POSTGRES"))) {
			$this->last_error = "Database not supported";
			return false;
		}

		if($db_type == "ADODB" && !in_array($db_settings['php_adodb_driver'], array("mysql", "mysqlt", "mysqli", "pdo_mysql", "postgres"))) {
			$this->last_error = "ADODB driver not supported";
			return false;
		}

		if($db_type == "ADODB") {

			switch($db_settings['php_adodb_driver']) {
				case 'mysql':
				case 'mysqlt':
				case 'mysqli':
				case 'pdo_mysql':
					$dsn = $db_settings['php_adodb_driver'] . '://' . $db_settings['db_user'] . ':' . rawurlencode($db_settings['db_passwd']) .
						'@' . $db_settings['db_server'] . '/' .
						$db_settings['db_name'] .
						'?persist=' . $db_settings['php_adodb_dsn_options_persist'] . '&fetchmode=' . ADODB_FETCH_ASSOC . $db_settings['php_adodb_dsn_options_misc'];
					$conn = NewADOConnection($dsn);
					break;
				case 'postgres':
				case 'firebird':
					$dsn = $db_settings['php_adodb_driver'] . '://' . $db_settings['db_user'] . ':' . rawurlencode($db_settings['db_passwd']) .
						'@' . $db_settings['db_server'] . '/' . $db_settings['db_name'] .
						'?persist=' . $db_settings['php_adodb_dsn_options_persist'] . '&fetchmode=' . ADODB_FETCH_ASSOC . $db_settings['php_adodb_dsn_options_misc'];
					$conn = NewADOConnection($dsn);
					break;
				case 'sqlite':
				case 'oci8':
					$conn = NewADOConnection($db_settings['php_adodb_dsn_custom']);
					break;
				case 'access':
				case 'db2':
					$conn =& ADONewConnection($db_settings['php_adodb_driver']);
					$conn->Connect($db_settings['php_adodb_dsn_custom']);
					break;
				case 'odbc_mssql':
					$conn =& ADONewConnection($db_settings['php_adodb_driver']);
					$conn->Connect($db_settings['php_adodb_dsn_custom'], $db_settings['db_user'], $db_settings['db_passwd']);
					break;
			}

			if($conn !== false) {
				if($db_settings['query_after_connection']) {
					$conn->execute($db_settings['query_after_connection']);
				}
			}

		} else if($db_type == "POSTGRES") {
			$dsn = 'host=' . $db_settings['db_server'] . 'port=' . $db_settings['db_port'] . 'dbname=' . $db_settings['db_name'] .
				'user=' . $db_settings['db_user'] . 'password=' . $db_settings['db_passwd'];
			$conn = pg_connect($dsn);
		}

		if($conn === false) {
			$this->last_error = 'Cannot connect to database';
		}

		$this->db_settings = $db_settings;
		return $conn;

	}

	/**
	 * Gets whereSQL and bind_params array using jui_filter_rules class
	 *
	 * @param $conn
	 * @param $filter_rules
	 * @return array
	 */
	public function get_whereSQL($conn, $filter_rules) {

		$rdbms = $this->db_settings['rdbms'];
		$use_prepared_statements = $this->db_settings['use_prepared_statements'];

		if(count($filter_rules) == 0) {
			$result = array('sql' => '', 'bind_params' => array());
		} else {
			$jfr = new jui_filter_rules($conn, $use_prepared_statements, $rdbms);
			$result = $jfr->parse_rules($filter_rules);
		}
		return $result;
	}


	/**
	 * Gets total rows count
	 *
	 * @param object $conn
	 * @param string $selectCountSQL
	 * @param string $whereSQL
	 * @param array $a_bind_params
	 * @return int|bool Total roes or false
	 */
	public function get_total_rows($conn, $selectCountSQL, $whereSQL, $a_bind_params) {
		$total_rows = 0;

		$rdbms = $this->db_settings['rdbms'];
		$use_prepared_statements = $this->db_settings['use_prepared_statements'];

		if($rdbms == "ADODB") {
			$sql = $selectCountSQL . ' ' . $whereSQL;
			if($use_prepared_statements) {
				$stmt = $conn->Execute($sql, $a_bind_params);
				if($stmt === false) {
					$this->last_error = 'Wrong SQL: ' . $sql . ' Error: ' . $conn->ErrorMsg();
					$total_rows = false;
				} else {
					$rs = $stmt->GetRows();
					$total_rows = $rs[0]['totalrows'];
				}
			} else {
				$rs = $conn->GetRow($sql);
				if($rs === false) {
					$this->last_error = 'Wrong SQL: ' . $sql . ' Error: ' . $conn->ErrorMsg();
					$total_rows = false;
				} else {
					$total_rows = $rs['totalrows'];
				}
			}
		} else if($rdbms == "POSTGRES") {

		} else {

		}

		return $total_rows;
	}


	/**
	 * Fetch page data
	 *
	 * @param object $conn
	 * @param int $page_num
	 * @param int $rows_per_page
	 * @param string $selectSQL
	 * @param array $sorting
	 * @param string $whereSQL
	 * @param array $a_bind_params
	 * @return array|bool Page data or false
	 */
	public function fetch_page_data($conn, $page_num, $rows_per_page, $selectSQL, $sorting, $whereSQL, $a_bind_params) {

		$a_data = array();

		// calculate sortingSQL
		$sortingSQL = $this->get_sortingSQL($sorting);

		$sql = $selectSQL . ' ' . $whereSQL . ' ' . $sortingSQL;

		$offset = ($page_num - 1) * $rows_per_page;

		$rdbms = $this->db_settings['rdbms'];
		$use_prepared_statements = $this->db_settings['use_prepared_statements'];

		if($rdbms == "ADODB") {
			if($use_prepared_statements) { // SelectLimit cannot be used with PREPARED STATEMENTS in ADODB
				$sql .= ' LIMIT ' . $offset . ',' . $rows_per_page;
				$smtp = $conn->Execute($sql, $a_bind_params);
				if($smtp === false) {
					$this->last_error = 'Wrong SQL: ' . $sql . ' Error: ' . $conn->ErrorMsg();
					$a_data = false;
				} else {
					$a_data = $smtp->GetRows();
				}
			} else {
				$rs = $conn->SelectLimit($sql, $rows_per_page, $offset);
				if($rs === false) {
					$this->last_error = 'Wrong SQL: ' . $sql . ' Error: ' . $conn->ErrorMsg();
					$a_data = false;
				} else {
					$a_data = $rs->GetRows();
				}
			}

		} else if($rdbms == "POSTGRES") {

		} else {

		}

		return $a_data;

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

		return $sortingSQL;
	}


	/**
	 * Disconnect database
	 *
	 * @param $conn
	 */
	public function db_disconnect($conn) {
		$rdbms = $this->db_settings['rdbms'];

		if($rdbms == "ADODB") {
			$conn->Close();
		} elseif(($rdbms == "POSTGRES")) {
			pg_close($conn);
		}
	}
}