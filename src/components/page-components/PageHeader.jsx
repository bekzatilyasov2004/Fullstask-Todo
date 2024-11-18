import { Box, Button, Text } from '@chakra-ui/react';
import { NavLink, useNavigate } from 'react-router-dom';

const PageHeader = ({ link, txt }) => {
    const navigate = useNavigate(); 

    return (
        <Box
            p={5}
            left={0}
            zIndex={9999}
            position={'fixed'}
            top={0}
            w={'100%'}
            display={'flex'}
            justifyContent={'space-between'}
            alignItems={'center'}
        >
            <Text 
                onClick={() => navigate('/')} 
                fontWeight={400}
                fontSize={{ base: '20px', md: '30px' }}
                cursor="pointer" 
            >
                🎯 Daily Tasks
            </Text>
            <Button
                as={NavLink}
                to={link}
                colorScheme={'teal'}
                background={'black'}
                borderRadius={'5px'}
                w={'150px'}
                h={'35px'}
            >
                {txt}
            </Button>
        </Box>
    );
};

export default PageHeader;
