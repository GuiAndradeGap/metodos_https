<?php
    $so_interface = $_SERVER['HTTP_USER_AGENT'];

    $so = 'Windows';

    if(strpos($so_interface, $so)){
       // echo 'Estou em um Windows';
       header('Location: http://localhost:81/Interceptador/desk_web/cliente/index.html');
    }else{
       // echo 'Não estou em um Windows ';
       header('Location: http://localhost:81/Interceptador/mobile_web/index.php');
    } 
?>
