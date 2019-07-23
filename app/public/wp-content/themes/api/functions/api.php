<?php

use Benlipp\SrtParser\Parser;

function exposeProjectsMeta() {
  register_rest_route( 'relatos/v1', '/get-taxonomies/', array(
    'methods' => 'GET',
    'callback' => 'relatosGetTaxonomies'
  ));

  register_rest_route('relatos/v1', '/get-all-projects/', array(
    'methods' => 'GET',
    'callback' => 'relatosGetAllProjects'
  ));

  register_rest_field('proyecto', 'rrMeta', array(
    'get_callback' => 'getProjectMeta',
    'schema'       => null,
  ));
}
add_action('rest_api_init', 'exposeProjectsMeta');

function getProjectMeta($object) {
  $prefix        = '_rr_';
  $postID        = $object['id'];
  $ret           = array();
  $relatosFields = array(
    'reservaID'   => 'reserva-id',
    'videos'      => 'video',
    'galeriaArte' => 'gallery_art'
  );

  foreach ($relatosFields as $key => $value) {
    if ($key == 'galeriaArte') {
      $gal = get_post_meta($postID, $prefix . $value, true);

      if (!empty($gal)) {
        $res = array();

        foreach ($gal as $imgID => $full) {
          $med = wp_get_attachment_image_src($imgID, 'medium');
          $lar = wp_get_attachment_image_src($imgID, 'large');
          $larMeta = wp_get_attachment_metadata($imgID);
          $w = $larMeta['sizes']['large']['width'] ? $larMeta['sizes']['large']['width'] : $larMeta['width'];
          $h = $larMeta['sizes']['large']['height'] ? $larMeta['sizes']['large']['height'] : $larMeta['height'];
          $res[$imgID] = array(
            'medium' => $med[0],
            'large' => $lar[0],
            'w' => $w, 
            'h' => $h
          );
        }

        $ret[$key] = $res;
      }
    } else {
      $ret[$key] = get_post_meta($postID, $prefix . $value, true);
    }
  }

  return $ret;
}

function relatosGetAllProjects() {
  $prefix = '_rr_';
  $ret = array();
  $query = new WP_Query(array(
    'posts_per_page' => -1,
    'post_type' => 'proyecto'
  ));

  while($query->have_posts()) : $query->the_post();
    $meta = getProjectMeta(array('id' => $query->post->ID));
    $video = !empty($meta['videos']) ? $meta['videos'][0] : null;

    $data = array(
      'id' => $query->post->ID,
      'title' => $query->post->post_title,
      'slug' => $query->post->post_name,
      'violencia' => wp_get_post_terms($query->post->ID, 'violencia', array('fields' => 'ids')),
      'tecnicas' => wp_get_post_terms($query->post->ID, 'tecnicas', array('fields' => 'ids'))
    );

    $techniquesSrt = null;
    $themesSrt = null;
    $parser = new Parser();

    if (!empty($video['tecnicasSrt'])) {
      $parser->loadFile($video['tecnicasSrt']);
      $techniquesSrt = $parser->parse();
    }

    if(!empty( $video['temasSrt'])) {
      $parser->loadFile($video['temasSrt']);
      $themesSrt = $parser->parse();;
    }

    if (!empty($video)) {
      $data['gallery'] = !empty( $meta['galeriaArte'] ) ? $meta['galeriaArte'] : null;
      $data['oembed'] = !empty( $video['oembed_url'] ) ? $video['oembed_url'] : null;
      $data['themesSrt'] = $themesSrt;
      $data['techniquesSrt'] = $techniquesSrt;
      $data['quote'] = !empty( $video['cita'] ) ? $video['cita'] : null;
      $data['synopsis'] = !empty( $video['sinopsis'] ) ? wpautop($video['sinopsis']) : null;
      $data['transcript'] = !empty( $video['transcripcion'] ) ? wpautop($video['transcripcion']) : null;
      $data['references'] = !empty( $video['referencias'] ) ? wpautop($video['referencias']) : null;
      $data['featured'] = get_the_post_thumbnail_url($query->post->ID, 'large');
    }

    $ret[] = $data;

  endwhile;
  wp_reset_postdata();

  return $ret;
}

function relatosGetTaxonomies($data) {
  $violencia = get_terms( 'violencia', array(
    'hide_empty' => true
  ));
  $tecnicas = get_terms('tecnicas', array(
    'hide_empty' => true
  ));

  $ret = array('violencia' => array(), 'tecnicas' => array());

  foreach ($violencia as $v) {
    $ret['violencia'][] = array(
      'id' => $v->term_id,
      'name' => $v->name,
      'slug' => $v->slug
    );
  }

  foreach ($tecnicas as $t) {
    $ret['tecnicas'][] = array(
      'id' => $t->term_id,
      'name' => $t->name,
      'slug' => $t->slug
    );
  }

  return $ret;
}
