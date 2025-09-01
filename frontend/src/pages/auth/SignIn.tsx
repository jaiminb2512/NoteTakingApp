// src/pages/SignIn/SignIn.tsx

import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Email, Visibility, VisibilityOff, Key } from "@mui/icons-material";
import signUpBg from "../../assets/signUp.png";
import Icon from "../../assets/icon.png";

// ✅ Validation schema
const schema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
    otp: yup.string().required("OTP is required"),
});

// ✅ Styled Components with MUI
const Container = styled(Box)(({ theme }) => ({
    display: "flex",
    minHeight: "100vh",
    background: "#fff",
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
}));

const Logo = styled("img")(() => ({
    width: "28px",
    height: "28px",
}));

const FormWrapper = styled(Box)(() => ({
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

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            email: "jonas_kahnwald@gmail.com",
            otp: "",
        },
    });

    const onSubmit = (data: any) => {
        console.log("Sign In Data:", data);
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

                <FormWrapper component="form" onSubmit={handleSubmit(onSubmit)}>
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

                    {/* OTP */}
                    <TextField
                        label="OTP"
                        type={showOtp ? "text" : "password"}
                        fullWidth
                        {...register("otp")}
                        error={!!errors.otp}
                        helperText={errors.otp?.message as string}
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
                        sx={{ color: "#2563eb", cursor: "pointer", fontWeight: 500 }}
                    >
                        Resend OTP
                    </Typography>

                    {/* Keep me logged in */}
                    <FormControlLabel
                        control={<Checkbox />}
                        label="Keep me logged in"
                        sx={{ fontSize: "0.875rem" }}
                    />

                    {/* Button */}
                    <StyledButton type="submit" fullWidth>
                        Sign In
                    </StyledButton>

                    {/* Sign up link */}
                    <SignUpText>
                        Need an account? <Link to="/signup">Create one</Link>
                    </SignUpText>
                </FormWrapper>
            </LeftPanel>

            {/* Right Panel (hidden on mobile) */}
            <RightPanel />
        </Container>
    );
};

export default SignIn;
