import TaskForm from "../components/TaskForm"
import TaskList from "../components/TaskList"
import TopTasks from "../components/TopTasks"

const Dashboard = () => {

  return (

    <div className="p-6 max-w-3xl mx-auto">

      <TaskForm />

      <TopTasks />

      <TaskList />

    </div>
  )
}

export default Dashboard