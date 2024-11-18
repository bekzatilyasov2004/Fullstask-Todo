import { Box, Button, Input, InputGroup, InputRightElement, Text, useToast, FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import PageHeader from '../components/page-components/PageHeader';
import useUserStore from '../stores/useGetUser';

const RegisterPage = () => {
    const nav = useNavigate();
    const toast = useToast();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [otpError, setOtpError] = useState('');
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^.{8,}$/;

    const setUser = useUserStore((state) => state.setUser);


    const validateInput = () => {
        let valid = true;

        if (!name) {
            setNameError("Name is required.");
            valid = false;
        } else {
            setNameError("");
        }

        if (!emailRegex.test(email)) {
            setEmailError("Invalid email format.");
            valid = false;
        } else {
            setEmailError("");
        }

        if (!passwordRegex.test(password)) {
            setPasswordError("Password must be at least 8 characters long.");
            valid = false;
        } else {
            setPasswordError("");
        }

        return valid;
    };

    const handleRegister = async () => {
        if (!validateInput()) return;

        setIsLoading(true);
        try {
            const response = await axios.post(`https://api.mirmakhmudoff.uz/api/auth/signup/`, { name, email, password });
            setIsLoading(false);

            if (response.status === 201) {
                setIsOtpSent(true);
                toast({
                    title: "Link sent.",
                    description: "Check your email for the verification link and OTP.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
            } else {
                toast({
                    title: "Registration failed.",
                    description: response.data.message,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        } catch (error) {
            setIsLoading(false);
            const errorMessage = error.response ? error.response.data.message : error.message;
            toast({
                title: "An error occurred.",
                description: errorMessage,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp) {
            setOtpError("OTP is required.");
            return;
        }

        console.log("Verifying OTP:", { email, otp });

        try {
            const response = await axios.post(
                'https://api.mirmakhmudoff.uz/api/auth/verify-otp/',
                { email, otp_code: otp }
            );
            if (response.status === 200) {
                localStorage.setItem('user', JSON.stringify({ name, email }));
                toast({
                    title: "OTP Verified.",
                    description: "Your OTP has been verified successfully.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
                nav("/dashboard/today");
            } else {
                setOtpError("Invalid OTP.");
            }
        } catch (error) {
            const errorMessage = error.response ? error.response.data.message : error.message;
            setOtpError(errorMessage);
        }
    };

    return (
        <Box w="100%" display="flex" justifyContent="center" alignItems="center">
            <Box w="100%" display="flex" flexDir="column" alignItems="center" maxW="1024px">
                <PageHeader link="/login" txt="Sign-In" />
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
                        <Text fontWeight="400" fontSize={{ base: '20px', md: '35px' }}>Sign Up</Text>
                        <Text fontWeight="275" fontSize={{ base: '15px', md: '20px' }}>
                            Welcome! Please enter your details to create your account.
                        </Text>

                        <FormControl isInvalid={nameError}>
                            <FormLabel>Your Name</FormLabel>
                            <Input
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            {nameError && <FormErrorMessage>{nameError}</FormErrorMessage>}
                        </FormControl>

                        <FormControl isInvalid={emailError}>
                            <FormLabel>Your Email</FormLabel>
                            <Input
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {emailError && <FormErrorMessage>{emailError}</FormErrorMessage>}
                        </FormControl>

                        <FormControl isInvalid={passwordError}>
                            <FormLabel>Your Password</FormLabel>
                            <InputGroup>
                                <Input
                                    type={isPasswordVisible ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <InputRightElement width="4.5rem">
                                    <Button h="1.75rem" size="sm" onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
                                        {isPasswordVisible ? "Hide" : "Show"}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                            {passwordError && <FormErrorMessage>{passwordError}</FormErrorMessage>}
                        </FormControl>

                        {!isOtpSent ? (
                            <Box w={'100%'} display={'flex'} justifyContent={'center'} alignItems={'center'}>

                                <Button
                                    mt={5}
                                    w="180px"
                                    h="50px"
                                    background={'black'}
                                    colorScheme="teal"
                                    isLoading={isLoading}
                                    onClick={handleRegister}
                                    loadingText="Signing Up"
                                >
                                    Sign-Up
                                </Button>
                            </Box>
                        ) : (
                            <>
                                <FormControl isInvalid={otpError}>
                                    <FormLabel>Enter OTP</FormLabel>
                                    <Input
                                        placeholder="Enter the OTP"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                    />
                                    {otpError && <FormErrorMessage>{otpError}</FormErrorMessage>}
                                </FormControl>
                                <Box w={'100%'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                                    <Button
                                        mt={5}
                                        w="180px"
                                        h="50px"
                                        background={'black'}
                                        colorScheme="teal"
                                        onClick={handleVerifyOtp}
                                    >
                                        Verify OTP
                                    </Button>
                                </Box>
                            </>
                        )}
                        <Box textAlign={'center'}>
                            <NavLink to="/login">Sign-In</NavLink>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default RegisterPage;
