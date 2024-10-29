import { useRef, useState } from "react";
import useAuth from "@/hooks/useAuth";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Link from "@mui/material/Link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

/**
 * UpdatePassword component allows users to update their password.
 * It includes form validation and error handling.
 */
export default function UpdatePassword() {
  const { updatePassword } = useAuth();
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [passwordError, setPasswordError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate form fields
    if (!passwordRef.current?.value || !confirmPasswordRef.current?.value) {
      setErrorMsg("Please complete all fields");
      setLoading(false);
      return;
    }
    if (passwordRef.current.value !== confirmPasswordRef.current.value) {
      setErrorMsg("Passwords don't match. Try again");
      setLoading(false);
      return;
    }
    if (passwordRef.current.value.length < 8) {
      setPasswordError(true);
      setLoading(false);
      return;
    }

    try {
      setErrorMsg("");
      const { error } = await updatePassword(passwordRef.current.value);
      if (!error) {
        navigate("/"); // Navigate to the home page on successful password update
      }
    } catch (error) {
      setErrorMsg("Error in Updating Password. Please try again");
    }

    setLoading(false);
  };

  /**
   * Handles changes in the password input field to reset the password error state.
   */
  const handlePasswordChange = () => {
    if (passwordError) {
      setPasswordError(false);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="90vh"
    >
      <Typography
        fontFamily="Inter"
        fontWeight={500}
        fontSize={25}
        textAlign="center"
        marginBottom={"5px"}
      >
        Set new password
      </Typography>
      <Typography
        fontFamily="Inter"
        fontWeight={400}
        fontSize={14}
        textAlign="center"
        marginBottom={"20px"}
        maxWidth={"30%"}
      >
        Your new password must be different to <br />
        previously used passwords.
      </Typography>
      {errorMsg && (
        <Alert
          severity="error"
          onClose={() => setErrorMsg("")}
          sx={{ marginBottom: "20px" }}
        >
          {errorMsg}
        </Alert>
      )}
      <Box sx={{ maxWidth: "18%" }}>
        <form onSubmit={handleSubmit}>
          <Typography
            fontFamily="Inter"
            fontWeight={400}
            fontSize={"0.9em"}
            textAlign="left"
            marginTop={"25px"}
            marginBottom={"4px"}
          >
            New Password
          </Typography>
          <TextField
            required
            fullWidth
            name="password"
            label=""
            type="password"
            id="password"
            autoComplete="password"
            inputRef={passwordRef}
            error={passwordError}
            helperText={passwordError ? "Must be at least 8 characters." : ""}
            onChange={handlePasswordChange}
            sx={{
              borderColor: passwordError ? "red" : "",
              "& .MuiInputBase-input": {
                height: "10px",
              },
            }}
          />
          <Typography
            fontFamily="Inter"
            fontWeight={400}
            fontSize={"0.9em"}
            textAlign="left"
            marginTop={"25px"}
            marginBottom={"4px"}
          >
            Confirm Password
          </Typography>
          <TextField
            required
            fullWidth
            name="confirmPassword"
            label=""
            type="password"
            id="confirmPassword"
            autoComplete=""
            inputRef={confirmPasswordRef}
            sx={{
              "& .MuiInputBase-input": {
                height: "10px",
              },
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              mt: 3,
              mb: 2,
              backgroundColor: "#3538CD",
              color: "#FFFFFF",
              borderRadius: "8px",
              height: "40px",
            }}
          >
            Reset password
          </Button>
        </form>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignSelf: "center",
          marginTop: "20px",
          marginBottom: "4px",
        }}
      >
        <Link
          href="/login"
          variant="body2"
          sx={{
            fontFamily: "Inter",
            fontWeight: "600",
            color: "#475467",
            fontSize: "0.9em",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          <ArrowBackIcon
            sx={{ fontSize: "medium", color: "#475467", marginRight: "5px" }}
          />
          Back to log in
        </Link>
      </Box>
    </Box>
  );
}
