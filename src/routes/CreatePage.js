import CreateShow from "../components/CreateShow"
import Instructions from "../components/Instructions"


const CreatePage = () => {
  return (
    <div className="create-container">
        <CreateShow />
        <div className="smaller-spacing-div"></div>
        <Instructions />
        <div className="spacing-div"></div>
    </div>
  )
}

export default CreatePage