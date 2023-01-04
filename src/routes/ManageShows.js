import MyEvents from "../components/MyEvents"
import MyTickets from "../components/MyTickets"
import { Routes, Route } from 'react-router-dom'
import EventManage from "../components/EventManage"

const ManageShows = () => {
  return (
    <div className='home-container'>
      <h2>Manage Your Tickets</h2>
        <MyTickets />
        <div className="spacing-div"></div>
      <h2>Manage Your Shows</h2>
      <Routes>
            <Route index element={<MyEvents />} />
                <Route path="manageshows/:address" element={<EventManage />} />
            </Routes>
        <div className="spacing-div"></div>
    </div>
  )
}

export default ManageShows