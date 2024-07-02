import React from 'react'
import { FaProductHunt } from "react-icons/fa";
import {Link} from "react-router-dom";


const Home = () => {
  return (
    <div className='home'>
        <nav className='container --flex-between'>
            <div className='logo'>
                <FaProductHunt size={35}/>
            </div>
            <ul className='home-links'>
                <li>
                    <Link to="/register">Register</Link>
                </li>
                <li>
                    <Link to="/login">Login</Link>
                </li>
            </ul>
        </nav>
    </div>
  )
}

export default Home