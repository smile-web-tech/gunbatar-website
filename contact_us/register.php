<?php
header('Content-Type: application/json');

// Логика регистрации
$registration_success = true;

if ($registration_success) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false]);
}
?>