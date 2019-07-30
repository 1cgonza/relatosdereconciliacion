<?php

function relatos_register_mb() {
  $prefix = '_rr_';

  $meta = new_cmb2_box(array(
    'id'           => $prefix . 'meta',
    'title'        => 'Datos',
    'object_types' => array('proyecto'),
    'context'      => 'normal',
    'priority'     => 'high',
    'show_names'   => true
  ));

  /*==============================
  =            Videos            =
  ==============================*/
  $video = $meta->add_field(array(
    'id'      => $prefix . 'video',
    'type'    => 'group',
    'desc'    => '',
    'options' => array(
      'group_title'   => __('Video {#}'),
      'add_button'    => 'Nuevo video',
      'remove_button' => 'Eliminar video',
      'sortable'      => true
    )
  ));

  $meta->add_group_field($video, array(
    'id'   => 'oembed_url',
    'name' => 'Video ID',
    'desc' => 'El "Video ID" está al final de la URL. Ejemplo: en la URL https://www.dailymotion.com/video/x7e22cu el ID es: x7e22cu',
    'type' => 'text'
  ));

  $meta->add_group_field($video, array(
    'id'   => 'cita',
    'name' => 'Cita',
    'desc' => '',
    'type' => 'wysiwyg',
    'options' => array(
      'media_buttons' => false,
      'teeny' => true,
      'textarea_rows' => get_option('default_post_edit_rows', 5)
    )
  ));

  $meta->add_group_field($video, array(
    'id'   => 'sinopsis',
    'name' => 'Sinopsis',
    'desc' => '',
    'type' => 'wysiwyg',
    'options' => array(
      'media_buttons' => false,
      'teeny' => true,
      'textarea_rows' => get_option('default_post_edit_rows', 10)
    )
  ));

  $meta->add_group_field($video, array(
    'id'   => 'transcripcion',
    'name' => 'Transcripción de entrevista',
    'desc' => '',
    'type' => 'wysiwyg',
    'options' => array(
      'media_buttons' => false,
      'teeny' => true,
      'textarea_rows' => get_option('default_post_edit_rows', 15)
    )
  ));

  $meta->add_group_field($video, array(
    'id'   => 'referencias',
    'name' => 'Referencias',
    'desc' => '',
    'type' => 'wysiwyg',
    'options' => array(
      'media_buttons' => true,
      'teeny' => true,
      'textarea_rows' => get_option('default_post_edit_rows', 15)
    )
  ));

  $meta->add_group_field($video, array(
    'id'   => 'temasSrt',
    'name' => 'Temas',
    'desc' => 'Descargar archivo .srt de YouTube y subirlo acá',
    'type' => 'file',
    'options' => array(
      'url' => false,
    ),
    'text' => array(
      'add_upload_file_text' => 'Agregar archivo .srt con temas'
    ),
    'query_args' => array(
      'type' => 'application/srt'
    )
  ));

  $meta->add_group_field($video, array(
    'id'   => 'tecnicasSrt',
    'name' => 'Técnicas',
    'desc' => 'Descargar archivo .srt de YouTube y subirlo acá',
    'type' => 'file',
    'options' => array(
      'url' => false,
    ),
    'text' => array(
      'add_upload_file_text' => 'Agregar archivo .srt con técnicas'
    ),
    'query_args' => array(
      'type' => 'application/srt'
    )
  ));
  /*=====  End of Videos  ======*/

  /*=================================
  =            Galleries            =
  =================================*/
  $meta->add_field(array(
    'id' => $prefix . 'gallery_art',
    'name' => 'Imágenes del arte (Concept, stills, bocetos, etc.)',
    'desc' => 'Se pueden subir varias al tiempo. Se puede ordenar el orden arrastrando las imágenes.',
    'type' => 'file_list',
    'text' => array(
      'add_upload_files_text' => 'Agregar o subir imagen',
      'remove_image_text'     => 'Eliminar imagen',
      'file_text'             => 'Archivo:',
      'file_download_text'    => 'Descargar',
      'remove_text'           => 'Eliminar'
    )
  ));

  $meta->add_field(array(
    'id' => $prefix . 'gallery_extra',
    'name' => 'Imágenes adicionales (Archivo, documentos, etc.)',
    'desc' => 'Se pueden subir varias al tiempo. Se puede ordenar el orden arrastrando las imágenes.',
    'type' => 'file_list',
    'text' => array(
      'add_upload_files_text' => 'Agregar o subir imagen',
      'remove_image_text'     => 'Eliminar imagen',
      'file_text'             => 'Archivo:',
      'file_download_text'    => 'Descargar',
      'remove_text'           => 'Eliminar'
    )
  ));

  /*=====  End of Galleries  ======*/

  /*===============================
  =            Credits            =
  ===============================*/
  $credits = relatos_get_credits();

  foreach ($credits as $field) {
    $options = array(
      'id'   => $prefix . $field->slug,
      'name' => $field->name,
      'type' => $field->type
    );

    if ( !empty($field->options) ) {
      $options['options'] = array();

      foreach ($field->options as $key => $value) {
        $options['options'][$key] = $value;
      }
    }

    if ( !empty($field->extra) ) {
      foreach ($field->extra as $key => $value) {
        $options[$key] = $value;
      }
    }
    $meta->add_field($options);
  }
  /*=====  End of Credits  ======*/
}

add_action('cmb2_admin_init', 'relatos_register_mb');
