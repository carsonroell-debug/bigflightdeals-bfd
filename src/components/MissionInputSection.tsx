import { useState } from 'react';
import { parseMissionText } from '../utils/missionParser';
import { getMissionSuggestions } from '../utils/missionSuggestions';
import { executeMission } from '../utils/executeMission';
import { track } from '../utils/analytics';
import type { MissionInput } from '../types/mission';
import './MissionInputSection.css';

interface MissionInputSectionProps {
  onRunMission: (mission: MissionInput) => void;
}

const MissionInputSection = ({ onRunMission }: MissionInputSectionProps) => {
  const [inputText, setInputText] = useState('');
  const [suggestions, setSuggestions] = useState<MissionInput[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    
    // Parse the input
    const parsed = parseMissionText(inputText);
    
    // Generate suggestions
    const generated = getMissionSuggestions(parsed);
    
    setSuggestions(generated);
    setIsLoading(false);

    // Track generation
    track('mission_suggestions_generated', {
      inputLength: inputText.length,
      suggestionCount: generated.length,
    });
  };

  const handleRunMission = (mission: MissionInput) => {
    // Execute mission (writes to localStorage, tracks analytics)
    const result = executeMission(mission, { openModal: true });

    // Track suggested mission run
    track('mission_suggested_run', {
      id: mission.id,
      origin: mission.originCode,
      destination: mission.destinationCode,
    });

    // Open modal with the normalized mission
    onRunMission(result.mission);
  };

  return (
    <section id="mission-input" className="mission-input-section">
      <div className="mission-input-container">
        <h2 className="section-title">Tell me your mission.</h2>
        <p className="section-subtitle">
          Describe what you're looking for in natural language. We'll suggest routes that match.
        </p>
        
        <div className="mission-input-form">
          <textarea
            className="mission-textarea"
            placeholder="Example: $1200, 10 days in March, warm, good Wi-Fi. Leaving Toronto."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={3}
          />
          <button
            className="mission-generate-button"
            onClick={handleGenerate}
            disabled={!inputText.trim() || isLoading}
            type="button"
          >
            {isLoading ? 'Generating...' : 'Generate mission options'}
          </button>
        </div>

        {suggestions.length > 0 && (
          <div className="mission-suggestions">
            <h3 className="suggestions-title">Suggested Routes</h3>
            <div className="suggestions-grid">
              {suggestions.map((mission) => (
                <div key={mission.id} className="suggestion-card">
                  <div className="suggestion-route">
                    <span className="suggestion-city">{mission.originLabel}</span>
                    <span className="suggestion-arrow">→</span>
                    <span className="suggestion-city">{mission.destinationLabel}</span>
                  </div>
                  {mission.budget && (
                    <div className="suggestion-budget">
                      Budget: {mission.currency} {mission.budget}
                    </div>
                  )}
                  <p className="suggestion-rationale">{mission.notes}</p>
                  <button
                    className="suggestion-button"
                    onClick={() => handleRunMission(mission)}
                    type="button"
                  >
                    Run mission
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default MissionInputSection;
