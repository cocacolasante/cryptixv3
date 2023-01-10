import MyEvents from "../components/MyEvents"
import { Routes, Route } from 'react-router-dom'
import EventManage from "../components/EventManage"
import CheckInTickets from "../components/CheckInTickets"

const ManageShows = () => {
  return (
    <div className='home-container'>
          <Routes>
            <Route index element={<MyEvents />} />
                <Route path="/:address" element={<EventManage />} />
                <Route path="/checkin/:address" element={<CheckInTickets />} />
          </Routes>
        <div className="spacing-div"></div>
    </div>
  )
}

export default ManageShows