import { Box, VStack, HStack, Button, Text, Input, Flex, IconButton, Checkbox, useToast } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons';
import { format, addDays, startOfMonth, endOfMonth, isSameDay } from 'date-fns';
import axios from 'axios';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { MdDelete } from "react-icons/md";

const getAccessToken = () => {
  const user = JSON.parse(localStorage.getItem('user')); 
  return user ? user.token : null;
};

const MonthlyTasks = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [newTask, setNewTask] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [tasks, setTasks] = useState([]); 
  const toast = useToast(); 

  useEffect(() => {
    const startDay = startOfMonth(currentDate);
    const endDay = endOfMonth(currentDate);
    const daysArray = [];
    for (let day = startDay; day <= endDay; day = addDays(day, 1)) {
      daysArray.push(day);
    }
    setDaysInMonth(daysArray);

    const todayIndex = daysArray.findIndex((day) => isSameDay(day, new Date()));
    const centerIndex = Math.max(0, todayIndex - Math.floor(5 / 2));
    setVisibleIndex(centerIndex);
  }, [currentDate]);

  const fetchTasks = async () => {
    try {
      const accessToken = getAccessToken();
      if (accessToken) {
        const res = await axios.get('https://api.mirmakhmudoff.uz/api/todos/', {
          headers: {
            Authorization: `Bearer ${accessToken}`, 
          },
        });
        setTasks(res.data); 
      } else {
        console.error('Access token not found');
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handlePrev = () => {
    setVisibleIndex((prev) => (prev - 1 >= 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setVisibleIndex((prev) => (prev + 5 < daysInMonth.length ? prev + 1 : prev));
  };

  const handleSelectDate = (day) => {
    setSelectedDate(day);
    setNewTask(''); 
    setTaskDescription(''); 
  };

  const handleAddTask = async () => {
    if (newTask.trim() === '' || taskDescription.trim() === '') return;

    try {
      const accessToken = getAccessToken();
      if (accessToken) {
        const formattedDate = format(selectedDate, 'yyyy-MM-dd');
        await axios.post(
          'https://api.mirmakhmudoff.uz/api/todos/', 
          {
            title: newTask,
            description: taskDescription,
            status: 'in-progress', 
            due_date: formattedDate, 
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`, 
            },
          }
        );
        setNewTask(''); 
        setTaskDescription(''); 
        toast({
          title: 'Task added.',
          description: 'Your task has been added successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        fetchTasks();
      } else {
        console.error('Access token not found');
      }
    } catch (error) {
      console.error('Error adding task:', error);
      toast({
        title: 'Error adding task.',
        description: 'There was an error adding your task. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const accessToken = getAccessToken();
      if (accessToken) {
        await axios.delete(`https://api.mirmakhmudoff.uz/api/todos/${taskId}/delete/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        toast({
          title: 'Task deleted.',
          description: 'Your task has been deleted successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        fetchTasks(); 
      } else {
        console.error('Access token not found');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: 'Error deleting task.',
        description: 'There was an error deleting your task. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const selectedDayTasks = tasks.filter(task => {
    const taskDate = new Date(task.due_date);
    return isSameDay(taskDate, selectedDate);
  });

  const inProgressTasks = selectedDayTasks.filter(task => task.status === 'in-progress');
  const doneTasks = selectedDayTasks.filter(task => task.status === 'done');

  const handleMarkAsCompleted = async (taskId) => {
    try {
      const accessToken = getAccessToken();
      if (accessToken) {
        await axios.patch(
          `https://api.mirmakhmudoff.uz/api/todos/${taskId}/status/`,
          { status: 'done' },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        toast({
          title: 'Task marked as completed.',
          description: 'Your task has been marked as completed.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        fetchTasks(); 
      } else {
        console.error('Access token not found');
      }
    } catch (error) {
      console.error('Error updating task status:', error.response ? error.response.data : error);
      toast({
        title: 'Error updating task status.',
        description: 'There was an error updating the task status. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleReActivateTask = async (taskId) => {
    try {
      const accessToken = getAccessToken();
      if (accessToken) {
        await axios.patch(
          `https://api.mirmakhmudoff.uz/api/todos/${taskId}/status/`,
          { status: 'in-progress' },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        toast({
          title: 'Task reactivated.',
          description: 'Your task has been marked as in-progress again.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        fetchTasks();
      }
    } catch (error) {
      console.error('Error reactivating task:', error);
      toast({
        title: 'Error reactivating task.',
        description: 'There was an error reactivating your task. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };


  return (
    <Box >
      <HStack className='scroll-container' overflowX="auto"  whiteSpace="nowrap" justify="space-between" alignItems="center">
        <Button onClick={handlePrev} leftIcon={<ArrowLeftIcon />} />
        <HStack >
          {daysInMonth.slice(visibleIndex, visibleIndex + 5).map((day, index) => {
            const isToday = isSameDay(day, new Date());
            const isSelected = isSameDay(day, selectedDate);
            return (
              <Box
                key={index}
                bg={isSelected ? 'blue.400' : isToday ? 'green.300' : 'gray.200'}
                color={isSelected ? 'white' : 'black'}
                w={'100px'}
                h={'50px'}
                display={'flex'}
                justifyContent={'center'}
                alignItems={'center'}
                borderRadius="md"
                cursor="pointer"
                onClick={() => handleSelectDate(day)}
              >
                <VStack spacing={0}>
                  <Text>{format(day, 'd')}</Text>
                  <Text fontSize="sm">{format(day, 'MMM')}</Text>
                </VStack>
              </Box>
            );
          })}
        </HStack>
        <Button onClick={handleNext} rightIcon={<ArrowRightIcon />} />
      </HStack>

      <VStack align="stretch" spacing={6} mt={6}>
        <Flex flexWrap={'wrap'} gap={5} justifyContent={'space-around'} alignItems={'start'}>
          <Box w={'300px'} border={'1px solid gray'} borderRadius="md" p={4} bg={'gray.50'}>
            <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
              <Text fontWeight="bold" mb={2}>To Do</Text>
              <IconButton borderRadius={'full'} icon={<BsThreeDotsVertical />} />
            </Box>
            <Input
              placeholder="Task"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              mb={3}
            />
            <Input
              placeholder="Description"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              mb={3}
            />
            <Button onClick={handleAddTask} colorScheme="blue" w="full">Add Task</Button>
          </Box>
          
          <Box w={'300px'} border={'1px solid gray'} borderRadius="md" p={4} bg={'gray.50'}>
            <Text fontWeight="bold" mb={4}>In Progress</Text>
            {inProgressTasks.length === 0 && <Text>No tasks in progress</Text>}
            {inProgressTasks.map((task) => (
              <HStack  p={2} borderRadius={'md'} border={'1px solid gray'} key={task.id} justify="space-between" mb={3}>
                <Checkbox isChecked={false} onChange={() => handleMarkAsCompleted(task.id)}>
                  {task.title}
                </Checkbox>
                <IconButton
                  icon={<MdDelete />}
                  aria-label="Delete"
                  onClick={() => handleDeleteTask(task.id)}
                />
              </HStack>
            ))}
          </Box>

          <Box w={'300px'} border={'1px solid gray'} borderRadius="md" p={4} bg={'gray.50'}>
            <Text fontWeight="bold" mb={4}>Done</Text>
            {doneTasks.length === 0 && <Text>No completed tasks</Text>}
            {doneTasks.map((task) => (
              <HStack p={2} borderRadius={'md'} border={'1px solid gray'} key={task.id} justify="space-between" mb={3}>
                <Checkbox isChecked={true} onChange={() => {handleReActivateTask(task.id)}}>
                  {task.title}
                </Checkbox>
                <IconButton
                  icon={<MdDelete />}
                  aria-label="Delete"
                  onClick={() => handleDeleteTask(task.id)}
                />
              </HStack>
            ))}
          </Box>
        </Flex>
      </VStack>
    </Box>
  );
};

export default MonthlyTasks;
