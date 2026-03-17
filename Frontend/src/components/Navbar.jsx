import { Link } from "react-router-dom"

const Navbar = () => {
  return (
    <div className="flex justify-between items-center bg-black text-white p-3">

      <h1 className="text-lg font-bold">
        Task Manager
      </h1>

      <div className="flex gap-3">

        <Link to="/">
          <button className="bg-blue-600 px-3 py-1 rounded">
            Dashboard
          </button>
        </Link>

        <Link to="/calendar">
          <button className="bg-purple-600 px-3 py-1 rounded">
            Calendar
          </button>
        </Link>

      </div>

    </div>
  )
}

export default Navbar