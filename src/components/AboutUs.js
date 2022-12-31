import { Link } from "react-router-dom"

const AboutUs = () => {
  return (
    <div className='about-us-div'>
        <h2 className='contact-us-heading'>About Us</h2>
        <p>Our goal is to eliminate the problems with traditional Ticket exchanges</p>
        <p><strong>Our focus</strong></p>
        <ul className='about-us-list'>
            <li>Over priced Resale of tickets</li>
            <li>Cut down on fees charged to the cusomters as well as the venues</li>
            <li>Provide collectable Digital tickets with resale value even after the event</li>
            <li>Eliminate fraudulent tickets and inject trust back into the secondary market</li>
        </ul>
        <p>Try out our ticket creation platform now for your event!</p>
        <p>Create Your Event Today!</p>
        <button className="home-page-btn"><Link to='/createshow' className='home-page-link'>Create Show</Link></button>

    </div>
  )
}

export default AboutUs