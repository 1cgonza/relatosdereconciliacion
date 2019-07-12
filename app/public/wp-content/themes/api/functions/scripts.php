<?php

function google_fonts() {
  $url = '';
  $fonts = array();
  $fonts[] = 'Ubuntu:300,400,700';

  if ($fonts) {
    $url = add_query_arg(array(
      'family' => urldecode(implode('|', $fonts))
    ), '//fonts.googleapis.com/css');
  }

  return $url;
}

function relatos_scripts() {
  wp_deregister_script('jquery');
  wp_deregister_script( 'wp-embed' );
  wp_enqueue_style('relatos-fonts', google_fonts(), array(), null);
  wp_enqueue_style('relatos-style', get_template_directory_uri() . '/css/style.css', array(), '', false);

  wp_enqueue_script('relatos-scripts', get_template_directory_uri() . '/js/scripts.min.js', array(), '', false);

  wp_localize_script( 'relatos-scripts', 'relatosVars', array(
    'path' => get_stylesheet_directory_uri()
  ));
}

add_action('wp_enqueue_scripts', 'relatos_scripts');
