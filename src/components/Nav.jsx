import { Link } from "react-router-dom";
// Removed unused imports
// import { RiLoginBoxLine, RiUser  } from "react-icons/ri";
// import { GoProjectRoadmap } from "react-icons/go";
// import { MdEventNote } from "react-icons/md";
// import { CgProfile } from "react-icons/cg";

const Nav = ({ user, handleLogOut }) => {
  const isAdmin = user && user.role === "admin";

  const adminOptions = (
    <nav className="nav">
      <ul className="nav-list">
        <li>
          <Link onClick={handleLogOut} to="/sign-in" className="nav-link">
            Sign Out
          </Link>
        </li>
        <li>
          <Link to="/main" className="nav-link">
            Languages List
          </Link>
        </li>
        <li>
          <Link to="/languages/createlanguage" className="nav-link">
            Add Language
          </Link>
        </li>
      </ul>
    </nav>
  );

  const userOptions = (
    <nav className="nav">
      <ul className="nav-list">
     <li>
          <Link to="/main" className="nav-link">
            Languages List
          </Link>
        </li>
        <li>
          <Link to="/translate" className="nav-link">
           Translate
          </Link>
        </li>
        
        <li>
          <Link onClick={handleLogOut} to="/sign-in" className="nav-link">
            Sign Out
          </Link>
        </li>
      </ul>
    </nav>
  );

  const publicOptions = (
    <nav className="nav">
      <ul className="nav-list">
         <li>
          <Link to="/" className="nav-link">
           Home
          </Link>
        </li>
        <li>
          <Link to="/register" className="nav-link">
            Register
          </Link>
        </li>
        <li>
          <Link to="/sign-in" className="nav-link">
            Sign In
          </Link>
        </li>
       
      </ul>
    </nav>
  );

  return (
    <header>
      <div className="nav-container">
        {isAdmin ? adminOptions : user ? userOptions : publicOptions}
      </div>
    </header>
  );
};

export default Nav;