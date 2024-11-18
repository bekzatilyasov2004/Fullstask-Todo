import { Box, Flex, Avatar, Text } from '@chakra-ui/react';
import useUserStore from '../../stores/useGetUser';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const { name, email } = useUserStore();
    const nav = useNavigate()

    return (
        <Flex
            p={4}
            justifyContent={'space-between'}
            alignItems={'center'}
            borderBottom={'1px solid blue'}
        >
            <Box cursor={'pointer'} onClick={()=>nav('/')}>
                <Text fontWeight={400} fontSize={{ base: '20px', md: '30px' }}>🎯 Daily Tasks</Text>
            </Box>
            <Flex alignItems={'center'}>
                <Avatar size={{base: 'sm', md: 'md'}}  mr={4} name={name} />
            </Flex>
        </Flex>
    );
};

export default Header;
