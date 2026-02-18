import { useCallback, useEffect, useState } from "react";
import "./BootSequence.css";

interface BootSequenceProps {
  onComplete: () => void;
  profileName: string;
  profileTitle: string;
}

type BootPhase = "black" | "warning" | "logo" | "loading" | "profile" | "complete";

const FADE_DURATION = 500; // ms for fade transitions

export function BootSequence({ onComplete, profileName, profileTitle }: BootSequenceProps) {
  const [phase, setPhase] = useState<BootPhase>("black");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [profileSelected, setProfileSelected] = useState(false);

  // Transition to a new phase with fade
  const transitionTo = (newPhase: BootPhase) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setPhase(newPhase);
      setIsTransitioning(false);
    }, FADE_DURATION);
  };

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    // Phase timing (accounting for fade transitions)
    // black -> warning
    timers.push(setTimeout(() => transitionTo("warning"), 500));
    // warning -> logo
    timers.push(setTimeout(() => transitionTo("logo"), 3500));
    // logo -> loading
    timers.push(setTimeout(() => transitionTo("loading"), 6500));
    // loading -> profile
    timers.push(setTimeout(() => transitionTo("profile"), 8500));

    return () => timers.forEach(clearTimeout);
  }, []);

  const handleProfileSelect = useCallback(() => {
    if (isTransitioning || profileSelected) return; // Prevent double-triggering
    setProfileSelected(true);
    // Show selected state briefly before fading out
    setTimeout(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setPhase("complete");
        onComplete();
      }, FADE_DURATION + 300);
    }, 400); // Show selected state for 400ms
  }, [isTransitioning, profileSelected, onComplete]);

  // Handle Enter key on profile screen
  useEffect(() => {
    if (phase !== "profile") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleProfileSelect();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [phase, handleProfileSelect]);

  if (phase === "complete") {
    return null;
  }

  return (
    <div className="boot-sequence">
      {/* Phase content with fade */}
      <div className={`boot-phase ${isTransitioning ? "fade-out" : "fade-in"}`}>
        {/* Initial black screen */}
        {phase === "black" && <div className="boot-black" />}

        {/* Warning/disclaimer screen */}
        {phase === "warning" && (
          <div className="boot-warning">
            <div className="warning-content">
              <p className="warning-text">
                This is a portfolio website designed as an homage to the PlayStation 3's iconic XrossMediaBar interface.
              </p>
              <p className="warning-subtext">Navigate with arrow keys or mouse. Press Enter to select.</p>
            </div>
          </div>
        )}

        {/* Logo screen */}
        {phase === "logo" && (
          <div className="boot-logo">
            <div className="logo-container">
              <div className="logo-icon">
                <svg viewBox="0 0 100 100" className="ps-shapes">
                  {/* Triangle */}
                  <polygon
                    points="25,70 50,30 75,70"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="shape shape-triangle"
                  />
                  {/* Circle */}
                  <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="2" className="shape shape-circle" />
                  {/* Cross */}
                  <g className="shape shape-cross">
                    <line x1="35" y1="35" x2="65" y2="65" stroke="currentColor" strokeWidth="2" />
                    <line x1="65" y1="35" x2="35" y2="65" stroke="currentColor" strokeWidth="2" />
                  </g>
                  {/* Square */}
                  <rect
                    x="35"
                    y="35"
                    width="30"
                    height="30"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="shape shape-square"
                  />
                </svg>
              </div>
              <div className="logo-text">
                <span className="logo-line1">AFROZE AMJAD</span>
                <span className="logo-line2">Portfolio Experience</span>
              </div>
            </div>
          </div>
        )}

        {/* Loading screen */}
        {phase === "loading" && (
          <div className="boot-loading">
            <div className="loading-wave">
              <div className="wave-bar" style={{ animationDelay: "0s" }} />
              <div className="wave-bar" style={{ animationDelay: "0.1s" }} />
              <div className="wave-bar" style={{ animationDelay: "0.2s" }} />
              <div className="wave-bar" style={{ animationDelay: "0.3s" }} />
              <div className="wave-bar" style={{ animationDelay: "0.4s" }} />
            </div>
            <p className="loading-text">Loading...</p>
          </div>
        )}

        {/* Profile selector */}
        {phase === "profile" && (
          <div className="boot-profile">
            <h1 className="profile-title">Select User</h1>
            <div className="profile-selector">
              <button className={`profile-card ${profileSelected ? "selected" : ""}`} onClick={handleProfileSelect}>
                <div className="profile-avatar">
                  <svg viewBox="0 0 100 100" fill="currentColor">
                    <circle cx="50" cy="35" r="20" />
                    <ellipse cx="50" cy="85" rx="35" ry="25" />
                  </svg>
                </div>
                <div className="profile-info">
                  <span className="profile-name">{profileName}</span>
                  <span className="profile-subtitle">{profileTitle}</span>
                </div>
              </button>
            </div>
            <p className="profile-hint">Click to continue</p>
          </div>
        )}
      </div>
    </div>
  );
}
