import { useMemo, useState } from "react";
import "./App.css";
import { BootSequence } from "./components/boot/BootSequence";
import { XMBContainer } from "./components/xmb";
import { loadSettings } from "./utils/storage";

// Profile data - could be imported from profile.json but keeping it simple
const PROFILE_NAME = "Afroze Amjad";
const PROFILE_TITLE = "Solution Architect";

function App() {
  const [bootComplete, setBootComplete] = useState(false);
  const [showXMB, setShowXMB] = useState(false);

  // Load saved theme for boot sequence
  const savedTheme = useMemo(() => loadSettings().theme, []);

  const handleBootComplete = () => {
    setBootComplete(true);
    // Small delay before showing XMB for smooth transition
    setTimeout(() => setShowXMB(true), 100);
  };

  return (
    <>
      {!bootComplete && <BootSequence onComplete={handleBootComplete} profileName={PROFILE_NAME} profileTitle={PROFILE_TITLE} theme={savedTheme} />}
      {showXMB && <XMBContainer />}
    </>
  );
}

export default App;
