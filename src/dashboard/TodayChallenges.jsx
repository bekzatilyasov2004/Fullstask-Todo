import { Box, VStack, HStack, Button, Text, Input, Flex, IconButton, useToast, Textarea, Checkbox, Skeleton } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { BsThreeDotsVertical } from 'react-icons/bs';
import axios from 'axios';
import { DeleteIcon } from '@chakra-ui/icons';

const getAccessToken = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user ? user.token : null;
};

const TodayChallenges = () => {
  const today = new Date();
  const [newTask, setNewTask] = useState('');
  const [description, setDescription] = useState('');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    if (newTask.trim() === '' || description.trim() === '') return;

    try {
      const accessToken = getAccessToken();
      if (accessToken) {
        const formattedDate = format(today, 'yyyy-MM-dd');
        await axios.post(
          'https://api.mirmakhmudoff.uz/api/todos/',
          {
            title: newTask,
            description: description,
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
      console.error('Error updating task status:', error);
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
          title: 'Task re-activated.',
          description: 'Your task has been re-activated.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        fetchTasks();
      } else {
        console.error('Access token not found');
      }
    } catch (error) {
      console.error('Error re-activating task:', error);
      toast({
        title: 'Error re-activating task.',
        description: 'There was an error re-activating the task. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const todayTasks = tasks.filter((task) => task.due_date === format(today, 'yyyy-MM-dd'));
  const inProgressTasks = todayTasks.filter((task) => task.status === 'in-progress');
  const doneTasks = todayTasks.filter((task) => task.status === 'done');

  return (
    <Box>
      <Box w={'100%'} textAlign={'center'} bg={'purple.400'} color={'white'} p={2} mb={4}>
        {format(today, 'dd MMMM yyyy')}
      </Box>

      <VStack align="stretch" spacing={6}>
        <Flex flexWrap={'wrap'} gap={5} justifyContent={'space-around'} alignItems={'start'}>
          <Box display={'flex'}  flexDir={'column'} w={'300px'} border={'1px solid gray'} borderRadius="md" p={4} bg={'gray.50'}>
            <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
              <Text fontWeight="bold" mb={2}>To Do</Text>
              <IconButton borderRadius={'full'} icon={<BsThreeDotsVertical />} />
            </Box>
            <Input
              placeholder="Task title"
              value={newTask}
              mt={2}
              onChange={(e) => setNewTask(e.target.value)}
            />
            <Input
              placeholder="Task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              mt={2}
            />
            <Button colorScheme="teal" variant={'unstyled'} mt={2} onClick={handleAddTask}>
              + add Task
            </Button>
          </Box>

          <Box display={'flex'} gap={2} flexDir={'column'} w={'300px'} border={'1px solid gray'} borderRadius="md" p={4} bg={'yellow.50'}>
            <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
              <Text fontWeight="bold" mb={2}>In-Progress</Text>
              <IconButton borderRadius={'full'} icon={<BsThreeDotsVertical />} />
            </Box>
            {loading ? (
              <Skeleton height="20px" />
            ) : (
              inProgressTasks.length > 0 ? (
                inProgressTasks.map((task) => (
                  <HStack key={task.id} justify="space-between" border={'1px solid gray'} borderRadius="md" p={2}>
                    <Box display="flex" gap={2} alignItems="center">
                      <Checkbox
                        isChecked={task.status === 'done'}
                        onChange={() => handleMarkAsCompleted(task.id)}
                      >
                        <Text>{task.title}</Text>
                      </Checkbox>
                    </Box>
                    <IconButton
                      icon={<DeleteIcon />}
                      size="sm"
                      
                      onClick={() => handleDeleteTask(task.id)}
                    />
                  </HStack>
                ))
              ) : (
                <Text color="gray.500">No tasks in progress.</Text>
              )
            )}

          </Box>

          <Box display={'flex'} gap={2} flexDir={'column'} w={'300px'} border={'1px solid gray'} borderRadius="md" p={4} bg={'green.50'}>
            <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
              <Text fontWeight="bold" mb={2}>Completed</Text>
              <IconButton borderRadius={'full'} icon={<BsThreeDotsVertical />} />
            </Box>
            {loading ? (
              <Skeleton height="20px" />
            ) : (
              doneTasks.length > 0 ? (
                doneTasks.map((task) => (
                  <HStack key={task.id} justify="space-between" border={'1px solid gray'} borderRadius="md" p={2}>
                    <Box display="flex" gap={2} alignItems="center">
                      <Checkbox
                        isChecked={true}
                        onChange={() => handleReActivateTask(task.id)}
                      >

                      <Text>{task.title}</Text>
                      </Checkbox>
                    </Box>
                    <IconButton
                      icon={<DeleteIcon />}
                      size="sm"
                      
                      onClick={() => handleDeleteTask(task.id)}
                    />
                  </HStack>
                ))
              ) : (
                <Text color="gray.500">No completed tasks.</Text>
              )
            )}

          </Box>
        </Flex>
      </VStack>
    </Box>
  );
};

export default TodayChallenges;
