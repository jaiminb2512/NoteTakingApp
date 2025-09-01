// src/pages/SignIn/SignIn.tsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userService } from "../../services/userService";
import { useAuth } from "../../contexts/AuthContext";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
    Box,
    TextField,
    Button,
    Typography,
    InputAdornment,
    IconButton,
    Checkbox,
    FormControlLabel,
    Alert,
    Snackbar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Email, Visibility, VisibilityOff, Key } from "@mui/icons-material";
import signUpBg from "../../assets/signUp.png";
import Icon from "../../assets/icon.png";

interface SignInFormData {
    email: string;
    otp: string;
}

// ✅ Validation schema
const schema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
    otp: yup.string().default("").when('$otpSent', {
        is: true,
        then: (schema) => schema.required("OTP is required"),
        otherwise: (schema) => schema.default(""),
    }),
});

// ✅ Styled Components with MUI
const Container = styled(Box)(({ theme }) => ({
    display: "flex",
    minHeight: "100vh",
    background: "#fff",
    position: 'relative',
    [theme.breakpoints.down("md")]: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
}));

const LeftPanel = styled(Box)(({ theme }) => ({
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem",
    [theme.breakpoints.down("md")]: {
        flex: "unset",
        width: "100%",
        padding: "1.5rem",
    },
}));

const RightPanel = styled(Box)(({ theme }) => ({
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: `url(${signUpBg}) no-repeat center`,
    backgroundSize: "cover",
    borderRadius: "1rem",
    margin: "1rem",
    [theme.breakpoints.down("md")]: {
        display: "none", // Hide image on mobile
    },
}));

const LogoWrapper = styled(Box)(() => ({
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginBottom: "2rem",
    position: 'absolute',
    top: '1.5rem',
    left: '1.5rem',
}));

const Logo = styled("img")(() => ({
    width: "28px",
    height: "28px",
}));

const FormWrapper = styled('form')(() => ({
    width: "100%",
    maxWidth: "360px",
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
}));

const StyledButton = styled(Button)(() => ({
    backgroundColor: "#3b82f6",
    color: "#fff",
    fontWeight: 600,
    padding: "0.75rem",
    borderRadius: "8px",
    textTransform: "none",
    "&:hover": {
        backgroundColor: "#2563eb",
    },
}));

const SignUpText = styled(Typography)(() => ({
    fontSize: "0.875rem",
    textAlign: "center",
    marginTop: "1rem",
    "& a": {
        color: "#2563eb",
        fontWeight: 500,
        textDecoration: "none",
    },
}));

// ✅ Component
const SignIn = () => {
    const [showOtp, setShowOtp] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { setAuthState } = useAuth();
    const [alert, setAlert] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error';
    }>({
        open: false,
        message: '',
        severity: 'success',
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
    } = useForm<SignInFormData>({
        mode: "onBlur",
        resolver: yupResolver(schema),
        context: { otpSent },
        defaultValues: {
            email: "",
            otp: "",
        } as SignInFormData,
    });

    const showNotification = (message: string, severity: 'success' | 'error') => {
        setAlert({
            open: true,
            message,
            severity,
        });
    };

    const handleGetOTP = async (data: SignInFormData) => {
        try {
            setLoading(true);
            await userService.initiateLogin(data.email);
            setOtpSent(true);
            showNotification('OTP sent to your email', 'success');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred';
            showNotification(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        try {
            setLoading(true);
            const email = getValues('email');
            await userService.initiateLogin(email);
            showNotification('OTP resent to your email', 'success');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred';
            showNotification(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (data: SignInFormData) => {
        try {
            setLoading(true);
            const response = await userService.verifyLogin({
                email: data.email,
                otp: data.otp!,
            });

            if (response.success && response.data) {
                // Persist token and user
                localStorage.setItem('token', response.data.token || '');
                if (response.data.user) {
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                }

                // Set auth state with user data from login response
                setAuthState({
                    isAuthenticated: true,
                    user: response.data.user || null
                });
            } else {
                throw new Error('Login failed');
            }

            showNotification('Login successful!', 'success');
            // Navigate to home page immediately after successful login
            navigate('/', { replace: true });
            return;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred';
            showNotification(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    const onSubmit: SubmitHandler<SignInFormData> = async (data) => {
        try {
            if (!otpSent) {
                await handleGetOTP(data);
            } else {
                await handleVerifyOTP(data);
            }
        } catch (error) {
            console.error('Form submission error:', error);
        }
    };

    return (
        <Container>
            {/* Left Panel (always visible) */}
            <LeftPanel>
                <LogoWrapper>
                    <Logo src={Icon} alt="logo" />
                    <Typography variant="h6" fontWeight="bold">
                        HD
                    </Typography>
                </LogoWrapper>

                <FormWrapper
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                >
                    <Typography variant="h4" fontWeight="bold">
                        Sign In
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Please login to continue to your account.
                    </Typography>

                    {/* Email */}
                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        {...register("email")}
                        error={!!errors.email}
                        helperText={errors.email?.message as string}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Email />
                                </InputAdornment>
                            ),
                        }}
                    />

                    {/* OTP Field - Only show after email is submitted */}
                    {otpSent && (
                        <>
                            <TextField
                                label="OTP"
                                type={showOtp ? "text" : "password"}
                                fullWidth
                                {...register("otp")}
                                error={!!errors.otp}
                                helperText={errors.otp?.message as string}
                                disabled={loading}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Key />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowOtp(!showOtp)}>
                                                {showOtp ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            {/* Resend OTP */}
                            <Typography
                                variant="body2"
                                sx={{
                                    color: "#2563eb",
                                    cursor: loading ? "default" : "pointer",
                                    fontWeight: 500,
                                    opacity: loading ? 0.7 : 1,
                                }}
                                onClick={loading ? undefined : handleResendOTP}
                            >
                                Resend OTP
                            </Typography>
                        </>
                    )}

                    {/* Keep me logged in */}
                    <FormControlLabel
                        control={<Checkbox />}
                        label="Keep me logged in"
                        sx={{ fontSize: "0.875rem" }}
                    />

                    {/* Button */}
                    <StyledButton
                        type="submit"
                        fullWidth
                        disabled={loading}
                        sx={{ opacity: loading ? 0.7 : 1 }}
                    >
                        {loading
                            ? "Please wait..."
                            : otpSent
                                ? "Sign In"
                                : "Get OTP"}
                    </StyledButton>

                    {/* Sign up link */}
                    <SignUpText>
                        Need an account? <Link to="/signup">Create one</Link>
                    </SignUpText>
                </FormWrapper>
            </LeftPanel>

            {/* Right Panel (hidden on mobile) */}
            <RightPanel />

            <Snackbar
                open={alert.open}
                autoHideDuration={6000}
                onClose={() => setAlert({ ...alert, open: false })}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setAlert({ ...alert, open: false })}
                    severity={alert.severity}
                    sx={{ width: '100%' }}
                >
                    {alert.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default SignIn;
