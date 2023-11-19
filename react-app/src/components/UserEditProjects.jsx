import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material"
import { useUser } from "../hooks"

const UserEditProjects = ({open, handleClose}) => {
  const { repos } = useUser();
  return (
    <div>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Select projects you want to show</DialogTitle>
        <DialogContent>
          {repos.map(({id, name, full_name}) => (
            <DialogContentText key={id}>
              {name} {full_name && `(${full_name})`}
            </DialogContentText>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default UserEditProjects