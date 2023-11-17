import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material"

const UserEditProjects = ({open, handleClose}) => {
  return (
    <div>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Select projects you want to show</DialogTitle>
        <DialogContent>
          <DialogContentText>Projecti 1</DialogContentText>
          <DialogContentText>Projecti 2</DialogContentText>
          <DialogContentText>Projecti 3</DialogContentText>
          <DialogContentText>Projecti 4</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default UserEditProjects