import { useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import NavBar from "./nav/NavBar";
import NavDropdown from "./nav/NavDropdown";
import NavItem from "./nav/NavItem";
import { useRouter } from "next/router";  // Import useRouter

const PopulatedNavBar = () => {
  const [articlesDropdownOpen, setArticlesDropdownOpen] = useState(false);
  const [moderatorDropdownOpen, setModeratorDropdownOpen] = useState(false);

  const router = useRouter();  // Get current route

  const toggleArticlesDropdown = () => {
    setArticlesDropdownOpen(prev => !prev);
    setModeratorDropdownOpen(false); // Close the other dropdown if opened
  };


  const toggleModeratorDropdown = () => {
    setModeratorDropdownOpen(prev => !prev);
    setArticlesDropdownOpen(false); // Close the other dropdown if opened
  };

  const handleLogout = () => {
    // Perform logout logic here (e.g., clearing session or token)
    console.log("User logged out");
    router.push('/');  // Redirect to the home page after logout
  };

  return (
    <NavBar>
      <NavItem>SPEED</NavItem>
      <NavItem route="/" end>
        Home
      </NavItem>

      {/* Show "Login" on all pages except the moderator page, show "Logout" on moderator */}
      {router.pathname.startsWith("/moderator") ? (
        <NavItem onClick={handleLogout}>
          Logout
        </NavItem>
      ) : (
        <NavItem route="/Login/page">
          Login
        </NavItem>
      )}
      
      <NavItem dropdown route="/articles" onClick={toggleArticlesDropdown} aria-haspopup="true" aria-expanded={articlesDropdownOpen}>
        Articles <IoMdArrowDropdown />
        {articlesDropdownOpen && (
          <NavDropdown>
            <NavItem route="/articles">View articles</NavItem>
            <NavItem route="/articles/new">Submit new</NavItem>
          </NavDropdown>
        )}
      </NavItem>
      {router.pathname.startsWith("/moderator") && (
        <NavItem dropdown onClick={toggleModeratorDropdown} aria-haspopup="true" aria-expanded={moderatorDropdownOpen}>
          Moderator <IoMdArrowDropdown />
          {moderatorDropdownOpen && (
            <NavDropdown>
              <NavItem route="/moderator">Pending Articles</NavItem>
              <NavItem route="/moderator/rejected">Rejected Articles</NavItem>
            </NavDropdown>
          )}
        </NavItem>
      )}
    </NavBar>
  );
};

export default PopulatedNavBar;
