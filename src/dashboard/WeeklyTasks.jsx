import { Box, VStack, HStack, Button, IconButton, Text, Input, Flex, useToast, Checkbox, Skeleton } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { format, startOfWeek, addDays, isSameDay, subWeeks, addWeeks } from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon, DeleteIcon } from '@chakra-ui/icons';
import axios from 'axios';
import './WeeklyTasks.css'
const getAccessToken = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user ? user.token : null;
};

const WeeklyTasks = () => {
  const today = new Date();
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(today, { weekStartsOn: 1 }));
  const [selectedDate, setSelectedDate] = useState(today);
  const [newTask, setNewTask] = useState('');
  const [description, setDescription] = useState('');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const weekDays = Array.from({ length: 7 }, (_, index) => addDays(currentWeekStart, index));

  useEffect(() => {
    fetchTasks();
  }, [selectedDate]);

  const fetchTasks = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async () => {
    if (newTask.trim() === '' || description.trim() === '') return;

    try {
      const accessToken = getAccessToken();
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      if (accessToken) {
        await axios.post(
          'https://api.mirmakhmudoff.uz/api/todos/',
          {
            title: newTask,
            description,
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
        setDescription('');
        toast({
          title: 'Task added.',
          description: 'Your task has been added successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        fetchTasks();
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

  const handleMarkAsDone = async (taskId) => {
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
          title: 'Task marked as done.',
          description: 'Your task has been marked as completed.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        fetchTasks();
      }
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: 'Error updating task.',
        description: 'There was an error updating your task. Please try again.',
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

  const handleSelectDate = (day) => {
    setSelectedDate(day);
  };

  const handleNextWeek = () => {
    setCurrentWeekStart(addWeeks(currentWeekStart, 1));
  };

  const handlePreviousWeek = () => {
    setCurrentWeekStart(subWeeks(currentWeekStart, 1));
  };

  const selectedDayTasks = tasks.filter((task) => {
    const taskDate = new Date(task.due_date);
    return isSameDay(taskDate, selectedDate);
  });

  const inProgressTasks = selectedDayTasks.filter((task) => task.status === 'in-progress');
  const doneTasks = selectedDayTasks.filter((task) => task.status === 'done');

  return (
    <Box>
      <Box className='scroll-container'  overflowX="auto"  whiteSpace="nowrap" mb={4} p={2}>
        <HStack >
          <IconButton
            icon={<ChevronLeftIcon />}
            aria-label="Previous Week"
            onClick={handlePreviousWeek}
            colorScheme="blue"
            mr={2}
            size="sm"
            borderRadius={'100%'}
          />
          {weekDays.map((day, index) => (
            <Box
              key={index}
              minWidth="100px"
              display={'flex'}
              flexDir={'column'}
              justifyContent={'center'}
              alignItems={'center'}
              cursor={'pointer'}
              border={'1px solid blue'}
              color={isSameDay(day, selectedDate) ? 'white' : 'black'}
              background={isSameDay(day, selectedDate) ? 'blue' : 'white'}
              onClick={() => handleSelectDate(day)}
            >
              <Text>{format(day, 'EEEE')}</Text>
              <Text>{format(day, 'MM/dd')}</Text>
            </Box>
          ))}
          <IconButton
            icon={<ChevronRightIcon />}
            aria-label="Next Week"
            onClick={handleNextWeek}
            colorScheme="blue"
            size="sm"
            borderRadius={'100%'}
          />
        </HStack>
      </Box>

      <VStack align="stretch" spacing={6}>
        <Flex flexWrap={'wrap'} gap={5} justifyContent={'space-around'} alignItems={'start'}>
          <Box w={'300px'} border={'1px solid gray'} borderRadius={'md'} p={4}>
            <Text fontWeight="bold" mb={2}>To Do</Text>
            <Input
              placeholder="Yangi task qo'shing"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
            <Input
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)} 
              mt={2}
            />
            <Button colorScheme="teal" variant={'unstyled'} mt={2} onClick={handleAddTask}>
              + add Task
            </Button>
          </Box>

          <Box w={'300px'} border={'1px solid gray'} borderRadius={'md'} p={4} bg={'yellow.50'}>
            <Text fontWeight="bold" mb={2}>In Progress</Text>
            {loading ? (
              <Skeleton height="50px" mb={3} />
            ) : (
              inProgressTasks.map((task) => (
                <Box key={task.id} p={2} display={'flex'} w={'100%'} justifyContent={'space-between'} alignItems={'center'} mb={2} borderRadius="md" border="1px solid gray">
                  <HStack spacing={4}>
                    <Checkbox
                      isChecked={task.status === 'done'}
                      onChange={() => handleMarkAsDone(task.id)}
                    >
                      {task.title}
                    </Checkbox>
                  </HStack>
                    <IconButton
                      icon={<DeleteIcon />}
                      onClick={() => handleDeleteTask(task.id)}
                      aria-label="Delete"
                      size="sm"
                    />
                </Box>
              ))
            )}
          </Box>
        <Box w={'300px'} border={'1px solid gray'} borderRadius={'md'} p={4}>
          <Text fontWeight="bold" mb={2}>Done</Text>
          {loading ? (
            <Skeleton height="50px" mb={3} />
          ) : (
            doneTasks.map((task) => (
              <Box key={task.id} p={2} mb={2} w={'100%'} display={'flex'} justifyContent={'space-between'} alignItems={'center'} borderRadius="md" border="1px solid gray">
                <HStack spacing={4}>
                  <Checkbox
                    isChecked={task.status === 'done'}
                    onChange={() => handleReActivateTask(task.id)}
                  >
                    {task.title}
                  </Checkbox>
                </HStack>
                  <IconButton
                    icon={<DeleteIcon />}
                    onClick={() => handleDeleteTask(task.id)}
                    aria-label="Delete"
                    size="sm"
                  />
              </Box>
            ))
          )}
        </Box>
        </Flex>

      </VStack>
    </Box>
  );
};

export default WeeklyTasks;
