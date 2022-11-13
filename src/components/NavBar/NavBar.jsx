import React from 'react';

import "./NavBar.scss";

function NavBar(props) {
    const { scrolling } = props;

    console.log(scrolling);

    return (
        <>
            <div className={scrolling ? "navbar sticky" : "navbar"} id="navbar">
                <div className="brand">
                    <a href="#!">Logo</a>
                </div>
                <ul className="nav">
                    <li>
                        <a href="#!" className="active">
                            Home
                        </a>
                    </li>
                    <li>
                        <a href="#!">About</a>
                    </li>
                    <li>
                        <a href="#!">Projects</a>
                    </li>
                    <li>
                        <a href="#!">Contact</a>
                    </li>
                </ul>
            </div>
        </>
    );
}

export default NavBar;
