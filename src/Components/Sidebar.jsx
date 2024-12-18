import React from 'react';
import '../styel.css'; // Correct the path to your stylesheet
import Tabs from './Tabs';

export default function Sidebar({ isOpen, showtab,role}) {
  return (
    <div className={`sidebar${isOpen ? ' open' : ''}`}>
      <Tabs openTab={showtab} role={role} />
    </div>
  );
}
