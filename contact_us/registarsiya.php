<?php
require_once('db.php');

$login = $_POST['login'];
$pass = $_POST['pass'];
$repeatpass = $_POST['repeatpass'];
$email = $_POST['email'];

$sql = "INSERT INTO`Test` (login,pass,email) VALUES('$login','$pass','$email')";

$conn -> query($sql);