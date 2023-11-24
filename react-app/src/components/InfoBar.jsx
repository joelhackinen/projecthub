import { useRecoilState } from "recoil";
import { infoState } from "../infoAtom";
import Alert from "@mui/material/Alert";


// displays error and success messages

const style = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  position: "fixed",
  gap: "1rem",
  left: "50%",
  top: "10%",
  transform: "translate(-50%, -50%)",
  zIndex: 999
};

const InfoBar = () => {
  const [value, _setValue] = useRecoilState(infoState);

  return (
    <div style={style}>
      <ul>
        {value.map(({ messages, severity }, i) =>
          <Alert severity={severity} key={i}>
            {messages.map((m, i) => <div key={i}>{m}</div>)}
          </Alert>)}
      </ul>
    </div>
  );
};

export default InfoBar;