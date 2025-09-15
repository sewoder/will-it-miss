import React from 'react';
import Hazard from './Hazard';
import Passing from './Passing';

export default function Orbital({
  name,
  is_potentially_hazardous_asteroid,
  close_approach_data,
  nasa_jpl_url,
}) {
  return (
    <div
      className={is_potentially_hazardous_asteroid ? 'is-hazard' : 'no-hazard'}
    >
      <h2>{name.replace(/[()]/g, '')}</h2>
      <p>
        潜在危险？ <Hazard yes={is_potentially_hazardous_asteroid} />
      </p>
      <Passing data={close_approach_data} />
      <p className="more">
        <a href={nasa_jpl_url} target="_blank">
          了解更多
        </a>
      </p>
    </div>
  );
}
