// =====================================
// File: src/App.tsx
// =====================================
import React, { useState } from "react";
import { AnalysisPanel } from "./components/AnalysisPanel";
import { OnboardingOverlay } from "./components/OnboardingOverlay";

function App() {
  const [showOnboarding, setShowOnboarding] = useState(true);

  return (
    <>
      <AnalysisPanel />
      {showOnboarding && (
        <OnboardingOverlay onDone={() => setShowOnboarding(false)} />
      )}
    </>
  );
}

export default App;
