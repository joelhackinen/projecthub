import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, DialogContentText, RadioGroup, FormControlLabel, Radio, List, ListItem } from "@mui/material"
import { useParams } from "react-router-dom";
import { useUpdateRepo, useUser } from "../hooks";
import { useState } from 'react'

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
  const user = useUser()
  const [newProject, setNewProject] = useState({})
  const [nameError, setNameError] = useState(false)

  const repo = user.repos.find( repo => repo.id === Number(projectId) )

  const handleChange = e => {
    let value;

    //boolean values are turned into strings in onChange functions.. so change "true"->true
    e.target.name==="visible" ? value = e.target.value==="true" : value = e.target.value
    
    setNewProject({
      ...newProject,
      [e.target.name]: value,
    })
  }

  const save = (e) => {
    e.preventDefault()
    if (!(newProject.name===undefined || newProject.name.length > 0)) {
      alert("Name can't be empty!")
      setNameError(true)
      return
    }
    updateRepo({
      ...repo,
      ...newProject
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
                From github, just show languages and their percentages
                {Object.entries(getRepoLanguagePercentage(repo.languages)).map(([key, value]) => (
                    <ListItem key={key}>
                      <p><strong>{key}:</strong> {value}%</p>
                    </ListItem>
                  ))}
              </List>
              :
              "Not from github. Show current languages and let them add/remove to/from the list" }
          </DialogContent>
          <DialogActions>
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