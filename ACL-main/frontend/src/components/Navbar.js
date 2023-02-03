import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { Container } from "@mui/system";
const Navbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const handleClick = async() => {
    logout()
    window.location.reload();
    navigate("/login")
    window.location.reload();

  }
  const handleViewCourses = async()=>{

    navigate("/viewallcourses");
  }
  const handleLogin = async()=>{

    navigate("/login");
  }
  const handleSign = async()=>{

    navigate("/signup");
  }
  const handleMost = async()=>{
    navigate("/mostpop")
  }

  return (
    <header style={{backgroundColor:"#75C7CB"}}>
      <div >

        <nav>
        {user &&(<Container style={{display:"flex",flexDirection:"row"}} alignItems="center" justifyContent="center" >
            <Button variant="contained" style={{backgroundColor: "#F6BB11",marginLeft:-100,height:40,minWidth:150,marginTop:25}} onClick={handleMost}>Most Popular Courses </Button>
            <Container style={{marginRight:300,marginLeft:400}}>             <Link to="/">
          <h1 style={{fontSize:30}}>Omarine Learning</h1>
        </Link></Container>

            <Button variant="contained" style={{backgroundColor: "#AE0000",height:40,minWidth:150,marginTop:25,marginRight:-200}} onClick={handleClick}>Log out </Button>
            
            
          </Container>
          )}
  
          {!user && (
          <Container style={{display:"flex",flexDirection:"row",marginTop:0}} alignItems="center" justifyContent="center" >
            <Button variant="contained" onClick={handleLogin} style={{height:40,minWidth:150,marginTop:50,marginLeft:-300,marginRight:10}}>LogIn </Button>
            <Button variant="contained" onClick={handleSign} style={{backgroundColor: "#126A34", height:40,minWidth:150,marginTop:50}}>Sign Up </Button>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Container style={{marginRight:300,marginLeft:300}} > 
           <Link to="/">
          <h1 style={{fontSize:30}}>Online Learning</h1>
        </Link></Container>
            
            <Button variant="contained" onClick={handleViewCourses} style={{backgroundColor: "#F6BB11",height:40,minWidth:150,marginTop:50,}}>Most Popular Courses </Button>
            
            
          </Container>
          )}

          
        </nav>
      </div>
    </header>
  );
}
export default Navbar;
