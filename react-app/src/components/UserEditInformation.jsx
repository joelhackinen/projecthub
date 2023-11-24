import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material"
import { useUser, useUpdateProfile } from "../hooks"
import { useState } from "react";

const UserEditInformation = ({ open, handleClose }) => {
  const user = useUser();
  const [updateUser, isUpdateUserPending] = useUpdateProfile()
  const [errors, setErrors] = useState(
    { email: false,
      firstname: false,
      lastname: false,
      url_name: false 
    })
  const [newUser, setNewUser] = useState({})

  const handleChange = e => {
    setNewUser({
      ...newUser,
      [e.target.name]: e.target.value,
    })
  }
  
  const validateForm = () => {
    let alertMsg = ""
    // Email, firstname and lastname are valid if they haven't been touched or they are between 2-30 chars
    const validEmail = (newUser.email===undefined || newUser.email.length > 0)
    const validFirstname = newUser.firstname===undefined || (newUser.firstname.length <= 30 && newUser.firstname.length >= 2)
    const validLastname = newUser.lastname===undefined || (newUser.lastname.length <= 30 && newUser.lastname.length >= 2)
    // Url is valid if server has a value and it hasn't been touched, or if the new value is between 3-30 chars
    const validUrl = (newUser.url_name===undefined && user?.url_name ) || (newUser?.url_name?.length >= 3 && newUser?.url_name?.length <= 30)

    !validEmail ? alertMsg += "Email can't be empty.\n" : null
    !validFirstname ? alertMsg += "First name must be between 2 and 30 characters long.\n" : null
    !validLastname ? alertMsg += "Last  name must be between 2 and 30 characters long.\n" : null
    !validUrl ? alertMsg += "Url must be between 3 and 30 characters long.\n" : null

    setErrors({
      email: !validEmail,
      firstname: !validFirstname,
      lastname: !validLastname,
      url_name: !validUrl 
    })
    
    return alertMsg
  }
  const saveAndClose = (e) => {
    e.preventDefault()
    
    const alertMessage = validateForm()
    if (alertMessage !==  ""){
      alert(alertMessage)
      return
    }

    updateUser({
      ...user,
      ...newUser
    })
    handleClose()
  }

  return (
    <div>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Edit your personal information</DialogTitle>
        <form noValidate onSubmit={saveAndClose}>
          <DialogContent> {/* Email */}
            { <TextField
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
              />}
          </DialogContent>
          <DialogContent> {/* First Name */}
            { <TextField
                id="firstname"
                name="firstname"
                label="First Name"
                defaultValue={user.firstname}
                type="text"
                required
                fullWidth
                onChange={handleChange}
                error={errors.firstname}
              />}
          </DialogContent>
          <DialogContent> {/* Last Name */}
            { <TextField
                id="lastname"
                name="lastname"
                label="Last Name"
                defaultValue={user.lastname}
                type="text"
                required
                fullWidth
                onChange={handleChange}
                error={errors.lastname}
              />}
          </DialogContent>
          <DialogContent> {/* Url */}
            { <TextField
                id="url_name"
                name="url_name"
                label="URL"
                placeholder="Set URL"
                defaultValue={user.url_name}
                type="text"
                required
                fullWidth
                onChange={handleChange}
                helperText={user.url_name ? `Your public profiles URL is: /user/${user.url_name}` : `Your public profiles URL will be: /user/<URL>`}
                error={errors.url_name}
              />}
          </DialogContent>
          <DialogContent> {/* About */}
            { <TextField
                id="about"
                name="about"
                label="About"
                defaultValue={user.about}
                type="text"
                fullWidth
                onChange={handleChange}
              />}
          </DialogContent>
          <DialogActions>
            <Button variant="contained" type="submit">Save and close</Button>
            <Button onClick={handleClose}>cancel</Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  )
}

export default UserEditInformation