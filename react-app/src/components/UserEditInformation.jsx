import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material"
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

  const saveAndClose = (e) => {
    e.preventDefault()
    
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

export default UserEditProjects