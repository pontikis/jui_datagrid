<?php
/**
 * Parse rules array from given JSON object and returns WHERE SQL clause and bind params array (in case of prepared statements)
 *
 * @param array $a_rules the rules array
 * @param bool $use_ps use prepared statements (or not)
 * @param bool $is_group if current rule belogns to group (except first group)
 * @return array
 */
function parse_rules($a_rules, $use_ps, $is_group = false) {
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
			$sql .= create_operator_sql($rule['condition']['operator']);

			$filter_value_conversion_server_side = array_key_exists("filter_value_conversion_server_side", $rule) ? $rule['filter_value_conversion_server_side'] : null;
			$filter_value = array_key_exists("filterValue", $rule['condition']) ? $rule['condition']['filterValue'] : null;
			$filter_value = create_filter_value_sql($rule['condition']['filterType'],
				$rule['condition']['operator'],
				$filter_value,
				$filter_value_conversion_server_side,
				$use_ps);

			if($use_ps) {
				if(!in_array($rule['condition']['operator'], array("is_null", "is_not_null"))) {
					$sql .= '?';
					array_push($bind_params, $filter_value);
				}
			} else {
				$sql .= $filter_value;
			}

		} else {
			parse_rules($rule['condition'], $use_ps, true);
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
 * @param bool $use_prepared_statents
 * @return string
 */
function create_filter_value_sql($filter_type, $operator_type, $a_values, $filter_value_conversion_server_side, $use_prepared_statents) {
	global $conn;
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

		if($use_prepared_statents) {
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
				$res = ($filter_type == "number" ? $a_values[0] : $conn->qstr($a_values[0]));
			} else if(in_array($operator_type, array("begins_with", "not_begins_with"))) {
				$res = $conn->qstr($a_values[0] . '%');
			} else if(in_array($operator_type, array("contains", "not_contains"))) {
				$res = $conn->qstr('%' . $a_values[0] . '%');
			} else if(in_array($operator_type, array("ends_with", "not_ends_with"))) {
				$res = $conn->qstr('%' . $a_values[0]);
			} else if(in_array($operator_type, array("in", "not_in"))) {
				for($i = 0; $i < $vlen; $i++) {
					$res .= ($i == 0 ? '(' : '');
					$res .= ($filter_type == "number" ? $a_values[$i] : $conn->qstr($a_values[$i]));
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
 * @param $operator_type
 * @return string
 */
function create_operator_sql($operator_type) {
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