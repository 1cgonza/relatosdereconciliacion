<?php

function disable_emojis() {
  remove_action('wp_head', 'print_emoji_detection_script', 7);
  remove_action('admin_print_scripts', 'print_emoji_detection_script');
  remove_action('wp_print_styles', 'print_emoji_styles');
  remove_action('admin_print_styles', 'print_emoji_styles');
  remove_filter('the_content_feed', 'wp_staticize_emoji');
  remove_filter('comment_text_rss', 'wp_staticize_emoji');
  remove_filter('wp_mail', 'wp_staticize_emoji_for_email');
  add_filter('tiny_mce_plugins', 'disable_emojis_tinymce');
}

// add_action('init', 'disable_emojis');

function my_remove_meta_boxes() {
  remove_meta_box( 'categorydiv', 'post', 'side' );
  remove_meta_box( 'tagsdiv-post_tag', 'post', 'side' );
}

add_action( 'admin_menu', 'my_remove_meta_boxes' );
