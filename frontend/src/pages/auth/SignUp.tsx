import { useState } from 'react';
import { Link } from 'react-router-dom';
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
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import signUpBg from '../../assets/signUp.png';
import Icon from '../../assets/icon.png';

interface SignUpFormData {
    fullName: string;
    email: string;
    dateOfBirth: string;
    otp: string;
}

const schema = yup.object().shape({
    fullName: yup.string().required('Full name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    dateOfBirth: yup.string().required('Date of birth is required'),
    otp: yup.string().required('OTP is required'),
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
    const [showOTP, setShowOTP] = useState(false);
    const [otpSent, setOtpSent] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormData>({
        resolver: yupResolver(schema),
    });

    const handleGetOTP = async (email: string) => {
        // API call to send OTP
        console.log('Sending OTP to:', email);
        setOtpSent(true);
    };

    const handleResendOTP = () => {
        // Handle OTP resend logic
        console.log('Resending OTP...');
    };

    const onSubmit = (data: SignUpFormData) => {
        if (!otpSent) {
            handleGetOTP(data.email);
        } else {
            console.log('Submitting data:', data);
            // API integration will be added later
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
                            {...register('dateOfBirth')}
                            error={!!errors.dateOfBirth}
                            helperText={errors.dateOfBirth?.message}
                        />

                        <StyledTextField
                            fullWidth
                            label="Email"
                            type="email"
                            {...register('email')}
                            error={!!errors.email}
                            helperText={errors.email?.message}
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
                                <ResendOTP onClick={handleResendOTP}>
                                    Resend OTP
                                </ResendOTP>
                            </>
                        )}

                        <StyledButton type="submit">
                            {otpSent ? 'Sign up' : 'Get OTP'}
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
        </PageWrapper>
    );
}