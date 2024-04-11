import * as React from "react";
import Avatar from "@mui/material/Avatar";
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
import backgroundImage from "../assets/nick-morrison-FHnnjk1Yj7Y-unsplash.jpg";
import stars from "../assets/Stars.png";
import logoSmall from "../assets/Logo-small.png";
import { useAuth } from "../context/AuthProvider";
import GoogleLogin from "../assets/Google Login.svg";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function SignInSide() {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
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
            backgroundImage: `url(https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)`,
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
              padding: "30px 60px",
            }}
          >
            <img src={stars} alt="stars" width="80px" height="80px" />
            <Typography
              variant="h2"
              component="h1"
              fontSize={"5.3rem"}
              fontFamily={"Inter"}
              marginTop="40px"
              fontWeight={300}
              gutterBottom
            >
              Study Smarter through AI-Generated Flashcards
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
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
              margin={"10px 0"}
            >
              Welcome back! Please enter your details.
            </Typography>
            
            <Button
              onClick={handleGoogleSignIn}
              fullWidth
            >
              <img src={GoogleLogin} alt="Google Login"/>
            </Button>

            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="#" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
