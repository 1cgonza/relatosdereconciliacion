<!DOCTYPE html>
<html class="no-js" <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo( 'charset' ); ?>">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
  <header id="header">
    <a href="http://relatosdereconciliacion.com" target="_self">
      <img class="logo" src="<?php echo get_template_directory_uri() . '/img/RelatosLogo.svg' ?>" alt="Relatos de Reconciliación">
    </a>
    <p><a class="extUrl" href="http://relatosdereconciliacion.com" target="_self">http://relatosdereconciliacion.com</a></p>
    <br/>
    <?php if ( is_user_logged_in() ) { ?>
      <p>Usuario: <?php echo esc_html(wp_get_current_user()->user_login) ?></p>
    <?php } else { ?>
      <p><a class="mainBtn" href="<?php echo wp_login_url(); ?>" title="Login">Login</a></p>
    <?php } ?>
  </header>

