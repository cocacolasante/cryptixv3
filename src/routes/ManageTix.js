import MyTickets from "../components/MyTickets"
import { Routes, Route } from 'react-router-dom'

const ManageTix = () => {
  return (
    <div className='home-container'>
    <h2>Manage Your Tickets</h2>
      <MyTickets />
      <div className="spacing-div"></div>   
  </div>
  )
}

export default ManageTix