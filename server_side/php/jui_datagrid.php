<?php
/*! \mainpage Welcome
 *
 * \section intro_sec Introduction
 *
 * jui_datagrid, helper class for <a href="../../../../docs/">jquery.jui_datagrid plugin</a>, handles AJAX requests.
 *
 * \section install_sec Usage
 *
 * \subsection step1 Fetch page data from server
 * \code{.php}
 * $jdg = new jui_datagrid($conn, $usePreparedStatements, $rdbms);
 * $result = $jdg->fetch_data($rules);
 * \endcode
 */

/**
 * jui_datagrid, helper class for jquery.jui_datagrid plugin, handles AJAX requests.
 **/
class jui_datagrid {

	/**
	 * @var object database connection
	 */
	var $conn;
	/**
	 * @var bool use prepared statements or not
	 */
	var $usePreparedStatements;
	/**
	 * @var string rdbms in use (one of "ADODB", "MYSQL", "MYSQLi", "PDO", "POSTGRES")
	 */
	var $rdbms;

	/**
	 * @param object $dbcon database connection
	 * @param bool $use_ps use prepared statements or not
	 * @param string $db_type rdbms in use (one of "ADODB", "MYSQL", "MYSQLi", "PDO", "POSTGRES")
	 */
	public function __construct($dbcon, $use_ps, $db_type) {
		$this->conn = $dbcon;
		$this->usePreparedStatements = $use_ps;
		$this->rdbms = $db_type;
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

	public function fetch_data() {

	}

}
