<?php
/**
 * jui_datagrid, helper class for jquery.jui_datagrid plugin, handles AJAX requests.
 **/
class jui_datagrid {

	/** @var object database connection */
	var $conn;
	/** @var bool use prepared statements or not */
	var $usePreparedStatements;
	/** @var string rdbms in use (one of "ADODB", "MYSQL", "MYSQLi", "PDO", "POSTGRES") */
	var $rdbms;

	var $page_num;

	var $rows_per_page;

	var $sorting;

	var $filter_rules;

	/**
	 * @param object $dbcon database connection
	 * @param bool $use_ps use prepared statements or not
	 * @param string $db_type rdbms in use (one of "ADODB", "MYSQL", "MYSQLi", "PDO", "POSTGRES")
	 * @param $page_num
	 * @param $rows_per_page
	 * @param $sorting
	 * @param $filter_rules
	 */
	public function __construct($dbcon, $use_ps, $db_type, $page_num, $rows_per_page, $sorting, $filter_rules) {
		$this->conn = $dbcon;
		$this->usePreparedStatements = $use_ps;
		$this->rdbms = $db_type;
		$this->page_num = $page_num;
		$this->rows_per_page = $rows_per_page;
		$this->sorting = $sorting;
		$this->filter_rules = $filter_rules;
	}

	public function set_conn($dbcon) {
		$this->conn = $dbcon;
	}

	public function get_conn() {
		return $this->conn;
	}

	public function set_usePreparedStatements($use_ps) {
		$this->usePreparedStatements = $use_ps;
	}

	public function get_usePreparedStatements() {
		return $this->usePreparedStatements;
	}

	public function set_rdbms($db) {
		$this->rdbms = $db;
	}

	public function get_rdbms() {
		return $this->rdbms;
	}


	public function get_total_rows() {
		$total_rows = 0;
		switch($this->rdbms) {
			case "ADODB":
				break;
			default:
				/**  \todo get total rows using other rdbms */
				$total_rows = false;
		}

		return $total_rows;
	}


	public function fetch_page_data() {

		switch($this->rdbms) {
			case "ADODB":
				break;
			default:
				/**  \todo fetch page data () using other rdbms */
				return false;
		}

	}


}
