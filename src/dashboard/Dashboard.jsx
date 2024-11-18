import { Box } from '@chakra-ui/react';
import Header from '../components/dashboard-components/Header';
import Sidebar from '../components/dashboard-components/Sidebar';
import Main from '../components/dashboard-components/Main'

const Dashboard = () => {

  return (
    <Box>
      <Header />
      <Box display={'flex'} justifyContent={'space-between'} alignItems={'start'}>
        <Sidebar />
        <Main  />
      </Box>
    </Box>
  );
};

export default Dashboard;
