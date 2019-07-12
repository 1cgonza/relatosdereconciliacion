<?php
function relatos_login_css() {
  wp_enqueue_style('ka-login', get_template_directory_uri() . '/css/login.css', false);
}
add_action('login_enqueue_scripts', 'relatos_login_css', 10);

function relatos_login_url() {
  return home_url();
}
add_filter( 'login_headerurl', 'relatos_login_url' );

function relatos_login_title() {
  return get_option('blogname');
}
add_filter( 'login_headertitle', 'relatos_login_title' );
