import { Link } from "react-router-dom"
import UpcomingEvents from "../components/UpcomingEvents"
import AboutUs from "../components/AboutUs"
import ContactUs from "../components/ContactUs"

const Home = () => {
  return (
    <div className="home-container">
      <div className='homepage-upcoming-events'>
        <h2>Upcoming Events</h2>
          <UpcomingEvents />
      </div>
      <div className="create-home-div">
        <h2>Create your own show here</h2>
        <button className="home-page-btn"><Link to='/createshow' className='home-page-link'>Create Show</Link></button>
      </div>
      <AboutUs />
      <ContactUs />
    </div>
  )
}

export default Home