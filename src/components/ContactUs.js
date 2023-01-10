import React from 'react'
import { TwitterIcon, FacebookIcon, LinkedinIcon } from 'react-share';


const ContactUs = () => {
  return (
    <div className='contact-us-div'>
        <h2>Contact Us</h2>
        <button className='buy-button email-btn' href="mailto:colasantecoding@gmail.com">Send An Email</button>
        <br />
        <div className='social-links'>
            <a href='https://twitter.com/cocacolasante' ><TwitterIcon /></a>
            <a href='/' ><FacebookIcon /></a>

        </div>

    </div>
  )
}

export default ContactUs