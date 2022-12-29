import CreateShow from "../components/CreateShow"
import UpcomingEvents from "../components/UpcomingEvents"

const Home = () => {
  return (
    <div className="home-container">
      <div className='home-container'>
        <h2>Upcoming Events</h2>
        <div>
          <UpcomingEvents />
        </div>
      </div>
      <div>
        <h2>Create your own show here</h2>
        <CreateShow />
      </div>
    </div>
  )
}

export default Home