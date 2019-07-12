<?php

class CreditsField {
  public function __construct($slug, $name, $type, $options = array(), $extra = array()) {
    $this->slug = $slug;
    $this->name = $name;
    $this->type = $type;
    $this->options = !empty($options) ? $options : NULL;
    $this->extra = !empty($extra) ? $extra : NULL;
  }
}

function relatos_get_credits() {
  $credits = array(
    new CreditsField('reserva-id', 'Reserva de Identidad', 'checkbox'),
    new CreditsField('nombre-entrevistado', 'Nombre del entrevistado', 'text'),
    new CreditsField('sexo', 'Sexo', 'select', array(
      'none'      => 'N/A',
      'femenino'  => 'Femenino',
      'masculino' => 'Masculino',
      'lgbtq'     => 'LGBTQ'
    ), array(
      'default' => 'none'
    )),
    new CreditsField('estado-civil', 'Estado Civil', 'select', array(
      'none'        => 'N/A',
      'soltero'     => 'Soltero(a)',
      'casado'      => 'Casado(a)',
      'separado'    => 'Separado(a)',
      'viudo'       => 'Viudo(a)',
      'union-libre' => 'Union Libre'
    ), array(
      'default' => 'none'
    )),
    new CreditsField('duracion', 'Duración', 'text_time', null, array(
      'time_format' => 'H:i:s',
      'attributes' => array(
        'data-timepicker' => json_encode(array(
          'stepMinute' => 1,
          'timeFormat' => 'HH:mm:ss'
        ))
      ),
    )
  ),
    new CreditsField('fecha-entrevista', 'Fecha Entrevista', 'text_date', null,
      array(
        'desc' => 'Día / Mes / Año',
        'date_format' => 'j/n/Y',
      )
    ),
    new CreditsField('fecha-prod', 'Fecha de Producción', 'text_date', null,
      array(
        'desc' => 'Día / Mes / Año',
        'date_format' => 'j/n/Y',
      )
    )
  );

  return $credits;
}
