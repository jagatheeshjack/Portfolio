import React from 'react';

export default function Tabs({ role, openTab }) {
  return (
    <div>
      {role === 'Admin' && (
        <>
          <div className='tablinks' onClick={() => openTab(1)}>Users </div>
          <div className='tablinks' onClick={() => openTab(2)}>Tab 2</div>
          <div className='tablinks' onClick={() => openTab(3)}>Tab 3</div>
          <div className='tablinks' onClick={() => openTab(4)}>Tab 4</div>
        </>
      )}
      {role === 'User' && (
        <>
          <div className='tablinks' onClick={() => openTab(1)}>About</div>
          <div className='tablinks' onClick={() => openTab(2)}>Portfolio</div>
          <div className='tablinks' onClick={() => openTab(3)}>Resume</div>
          <div className='tablinks' onClick={() => openTab(4)}>Testimonials</div>
          <div className='tablinks' onClick={() => openTab(5)}>Contact</div>
        </>
      )}
      {role === 'Viewer' && (
        <>
          <div className='tablinks' onClick={() => openTab(1)}>Tab 1</div>
          <div className='tablinks' onClick={() => openTab(2)}>Tab 2</div>
          <div className='tablinks' onClick={() => openTab(3)}>Tab 3</div>
          <div className='tablinks' onClick={() => openTab(4)}>Tab 4</div>
        </>
      )}
      {!role && <div>None</div>}
    </div>
  );
}
