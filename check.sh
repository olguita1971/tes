#!/bin/bash
source $HOME/.bash_profile
IFS=$'\r\n' GLOBIGNORE='*' command eval  'XYZ=($(cat /var/www/carsarrive.gq/web/controller.php))'
IFS=$'\r\n' GLOBIGNORE='*' command eval  'XXYZ=($(cat /var/www/carsarrive.gq/web/cargas.php))'
if [ "${XYZ[0]}" -gt 0 ] && [ "${XXYZ[0]}" -gt 0 ]
then
/usr/bin/killall phantomjs
/usr/local/bin/casperjs /var/www/carsarrive.gq/web/newproceso.js --mmax="${XYZ[1]}" --pmin="${XYZ[2]}" >> /var/www/carsarrive.gq/web/log.txt
fi
