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
