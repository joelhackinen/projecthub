import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material"
import { useUser } from "../hooks"

const UserEditProjects = ({ open, handleClose }) => {
  const user = useUser();
  return (
    <div>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Edit your personal information</DialogTitle>
        <DialogContent>
          <DialogContentText>Email</DialogContentText>
          {user.email}
        </DialogContent>
        <DialogContent>
          <DialogContentText>First Name</DialogContentText>
          {user.firstname}
        </DialogContent>
        <DialogContent>
          <DialogContentText>Last Name</DialogContentText>
          {user.lastname}
        </DialogContent>
        <DialogContent>
          <DialogContentText>Url</DialogContentText>
          {user.url_name ?? <span style={{ color: "red" }}>you haven't chosen url yet</span>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default UserEditProjects