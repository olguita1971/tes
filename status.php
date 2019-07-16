<?php
$out = shell_exec('tail /var/www/carsarrive.gq/web/log.txt');
$out2 = shell_exec('cat log.txt | grep Click | tail');
echo "Registros de busqueda y coincidencias:";
echo "<pre>".$out."</pre>";
echo "<br>Ultimos 10 Clicks registrados:";
echo "<pre>".$out2."</pre>";
?>
<br>
Ver la captura de la pantalla al momento de hacer click:
<form action="/imagenid.php" method="post">
  LoadID Code:<br>
  <input type="text" name="loadid">
  <br><br>
  <input type="submit" value="Submit">
</form> 
