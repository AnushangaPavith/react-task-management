import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import Header from '../../components/Header';
import axios from 'axios';
import PeopleIcon from '@mui/icons-material/People';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import WorkIcon from '@mui/icons-material/Work';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { environment } from "../../environment";
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [staffCount, setStaffCount] = useState(0);
  const [clientCount, setClientCount] = useState(0);
  const [jobsCount, setJobsCount] = useState(0);
  const [totalount, setTotalCount] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const staffResponse = await axios.get(environment.apiUrl + "/staff/getAllStaffCount");
        setStaffCount(staffResponse.data.count);
                                              
        const clientResponse = await axios.get(environment.apiUrl + "/client/getAllClientCount");
        setClientCount(clientResponse.data.count);
        
        const jobResponse = await axios.get(environment.apiUrl + "/job/getCount");
        setJobsCount(jobResponse.data.count);

        const totalResponse = await axios.get(environment.apiUrl + "/job/getTotalAndProfit");
        console.log(totalResponse.data.data)
        setTotalCount(totalResponse.data.data);
       

      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    };


  
    fetchCounts();
  }, []);
  console.log(totalount)
   const totalPayment = totalount.totalOrgTotal
        const staffPayment = totalount.totalStaffPayTotal
        const profit = totalount.totalProfit
  const cardStyle = {
    minHeight: 160,
    width: '30%',
    color: 'white',
    padding: '10px',
    borderRadius: "10px",
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Header title="Admin Dashboard" subtitle="Managing your business" />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: '20px' }}>
        <Card sx={{ ...cardStyle, background: 'linear-gradient(90deg, #1CB5E0 0%, #000851 100%)',cursor:"pointer" }}>
          <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h3" component="div">
                Staff
              </Typography>
              <Typography variant="h3">
                {staffCount}
              </Typography>
            </Box>
            <PeopleIcon sx={{ fontSize: 60 }} />
          </CardContent>
        </Card>
        <Card sx={{ ...cardStyle, background: 'linear-gradient(90deg, #FF512F 0%, #DD2476 100%)' ,cursor:"pointer"}}>
          <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h3" component="div">
                Clients
              </Typography>
              <Typography variant="h3">
                {clientCount}
              </Typography>
            </Box>
            <GroupAddIcon sx={{ fontSize: 60 }} />
          </CardContent>
        </Card>
        <Card sx={{ ...cardStyle, background: 'linear-gradient(90deg, #2980b9 0%, #2c3e50 100%)', cursor:"pointer" }}>
          <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h3" component="div">
                Jobs
              </Typography>
              <Typography variant="h3">
                {jobsCount}
              </Typography>
            </Box>
            <WorkIcon sx={{ fontSize: 60 }} />
          </CardContent>
        </Card>
      </Box>
      <div style={{marginTop:"30px"}}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <Card sx={{ ...cardStyle, background: 'linear-gradient(90deg, #76b852 0%, #8DC26F 100%)',cursor:"pointer" }} onClick={() => navigate('/paymentsummery')}>
          <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h3" component="div">
                View Payments
              </Typography>
              <Typography variant="h3">
              {/* $ {totalPayment} */}
              </Typography>
              
            </Box>
            <AttachMoneyIcon  sx={{ fontSize: 60 }} />
          </CardContent>
        </Card>
        {/* <Card sx={{ ...cardStyle, background: 'linear-gradient(90deg, #f85032 0%, #e73827 100%)',cursor:"pointer" }}>
          <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h3" component="div">
                Staff Payments
              </Typography>
              <Typography variant="h3">
              $ {staffPayment}
              </Typography>
              
            </Box>
            <PersonAddIcon  sx={{ fontSize: 60 }} />
          </CardContent>
        </Card>
        <Card sx={{ ...cardStyle, background: 'linear-gradient(90deg, #00C9FF 0%, #92FE9D 100%)',cursor:"pointer" }}>
          <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h3" component="div">
               Profit
              </Typography>
              <Typography variant="h3">
              $ {profit}
              </Typography>
             
            </Box>
            <AssignmentIcon  sx={{ fontSize: 60 }} />
          </CardContent>
        </Card> */}
      </Box>
      </div>
    </Box>
  );
};

export default AdminDashboard;
