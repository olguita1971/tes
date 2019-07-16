<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
* {
    box-sizing: border-box;
}

input[type=text], select, textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    resize: vertical;
}

label {
    padding: 12px 12px 12px 0;
    display: inline-block;
}

input[type=submit] {
    background-color: #4CAF50;
    color: white;
    padding: 12px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    float: right;
}

input[type=submit]:hover {
    background-color: #45a049;
}

.container {
    border-radius: 5px;
    background-color: #f2f2f2;
    padding: 20px;
}

.col-25 {
    float: left;
    width: 25%;
    margin-top: 6px;
}

.col-75 {
    float: left;
    width: 75%;
    margin-top: 6px;
}

/* Clear floats after the columns */
.row:after {
    content: "";
    display: table;
    clear: both;
}

/* Responsive layout - when the screen is less than 600px wide, make the two columns stack on top of each other instead of next to each other */
@media screen and (max-width: 600px) {
    .col-25, .col-75, input[type=submit] {
        width: 100%;
        margin-top: 0;
    }
}
</style>
<script>
window.onload = function () { 
(function countdown(remaining) {
    if(remaining === 0)
        location.reload(true);
    //document.getElementById('countdown').innerHTML = "Automatic page refresh in "+remaining+" Seconds";
    setTimeout(function(){ countdown(remaining - 1); }, 1000);
})(900);}
</script>
<script src="login.js"></script>
</head>
<body>
<div id="countdown"></div>
<?php
$lineas = file('/var/www/carsarrive.gq/web/controller.php');
$remaining = file('/var/www/carsarrive.gq/web/cargas.php');
$since = file('/var/www/carsarrive.gq/web/since.php');
$ignore1 = file('/var/www/carsarrive.gq/web/history.php');
if (isset($_POST['loads']) and isset($_POST['mmax']) and isset($_POST['pmin']) and isset($_POST['segundos'])){
$loads = $_POST['loads'];
$mmax = $_POST['mmax'];
$pmin = $_POST['pmin'];
$segundos = $_POST['segundos'];
$ignore = $_POST['ignore'];
$out = shell_exec('casperjs newlogin.js');
//var_dump($out);
if ($mmax > 0 && $pmin > 0 && $loads > 0){
$fichero = '/var/www/carsarrive.gq/web/controller.php';
$fichero2 = '/var/www/carsarrive.gq/web/cargas.php';
$fichero3 = '/var/www/carsarrive.gq/web/since.php';
$fichero4 = '/var/www/carsarrive.gq/web/history.php';
$datos = "1\n".$mmax."\n".$pmin."\n".$segundos;
// Escribe el contenido al fichero
$date = new DateTime();
$date = $date->format("Y/m/d h:i:s");
file_put_contents($fichero, $datos);
file_put_contents($fichero2, $loads);
file_put_contents($fichero3, $date);
file_put_contents($fichero4, $ignore);}
//exec('casperjs login.js --mmax='.$mmax.' --pmin='.$pmin, $out);
//echo $out[0];
header("Refresh:0");
}
if (isset($_POST['stop'])){$fichero = '/var/www/carsarrive.gq/web/controller.php';$fichero2 = '/var/www/carsarrive.gq/web/cargas.php';$fichero3 = '/var/www/carsarrive.gq/web/since.php';$datos = "0";file_put_contents($fichero, $datos);file_put_contents($fichero2, $datos);file_put_contents($fichero3, "-");header("Refresh:0");}
?>
<h2>Marron</h2>

<div class="container">
  <form method="POST" action="index.php">
    <div class="row">
      <div class="col-25">
        <label for="fname">Loads</label>
      </div>
      <div class="col-75">
        <input type="number" id="fname" name="loads" placeholder="Loads">
      </div>
    </div>
    <div class="row">
      <div class="col-25">
        <label for="fname">Milage Max</label>
      </div>
      <div class="col-75">
        <input type="number" id="fname" name="mmax" placeholder="Milage Max">
      </div>
    </div>
    <div class="row">
      <div class="col-25">
        <label for="fname">Price Min</label>
      </div>
      <div class="col-75">
        <input type="number" id="fname" name="pmin" placeholder="Price Min">
      </div>
    </div>
    <div class="row">
      <div class="col-25">
        <label for="fname">Refresh Every</label>
      </div>
      <div class="col-75">
        <input type="number" id="segundos" name="segundos" placeholder="Seconds">
      </div>
    </div>
    <div class="row">
      <div class="col-25">
        <label for="fname">Ignore ID</label>
      </div>
      <div class="col-75">
        <input type="text" id="ignore" name="ignore" value="<?php echo $ignore1[0]; ?>" placeholder="Comma separated IDs">
      </div>
    </div><br>
    <div style="text-align:center;" class="row">
	<?php
	if ($lineas[0] == 0){echo "Status: Offline!";}else{echo "Status: Online Running Every ".$lineas[3]." Seconds!\nPrice Min: $".$lineas[2]." Mileage Max:".$lineas[1];}
	?>
	<br>Loads remaining:<?php echo " ".$remaining[0]; ?>
	<br>Running Since:<?php echo " ".$since[0]." GMT-4"; ?>
	<br><a href="status.php">Ver Status</a>
    </div><br>
    <div class="row">
      <input type="submit" value="Start">
    </div>
  </form>
  <form method="POST" action="index.php"> 
    <div class="row">
      <input style="display:none;" type="text" id="stop" name="stop" value="stop">
      <input style="background-color:#af4c4c;" type="submit" value="Stop">
    </div>
   </form>
</div>

</body>
</html>

