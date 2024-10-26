import React from 'react'
import "./stylesheets/categories.css"

function new_category() {
    // const handlecategory= () => {

    // }
  return (
    <div class="dropdown">
    <button class="dropbtn">All Categories</button>
    <div class="dropdown-content">
      <a href="/">Mens</a>
      <ol>
        <li>Shirts</li>
        <li>T-Shirts</li>
        <li>Pants</li>
        <li>Trousers</li>
        <li>waistcoat</li>
        <li>Shoes</li>
      </ol>
      <a href="/">Womens</a>
      <a href="/">Childs</a>
    </div>
  </div> 
  );
}

export default new_category;