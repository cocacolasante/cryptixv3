import ViewShows from "../components/ViewShows"
import CreateButtonDiv from "../components/CreateButtonDiv"
import { Routes, Route } from 'react-router-dom'
import ShowManage from "../components/ShowManage"


const Browse = () => {
  return (
    <div className="create-show-div create-container">
      <h1>Browse</h1>
      <Routes>
            <Route index element={<ViewShows />} />
                <Route path="/:address" element={<ShowManage />} />
          </Routes>
      <div className="spacing-div"></div>
      <CreateButtonDiv />
      <div className="spacing-div"></div>

    </div>
  )
}

export default Browse