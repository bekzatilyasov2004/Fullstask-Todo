import {
  Box,
  VStack,
  HStack,
  Button,
  Text,
  Input,
  IconButton,
  Checkbox,
  useToast,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { format, isValid } from 'date-fns';
import axios from 'axios';
import { MdDelete } from 'react-icons/md';

const getAccessToken = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user ? user.token : null;
};

const getSelectData = () => {
  const specialDays = JSON.parse(localStorage.getItem('specialDays'));
  return specialDays && specialDays.length > 0 ? new Date(specialDays[0].date) : null; 
};

const SpecialDayPage = () => {
  const [selectedDate, setSelectedDate] = useState(getSelectData);
  const [newTask, setNewTask] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [tasks, setTasks] = useState([]);
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
      }
    } catch (error) {
      console.error('Error fetching tasks:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    if (newTask.trim() === '' || taskDescription.trim() === '') {
      toast({
        title: 'Please fill in all fields.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

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
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        fetchTasks();
      }
    } catch (error) {
      console.error('Error adding task:', error.response?.data || error.message);
      toast({
        title: error.response?.data?.message || 'Error adding task.',
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
        await axios.delete(
          `https://api.mirmakhmudoff.uz/api/todos/${taskId}/delete/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        toast({
          title: 'Task deleted.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        fetchTasks();
      }
    } catch (error) {
      console.error('Error deleting task:', error.response?.data || error.message);
      toast({
        title: error.response?.data?.message || 'Error deleting task.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleMarkAsCompleted = async (taskId, currentStatus) => {
    try {
      const accessToken = getAccessToken();
      if (accessToken) {
        const newStatus = currentStatus === 'in-progress' ? 'done' : 'in-progress';
        await axios.patch(
          `https://api.mirmakhmudoff.uz/api/todos/${taskId}/status/`,
          { status: newStatus },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        toast({
          title: `Task marked as ${newStatus}.`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        fetchTasks();
      }
    } catch (error) {
      console.error('Error updating task status:', error.response?.data || error.message);
      toast({
        title: error.response?.data?.message || 'Error updating task status.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const inProgressTasks = tasks.filter((task) => task.status === 'in-progress');
  const doneTasks = tasks.filter((task) => task.status === 'done');

  return (
    <Box>
      <Text fontWeight="bold" mb={5}>
        Selected Date: {isValid(selectedDate) ? format(selectedDate, 'MMMM d, yyyy') : 'Invalid Date'}
      </Text>

      <Box display="flex" gap={5} flexWrap="wrap" justifyContent="center">
        <Box borderWidth="1px" borderRadius="md" p={4} w="300px" borderColor="gray.300">
          <Text fontWeight="bold" mb={3}>
            Add Task
          </Text>
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
          <Button onClick={handleAddTask}>Add Task</Button>
        </Box>

        <Box borderWidth="1px" borderRadius="md" p={4} w="300px" borderColor="gray.300">
          <Text fontWeight="bold" mb={3}>
            In Progress
          </Text>
          {inProgressTasks.length === 0 ? (
            <Text>No tasks in progress.</Text>
          ) : (
            inProgressTasks.map((task) => (
              <HStack p={2} border={'1px solid gray'} borderRadius={'md'} key={task.id} justify="space-between" mb={2}>
                <Checkbox
                  isChecked={false}
                  onChange={() => handleMarkAsCompleted(task.id, task.status)}
                >
                  {task.title}
                </Checkbox>
                <IconButton
                  icon={<MdDelete />}
                  onClick={() => handleDeleteTask(task.id)}
                  variant="outline"
                />
              </HStack>
            ))
          )}
        </Box>

        <Box borderWidth="1px" borderRadius="md" p={4} w="300px" borderColor="gray.300">
          <Text fontWeight="bold" mb={3}>
            Done
          </Text>
          {doneTasks.length === 0 ? (
            <Text>No completed tasks.</Text>
          ) : (
            doneTasks.map((task) => (
              <HStack p={2} border={'1px solid gray'} borderRadius={'md'} key={task.id} justify="space-between" mb={2}>
                <Checkbox
                  isChecked={true}
                  onChange={() => handleMarkAsCompleted(task.id, task.status)}
                >
                  {task.title}
                </Checkbox>
                <IconButton
                  icon={<MdDelete />}
                  onClick={() => handleDeleteTask(task.id)}
                  variant="outline"
                />
              </HStack>
            ))
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default SpecialDayPage;
