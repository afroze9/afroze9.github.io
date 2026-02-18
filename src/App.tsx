import { useMemo, useState } from "react";
import "./App.css";
import { BootSequence } from "./components/boot/BootSequence";
import { XMBContainer } from "./components/xmb";
import { WaveBackground } from "./components/xmb/WaveBackground";
import { LayoutProvider } from "./context/LayoutContext";
import type { ThemeColor } from "./types";
import { loadSettings } from "./utils/storage";

// Profile data - could be imported from profile.json but keeping it simple
const PROFILE_NAME = "Afroze Amjad";
const PROFILE_TITLE = "Solution Architect";

function App() {
  const [bootComplete, setBootComplete] = useState(false);
  const [showXMB, setShowXMB] = useState(false);

  const savedSettings = useMemo(() => loadSettings(), []);
  const [theme, setTheme] = useState<ThemeColor>(savedSettings.theme);

  const handleBootComplete = () => {
    setBootComplete(true);
    // Small delay before showing XMB for smooth transition
    setTimeout(() => setShowXMB(true), 100);
  };

  return (
    <LayoutProvider>
      {/* Persistent background shared by boot profile screen and XMB.
          Ribbons always animate — the black BootSequence overlay hides them
          during early boot phases; they're fully built up by the profile phase. */}
      <WaveBackground theme={theme} showRibbons={showXMB} />
      {!bootComplete && (
        <BootSequence
          onComplete={handleBootComplete}
          profileName={PROFILE_NAME}
          profileTitle={PROFILE_TITLE}
        />
      )}
      {showXMB && (
        <XMBContainer
          initialSettings={savedSettings}
          onThemeChange={setTheme}
        />
      )}
    </LayoutProvider>
  );
}

export default App;
