import { Box, Avatar, Flex, Text, IconButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Input, HStack } from '@chakra-ui/react';
import { NavLink, useNavigate } from 'react-router-dom';
import { IoTodaySharp } from "react-icons/io5";
import { FaCalendarWeek } from "react-icons/fa6";
import { BsCalendarMonthFill, BsStarFill } from "react-icons/bs";
import { IoLogInOutline } from 'react-icons/io5';
import { useEffect, useState } from 'react';
import useUserStore from '../../stores/useGetUser';
import { IoIosAddCircle } from "react-icons/io";

const Sidebar = () => {
  const { name, email, getUserFromLocalStorage, clearUser } = useUserStore();
  const [isModalOpen, setModalOpen] = useState(false);
  const [specialDay, setSpecialDay] = useState('');
  const [taskDate, setTaskDate] = useState('');
  const [specialDays, setSpecialDays] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    getUserFromLocalStorage();

    const storedSpecialDays = JSON.parse(localStorage.getItem('specialDays')) || [];
    setSpecialDays(storedSpecialDays);
  }, [getUserFromLocalStorage]);

  const handleLogout = () => {
    clearUser();
    localStorage.removeItem('user');
    nav('/');
  };

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const handleAddSpecialDay = () => {
    if (specialDay && taskDate) {
      const newDay = { name: specialDay, date: taskDate };
      const updatedDays = [...specialDays, newDay];
      setSpecialDays(updatedDays);

      localStorage.setItem('specialDays', JSON.stringify(updatedDays));

      closeModal();
      nav(`/dashboard/special/${specialDay.toLowerCase().replace(/\s+/g, '-')}`);
    }
  };

  return (
    <Box
      w={{ base: '50px', md: '230px' }}
      display={'flex'}
      justifyContent={'start'}
      alignItems={'start'}
      flexDir={'column'}
      pos={'sticky'}
      top={0}
      borderRight={'1px solid blue'}
      h={'100vh'}
    >
      <Box
        flexDir={'column'}
        w={'100%'}
        display={'flex'}
        justifyContent={'start'}
        gap={2}
        alignItems={'center'}
      >
        <Box p={2} w={'100%'} display={'flex'} gap={5}>
          <Avatar size={{ base: 'sm', md: 'md' }} name={name} />
          <Flex display={{ base: 'none', md: 'flex' }} flexDir={'column'}>
            <Text fontSize={'18px'} fontWeight={300}>
              {name || 'Guest'}
            </Text>
            <Text fontSize={'10px'} fontWeight={275}>
              {email || 'No Email'}
            </Text>
          </Flex>
        </Box>

        <Flex w={'100%'} borderTop={'1px solid blue'} flexDir={'column'}>
          <NavLink
            to="today"
            style={({ isActive }) => ({
              backgroundColor: isActive ? 'blue' : 'transparent',
              color: isActive ? 'white' : 'inherit',
              textDecoration: 'none',
              padding: '8px',
              borderRadius: '4px',
              marginBottom: '4px',
            })}
          >
            <Flex alignItems={'center'} justifyContent={'center'} gap={'3'}>
              <IoTodaySharp size={'25px'} />
              <Box w={'100%'} display={{ base: 'none', md: 'flex' }} alignItems={'center'} p={1}>
                Today's Challenges
              </Box>
            </Flex>
          </NavLink>

          <NavLink
            to="weekly"
            style={({ isActive }) => ({
              backgroundColor: isActive ? 'blue' : 'transparent',
              color: isActive ? 'white' : 'inherit',
              textDecoration: 'none',
              padding: '8px',
              borderRadius: '4px',
              marginBottom: '4px',
            })}
          >
            <Flex alignItems={'center'} justifyContent={'center'} gap={'3'}>
              <FaCalendarWeek size={'25px'} />
              <Box w={'100%'} display={{ base: 'none', md: 'flex' }} alignItems={'center'} p={1}>
                Weekly Tasks
              </Box>
            </Flex>
          </NavLink>

          <NavLink
            to="monthly"
            style={({ isActive }) => ({
              backgroundColor: isActive ? 'blue' : 'transparent',
              color: isActive ? 'white' : 'inherit',
              textDecoration: 'none',
              padding: '8px',
              borderRadius: '4px',
              marginBottom: '4px',
            })}
          >
            <Flex alignItems={'center'} justifyContent={'center'} gap={'3'}>
              <BsCalendarMonthFill size={'25px'} />
              <Box w={'100%'} display={{ base: 'none', md: 'flex' }} alignItems={'center'} p={1}>
                Monthly Tasks
              </Box>
            </Flex>
          </NavLink>

          {specialDays.map((day) => (
            <NavLink
              key={day.name}
              to={`/dashboard/special/${day.name.toLowerCase().replace(/\s+/g, '-')}`}
              style={({ isActive }) => ({
                backgroundColor: isActive ? 'blue' : 'transparent',
                color: isActive ? 'white' : 'inherit',
                textDecoration: 'none',
                padding: '8px',
                borderRadius: '4px',
                marginBottom: '4px',
              })}
            >
              <Flex alignItems={'center'} justifyContent={'center'} gap={'3'}>
                <BsStarFill size={'25px'} />
                <Box w={'100%'} display={{ base: 'none', md: 'flex' }} alignItems={'center'} p={1}>
                  {day.name}
                </Box>
              </Flex>
            </NavLink>
          ))}
        </Flex>

        <Flex onClick={openModal} cursor={'pointer'} alignItems={'center'} justifyContent={'center'} gap={'3'}>
          <IoIosAddCircle size={'30px'} />
          <Box w={'100%'} display={{ base: 'none', md: 'flex' }} alignItems={'center'} p={1}>
            <Text>Add Special Day</Text>
          </Box>
        </Flex>

        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add Special Day</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Input
                placeholder="Special Day Name"
                value={specialDay}
                onChange={(e) => setSpecialDay(e.target.value)}
                mb={4}
              />
              <Input
                type="date"
                value={taskDate}
                onChange={(e) => setTaskDate(e.target.value)}
              />
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" onClick={handleAddSpecialDay}>
                Save
              </Button>
              <Button ml={3} onClick={closeModal}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>

      <Box
  pos={'absolute'}
  bottom={0}
  w={'100%'}
  display={'flex'}
  justifyContent={'center'}
  alignItems={'center'}
  py={4}
>
  <HStack>
    <IconButton
      icon={<IoLogInOutline />}
      aria-label={name ? 'Logout' : 'Login'}
      onClick={name ? handleLogout : () => nav('/login')}
      size="lg"
      variant="ghost"
    />
    
    <Text
      display={{ base: 'none', md: 'block' }}  
      fontSize="lg"
      cursor={'pointer'}
      fontWeight="semibold"
      onClick={name ? handleLogout : () => nav('/login')}
    >
      Logout
    </Text>
  </HStack>
</Box>

    </Box>
  );
};

export default Sidebar;
