<?php

$servername = "localhost";
$username = "peydalytvg";
$password = "KV5TJj7Qd8NGSu_N";
$dbname = "peydalytvg";



$conn = mysqli_connect($server, $username, $password, $dbname);

if(!$conn){
    die("connection failed". mysqli_connect_error());
}else{
    echo"USPEH!";
}

?>