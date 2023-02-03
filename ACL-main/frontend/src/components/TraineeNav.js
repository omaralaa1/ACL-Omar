import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import TabPanel from '@mui/lab/TabPanel';
import ViewCoursesForTrainee from '../pages/ViewCoursesForTrainee';
import Wallet from '../pages/Wallet';
import SearchCoursePage from '../pages/SearchCoursePage';
import { Typography } from '@mui/material';
const { useState, useEffect, } = require("react");

const TraineeNav = ()=>{
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("userId");

    const urlviewmycourses = `/getmycourses?userId=${userId}`;
    const urlallcourses = `/viewallcourses`;
    const urlWallet = `/getwallet?userId=${userId}`;
    const urlprofile = `/traineeprofile`;
    
   
    const [value, setValue] = useState(12);



  
    const handleChange = (event,newValue) => {
      console.log(newValue,"wdewde")
    
        setValue(newValue);

    } 
    return (
<div>        
        <Box sx={{ bgcolor: 'background.paper',width:100,marginLeft:-40,marginBottom:-40 }}>
        
            <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 0, borderColor: 'divider' }}
            >
                <Tab   label={<Typography sx={{fontFamily:"Sans-serif	",color:"Indigo",fontSize:14}} >Profile</Typography>}  href={urlprofile}  />
                 <Tab label={<Typography sx={{fontFamily:"Sans-serif	",color:"Indigo",fontSize:14}} >My Courses</Typography>} href={urlviewmycourses} />
                <Tab  label={<Typography sx={{fontFamily:"Sans-serif	",color:"Indigo",fontSize:14}} >My Wallet</Typography>} href={urlWallet} />
                <Tab   label={<Typography sx={{fontFamily:"Sans-serif	",color:"Indigo",fontSize:14}} >View All Courses</Typography>}  href={urlallcourses}  />
                <Tab   label={<Typography sx={{fontFamily:"Sans-serif	",color:"Indigo",fontSize:14}} >My Reports</Typography>}  href="/viewmyreports"  />
            </Tabs>


        </Box>

 </div>
 
    )


}

export default TraineeNav