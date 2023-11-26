import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from "@mui/material";


const PublicPageProject = () => {
  const { id } = useParams();
  const projects = useOutletContext();

  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  
  const handleClose = () => {
    setOpen(false)
    navigate("/user/villestrengell")
    return null
  }

  const plainLanguageList = (languages) => {
    return languages ? Object.keys(languages).join(', ') : ''
  }
  const languagePercentages = (languages) => {
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
    const languagesInPercentages = Object.entries(getRepoLanguagePercentage(languages)).sort((b, a) => a[1] - b[1])
    return languagesInPercentages.map(([key, value]) => (
      <div key={key}>
        <strong>{key}:</strong> {value}%
      </div>
    ))
  }

  const project = projects.find( p =>  p.id === Number(id) )

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>
        {project?.name}
      </DialogTitle>
      <div style={{ marginLeft: "1.5em", marginTop:"-1.3em" }}>
        <i>{project?.github ? project.html_url : <></>}</i>
      </div>
      <DialogContent>
        Description:
        <div style={{ marginLeft: "2em" }}>
          {project?.description}
        </div>
      </DialogContent>
      
      <DialogContent>
        Created at:
        <div style={{ marginLeft: "2em" }}>
          {project?.created_at}
        </div>
      </DialogContent>
      <DialogContent>Languages used:
        <div style={{ marginLeft: "2em" }}>
          {project?.github ? languagePercentages(project.languages) : plainLanguageList(project.languages)}
        </div>
      </DialogContent>
      
    </Dialog>
  )
};

export default PublicPageProject;