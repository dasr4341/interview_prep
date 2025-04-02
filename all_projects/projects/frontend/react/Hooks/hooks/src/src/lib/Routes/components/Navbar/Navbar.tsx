import React from 'react';
import './Navbar.scoped.scss'; 

export default function Navbar({ header }: {header: string}) {
    return (
        <section className='header-section'>
            <div className='header'>{header}</div>
        </section>
    );
}
