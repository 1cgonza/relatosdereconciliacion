<?php

function relatos_register_tax($name, $singular, $plural, $types, $slug, $hierarchical) {
  return register_taxonomy($name, $types,
    array(
      'labels' => array(
        'name'                       => $plural,
        'singular_name'              => $singular,
        'search_items'               => 'Buscar',
        'popular_items'              => $plural . ' con mayor cantidad de entradas',
        'all_items'                  => 'Todos',
        'parent_item'                => 'Parent ' . $singular,
        'parent_item_colon'          => 'Parent ' . $singular . ':',
        'edit_item'                  => 'Editar ' . $singular,
        'update_item'                => 'Actualizar ' . $singular,
        'add_new_item'               => 'Agregar ' . $singular,
        'new_item_name'              => 'Nuevo ' . $singular,
        'separate_items_with_commas' => 'Separar los ' . $plural . ' con coma.',
        'choose_from_most_used'      => 'Ver lista de ' . $plural
      ),
      'hierarchical'      => $hierarchical,
      'show_admin_column' => true,
      'show_ui'           => true,
      'show_in_rest'      => true,
      'query_var'         => true,
      'rewrite'           => array( 'slug' => $slug )
    )
  );
}

relatos_register_tax(
  'tecnicas',
  'Técnica',
  'Técnicas',
  array('proyecto'),
  'tecnica',
  true
);

relatos_register_tax(
  'autores',
  'Autor',
  'Autores',
  array('proyecto'),
  'autor',
  false
);

relatos_register_tax(
  'colaboadores',
  'Colaborador',
  'Colaboradores',
  array('proyecto'),
  'colaboador',
  false
);

relatos_register_tax(
  'violencia',
  'Tipo de Violencia',
  'Tipos de Violencia',
  array('proyecto'),
  'autor',
  true
);
