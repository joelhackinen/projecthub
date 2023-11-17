import { useNavigate, useParams } from "react-router-dom";
import { useState } from 'react'
import UserEditProjects from "./UserEditProjects"
import UserEditInformation from "./UserEditInformation"

const style = {
  // eslint-disable-next-line
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const UserEditLayout = () => {
  const { formParam } = useParams();
  const navigate = useNavigate();

  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false)
    navigate("/dashboard")
    return null
  }
  
  switch (formParam) {
    case "information":
      return <UserEditInformation open={open} handleClose={handleClose} />
    case "projects":
      return <UserEditProjects open={open} handleClose={handleClose} />
    default:
      return <div>Incorrect params</div>
  }
};

export default UserEditLayout;