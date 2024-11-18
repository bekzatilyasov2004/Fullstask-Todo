import { Box } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';

const Main = () => {
    return (
        <Box flex="1" overflowY="auto">
            <Outlet /> 
        </Box>
    );
};

export default Main;
