import { Link } from "react-router-dom"

const Navbar = () => {
  return (
    <div className="flex justify-between items-center px-8 py-4 bg-[#020617] border-b border-[#06B6D4]/20 backdrop-blur-md">

  <h1 className="text-xl font-semibold text-[#06B6D4] tracking-wide">
    Task Manager
  </h1>

  <div className="flex gap-4">

    <Link to="/">
      <button className="px-4 py-1.5 rounded-lg bg-[#06B6D4] text-black font-medium hover:bg-[#22D3EE] hover:shadow-[0_0_12px_#22D3EE] transition">
        Dashboard
      </button>
    </Link>

    <Link to="/calendar">
      <button className="px-4 py-1.5 rounded-lg bg-[#0EA5E9] text-black font-medium hover:bg-[#22D3EE] hover:shadow-[0_0_12px_#22D3EE] transition">
        Calendar
      </button>
    </Link>

  </div>
</div>
  )
}

export default Navbar