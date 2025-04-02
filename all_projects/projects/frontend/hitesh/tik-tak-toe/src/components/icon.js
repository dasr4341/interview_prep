import React from 'react'
import { FaRegCircle, FaPen, FaTimes } from 'react-icons/fa';

function icon({ iconType }) {

    // eslint-disable-next-line default-case
    switch (iconType) {
        case 'circle':
            return <FaRegCircle className='icon' />;
        case 'cross':
            return <FaTimes className='icon' />;
        case 'pen':
            return <FaPen className='icon' />;
    }
}
export default icon;