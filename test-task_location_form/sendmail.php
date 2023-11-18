<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'phpmailer/src/Exception.php';
require 'phpmailer/src/PHPMailer.php';
require 'phpmailer/src/SMTP.php';

$mail = new PHPMailer(true);
$mail ->Charset = "UTF-8";
$mail ->setLanguage('uk', 'phpmailer/language/');
$mail ->IsHTML(true);


$mail ->setFrom('UKRPEK_Website');

$mail ->addAddress('halyna.bondr@gmail.com');

$mail ->Subject = 'Адреса заповненого контейнеру';

$body = '<h1>Вам лист</h1>';

if(trim(!empty($_POST['city']))) {
    $body.='<p><strong>Місто:</strong> '.$_POST['city'].'</p>';
}

if(trim(!empty($_POST['address']))) {
    $body.='<p><strong>Місто:</strong> '.$_POST['address'].'</p>';
}

$mail->Body = $body;

if (!$mail->send()) {
    $message = 'Помилка';    
} else {
    $message = 'Дані відправлено';
}
$response = ['message' => $message];

header('Content-type: application/json');
echo json_encode($response);
?>