import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, IconButton } from "@mui/material"
import { useUser, useUpdateProfile } from "../hooks"
import { useState } from "react";

const UserEditProjects = ({ open, handleClose }) => {
  const user = useUser();
  const updateUser = useUpdateProfile()
  const [newUser, setNewUser] = useState({})

  const handleChange = e => {
    setNewUser({
      ...newUser,
      [e.target.name]: e.target.value,
    })
  }

  const saveAndClose = () => {
    if (newUser.email === '') {
      alert("Email can not be empty!")
      return;
    }
    // TODO: Error handling
    // for ex. show user if an url is already in use, now it throws just 500
    
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
        
        <DialogContent>
          <DialogContentText>Email</DialogContentText>
          { <input
              defaultValue={user.email}
              placeholder="Set email"
              onChange={handleChange}
              type="text"
              name="email"
              id="email"
            />}
        </DialogContent>
        <DialogContent>
          <DialogContentText>First Name</DialogContentText>
          { <input
              defaultValue={user.firstname}
              placeholder="Set first name"
              onChange={handleChange}
              type="text"
              name="firstname"
              id="firstname"
            />}
        </DialogContent>
        <DialogContent>
          <DialogContentText>Last Name</DialogContentText>
          { <input
              defaultValue={user.lastname}
              placeholder="Set last name"
              onChange={handleChange}
              type="text"
              name="lastname"
              id="lastname"
            />}
        </DialogContent>
        <DialogContent>
          <DialogContentText>Url</DialogContentText>
          { <input
              defaultValue={user.url_name}
              placeholder="Set url"
              onChange={handleChange}
              type="text"
              name="url_name"
              id="url_name"
            />}
        </DialogContent>
        <DialogActions>
          <Button onClick={saveAndClose}>Save and close</Button>
          <Button onClick={handleClose}>cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default UserEditProjects