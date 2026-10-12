import React from 'react'
import { IoIosSearch } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { MdFavoriteBorder } from "react-icons/md";
import { LuShoppingCart } from "react-icons/lu";




const Navbar = () => {
  return (
    <div>
      <nav class="navbar">
        <div class="logo">Govd.</div>
        <div className="links">
            <li>Home</li>
            <li>Shop</li>
            <li>Featured</li>
            <li>Gallery</li>
            <li>Blogs</li>
        </div>
        <div className="icons">
            <span><IoIosSearch /></span>
            <span><CgProfile /></span>
            <span><MdFavoriteBorder /></span>
            <span><LuShoppingCart /></span>

        </div>
      </nav>
    </div>
  )
}

export default Navbar
