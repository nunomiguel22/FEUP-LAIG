<?php
function execPrint($command) {
    $result = array();
    exec($command, $result);
    print("<pre>");
    foreach ($result as $line) {
        print($line . "\n");
    }
    print("</pre>");
}


// Set Variables
$LOCAL_ROOT         = "/var/www/html/";
$LOCAL_REPO_NAME    = "FEUP-LAIG"; // Change to repo
$LOCAL_REPO         = "{$LOCAL_ROOT}/{$LOCAL_REPO_NAME}";
$REMOTE_REPO        = "git@github.com:username/reponame.git";
$BRANCH             = "master";

$allowed_ips = array(
	'207.97.227.', '50.57.128.', '108.171.174.', '50.57.231.', '204.232.175.', '192.30.252.', // GitHub
	'195.37.139.','193.174.' // VZG
);
$allowed = false;

$headers = apache_request_headers();

if (@$headers["X-Forwarded-For"]) {
    $ips = explode(",",$headers["X-Forwarded-For"]);
    $ip  = $ips[0];
} else {
    $ip = $_SERVER['REMOTE_ADDR'];
}

foreach ($allowed_ips as $allow) {
    if (stripos($ip, $allow) !== false) {
        $allowed = true;
        break;
    }
}

if (!$allowed) {
	header('HTTP/1.1 403 Forbidden');
 	echo "<span style=\"color: #ff0000\">Sorry, no hamster - better convince your parents!</span>\n";
    echo "</pre>\n</body>\n</html>";
    exit;
}

flush();


if ( $_POST['payload'] ) {
  // Only respond to POST requests from Github


  if( file_exists($LOCAL_REPO) ) {

    // If there is already a repo, just run a git pull to grab the latest changes
    //execPrint("cd {$LOCAL_REPO} && sudo -u reav git pull 2>&1"); //DEBUG
    exec("cd {$LOCAL_REPO} && sudo -u reav git pull");
    die("done " . mktime());
  }
}
?>
