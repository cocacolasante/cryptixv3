import ViewShows from "../components/ViewShows"
import CreateButtonDiv from "../components/CreateButtonDiv"

const Browse = () => {
  return (
    <div className="create-show-div create-container">
      <h1>Browse</h1>
      <ViewShows />
      <div className="spacing-div"></div>
      <CreateButtonDiv />
      <div className="spacing-div"></div>

    </div>
  )
}

export default Browse