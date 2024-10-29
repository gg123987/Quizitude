import { useRef, useState } from "react";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import backgroundImage from "@/assets/nick-morrison-FHnnjk1Yj7Y-unsplash.jpg";
import stars from "@/assets/Stars.png";
import logoSmall from "@/assets/Logo-small.png";
import GoogleLogin from "@/assets/Google Login.svg";
import { supabase } from "@/utils/supabase";

const defaultTheme = createTheme();

/**
 * SignInSide component renders the login page with options to sign in using email/password or Google.
 *
 * @component
 * @returns {JSX.Element} The rendered component.
 *
 * @example
 * return (
 *   <SignInSide />
 * )
 *
 * @remarks
 * - This component uses Material-UI for styling and layout.
 * - It includes form validation and error handling for email and password fields.
 * - It supports "Remember Me" functionality by storing the session token in localStorage.
 * - It provides a link to reset the password and to sign up for a new account.
 *
 * @async
 * @function handleSubmit
 * @description Handles the form submission for email/password login.
 * @param {Event} e - The form submission event.
 *
 * @function handleGoogleSignIn
 * @description Handles the Google sign-in button click.
 */
export default function SignInSide() {
  const [rememberMe, setRememberMe] = useState(false);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setErrorMsg("");
      setLoading(true);

      if (!passwordRef.current?.value || !emailRef.current?.value) {
        setErrorMsg("Please fill in the fields");
        setLoading(false);
        return;
      }
      const { user, session, error } = await login(
        emailRef.current.value,
        passwordRef.current.value
      );

      console.log("Login data:", user, session, error);

      if (error) {
        // If the error is due to invalid login credentials, check if the email exists
        if (error.message === "Invalid login credentials") {
          const { data: users } = await supabase
            .from("users")
            .select("email")
            .eq("email", emailRef.current.value)
            .single();

          const count = users ? 1 : 0;

          // If the email exists, show password error, otherwise show email error
          if (count > 0) {
            setEmailError(false);
            setPasswordError(true);
          } else {
            setEmailError(true);
            setPasswordError(false);
          }
        }
      } else {
        if (user && session) {
          if (rememberMe) {
            localStorage.setItem("rememberMeToken", session.access_token);
          }
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Login error:", error.message);
      setErrorMsg("An unexpected error occurred. Please try again later.");
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
              fontWeight={300}
              color="white"
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
              padding: "20px 100px",
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
              Log in
            </Typography>
            <Typography
              fontFamily="Inter"
              fontWeight={300}
              fontSize={"1em"}
              textAlign="left"
              marginTop={"10px"}
              marginBottom={"30px"}
            >
              Welcome back! Please enter your details.
            </Typography>

            <Button onClick={handleGoogleSignIn} fullWidth>
              <img src={GoogleLogin} alt="Google Login" />
            </Button>

            <Typography
              fontFamily="Inter"
              fontWeight={200}
              fontSize={"0.9em"}
              textAlign="left"
              marginTop={"40px"}
              marginBottom={"20px"}
              alignSelf={"center"}
            >
              or Sign in with Email
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
                  sx={{ marginBottom: "20px" }}
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
                helperText={
                  emailError
                    ? "We do not recognize this email. Please try again"
                    : ""
                }
                sx={{ borderColor: emailError ? "red" : "" }}
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
                helperText={passwordError ? "Incorrect password" : ""}
                sx={{ borderColor: passwordError ? "red" : "" }}
                disabled={loading}
              />
              <Grid container sx={{ marginTop: "10px" }}>
                <Grid item xs>
                  <FormControlLabel
                    control={
                      <Checkbox
                        value={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        color="primary"
                      />
                    }
                    label={
                      <Typography
                        fontFamily="Inter"
                        fontWeight="500"
                        fontSize="14px"
                      >
                        {" "}
                        Remember me
                      </Typography>
                    }
                  />
                </Grid>
                <Grid item sx={{ marginTop: "10px" }}>
                  <Link
                    href="/passwordreset"
                    variant="body2"
                    sx={{
                      fontWeight: "bold",
                      color: "#3538CD",
                      textDecoration: "none",
                    }}
                  >
                    Forgot password?
                  </Link>
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  backgroundColor: "#3538CD",
                  color: "#FFFFFF",
                  borderRadius: "10px",
                }}
              >
                Sign In
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
                Dont have an account?
              </Typography>
              <Link
                href="/register"
                variant="body2"
                sx={{
                  fontWeight: "bold",
                  color: "#3538CD",
                  textDecoration: "none",
                  marginLeft: "4px",
                }}
              >
                Sign Up
              </Link>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
