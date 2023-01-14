import { Link } from "react-router-dom"
import UpcomingEvents from "../components/UpcomingEvents"
import AboutUs from "../components/AboutUs"
import ContactUs from "../components/ContactUs"
import CreateButtonDiv from "../components/CreateButtonDiv"
import Landing from "../components/Landing"

const Home = () => {
  return (
    <div className="home-container">
      <Landing />
      <div className='homepage-upcoming-events'>
        <h2>Upcoming Events</h2>
          <UpcomingEvents />
      </div>
      <div className="spacing-div"></div>
      <CreateButtonDiv />
      <div className="spacing-div"></div>
      <AboutUs />
      <div className="spacing-div"></div>
      <ContactUs />
      <div className="spacing-div"></div>
    </div>
  )
}

export default Home