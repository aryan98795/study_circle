import React from "react";
import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <div className="flex px-4 py-2 items-center justify-between tracking-tight">
      <div className="flex items-end ">
        <h1 className="font-bold text-2xl italic text-blue-600">Learnify</h1>
        <p className="text-sm text-blue-600">- A Collaborative Learning Platform.</p>
      </div>
      <div className="flex gap-4 font-semibold items-center ">
        <NavLink to='/'>Home</NavLink>
        <NavLink to='/features'>Features</NavLink>
        <NavLink>About Us</NavLink>
        <NavLink>Contact Us</NavLink>
        <NavLink className='bg-blue-600 rounded-full text-white px-4 py-2'>SignUp / Login</NavLink>

      </div>
    </div>
  );
}

export default Navbar;
