import React from 'react'
import "../constants/styles/Home.css"
import { LogoMark } from '../constants/styles/icons'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

interface Props {
    home: boolean
}

export const Header = ({ home }: Props) => {
    const navigate = useNavigate()
    const { auth, isAuthenticated } = useAuth()

    return (
    <nav className="navbar">
        <Link className='link' to="/">
        <div className="logo"> <LogoMark /> Ameer AI</div>
        </Link>
        {home && (
            <div>
        <div className="nav-links">
          <span>Explore</span>
          <span onClick={() => navigate("/ameer")}>Ask Ameer</span>
          <span onClick={() => navigate("/best-route/results")}>Budget</span>
          <span>About</span>
        </div>
        
      </div>
      )}
      {isAuthenticated ? (
          <div className="profile-container">
  {auth?.profilePic ? (
    <img
      src={auth.profilePic}
      alt="Profile"
      className="profile-pic"
    />
  ) : (
    <div className="profile-initial">
      {auth?.username?.charAt(0).toUpperCase()}
    </div>
  )}

  <span className="profile-name">{auth?.username}</span>
</div>
        ) : (
          <button onClick={() => navigate("/login")} className="nav-btn">Sign in</button>
        )}
        </nav>
  )
}
