<?php
function relatos_setup() {
  add_theme_support('title-tag');
  add_theme_support('post-thumbnails');
  add_theme_support('html5', array(
    'comment-form',
    'comment-list',
    'search-form',
    'gallery',
    'caption'
  ));

  // add_image_size('relatos-500xauto', 500, 9999);

  // function rr_custom_image_sizes($sizes) {
  //   return array_merge($sizes, array(
  //     'relatos-500xauto' => '500px by auto'
  //   ));
  // }
  // add_filter('image_size_names_choose', 'rr_custom_image_sizes');
}
add_action('after_setup_theme', 'relatos_setup');

function relatos_head_css() {
  echo "<script>(function(html){html.className = html.className.replace(/\bno-js\b/,'js')})(document.documentElement);</script>\n";
}

add_action('wp_head', 'relatos_head_css', 0);
