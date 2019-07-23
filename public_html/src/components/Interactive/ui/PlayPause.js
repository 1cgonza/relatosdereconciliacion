import React from 'react';

export default function PlayPause(props) {
  if (!props.ready) {
    return null;
  }
  return (
    <div className={props.playing ? 'playPause playing' : 'playPause'}>
      <span className='ppIcon' />
    </div>
  );
}
