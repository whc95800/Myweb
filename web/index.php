<?php
/*
 * 不動産物件管理システム
 * Copyright (c) 2010-2016 by Crytus All rights reserved.
 *
 * 【注意】このファイルの修正は充分ご注意ください。
 * 修正する前には、必ずバックアップを保存してください。
 * 動作がおかしくなったら元のファイルに戻してください。
 * このファイルの漢字コードはHTMLと同じにしてください。
 *
 * get_newinfo処理修正 2013/07/18
 * 管理画面のレスポンシブ化 2016/01/08
 */
ini_set("short_open_tag", "0");
ini_set("magic_quotes_gpc", "0");
ini_set("mbstring.encoding_translation", "0");

// エラー出力の指定
error_reporting (E_ALL & ~E_NOTICE & ~E_WARNING & ~E_STRICT & ~E_DEPRECATED);

// データベースの漢字コード
define("DB_ENCODING", "UTF-8");

// メールの漢字コード(UTF-8かJIS)
define("MAIL_ENCODING", "JIS");

// セッションの開始
session_start();

include_once("setup.php");

$script_encoding = SCRIPT_ENCODING;

// 1ページの件数
if (!defined("PAGE_LIMIT")) {
	define("PAGE_LIMIT", 10);	// 10件
}

// 動作環境チェック
if (!function_exists("mb_convert_encoding")) {
	error_exit("日本語変換処理が使えません。ご確認をお願い致します。");
}
//if (!function_exists("sqlite_open")) {
//	error_exit("簡易データベース(SQLite)が使えません。ご確認をお願い致します。");
//}
if (!class_exists("PDO")) {
	error_exit("簡易データベース(SQLite3)が使えません。ご確認をお願い致します。");
} else {
	$ary = PDO::getAvailableDrivers();
	if (!in_array("sqlite", $ary)) {
		error_exit("簡易データベース(SQLite3)が使えません。ご確認をお願い致します。");
	}
}
if (!file_exists($DB_URI)) {
	error_exit("データファイル（{$DB_URI}）がみつかりません。ご確認をお願い致します。");
}
if (!function_exists("ImageCreateFromString")) {
	error_exit("画像処理が組み込まれていません。ご確認をお願い致します。");
}
if (substr(phpversion(), 0, 1) == "4") {
	error_exit("このシステムはPHP5 が必要です。ご確認をお願い致します。");
}
// 異常終了
function error_exit($msg)
{
	echo '<html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"></head><body>';
	echo $msg;
	echo "</body></html>";
	exit;
}
//-------------------------------------------------------------
//define("MAX_REC_SIZE", 4000);	// 1レコードの最大バイト数

// magic_quotes_gpc対策
if (get_magic_quotes_gpc()) {
	$_REQUEST = safeStripSlashes($_REQUEST);
}

$dbh = new PDO("sqlite:" . $DB_URI);

function exec_file($file)
{
	global $setup;
	global $DB_URI;
	global $script_encoding;

	if (file_exists("_files/" . $file)) {
		include_once("_files/" . $file);
	} else {
		$php = load_blob($file);
		eval("?>" . $php);
	}
}

// 大きなデータを取り出す
function load_blob($key)
{
	global $dbh;

//echo "load:{$key}<br>";
	$sql = "select seq from file_list where name='{$key}'";
	//$result = sqlite_query($dbh, $sql);
	//$val = sqlite_fetch_all($result);
	$ret = $dbh->query($sql);
	$val = $ret->fetchAll();

	if ($val) {
		$val = $val[0];
		$id = $val["seq"];
		$file = load_db_file($id);
		return $file;
	}
	return false;
}

function load_db_file($id)
{
	global $dbh;

	$data = "";
	$sql = "select contents from file_contents where file_num={$id} order by seq";
	//$result = sqlite_query($dbh, $sql);
	$stmt = $dbh->query($sql);
	while ($ret = $stmt->fetch(PDO::FETCH_ASSOC)) {
//	while ($ret = sqlite_fetch_array($result, SQLITE_ASSOC, TRUE)) {
		$data .= $ret["contents"];
	}
	return $data;
}

function safeStripSlashes($var) {
	if (is_array($var)) {
		return array_map('safeStripSlashes', $var);
	} else {
		if (get_magic_quotes_gpc()) {
			$var = stripslashes($var);
		}
		return $var;
	}
}

$act = $_REQUEST["act"];
if (!$act) {
	$act = "index";
}

// バイナリー処理のファイル
$binary = array(
	"png",
	"jpg",
	"gif",
);

if ($act == "file") {
	$file = $_REQUEST["f"];
	if ($file) {
		if (file_exists($file)) {
			$contents = file_get_contents($file);
		} else if (file_exists("_files/" . $file)) {
			$contents = file_get_contents("_files/" . $file);
		} else {
			$contents = load_blob($file);
			$ary = explode(".", $file);
			if (count($ary) > 1) {	// 拡張子あり？
				if (in_array($ary[count($ary)-1], $binary)) {
					$contents = base64_decode($contents);
				}
			}
		}
	}
	header('Content-Type: ' . get_mime_types($file));
	echo $contents;
	exit;
}
// --------------------------------
exec_file("sqlite_db.inc");
exec_file("dbaccess.inc");

exec_file("cms.inc");
exec_file("info.inc");
exec_file("info_item.inc");
exec_file("image.inc");

//exec_file("mail.php");
exec_file("htmltemplate.inc");
exec_file("fudosan_core.php");

// --------------------------------
if ($act == "list") {	// 物件一覧
	$page = $_REQUEST["page"];
	if (!$page) {
		$page = 1;
	}
	$ord = $_REQUEST["ord"];
	if (!$ord) {
		$ord = "";
	}
	$kind = $_REQUEST["kind"];
	if (!$kind) {
	//	$kind = "1";
	}
	$top = $_REQUEST["top"];
	if (!$top) {
		$top = "0";
	}
	$limit = $_REQUEST["limit"];
	if (!$limit) {
		$limit = PAGE_LIMIT;
	}
	$html = $_REQUEST["html"];
	//
	$form["ord"] = $ord;
	$form["kind"] = $kind;
	//
	$propaty = get_bukken_propaty(false, $kind);
//dump($propaty);
	// 項目検索
	$search = array();
	for ($i = 1; $i <= 20; $i++) {
		if (isset($_REQUEST["info" . $i])) {
			$v = trim($_REQUEST["info" . $i]);
			if ($v) {
				$search["info" . $i] = $v;
				$form["info" . $i] = $v;
				$form["info" . $i . "_" . $v] = $v;
				$form["info" . $i . "_" . $v] = " selected";
			}
		}
	}
	// こだわり検索
	$special = array();
	$special_item = array();
	for ($i = 1; $i <= 20; $i++) {
		$v = 0;
		if (isset($_REQUEST["special" . $i])) {
			$v = trim($_REQUEST["special" . $i]);
		}
		if ($propaty["special" . $i]) {
			$form["special" . $i] = $v;
			unset($item);
			$item["no"] = $i;
			$item["title"] = $propaty["special" . $i];
			$item["icon"] = $setup["icons"][$kind][$i];
			if ($v) {
				$special["special" . $i] = $v;
				$item["value"] = $v;
			}
			$special_item[] = $item;
		}
	}
	$form["special"] = $special_item;
	$data["form"] = $form;
	//
	$data["title"] = $setup["bukken"][$kind];
	list($list, $pager) = bukken_list($kind, $ord, $page, $limit, $top, $search, $special);
	$data["list"] = $list;
	$data["pager"] = $pager;
	$data["order"] = $ord;
	$data["ord" . $ord] = "1";
	$data["kind"] = $kind;
	$data["limit"] = $limit;
	$data["html"] = $html;
	$data["top"] = $top;
	//
	if (!$html) {
		$html = $propaty["list_html"];
	}
	$data["osusume"] = bukken_list(0, 0, 0, 8, 2);	//●●●全ページにおすすめ物件を表示させる。この行と15行ぐらい下の２か所。
	htmltemplate::t_include($html, $data);
	exit;
}
// 物件詳細
if ($act == "bukken") {
	$id = $_REQUEST["id"];
	if ($id) {
		// 物件
		$item = get_bukken($id);
		if ($item["pdf"]) {		// PDF ファイル
			$item["pdf_file"] = Image::getData($item["pdf"]);
		}
		$data["item"] = $item;
		//
		$html = $_REQUEST["html"];
		if (!$html) {
			$html = $item["propaty"]["item_html"];
		}
		$data["osusume"] = bukken_list(0, 0, 0, 8, 2);	//●●●全ページにおすすめ物件を表示させる。この行と15行ぐらい上の２か所。
		htmltemplate::t_include($html, $data);
		exit;
	}
}
if (($act == "toiawase")||($act == "toiawase_reinput")) {
	$id = $_REQUEST["id"];
	$item = get_bukken($id);
	if ($id && $item) {
		$data["item"] = $item;
		//
		$mode = $_REQUEST["mode"];
		if ($mode == "form") {
			$name = $_REQUEST["name"];
			$email = $_REQUEST["email"];
			$comment = $_REQUEST["comment"];
			$form["name"] = $name;
			$form["email"] = $email;
			$form["comment"] = $comment;
			$data["form"] = $form;
			if ($name && $email && $comment) {
				$data["mode"] = "confirm";
				$data["confirm"] = "1";
				$_SESSION["form"] = $form;
			} else {
				$msg = array();
				if (!$name) {
					$msg[] = $error_msg1;
				}
				if (!$email) {
					$msg[] = $error_msg2;
				}
				if (!$comment) {
					$msg[] = $error_msg3;
				}
				$data["message"] = join("<br/>", $msg);
				$data["mode"] = "form";
			}
		} else if ($mode == "confirm") {
			$form = $_SESSION["form"];
			$body = $mail_body;
			$body = str_replace("{info_id}", $item["info_id"], $body);
			$body = str_replace("{title}", $item["title"], $body);
			$body = str_replace("{name}", $form["name"], $body);
			$body = str_replace("{email}", $form["email"], $body);
			$body = str_replace("{comment}", $form["comment"], $body);
			// メール送信
			$tmp = $pre_admin . "\n" . $body . "\n\n" . $post_admin;
			sendmail2($from_mail, $admin_mail, $subject_admin, $tmp, null, $from_name);
			$tmp = $form["name"] . "{$mail_sama}\n\n{$pre_user}\n{$body}\n\n{$post_user}";
			sendmail2($from_mail, $form["email"], $subject, $tmp, null, $from_name);
		} else {
			$data["mode"] = "form";
		}
		if ($act == "toiawase_reinput") {
			$data["form"] = $_SESSION["form"];
			$data["mode"] = "form";
		}
		//
		htmltemplate::t_include("toiawase.html", $data);
		exit;
	}
}
// --------------------------------
// トップページ
$data["osusume"] = bukken_list(0, 0, 0, 8, 2);	// おすすめ
//
$data["list0"] = bukken_list(0, 0, 0, 8, 1);	// 全物件
$data["list1"] = bukken_list(1, 0, 0, 8, 1);	// 扱う物件の種類：１つめ
$data["list2"] = bukken_list(2, 0, 0, 8, 1);	// 扱う物件の種類：２つめ
$data["list3"] = bukken_list(3, 0, 0, 8, 1);	// 扱う物件の種類：３つめ
$data["list4"] = bukken_list(4, 0, 0, 8, 1);	// 扱う物件の種類：４つめ
//
$data["newinfo"] = get_newinfo();
//
htmltemplate::t_include("index_.html", $data);
exit;
// --------------------------------
// お知らせ
function get_newinfo()
{
	global $DB_URI;

	$sql = "select * from info where open=1 and kind=" . INFO_RSS;
	$inst = DBConnection::getConnection($DB_URI);
	$ret = $inst->search_sql($sql);
	$list = array();
	if ($ret["count"]) {
		foreach ($ret["data"] as $val) {
			$item = get_setup(INFO_RSS, $val["info_id"]);
			if ($item["open"]) {
				$item["reg_date"] = $val["reg_date"];
				if ($kind) {
					if ($kind == $item["kind"]) {
						$list[$item["rss_date"]] = $item;
					}
				} else {
					$list[$item["rss_date"]] = $item;
				}
			}
		}
	}
	// 並べ替え
	$rss = array();
	if ($list) {
		krsort($list);
		foreach ($list as $val) {
			$val["rss_date"] = substr($val["rss_date"], 0, 4) . "/" . substr($val["rss_date"], 5, 2) . "/" . substr($val["rss_date"], 8, 2);
			$rss[] = $val;
		}
	}
	return $rss;
}
// --------------------------------
// 物件プロパティ
function get_bukken_propaty($inst, $kind)
{
	global $DB_URI;

	if ($_SESSION["PROPATY" . $kind]) {
//		return $_SESSION["PROPATY" . $kind];
	}
	$propaty = array();
	if (!$inst) {
		$inst = DBConnection::getConnection($DB_URI);
	}
	$sql = "select kind,value from info_item where info_id in (select info.info_id from info left join info_item on info.info_id=info_item.info_id where info.kind=" . INFO_PROPATY . " and info_item.kind='kind' and info_item.value='{$kind}')";
	$ret = $inst->search_sql($sql);
	if ($ret["count"]) {
		foreach ($ret["data"] as $val) {
			$propaty[$val["kind"]] = $val["value"];
		}
	}
	if (!$propaty["list_html"]) {
		$propaty["list_html"] = "list.html";
	}
	if (!$propaty["item_html"]) {
		$propaty["item_html"] = "item.html";
	}
//dump($propaty);
	$_SESSION["PROPATY" . $kind] = $propaty;
	return $propaty;
}
// --------------------------------
function bukken_list($kind=0, $ord=0, $page=0, $limit=0, $top=0, $search=array(), $special=array())
{
	global $DB_URI;

	$inst = DBConnection::getConnection($DB_URI);
	$join = "";
	$where = "";
	if ($kind) {
		$k = INFO_ITEM + intval($kind);
		$where = " and info.kind={$k}";
		// プロパティ
		$propaty = get_bukken_propaty($inst, $kind);
	}
	// トップページ用一覧
	if ($top) {
		if ($top == 1) {	// new
			$join = " left join info_item i2 on info.info_id=i2.info_id";
			$where .= " and i2.kind='new' and i2.value=1";
		}
		if ($top == 2) {	// オススメ
			$join = " left join info_item i2 on info.info_id=i2.info_id";
			$where .= " and i2.kind='recommend' and i2.value=1";
		}
		if (intval($top) > 10) {	// オススメ
			$join = " left join info_item i2 on info.info_id=i2.info_id";
			$v = intval($top) - 10;
			$where .= " and i2.kind='recommend' and i2.value=$v";
		}
	}
	// 条件検索
	if ($search) {
		$no = 11;
		foreach ($search as $key => $val) {
			$val = mb_convert_encoding($val, INTERNAL_ENCODING, SCRIPT_ENCODING);
			$join .= " left join info_item i$no on info.info_id=i$no.info_id";
			$where .= " and i$no.value like '%{$val}%' and i$no.kind='$key'";
//			$where .= " and i$no.value='$val' and i$no.kind='$key'";
			$no++;
		}
	}
	// こだわり条件検索
	if ($special) {
		$no = 21;
		foreach ($special as $key => $val) {
			$join .= " left join info_item i$no on info.info_id=i$no.info_id";
			$where .= " and i$no.value=$val and i$no.kind='special'";
			$no++;
		}
	}
	//
	$sql = " from info" .
		" left join info_item i1 on info.info_id=i1.info_id {$join}" .
		" where info.open=1 and i1.kind='price' {$where}";
	if ($page && $limit) {
		$ret = $inst->search_sql("select count(info.info_id) as num" . $sql);
		$count = $ret["data"][0]["num"];
		$pages = intval(($count + $limit - 1) / $limit);
		$pager = array();
		if ($pages > 1) {
			$pager = page_index($page, $pages);
		}
	}
	if ($ord == 1) {
		$sql .= " order by price desc";	// 高い順
	} else if ($ord == 2) {
		$sql .= " order by price";	// 安い順
	} else {
		$sql .= " order by info.reg_date desc";	// 新着
	}
	if ($page && $limit) {
		$p["offset"] = ($page - 1) * $limit;
		$p["limit"] = $limit;
	} else {
		$p["offset"] = 0;
		$p["limit"] = $limit;
	}
	$ret = $inst->search_sql("select info.info_id as info_id,i1.value+0 as price" . $sql, false, $p);
	$list = array();
	if ($ret["count"]) {
		foreach ($ret["data"] as $val) {
			$list[] = get_bukken($val["info_id"], $propaty);
		}
	}
	if ($page && $limit) {
		return array($list, $pager);
	}
	return $list;
}

function get_bukken($info_id, $propaty=null)
{
	global $DB_URI;
	global $setup;

	$ret = get_infoitem($info_id);
	if (!$ret) return array();
	$inst = DBConnection::getConnection($DB_URI);
	$info = Info::getData($info_id);
	$kind = $info["kind"] - 100;
	if (!$propaty) {
		// プロパティ
		$propaty = get_bukken_propaty($inst, $kind);
	}
	//
//	$list = array("info_id" => $info_id, "kind" => $kind, "propaty" => $propaty);
	$list = array("info_id" => $info_id, "kind" => $kind, "bukken" => $setup["bukken"][$kind], "propaty" => $propaty);
	$list_item = array();
	$info = array();
	$special = array();
	foreach ($ret as $key => $val) {
		if ($key == "special") {
			$ary = explode(",", $val);
			if ($ary) {
				foreach ($ary as $val2) {
					$key2 = "special" . $val2;
					unset($item);
					$item["title"] = $propaty[$key2];
					$item["value"] = $val2;
					if ($setup["icons"][$kind][$val2]) {
						$item["icon"] = $setup["icons"][$kind][$val2];
					}
					$list[$key2] = $item;
					$special[] = $item;
				}
			}
		} else if ($propaty[$key]) {
			unset($item);
			if ($val) {
				$item["title"] = $propaty[$key];
				$item["value"] = $val;
				$list[$key] = $item;
				if (substr($key, 0, 4) == "info") {
					$n = intval(substr($key, 4));
					if ($n <= 10) {		// 一覧項目
						$list_item[] = $item;
					}
					$info[] = $item;
				}
			}
		} else if ($val) {
			if (($key == "new") && $val) {
				$list["new_flag"] = $val;
			}
			if (($key == "recommend") && $val) {
				$list["recommend" . $val] = "1";
			}
			$list[$key] = $val;
		}
		if (substr($key, 0, 5) == "image") {
			if ($val) {
				$img = Image::getData($val);
				if ($img) {
					$list[$key . "_file"] = $img["save_name"];
				}
			}
		}
	}
	$list["list_item"] = set_row($list_item, 2);	// 一覧用情報
	$list["info"] = $info;	// 詳細用情報
	$list["special"] = $special;	// こだわり
	return $list;
}
function set_row($ary, $cnt)
{
	$num = 0;
	$col = 0;
	$data = array();
	$row = array();
	foreach ($ary as $val) {
		$row[] = $val;
		if (++$col == $cnt) {
			$data[$num]["num"] = $num + 1;
			$data[$num++]["row"] = $row;
			$row = array();
			$col = 0;
		}
	}
	if ($row) {
		$data[$num]["num"] = $num + 1;
		$data[$num++]["row"] = $row;
	}
	return $data;
}
function page_index($cur, $pages)
{
	$page = array();
	$no = 0;
	if ($cur > 1) {
		$page['prev'] = array('no' => $cur - 1, 'name' => 'PREV', 'link' => 1);
	}
	for ($i = 1; $i <= $pages; $i++) {
		if ($i == $cur) {
			$page['list'][$no] = array('no' => $i, 'name' => $i);
		} else {
			$page['list'][$no] = array('no' => $i, 'name' => $i, 'link' => 1);
		}
		$no++;
	}
	if ($cur < ($pages)) {
		$page['next'] = array('no' => $cur + 1, 'name' => 'NEXT', 'link' => 1);
	}
	return $page;
}

// ファイルの拡張子からMIMEタイプを得る
function get_mime_types($file)
{
	$mime_types = array(
		'txt' => 'text/plain',
		'htm' => 'text/html',
		'html' => 'text/html',
		'php' => 'text/html',
		'css' => 'text/css',
		'js' => 'application/javascript',
		'json' => 'application/json',
		'xml' => 'application/xml',
		'swf' => 'application/x-shockwave-flash',
		'flv' => 'video/x-flv',

		// images
		'png' => 'image/png',
		'jpe' => 'image/jpeg',
		'jpeg' => 'image/jpeg',
		'jpg' => 'image/jpeg',
		'gif' => 'image/gif',
		'bmp' => 'image/bmp',
		'ico' => 'image/vnd.microsoft.icon',
		'tiff' => 'image/tiff',
		'tif' => 'image/tiff',
		'svg' => 'image/svg+xml',
		'svgz' => 'image/svg+xml',

		// archives
		'zip' => 'application/zip',
		'rar' => 'application/x-rar-compressed',
		'exe' => 'application/x-msdownload',
		'msi' => 'application/x-msdownload',
		'cab' => 'application/vnd.ms-cab-compressed',

		// audio/video
		'mp3' => 'audio/mpeg',
		'qt' => 'video/quicktime',
		'mov' => 'video/quicktime',

		// adobe
		'pdf' => 'application/pdf',
		'psd' => 'image/vnd.adobe.photoshop',
		'ai' => 'application/postscript',
		'eps' => 'application/postscript',
		'ps' => 'application/postscript',

		// ms office
		'doc' => 'application/msword',
		'rtf' => 'application/rtf',
		'xls' => 'application/vnd.ms-excel',
		'ppt' => 'application/vnd.ms-powerpoint',

		// open office
		'odt' => 'application/vnd.oasis.opendocument.text',
		'ods' => 'application/vnd.oasis.opendocument.spreadsheet',
	);

	$ary = explode(".", $file);
	if (count($ary) > 1) {	// 拡張子あり？
		if ($mime_types[$ary[count($ary)-1]]) {
			return $mime_types[$ary[count($ary)-1]];
		}
	}
	return "application/octet-stream";	// 不明なファイル
}

