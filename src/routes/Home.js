import { Link } from "react-router-dom"
import UpcomingEvents from "../components/UpcomingEvents"
import AboutUs from "../components/AboutUs"
import ContactUs from "../components/ContactUs"
import CreateButtonDiv from "../components/CreateButtonDiv"

const Home = () => {
  return (
    <div className="home-container">
      <div className='homepage-upcoming-events'>
        <h2>Upcoming Events</h2>
          <UpcomingEvents />
      </div>
      <CreateButtonDiv />
      <AboutUs />
      <ContactUs />
    </div>
  )
}

export default Home