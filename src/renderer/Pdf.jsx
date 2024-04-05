import React from 'react'
import ReactDOM from 'react-dom/client';
import '../assets/css/index.css';

const Pdf = () => {
  return (
    <div>
      <div className='flex'>
        <button type="button">Print</button>
      </div>
      <div className='flex'>
        <div className='uppercase'>PT. Sumber Rezeki Palletindo</div>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <Pdf />
)