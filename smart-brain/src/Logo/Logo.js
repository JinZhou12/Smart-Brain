import React from 'react';
import Tilt from 'react-parallax-tilt';
import brain from './brain.png';
import './Logo.css';

const Logo = () => {
    return (
      <div className='ma4 mt4'>
        <Tilt className='Tilt br2 shadow-2' style={{ width:'130px', height: '130px' }}>
          <div className='Tilt-inner'>
            <img style={{paddingTop: '1px'}} alt='logo' src={brain}/>
          </div>
        </Tilt>
      </div>
    );
}

export default Logo;