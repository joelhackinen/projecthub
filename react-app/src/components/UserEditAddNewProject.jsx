import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, TextField, Radio, RadioGroup, FormControlLabel, List, ListItem, Checkbox, ListItemText, IconButton, FormControl, FormGroup } from "@mui/material"
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useUser, useAddRepo } from "../hooks"
import { useState } from "react";

const UserEditAddNewProject = ({ open, handleClose }) => {
  const user = useUser();
  const addRepo = useAddRepo();
  const [nameError, setNameError] = useState(false)

  const [listOfLanguages, setListOfLanguages] = useState(['Python', 'Javascript', 'React', 'C++'])
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [customLanguage, setCustomLanguage] = useState('');

  const [newProject, setNewProject] = useState({
    //user_email: user.email, ---- ei tarvita, backendissä käyttäjä luetaan keksin tokenista
    owner: "",
    name: "",
    full_name: "",
    description: "",
    html_url: "",
    visible: true,
    created_at: 0
  })
  const handleChange = e => {
    setNewProject({
      ...newProject,
      [e.target.name]: e.target.value,
    })
  }
  const handleToggleLanguage = (value) => {
    const currentIndex = selectedLanguages.indexOf(value);
    const newSelectedLanguages = [...selectedLanguages];

    if (currentIndex === -1) {
      newSelectedLanguages.push(value);
    } else {
      newSelectedLanguages.splice(currentIndex, 1);
    }

    setSelectedLanguages(newSelectedLanguages);
  };
  const handleAddCustomLanguage = () => {
    if (customLanguage.trim() !== '' && listOfLanguages.indexOf(customLanguage) === -1) {
      setListOfLanguages([...listOfLanguages, customLanguage]);
      setCustomLanguage('');
    }
  };
  
  const addNewProject = (e) => {
    e.preventDefault()

    if (!newProject.name || newProject.name=='') {
      alert("Name can not be empty")
      setNameError(true)
      return
    }

    const projectName = newProject.name
    const description = newProject.description
    const created_at = newProject.created_at
    const visibility = newProject.visible
    const languages = selectedLanguages

    addRepo({
      ...newProject,
      visible: newProject.visible === "false" ? false : true,
      created_at: newProject.created_at.toString(), //pitää olla string toistaseks
    });
    handleClose()
  }

  return (
    <div>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Add a new project</DialogTitle>
        <form noValidate onSubmit={addNewProject}>
          <DialogContent> {/* Name */}
            <TextField
              id="name"
              name="name"
              label="Name"
              type="text"
              required
              error={nameError}
              fullWidth
              onChange={handleChange}
            />
          </DialogContent>
          <DialogContent> {/* created_at */}
            <DialogContentText>When did you create this project?</DialogContentText>
            <TextField
              id="created_at"
              name="created_at"
              type="date"
              fullWidth
              onChange={handleChange}
            />
          </DialogContent>
          <DialogContent> {/* Description */}
            <TextField
              id="description"
              name="description"
              type="text"
              label="Write a description of the project"
              multiline
              minRows={4}
              fullWidth
              onChange={handleChange}
            />
          </DialogContent>
          <DialogContent> {/* Visibility */}
            <DialogContentText>Visibility</DialogContentText>
            <RadioGroup
              id="visible"
              defaultValue={true}
              name="visible"
              onChange={handleChange}
            >
              <FormControlLabel value={true} control={<Radio />} label="Visible" />
              <FormControlLabel value={false} control={<Radio />} label="Hidden" />
            </RadioGroup>
          </DialogContent>
          <DialogContent> {/* Languages */}
            <DialogContentText>What languages/technologies did you use on this project?</DialogContentText>
            <List>
              {listOfLanguages.map((item) => (
                <ListItem key={item} dense button onClick={() => handleToggleLanguage(item)}>
                  <Checkbox
                    // edge="start"
                    size="small"
                    checked={selectedLanguages.indexOf(item) !== -1}
                    tabIndex={-1}
                    disableRipple
                  />
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
            <TextField
              size="small"
              variant="standard"
              label="Add another language"
              value={customLanguage}
              onChange={(e) => setCustomLanguage(e.target.value)}
            />
            <IconButton onClick={handleAddCustomLanguage}>
              <AddCircleOutlineIcon color="red"/>
            </IconButton>
          </DialogContent>

          <DialogActions>
            <Button type="submit">Add</Button>
            <Button onClick={handleClose}>cancel</Button>
          </DialogActions>
        </form>
        

        
      </Dialog>
    </div>
  )
}

export default UserEditAddNewProject