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
        <DialogActions>
          <Button onClick={handleClose}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default UserEditProjects