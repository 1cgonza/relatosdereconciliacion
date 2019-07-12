<?php

require_once 'functions/helpers.php';
require_once 'functions/setup.php';
require_once 'functions/scripts.php';
require_once 'functions/login.php';
require_once 'functions/metaboxes.php';
require_once 'functions/taxonomies.php';
require_once 'functions/clean-junk.php';
require_once 'functions/custom-post-types.php';
require_once 'functions/api.php';
require_once 'vendor/autoload.php';

function relatosMenus() {
  $locations = array(
    'Nav' => __('Menú Principal', 'text_domain'),
  );
  register_nav_menus($locations);
}
add_action('init', 'relatosMenus');

function wpse121123_contact_menu_atts($atts, $item, $args) {
  $atts['data-target'] = $item->object_id;
  return $atts;
}
add_filter( 'nav_menu_link_attributes', 'wpse121123_contact_menu_atts', 10, 3 );
