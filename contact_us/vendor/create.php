<?php
require_once '../db/connect.php';
$id = $_POST['id'];
$Ady = $_POST['Ady'];
$Telefon = $_POST['Telefon'];
$Email = $_POST['Email'];
$Dersi = $_POST['Dersi'];
$image = $_POST['image'];
$image2 = $_POST['image2'];

mysqli_query($connect, "INSERT INTO `register` (`id`, `Ady`, `Telefon`, `Email`, `Dersi`, `image`, `image2`, `created_at`, `updated_at`) VALUES (NULL, '$Ady', '$Telefon', '$Email', '$Dersi', '$image', '$image2', NULL, NULL);");
header('Location: /contact_us/contact%20us.html');

$charset = "utf8";
if(!$mysqli_query->set_charset($charset)){
    
    print('Osibka');
}
?>