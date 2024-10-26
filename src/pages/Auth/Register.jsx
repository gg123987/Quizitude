import { useRef, useState } from "react";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import backgroundImage from "@/assets/nick-morrison-FHnnjk1Yj7Y-unsplash.jpg";
import stars from "@/assets/Stars.png";
import logoSmall from "@/assets/Logo-small.png";
import GoogleSignup from "@/assets/Google Signup.svg";

const defaultTheme = createTheme();

export default function Register() {
  const fNameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setErrorMsg("");
      setLoading(true);
      setEmailError(false);
      setPasswordError(false);

      if (
        !fNameRef.current?.value ||
        !passwordRef.current?.value ||
        !emailRef.current?.value
      ) {
        setErrorMsg("Please fill in all fields");
        setLoading(false);
        return;
      }

      if (
        !emailRef.current.value.includes("@") ||
        !emailRef.current.value.includes(".")
      ) {
        setEmailError(true);
        setLoading(false);
        return;
      }

      if (passwordRef.current.value.length < 8) {
        setPasswordError(true);
        setLoading(false);
        return;
      }

      setErrorMsg("");
      setLoading(true);

      const { data, error } = await register(
        emailRef.current.value,
        passwordRef.current.value,
        fNameRef.current.value
      );

      console.log(data);
      console.log(error);
      if (error) {
        if (error.message === "User already registered") {
          setErrorMsg(
            "Email already exists. Please use a different email or login."
          );
        } else {
          setErrorMsg("Error in Creating Account");
        }
      } else {
        navigate("/login");
      }
    } catch (error) {
      setErrorMsg("Error in Creating Account");
    }
    setLoading(false);
  };

  const { signInWithGoogle } = useAuth();

  const handleGoogleSignIn = () => {
    signInWithGoogle();
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
            display: "flex",
            alignItems: "center",
            width: "100%",
            height: "100%",
            transition: "width 0.5s, height 0.5s",
            "&:hover": {
              width: "120%",
              height: "120%",
            },
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: "0",
              left: "0",
              height: "100%",
              width: "100%",
              bgcolor: "#2D3282",
              opacity: 0.75,
              zIndex: 0,
            }}
          ></Box>

          <Box
            sx={{
              textAlign: "left",
              color: "#ffffff",
              zIndex: 1,
              position: "absolute",
              padding: "12% 9%",
            }}
          >
            <img src={stars} alt="stars" width="80px" height="80px" />
            <Typography
              variant="h2"
              component="h1"
              fontSize={"5rem"}
              fontFamily={"Inter"}
              marginTop="40px"
              color="white"
              fontWeight={300}
              gutterBottom
            >
              Study Smarter <br />
              through AI-Generated Flashcards
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: "auto",
              display: "flex",
              flexDirection: "column",
              padding: "20px 80px",
              width: "100%",
              maxWidth: "570px",
              justifyContent: "center",
            }}
          >
            <img src={logoSmall} alt="logo" width="23px" height="23px" />
            <Typography
              fontFamily="Inter"
              fontWeight={600}
              fontSize={"1.5em"}
              textAlign="left"
              marginTop={"30px"}
            >
              Sign Up
            </Typography>
            <Typography
              fontFamily="Inter"
              fontWeight={300}
              fontSize={"1em"}
              textAlign="left"
              marginTop={"10px"}
              marginBottom={"30px"}
            >
              Start studying with flashcards today
            </Typography>

            <Button onClick={handleGoogleSignIn} fullWidth>
              <img src={GoogleSignup} alt="Google Signup" />
            </Button>

            <Typography
              fontFamily="Inter"
              fontWeight={200}
              fontSize={"0.9em"}
              textAlign="left"
              marginTop={"40px"}
              alignSelf={"center"}
            >
              or Sign up with Email
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1, textAlign: "left" }}
            >
              {errorMsg && (
                <Alert
                  severity="error"
                  onClose={() => setErrorMsg("")}
                  sx={{ marginBottom: "20px", mt: "10px" }}
                >
                  {errorMsg}
                </Alert>
              )}
              <Typography
                fontFamily="Inter"
                fontWeight={400}
                fontSize={"0.9em"}
                textAlign="left"
                marginTop={"20px"}
                marginBottom={"4px"}
              >
                First Name
              </Typography>
              <TextField
                required
                fullWidth
                id="fName"
                label=""
                name="fName"
                autoComplete="fName"
                autoFocus
                inputRef={fNameRef}
                disabled={loading}
              />
              <Typography
                fontFamily="Inter"
                fontWeight={400}
                fontSize={"0.9em"}
                textAlign="left"
                marginTop={"20px"}
                marginBottom={"4px"}
              >
                Email
              </Typography>
              <TextField
                required
                fullWidth
                id="email"
                label=""
                name="email"
                autoComplete="email"
                autoFocus
                inputRef={emailRef}
                error={emailError}
                disabled={loading}
                helperText={
                  emailError ? "Please use a valid email address" : ""
                }
                sx={{ borderColor: emailError ? "red" : "" }}
              />
              <Typography
                fontFamily="Inter"
                fontWeight={400}
                fontSize={"0.9em"}
                textAlign="left"
                marginTop={"20px"}
                marginBottom={"4px"}
              >
                Password
              </Typography>
              <TextField
                required
                fullWidth
                name="password"
                label=""
                type="password"
                id="password"
                autoComplete="current-password"
                inputRef={passwordRef}
                error={passwordError}
                disabled={loading}
                helperText={
                  passwordError ? "Must be at least 8 characters" : ""
                }
                sx={{ borderColor: passwordError ? "red" : "" }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  height: 50,
                  mt: 5,
                  mb: 2,
                  backgroundColor: "#3538CD",
                  color: "#FFFFFF",
                  borderRadius: "10px",
                }}
              >
                Get started
              </Button>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignSelf: "center",
                marginTop: "20px",
                marginBottom: "4px",
              }}
            >
              <Typography
                fontFamily="Inter"
                fontWeight={400}
                fontSize={"0.9em"}
                textAlign="center"
              >
                Already have an account?
              </Typography>
              <Link
                href="/login"
                variant="body2"
                sx={{
                  fontWeight: "bold",
                  color: "#3538CD",
                  textDecoration: "none",
                  marginLeft: "4px",
                }}
              >
                Log in
              </Link>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
