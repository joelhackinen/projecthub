import { useRecoilState } from "recoil";
import { infoState } from "../infoAtom";
import Alert from "@mui/material/Alert";
import { styled } from "@mui/material";

// displays error and success messages

const style = {
  display: "flex",
  flexDirection: "column-reverse",
  alignItems: "center",
  position: "fixed",
  gap: "0.5rem",
  left: "50%",
  top: "10%",
  transform: "translate(-50%, -50%)",
  zIndex: 999,
};

const SlimAlert = styled(Alert)({
  borderRadius: "2rem",
  paddingTop: 1,
  paddingBottom: 1,
});

const InfoBar = () => {
  const [state, setState] = useRecoilState(infoState);

  const handleClose = (id) => {
    setState(state.filter((item) => item.id !== id));
  };

  return (
    <div style={style}>
      {[...state]
        .reverse()
        .slice(0, 5)
        .map(({ messages, severity, id }, idx) => (
          <SlimAlert
            sx={{ boxShadow: 10 }}
            key={id}
            severity={severity}
            onClose={() => handleClose(id)}
          >
            {messages
              ? messages.map((m, i) => <div key={`${id}-${i}`}>{m}</div>)
              : "no message"}
          </SlimAlert>
        ))}
    </div>
  );
};

export default InfoBar;
