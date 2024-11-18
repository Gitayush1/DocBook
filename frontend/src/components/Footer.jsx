import React from 'react'
import { assets } from '../assets/assets_frontend/assets'

const Footer = () => {
  return (
    <div className='md:mx-10'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
        {/* {------LeftSection------} */}
        <div>
            <img className='mb-5 w-40' src={assets.docbook_logo_new} alt=''></img>
            <p className='w-full md:w-2/3 text-gray-600 leading-6'>DocBOOK is your one-stop solution for booking medical appointments with ease. Our platform connects you with top-rated doctors across various specialties, allowing you to schedule visits at your convenience.</p>
        </div>

        {/* {------CenterSection------} */}
        <div>
            <p className='text-xl font-medium mb-5'>COMPANY</p>
            <ul className='flex flex-col gap-2 text-gray-600'>
                <a href='/'>Home</a>
                <a href='/about'>About us</a>
                <a href='/contact'>Contact us</a>
                <a>Privacy Policy</a>
            </ul>
        </div>

        {/* {------RightSection------} */}
        <div>
            <p  className='text-xl font-medium mb-5 '>GET IN TOUCH</p>
            <ul  className='flex flex-col gap-2 text-gray-600'>
                <li>+9145687455</li>
                <li>docbook@gmail.com</li>
            </ul>
        </div>
      </div>
      {/* {---------Copyright Text-------} */}
      <div>
            <hr></hr>
            <p className='py-5 text-sm text-center'>Copyright © 2024 DocBook - All Right Reserved.</p>
        </div>
    
    </div>
  )
}

export default Footer
