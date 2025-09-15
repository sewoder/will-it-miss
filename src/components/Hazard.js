import React from 'react';
const YesNo = new Map([
  [true, '是 😱'],
  [false, '否 😊'],
]);

export default function Hazard({ yes }) {
  return <span className="hazard">{YesNo.get(yes)}</span>;
}
