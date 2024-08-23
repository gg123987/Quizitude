import { useRef, useState } from "react";
import useAuth from "@/hooks/useAuth";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Link from "@mui/material/Link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { supabase } from "@/utils/supabase";
import mailsent from "@/assets/MailSent.svg";

export default function PasswordReset() {
  const { passwordReset } = useAuth();
  const emailRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [msg, setMsg] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [confirmation, setConfirmation] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [allowResubmit, setallowResubmit] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data: users } = await supabase
        .from("users")
        .select("email")
        .eq("email", emailRef.current.value)
        .single();

      const count = users ? 1 : 0;

      if (count > 0) {
        setEmailError(false);
      } else {
        setEmailError(true);
        setLoading(false);
        return;
      }

      const { error } = await passwordReset(emailRef.current.value);
      if (!error) {
        setEmailInput(emailRef.current.value);
        setConfirmation(true);
      } else {
        setErrorMsg(error.message);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleResubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
  
      const { error: reError } = await passwordReset(emailInput);
      if (!reError) {
        setEmailInput(emailInput);
        setallowResubmit(false);
      } else {
        setErrorMsg(reError.message);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };  

  if (confirmation) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="90vh"
      >
        <img src={mailsent} alt="Mail Sent" />
        <Typography
          fontFamily="Inter"
          fontWeight={500}
          fontSize={25}
          textAlign="center"
          mt="10px"
          marginBottom={"5px"}
        >
          Reset Link Sent!
        </Typography>
        <Typography
          fontFamily="Inter"
          fontWeight={400}
          fontSize={14}
          textAlign="center"
          marginBottom={"20px"}
          maxWidth={"30%"}
        >
          Check your email. We sent a password reset link to <br />
          {emailInput}
        </Typography>
        {msg && (
          <Alert
            severity="success"
            onClose={() => setMsg("")}
            sx={{ marginBottom: "20px", mt: 3 }}
          >
            {msg}
          </Alert>
        )}
        {allowResubmit && (
          <form onSubmit={handleResubmit}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 2,
                mb: 2,
                backgroundColor: "#3538CD",
                color: "#FFFFFF",
                borderRadius: "8px",
                height: "40px",
                width: "300px",
              }}
            >
              Resend Link
            </Button>
          </form>
        )}
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
        Forgot Password?
      </Typography>
      <Typography
        fontFamily="Inter"
        fontWeight={400}
        fontSize={14}
        textAlign="center"
        marginBottom={"20px"}
        maxWidth={"30%"}
      >
        Please enter your email address and we will <br />
        send you the reset password instructions
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
            disabled={loading}
            inputRef={emailRef}
            error={emailError}
            helperText={
              emailError
                ? "We do not recognize this email. Please try again"
                : ""
            }
            sx={{
              borderColor: emailError ? "red" : "",
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
