<?php

/**
 * Convert date string (without time) of given format to YYYYMMDD string
 *
 * @param string $str_user_date
 * @param string $str_user_dateformat
 * @return string
 */
function date_encode($str_user_date, $str_user_dateformat) {
	$date = DateTime::createFromFormat($str_user_dateformat, $str_user_date);
	return $date->format("Y") . $date->format("m") . $date->format("d");
}

/**
 * Converts a UTC timestamp to date string of given timezone (considering DST) and given dateformat
 *
 * DateTime requires PHP >= 5.2
 *
 * @param $str_server_datetime
 *
 * <li>Normally is a 14-digit UTC timestamp (YYYYMMDDHHMMSS). It can also be 8-digit (date), 12-digit (datetime without seconds).
 * If given dateformat (<var>$str_user_dateformat</var>) is longer than <var>$str_server_datetime</var>,
 * the missing digits of input value are filled with zero,
 * so (YYYYMMDD is equivalent to YYYYMMDD000000 and YYYYMMDDHHMM is equivalent to YYYYMMDDHHMM00).
 *
 * <li>It can also be 'now', null or empty string. In this case returns the current time.
 *
 * <li>Other values (invalid datetime strings) throw an error. Milliseconds are not supported.
 *
 * @param string $str_user_timezone
 * @param $str_user_dateformat
 * @return string
 */
function UTC_timestamp_to_local_datetime($str_server_datetime,
										 $str_user_timezone,
										 $str_user_dateformat) {

	if(is_null($str_server_datetime) || $str_server_datetime == '') {
		return '';
	}

	// create date object
	$date = new DateTime($str_server_datetime);

	// convert to user timezone
	$userTimeZone = new DateTimeZone($str_user_timezone);
	$date->setTimeZone($userTimeZone);

	// convert to user dateformat
	$str_user_datetime = $date->format($str_user_dateformat);

	return $str_user_datetime;
}

