import { useRecoilState } from "recoil";
import { infoState } from "../infoAtom";
import Alert from "@mui/material/Alert";


// displays error and success messages

const style = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  position: "fixed",
  gap: "0.5rem",
  left: "50%",
  top: "10%",
  transform: "translate(-50%, -50%)",
  zIndex: 999
};

const InfoBar = () => {
  const [value, _setValue] = useRecoilState(infoState);

  return (
    <div style={style}>
      {value.map(({ messages, severity, id }) =>
        <Alert severity={severity} key={id}>
          {messages ? messages.map((m, i) => <div key={`${id}-${i}`}>{m}</div>) : "no message"}
        </Alert>)}
    </div>
  );
};

export default InfoBar;