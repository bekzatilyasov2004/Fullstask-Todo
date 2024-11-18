import { Box, Button, Input, InputGroup, InputRightElement, Text, useToast } from '@chakra-ui/react';
import PageHeader from '../components/page-components/PageHeader';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import useUserStore from '../stores/useGetUser'; 

const LoginPage = () => {
    const nav = useNavigate();
    const toast = useToast();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const setUser = useUserStore((state) => state.setUser); 

    const handleLogin = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post('https://api.mirmakhmudoff.uz/api/auth/signin/', { email, password });

            if (response?.status === 200) {
                const { name, email, access_token } = response.data;
                setUser({ name, email, token: access_token });
                localStorage.setItem('user', JSON.stringify({ name, email, token: access_token }));

                console.log(response.data)
                toast({
                    title: "Login muvaffaqiyatli amalga oshirildi.",
                    description: "Dashboardga yo'naltirilmoqdasiz...",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });

                nav('/dashboard/today');
            } else {
                toast({
                    title: "Kirishda xatolik.",
                    description: response?.data?.message || "Noto'g'ri ma'lumotlar kiritildi.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        } catch (error) {
            toast({
                title: "Xatolik yuz berdi.",
                description: error.response?.data?.message || error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box w="100%" display="flex" justifyContent="center" alignItems="center">
            <Box w="100%" display="flex" flexDir="column" alignItems="center" maxW="1024px">
                <PageHeader link="/register" txt="Sign-up" />
                <Box w="100%" mt="80px" p={5} h="80vh" display="flex" justifyContent="center" alignItems="center">
                    <Box 
                        p={5} 
                        display="flex" 
                        flexDir="column" 
                        gap={{ base: '1', md: '2' }} 
                        w="100%" 
                        maxW="623px" 
                        borderRadius="10px" 
                        border="1px solid #22222240" 
                        textAlign="start"
                    >
                        <Text fontWeight="400" fontSize={{ base: '20px', md: '35px' }}>Sign In</Text>
                        <Text fontWeight="275" fontSize={{ base: '15px', md: '20px' }}>
                            Nice to meet you! Enter your email and password to login.
                        </Text>
                        
                        <label>Your Email</label>
                        <Input 
                            type="email" 
                            placeholder="Enter your email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <label>Your Password</label>
                        <InputGroup>
                            <Input 
                                type={showPassword ? "text" : "password"} 
                                placeholder="Enter your password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <InputRightElement width="4.5rem">
                                <Button h="1.75rem" size="sm" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? "Hide" : "Show"}
                                </Button>
                            </InputRightElement>
                        </InputGroup>

                        <Box 
                            gap={2} 
                            display="flex" 
                            justifyContent="center" 
                            alignItems="center" 
                            flexDir="column" 
                            mt={10} 
                            textAlign="center"
                        >
                            <Button 
                                mt={5} 
                                borderRadius="5px" 
                                w="180px" 
                                h="50px" 
                                background={'black'}
                                colorScheme="teal" 
                                isLoading={isLoading} 
                                loadingText="Signing In"
                                disabled={isLoading}
                                onClick={handleLogin}
                            >
                                Sign-In
                            </Button>
                            <NavLink to="/register">Sign up</NavLink>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default LoginPage;
