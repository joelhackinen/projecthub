import { useEffect, useRef, useState } from 'react'
import { useParams } from "react-router-dom";
import { useUpdateRepo, useDeleteRepo, useUser } from "../hooks";

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, DialogContentText, RadioGroup, FormControlLabel, Radio, List, ListItem, Checkbox, ListItemText, IconButton } from "@mui/material"
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const getRepoLanguagePercentage = (languages) => {
  const totalPtsArr = Object.values(languages);
  var sumTotalPts = 0;
  totalPtsArr.forEach((pts) => {
    sumTotalPts += pts;
  });

  const languagesPercentage = {};
  Object.keys(languages).forEach((lang) => {
    languagesPercentage[lang] = ((languages[lang] * 100) / sumTotalPts).toFixed(1);
  });

  return languagesPercentage;
}

const UserEditEditProject = ({ open, handleClose }) => {
  const { projectId } = useParams()
  const [updateRepo, isUpdateRepoPending] = useUpdateRepo()
  const [deleteRepo, isDeleteRepoPending] = useDeleteRepo()
  const user = useUser()

  const [newProject, setNewProject] = useState({})
  const [nameError, setNameError] = useState(false)
  const [nameErrorText, setNameErrorText] = useState("")
  const nameRef = useRef()

  const [listOfLanguages, setListOfLanguages] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [customLanguage, setCustomLanguage] = useState('');

  const repo = user.repos.find( repo => repo.id === Number(projectId) )

  useEffect(() => {
    setListOfLanguages(Object.keys(repo.languages))
    setSelectedLanguages(Object.keys(repo.languages))
  }, [])

  const handleToggleLanguage = (value) => {
    const currentIndex = selectedLanguages.indexOf(value);
    const newSelectedLanguages = [...selectedLanguages];

    if (currentIndex === -1) {
      newSelectedLanguages.push(value);
    } else {
      newSelectedLanguages.splice(currentIndex, 1);
    }
    setSelectedLanguages(newSelectedLanguages);
  }
  const handleAddCustomLanguage = () => {
    if (customLanguage.trim() !== '' && listOfLanguages.indexOf(customLanguage) === -1) {
      setListOfLanguages([...listOfLanguages, customLanguage])
      setSelectedLanguages([...selectedLanguages, customLanguage])
      setCustomLanguage('');
    }
  }

  const handleChange = e => {
    let value;
    //boolean values are turned into strings in onChange functions.. so change "true"->true
    e.target.name==="visible" ? value = e.target.value==="true" : value = e.target.value
    
    setNewProject({
      ...newProject,
      [e.target.name]: value,
    })
  }

  const handleDelete = () => {
    if (!confirm(`Are you sure you want to delete project ${repo.name}?`))
      return

    deleteRepo(projectId)
    handleClose()
  }

  const save = (e) => {
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

    updateRepo({
      ...repo,
      ...newProject,
      languages: languagesObj
    })
    handleClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      {repo ? <>
        <DialogTitle>Edit project {repo.name}</DialogTitle>
        <form noValidate onSubmit={save}>
          <DialogContent> {/* Name */}
            <TextField
              id="name"
              name="name"
              label="Name"
              defaultValue={repo.name}
              type="text"
              required
              fullWidth
              onChange={handleChange}
              error={nameError}
              inputRef={nameRef}
              helperText={nameErrorText}
            />
          </DialogContent>
          <DialogContent> {/* created_at */}
            <DialogContentText>When did you create this project?</DialogContentText>
            { 
            repo.github ?
            <p>
              {repo.created_at}
            </p>
            :
              <TextField
                id="created_at"
                name="created_at"
                defaultValue={repo.created_at} // TODO Default value
                type="date"
                fullWidth
                onChange={handleChange}
              />
            }
            
          </DialogContent>
          <DialogContent> {/* Description */}
            <TextField
              id="description"
              name="description"
              type="text"
              label="Write a description of the project"
              defaultValue={repo.description}
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
              defaultValue={repo.visible}
              name="visible"
              onChange={handleChange}
            >
              <FormControlLabel value={true} control={<Radio />} label="Visible" />
              <FormControlLabel value={false} control={<Radio />} label="Hidden" />
            </RadioGroup>
          </DialogContent>
          <DialogContent> {/* Languages */}
            <DialogContentText>Languages</DialogContentText>
            { repo.github ?
              <List>  
                {Object.entries(getRepoLanguagePercentage(repo.languages)).map(([key, value]) => (
                  <ListItem key={key}>
                    <p><strong>{key}:</strong> {value}%</p>
                  </ListItem>
                ))}
              </List>
              :
              <>
                <List>
                  {
                    listOfLanguages.map((item) => (
                      <ListItem key={item} dense button onClick={() => handleToggleLanguage(item)}>
                        <Checkbox
                          size="small"
                          checked={selectedLanguages.indexOf(item) !== -1}
                          tabIndex={-1}
                          disableRipple
                        />
                        <ListItemText primary={item} />
                      </ListItem>
                    ))
                  }
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
              </>
            }
          </DialogContent>
          <br />
          <DialogActions>
            <Button color="error" variant="outlined" onClick={handleDelete} startIcon={<DeleteIcon />}>Delete Project</Button>
            <div style={{flex: '1'}} />
            <Button variant="contained" type="submit">Save</Button>
            <Button onClick={handleClose}>Cancel</Button>
          </DialogActions>
        </form>
      </>
      : <strong>Loading ...</strong>}
    </Dialog>
  )
}

export default UserEditEditProject