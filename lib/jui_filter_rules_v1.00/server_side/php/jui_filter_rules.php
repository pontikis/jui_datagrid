<?php
/**
 * jui_filter_rules, helper class for jquery.jui_filter_rules plugin, handles AJAX requests.
 **/
class jui_filter_rules {

	/** @var object Database connection */
	var $conn;
	/** @var bool Use prepared statements or not */
	var $usePreparedStatements;
	/** @var string RDBMS in use (one of "ADODB", "MYSQL", "MYSQLi", "MYSQL_PDO", "POSTGRES") */
	var $rdbms;

	/**
	 * @param object $dbcon database connection
	 * @param bool $use_ps use prepared statements or not
	 * @param string $db_type rdbms in use (one of "ADODB", "MYSQL", "MYSQLi", "MYSQL_PDO", "POSTGRES")
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


	/**
	 * Parse rules array from given JSON object and returns WHERE SQL clause and bind params array (used on prepared statements)
	 *
	 * @param array $a_rules The rules array
	 * @param bool $is_group If current rule belogns to group (except first group)
	 * @return array
	 */
	public function parse_rules($a_rules, $is_group = false) {
		static $sql;
		static $bind_params = array();
		if(is_null($sql)) {
			$sql = 'WHERE ';
		}
		$a_len = count($a_rules);

		foreach($a_rules as $i => $rule) {
			if(!isset($rule['condition'][0])) {
				$sql .= PHP_EOL;
				$sql .= ($is_group && $i == 0 ? '(' : '');
				$sql .= $rule['condition']['field'];
				$sql .= $this->create_operator_sql($rule['condition']['operator']);

				$filter_value_conversion_server_side = array_key_exists("filter_value_conversion_server_side", $rule) ? $rule['filter_value_conversion_server_side'] : null;
				$filter_value = array_key_exists("filterValue", $rule['condition']) ? $rule['condition']['filterValue'] : null;
				$filter_value_sql = $this->create_filter_value_sql($rule['condition']['filterType'],
					$rule['condition']['operator'],
					$filter_value,
					$filter_value_conversion_server_side,
					$this->usePreparedStatements, $this->rdbms);

				if($this->usePreparedStatements) {
					if(!in_array($rule['condition']['operator'], array("is_null", "is_not_null"))) {
						if(in_array($rule['condition']['operator'], array("in", "not_in"))) {
							$sql .= '(';
							$filter_value_len = count($filter_value);
							for($v = 0; $v < $filter_value_len; $v++) {
								$sql .= '?';
								if($v < $filter_value_len - 1) {
									$sql .= ',';
								}
								array_push($bind_params, $filter_value[$v]);
							}
							$sql .= ')';
						} else {
							$sql .= '?';
							array_push($bind_params, $filter_value_sql);
						}
					}
				} else {
					$sql .= $filter_value_sql;
				}

			} else {
				$this->parse_rules($rule['condition'], true);
			}
			$sql .= ($i < $a_len - 1 ? ' ' . $rule['logical_operator'] : '');
			$sql .= ($is_group && $i == $a_len - 1 ? ')' : '');
		}
		return array('sql' => $sql, 'bind_params' => $bind_params);
	}

	/**
	 * Return current rule filter value as a string suitable for SQL WHERE clause
	 *
	 * @param string $filter_type (one of "text", "number", "date" - see documentation)
	 * @param string $operator_type (see documentation for available operators)
	 * @param array|null $a_values the values array
	 * @param array|null $filter_value_conversion_server_side
	 * @return string
	 */
	private function create_filter_value_sql($filter_type, $operator_type, $a_values, $filter_value_conversion_server_side) {
		$conn = $this->conn;
		$res = '';
		$vlen = count($a_values);
		if($vlen == 0) {
			if(in_array($operator_type, array("is_empty", "is_not_empty"))) {
				$res = "''";
			}
		} else {

			// apply filter value conversion (if any)
			if(is_array($filter_value_conversion_server_side)) {
				$function_name = $filter_value_conversion_server_side['function_name'];
				$args = $filter_value_conversion_server_side['args'];
				$arg_len = count($args);

				for($i = 0; $i < $vlen; $i++) {
					if($i == 0) {
						array_push($args, $a_values[$i]);
						$arg_len++;
					} else {
						$args[$arg_len - 1] = $a_values[$i];
					}
					$a_values[$i] = call_user_func_array($function_name, $args);
				}
			}

			if($this->usePreparedStatements) {
				if(in_array($operator_type, array("equal", "not_equal", "less", "not_equal", "less_or_equal", "greater", "greater_or_equal"))) {
					$res = $a_values[0];
				} else if(in_array($operator_type, array("begins_with", "not_begins_with"))) {
					$res = $a_values[0] . '%';
				} else if(in_array($operator_type, array("contains", "not_contains"))) {
					$res = $a_values[0] . '%';
				} else if(in_array($operator_type, array("ends_with", "not_ends_with"))) {
					$res = '%' . $a_values[0];
				} else if(in_array($operator_type, array("in", "not_in"))) {
					for($i = 0; $i < $vlen; $i++) {
						$res .= ($i == 0 ? '(' : '');
						$res .= $a_values[$i];
						$res .= ($i < $vlen - 1 ? ',' : ')');
					}
				}
			} else {
				if(in_array($operator_type, array("equal", "not_equal", "less", "not_equal", "less_or_equal", "greater", "greater_or_equal"))) {
					$res = ($filter_type == "number" ? $a_values[0] : $this->safe_sql($a_values[0]));
				} else if(in_array($operator_type, array("begins_with", "not_begins_with"))) {
					$res = $this->safe_sql($a_values[0] . '%');
				} else if(in_array($operator_type, array("contains", "not_contains"))) {
					$res = $this->safe_sql('%' . $a_values[0] . '%');
				} else if(in_array($operator_type, array("ends_with", "not_ends_with"))) {
					$res = $this->safe_sql('%' . $a_values[0]);
				} else if(in_array($operator_type, array("in", "not_in"))) {
					for($i = 0; $i < $vlen; $i++) {
						$res .= ($i == 0 ? '(' : '');
						$res .= ($filter_type == "number" ? $a_values[$i] : $this->safe_sql($a_values[$i]));
						$res .= ($i < $vlen - 1 ? ',' : ')');
					}
				}
			}
		}
		return $res;
	}

	/**
	 * Create rule operator SQL substring
	 *
	 * @param string $operator_type
	 * @return string
	 */
	private function create_operator_sql($operator_type) {
		$operator = '';
		switch($operator_type) {
			case 'equal':
				$operator = '=';
				break;
			case 'not_equal':
				$operator = '!=';
				break;
			case 'in':
				$operator = 'IN';
				break;
			case 'not_in':
				$operator = 'NOT IN';
				break;
			case 'less':
				$operator = '<';
				break;
			case 'less_or_equal':
				$operator = '<=';
				break;
			case 'greater':
				$operator = '>';
				break;
			case 'greater_or_equal':
				$operator = '>=';
				break;
			case 'begins_with':
				$operator = 'LIKE';
				break;
			case 'not_begins_with':
				$operator = 'NOT LIKE';
				break;
			case 'contains':
				$operator = 'LIKE';
				break;
			case 'not_contains':
				$operator = 'NOT LIKE';
				break;
			case 'ends_with':
				$operator = 'LIKE';
				break;
			case 'not_ends_with':
				$operator = 'NOT LIKE';
				break;
			case 'is_empty':
				$operator = '=';
				break;
			case 'is_not_empty':
				$operator = '!=';
				break;
			case 'is_null':
				$operator = 'IS NULL';
				break;
			case 'is_not_null':
				$operator = 'IS NOT NULL';
				break;
		}
		$operator = ' ' . $operator . ' ';
		return $operator;
	}

	/**
	 * Returns escaped string for safe insertion in the database (in case prepared statements are NOT used)
	 *
	 * @param string $str_expr The string expression to be quoted
	 * @return string
	 */
	private function safe_sql($str_expr) {
		$conn = $this->conn;
		$rdbms = $this->rdbms;
		$res = '';
		switch($rdbms) {
			case "ADODB":
				$res = $conn->qstr($str_expr);
				break;
			case "MYSQL": // \todo MYSQL not tested!
				$res = mysql_real_escape_string($str_expr, $conn);
				break;
			case "MYSQLi": // \todo MYSQLi not tested!
				$res = mysqli_real_escape_string($conn, $str_expr);
				break;
			case "MYSQL_PDO": // \todo MYSQL_PDO not tested!
				$res = $conn->quote($str_expr);
				break;
			case "POSTGRES": // \todo POSTGRES not tested!
				$res = pg_escape_literal($conn, $str_expr);
				break;
		}
		return $res;
	}

}
