import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import UserEditEditProject from "./UserEditEditProject";
import UserEditInformation from "./UserEditInformation";
import UserEditAddNewProject from "./UserEditAddNewProject";

const UserEditLayout = () => {
  const { formParam } = useParams();

  const navigate = useNavigate();

  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    navigate("/dashboard");
    return null;
  };

  switch (formParam) {
    case "information":
      return <UserEditInformation open={open} handleClose={handleClose} />;
    case "addNewProject":
      return <UserEditAddNewProject open={open} handleClose={handleClose} />;
    case "project":
      return <UserEditEditProject open={open} handleClose={handleClose} />;
    default:
      return <></>;
  }
};

export default UserEditLayout;
