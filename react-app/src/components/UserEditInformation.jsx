import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { useUser, useUpdateProfile } from "../hooks";
import { useState, useRef } from "react";

const UserEditInformation = ({ open, handleClose }) => {
  const user = useUser();
  const [updateUser, isUpdateUserPending] = useUpdateProfile();
  const emailRef = useRef();
  const firstnameRef = useRef();
  const lastnameRef = useRef();
  const urlRef = useRef();

  const [errors, setErrors] = useState({
    email: false,
    firstname: false,
    lastname: false,
    url_name: false,
  });
  const [errorTexts, setErrorTexts] = useState({
    email: "",
    firstname: "",
    lastname: "",
    url_name: "",
  });

  const [newUser, setNewUser] = useState({});

  const handleChange = (e) => {
    setNewUser({
      ...newUser,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const validateEmail = (email) => {
      return email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      );
    };
    const focusInputs = (
      validEmail,
      validFirstname,
      validLastname,
      validUrl,
    ) => {
      if (!validEmail) emailRef.current.focus();
      else if (!validFirstname) firstnameRef.current.focus();
      else if (!validLastname) lastnameRef.current.focus();
      else if (!validUrl) urlRef.current.focus();
    };

    let isError = false;
    const validEmail =
      newUser.email === undefined || validateEmail(newUser.email);
    // firstname and lastname are valid if they haven't been touched or they are between 2-30 chars
    const validFirstname =
      newUser.firstname === undefined ||
      (newUser.firstname.length <= 30 && newUser.firstname.length >= 2);
    const validLastname =
      newUser.lastname === undefined ||
      (newUser.lastname.length <= 30 && newUser.lastname.length >= 2);
    // Url is valid if server has a value and it hasn't been touched, or if the new value is between 3-30 chars
    const validUrl =
      (newUser.url_name === undefined && user?.url_name) ||
      (newUser?.url_name?.length >= 3 && newUser?.url_name?.length <= 30);

    isError = validEmail && validFirstname && validLastname && validUrl;

    focusInputs(validEmail, validFirstname, validLastname, validUrl);

    setErrors({
      email: !validEmail,
      firstname: !validFirstname,
      lastname: !validLastname,
      url_name: !validUrl,
    });
    setErrorTexts({
      email: validEmail ? "" : "Invalid email.",
      firstname: validFirstname
        ? ""
        : "First name must be between 2 and 30 characters long.",
      lastname: validLastname
        ? ""
        : "Last  name must be between 2 and 30 characters long.",
      url_name: validUrl ? "" : "Url must be between 3 and 30 characters long.",
    });

    return isError;
  };

  const saveAndClose = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    updateUser({
      ...user,
      ...newUser,
    });
    handleClose();
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Edit your personal information</DialogTitle>
        <form noValidate onSubmit={saveAndClose}>
          <DialogContent>
            {" "}
            {/* Email */}
            {
              <TextField
                id="email"
                name="email"
                label="Email"
                defaultValue={user.email}
                type="text"
                required
                fullWidth
                onChange={handleChange}
                margin="dense"
                error={errors.email}
                helperText={errorTexts.email}
                inputRef={emailRef}
              />
            }
          </DialogContent>
          <DialogContent>
            {" "}
            {/* First Name */}
            {
              <TextField
                id="firstname"
                name="firstname"
                label="First Name"
                defaultValue={user.firstname}
                type="text"
                required
                fullWidth
                onChange={handleChange}
                error={errors.firstname}
                helperText={errorTexts.firstname}
                inputRef={firstnameRef}
              />
            }
          </DialogContent>
          <DialogContent>
            {" "}
            {/* Last Name */}
            {
              <TextField
                id="lastname"
                name="lastname"
                label="Last Name"
                defaultValue={user.lastname}
                type="text"
                required
                fullWidth
                onChange={handleChange}
                error={errors.lastname}
                helperText={errorTexts.lastname}
                inputRef={lastnameRef}
              />
            }
          </DialogContent>
          <DialogContent>
            {" "}
            {/* Url */}
            {
              <TextField
                id="url_name"
                name="url_name"
                label="URL"
                placeholder="Set URL"
                defaultValue={user.url_name}
                type="text"
                required
                fullWidth
                onChange={handleChange}
                helperText={
                  errors.url_name
                    ? errorTexts.url_name
                    : user.url_name
                    ? `Your public profiles URL is: https://projecthub.fly.dev/user/${user.url_name}`
                    : `Your public profiles URL will be: https://projecthub.fly.dev/user/<URL>`
                }
                error={errors.url_name}
                inputRef={urlRef}
              />
            }
          </DialogContent>
          <DialogContent>
            {" "}
            {/* About */}
            {
              <TextField
                id="about"
                name="about"
                label="About me"
                multiline
                minRows={2}
                defaultValue={user.about}
                type="text"
                fullWidth
                onChange={handleChange}
              />
            }
          </DialogContent>
          <DialogActions>
            <Button variant="contained" type="submit">
              Save and close
            </Button>
            <Button onClick={handleClose}>cancel</Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default UserEditInformation;
