import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, TextField, Radio, RadioGroup, FormControlLabel, List, ListItem, Checkbox, ListItemText, IconButton } from "@mui/material"
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useAddRepo } from "../hooks"
import { useState, useRef } from "react";

const UserEditAddNewProject = ({ open, handleClose }) => {
  const [addRepo, isAddRepoPending] = useAddRepo();
  const [nameError, setNameError] = useState(false)
  const [nameErrorText, setNameErrorText] = useState("")
  const nameRef = useRef()
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
    visible: "true",
    created_at: "",
    languages: [],
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
      setSelectedLanguages([...selectedLanguages, customLanguage])
      setCustomLanguage('');
    }
  };
  
  const addNewProject = (e) => {
    e.preventDefault()
    const invalidName = !(newProject.name===undefined || (newProject.name.length <= 30 && newProject.name.length >= 2))
    if (invalidName) {
      setNameError(true)
      setNameErrorText(invalidName ? "Name must be between 2 and 30 characters long." : "")
      nameRef.current.focus()
      return
    }

    const languagesObj = {};
    selectedLanguages.forEach(lang => languagesObj[lang] = 0);

    addRepo({
      ...newProject,
      visible: JSON.parse(newProject.visible),
      created_at: newProject.created_at,
      languages: languagesObj,
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
              helperText={nameErrorText}
              fullWidth
              onChange={handleChange}
              inputRef={nameRef}
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
            <Button variant="contained" type="submit">Add</Button>
            <Button onClick={handleClose}>cancel</Button>
          </DialogActions>
        </form>
        

        
      </Dialog>
    </div>
  )
}

export default UserEditAddNewProject