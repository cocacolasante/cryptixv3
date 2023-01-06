import MyEvents from "../components/MyEvents"
import { Routes, Route } from 'react-router-dom'
import EventManage from "../components/EventManage"

const ManageShows = () => {
  return (
    <div className='home-container'>
      <Routes>
            <Route index element={<MyEvents />} />
                <Route path="/:address" element={<EventManage />} />
            </Routes>
        <div className="spacing-div"></div>
    </div>
  )
}

export default ManageShows