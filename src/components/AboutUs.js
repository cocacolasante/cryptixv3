import { Link } from "react-router-dom"

const AboutUs = () => {
  return (
    <div className='about-us-div'>
        <h2 className='contact-us-heading'>About Us</h2>
        <p>Our goal is to eliminate the problems with traditional Ticket companies and Scalpers</p>
        <p><strong>Our focus</strong></p>
        <ul className='about-us-list'>
            <li>Provide a lost cost, no code option for anyone to create a digital collectible for their event</li>
            <li>Over priced Resale of tickets</li>
            <li>Cut down on fees charged to the cusomters as well as the venues</li>
            <li>Provide collectable Digital tickets with resale value even after the event</li>
            <li>Eliminate fraudulent tickets and inject trust back into the secondary market</li>
        </ul>
        <p>Try out our ticket creation platform now for your event!</p>
        <p>Create Your Event Today!</p>
        <Link to='/createshow' className="event-btm">Create Show</Link>

    </div>
  )
}

export default AboutUs