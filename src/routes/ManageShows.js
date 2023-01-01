import MyEvents from "../components/MyEvents"
import MyTickets from "../components/MyTickets"


const ManageShows = () => {
  return (
    <div className='home-container'>
      <h2>Manage Your Tickets</h2>
        <MyTickets />
      <h2>Manage Your Shows</h2>
        <MyEvents />
    </div>
  )
}

export default ManageShows