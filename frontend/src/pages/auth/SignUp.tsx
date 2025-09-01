import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
    Box,
    TextField,
    Button,
    Typography,
    InputAdornment,
    IconButton,
    Alert,
    Snackbar,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { userService } from '../../services/userService';
import signUpBg from '../../assets/signUp.png';
import Icon from '../../assets/icon.png';

interface SignUpFormData {
    fullName: string;
    email: string;
    dob: string;  // Changed from dateOfBirth to dob
    otp?: string;
}

const schema: yup.ObjectSchema<SignUpFormData> = yup.object().shape({
    fullName: yup.string().required('Full name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    dob: yup.string().required('Date of birth is required'),
    otp: yup.string().when('$otpSent', {
        is: true,
        then: (schema) => schema.required('OTP is required'),
        otherwise: (schema) => schema.notRequired(),
    }),
});

const PageWrapper = styled(Box)({
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 0,
    position: 'relative',
    width: '100%',
    height: '100vh',
    background: '#FFFFFF',
    borderRadius: '32px',
});

const LeftColumn = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: '32px',
    width: '591px',
    height: '100%',
    flex: '1',
});

const LogoContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 0,
    gap: '12px',
    width: '79px',
    height: '32px',
});

const Logo = styled('img')({
    width: '32px',
    height: '32px',
});

const LogoText = styled(Typography)({
    fontFamily: 'Inter',
    fontWeight: 600,
    fontSize: '24px',
    lineHeight: '110%',
    textAlign: 'center',
    letterSpacing: '-0.04em',
    color: '#232323',
});

const ContentContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '0 64px',
    gap: '32px',
    width: '527px',
    height: '928px',
    flex: 1,
});

const TextContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 0,
    gap: '12px',
    width: '399px',
    height: '83px',
});

const StyledTitle = styled(Typography)({
    fontFamily: 'Inter',
    fontWeight: 700,
    fontSize: '40px',
    lineHeight: '110%',
    textAlign: 'center',
    letterSpacing: '-0.04em',
    color: '#232323',
});

const StyledSubtitle = styled(Typography)({
    fontFamily: 'Inter',
    fontWeight: 400,
    fontSize: '18px',
    lineHeight: '150%',
    color: '#969696',
});

const StyledForm = styled('form')({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 0,
    gap: '20px',
    width: '399px',
});

const StyledTextField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
        height: '59px',
        borderRadius: '10px',
        '& fieldset': {
            borderWidth: '1.5px',
            borderColor: '#D9D9D9',
        },
        '&:hover fieldset': {
            borderColor: '#367AFF',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#367AFF',
        },
    },
    '& .MuiInputLabel-root': {
        fontFamily: 'Inter',
        fontSize: '14px',
        fontWeight: 500,
        color: '#9A9A9A',
        '&.Mui-focused': {
            color: '#367AFF',
        },
    },
    '& .MuiInputBase-input': {
        fontFamily: 'Inter',
        fontSize: '18px',
        lineHeight: '150%',
        color: '#232323',
    },
});

const ResendOTP = styled(Typography)({
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '16px',
    lineHeight: '150%',
    textDecorationLine: 'underline',
    color: '#367AFF',
    cursor: 'pointer',
    marginTop: '8px',
});

const StyledButton = styled(Button)({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '16px 8px',
    gap: '8px',
    width: '399px',
    height: '54px',
    background: '#367AFF',
    borderRadius: '10px',
    fontFamily: 'Inter',
    fontWeight: 600,
    fontSize: '18px',
    lineHeight: '120%',
    letterSpacing: '-0.01em',
    color: '#FFFFFF',
    textTransform: 'none',
    '&:hover': {
        background: '#2952CC',
    },
});

const RightColumn = styled(Box)({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: '12px',
    gap: '10px',
    width: '849px',
    height: '100%',
    backgroundImage: `url(${signUpBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderRadius: '24px',
});

export default function SignUp() {
    const navigate = useNavigate();
    const [showOTP, setShowOTP] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error';
    }>({
        open: false,
        message: '',
        severity: 'success',
    });

    const { register, handleSubmit, formState: { errors }, getValues } = useForm<SignUpFormData>({
        resolver: yupResolver(schema),
        context: { otpSent },
        defaultValues: {
            fullName: '',
            email: '',
            dob: '',
            otp: undefined
        }
    });

    const showNotification = (message: string, severity: 'success' | 'error') => {
        setAlert({
            open: true,
            message,
            severity,
        });
    };

    const handleGetOTP = async (data: SignUpFormData) => {
        try {
            setLoading(true);
            const response = await userService.register({
                fullName: data.fullName,
                email: data.email,
                dob: data.dob,
            });
            setOtpSent(true);
            showNotification(response.message, 'success');
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
            const response = await userService.resendOTP(email);
            showNotification(response.message, 'success');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred';
            showNotification(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (data: SignUpFormData) => {
        try {
            setLoading(true);
            await userService.verifyOTP({
                email: data.email,
                otp: data.otp!,
            });

            showNotification('Registration successful! Redirecting to sign in...', 'success');
            // Navigate to sign in page after successful registration
            setTimeout(() => {
                navigate('/signin');
            }, 1500);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred';
            showNotification(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data: SignUpFormData) => {
        if (!otpSent) {
            await handleGetOTP(data);
        } else {
            await handleVerifyOTP(data);
        }
    };

    return (
        <PageWrapper>
            <LeftColumn>
                <LogoContainer>
                    <Logo src={Icon} alt="HD Logo" />
                    <LogoText>HD</LogoText>
                </LogoContainer>

                <ContentContainer>
                    <TextContainer>
                        <StyledTitle>Sign up</StyledTitle>
                        <StyledSubtitle>
                            Sign up to enjoy the feature of HD
                        </StyledSubtitle>
                    </TextContainer>

                    <StyledForm onSubmit={handleSubmit(onSubmit)} noValidate>
                        <StyledTextField
                            fullWidth
                            label="Your Name"
                            {...register('fullName')}
                            error={!!errors.fullName}
                            helperText={errors.fullName?.message}
                            disabled={otpSent || loading}
                        />

                        <StyledTextField
                            fullWidth
                            label="Date of Birth"
                            type="date"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CalendarTodayIcon sx={{ color: '#232323' }} />
                                    </InputAdornment>
                                ),
                            }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            {...register('dob')}
                            error={!!errors.dob}
                            helperText={errors.dob?.message}
                            disabled={otpSent || loading}
                        />

                        <StyledTextField
                            fullWidth
                            label="Email"
                            type="email"
                            {...register('email')}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                            disabled={otpSent || loading}
                        />

                        {otpSent && (
                            <>
                                <StyledTextField
                                    fullWidth
                                    label="OTP"
                                    type={showOTP ? 'text' : 'password'}
                                    {...register('otp')}
                                    error={!!errors.otp}
                                    helperText={errors.otp?.message}
                                    disabled={loading}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle otp visibility"
                                                    onClick={() => setShowOTP(!showOTP)}
                                                    edge="end"
                                                >
                                                    {showOTP ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <ResendOTP
                                    onClick={handleResendOTP}
                                    sx={{ opacity: loading ? 0.7 : 1, pointerEvents: loading ? 'none' : 'auto' }}
                                >
                                    Resend OTP
                                </ResendOTP>
                            </>
                        )}

                        <StyledButton
                            type="submit"
                            disabled={loading}
                            sx={{ opacity: loading ? 0.7 : 1 }}
                        >
                            {loading ? 'Please wait...' : otpSent ? 'Sign up' : 'Get OTP'}
                        </StyledButton>

                        <Typography
                            sx={{
                                fontFamily: 'Inter',
                                fontSize: '18px',
                                lineHeight: '150%',
                                textAlign: 'center',
                                color: '#6C6C6C',
                                width: '100%',
                                mt: 2,
                            }}
                        >
                            Already have an account?{' '}
                            <Link to="/signin" style={{ color: '#367AFF', textDecoration: 'none' }}>
                                Sign in
                            </Link>
                        </Typography>
                    </StyledForm>
                </ContentContainer>
            </LeftColumn>
            <RightColumn />

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
        </PageWrapper>
    );
}