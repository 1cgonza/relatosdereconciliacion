<?php

function relatos_flush_rewrite_rules() {
  flush_rewrite_rules();
}
add_action('after_switch_theme', 'relatos_flush_rewrite_rules');

// The custom dashicons are at: https://developer.wordpress.org/resource/dashicons/
function relatos_register_cpt($typeName, $singular, $plural, $icon) {
  return register_post_type($typeName,
    array(
      'labels' => array(
        'name'               => $plural,
        'singular_name'      => $singular,
        'all_items'          => 'Todos',
        'add_new'            => 'Agregar Nuevo',
        'add_new_item'       => 'Agregar Nuevo',
        'edit'               => 'Editar',
        'edit_item'          => 'Editar ' . $singular,
        'new_item'           => 'Nuevo ' . $singular,
        'view_item'          => 'Ver ' . $singular,
        'search_items'       => 'Buscar ' . $plural,
        'not_found'          => 'No hay resultados.',
        'not_found_in_trash' => 'No hay nada en la basura',
        'parent_item_colon'  => ''
      ),

      'description'         => '',
      'public'              => true,
      'publicly_queryable'  => true,
      'exclude_from_search' => false,
      'show_ui'             => true,
      'query_var'           => true,
      'menu_position'       => 7,
      'menu_icon'           => $icon,
      'rewrite'             => array( 'slug' => $typeName, 'with_front' => false ),
      'has_archive'         => $typeName,
      'capability_type'     => 'post',
      'hierarchical'        => false,
      'supports'            => array( 'title', 'thumbnail', 'comments', 'revisions', 'custom-fields'),
      'show_in_rest'        => true,
      // 'taxonomies'          => array( 'post_tag' )
    )
  );
}

function custom_post_types() {
  relatos_register_cpt('proyecto', 'Proyecto', 'Proyectos', 'dashicons-image-filter');
}

add_action('init', 'custom_post_types');
