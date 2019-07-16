<?php
$time = time();
while ( true ) {
    /*
     * Play Some Ball
     */
    if ((time() - $time) >= 1) {
        echo date("Y:m:d g:i:s"), PHP_EOL;
        $time = time();
    }
    sleep(1);
}
?>
