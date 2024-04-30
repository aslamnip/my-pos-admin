import React from 'react';
import './Loading.css'

function Loading() {
    return (
        <div>
            <div className='loadingWhite'>

                <span>Loading...</span>
                <div className='ring'> </div>
            </div>

        </div>
    );
}

export default Loading;