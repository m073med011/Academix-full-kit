import { FaChartPie, FaCog, FaCommentDots, FaThLarge, FaUser, FaUsers, FaWifi } from "react-icons/fa";

export function NeuralNetwork() {
  return (
    <div className="nerve-network">
      {/* SVG Connections */}
      <svg className="nerve-connections-svg" viewBox="0 0 500 500" preserveAspectRatio="xMidYMid meet">
        {/* Base static lines */}
        <line x1="-28" y1="237" x2="250" y2="250" stroke="rgba(139, 92, 246, 0.2)" strokeWidth="3" className="nerve-line"/>
        <line x1="250" y1="250" x2="222" y2="62" stroke="rgba(100, 120, 150, 0.2)" strokeWidth="2" className="nerve-line"/>
        <line x1="250" y1="250" x2="422" y2="122" stroke="rgba(100, 120, 150, 0.2)" strokeWidth="2" className="nerve-line"/>
        <line x1="250" y1="250" x2="347" y2="437" stroke="rgba(100, 120, 150, 0.2)" strokeWidth="2" className="nerve-line"/>
        <line x1="250" y1="250" x2="72" y2="372" stroke="rgba(100, 120, 150, 0.2)" strokeWidth="2" className="nerve-line"/>
        <line x1="250" y1="250" x2="42" y2="122" stroke="rgba(100, 120, 150, 0.2)" strokeWidth="2" className="nerve-line"/>
        <line x1="222" y1="62" x2="42" y2="122" stroke="rgba(100, 120, 150, 0.15)" strokeWidth="1.5" className="nerve-line"/>
        <line x1="222" y1="62" x2="422" y2="122" stroke="rgba(100, 120, 150, 0.15)" strokeWidth="1.5" className="nerve-line"/>
        <line x1="422" y1="122" x2="347" y2="437" stroke="rgba(100, 120, 150, 0.15)" strokeWidth="1.5" className="nerve-line"/>
        <line x1="347" y1="437" x2="72" y2="372" stroke="rgba(100, 120, 150, 0.15)" strokeWidth="1.5" className="nerve-line"/>
        <line x1="72" y1="372" x2="42" y2="122" stroke="rgba(100, 120, 150, 0.15)" strokeWidth="1.5" className="nerve-line"/>

        {/* Phase 1: Person -> Center */}
        <line x1="-28" y1="237" x2="250" y2="250" stroke="rgba(139, 92, 246, 1)" strokeWidth="3" className="nerve-line-glow electric-phase1"/>

        {/* Phase 2: Center -> All outer nodes */}
        <line x1="250" y1="250" x2="222" y2="62" stroke="rgba(6, 182, 212, 0.9)" strokeWidth="2.5" className="nerve-line-glow electric-phase2"/>
        <line x1="250" y1="250" x2="422" y2="122" stroke="rgba(6, 182, 212, 0.9)" strokeWidth="2.5" className="nerve-line-glow electric-phase2"/>
        <line x1="250" y1="250" x2="347" y2="437" stroke="rgba(6, 182, 212, 0.9)" strokeWidth="2.5" className="nerve-line-glow electric-phase2"/>
        <line x1="250" y1="250" x2="72" y2="372" stroke="rgba(6, 182, 212, 0.9)" strokeWidth="2.5" className="nerve-line-glow electric-phase2"/>
        <line x1="250" y1="250" x2="42" y2="122" stroke="rgba(6, 182, 212, 0.9)" strokeWidth="2.5" className="nerve-line-glow electric-phase2"/>

        {/* Phase 3: All outer nodes -> Center */}
        <line x1="222" y1="62" x2="250" y2="250" stroke="rgba(139, 92, 246, 0.9)" strokeWidth="2.5" className="nerve-line-glow electric-phase3"/>
        <line x1="422" y1="122" x2="250" y2="250" stroke="rgba(139, 92, 246, 0.9)" strokeWidth="2.5" className="nerve-line-glow electric-phase3"/>
        <line x1="347" y1="437" x2="250" y2="250" stroke="rgba(139, 92, 246, 0.9)" strokeWidth="2.5" className="nerve-line-glow electric-phase3"/>
        <line x1="72" y1="372" x2="250" y2="250" stroke="rgba(139, 92, 246, 0.9)" strokeWidth="2.5" className="nerve-line-glow electric-phase3"/>
        <line x1="42" y1="122" x2="250" y2="250" stroke="rgba(139, 92, 246, 0.9)" strokeWidth="2.5" className="nerve-line-glow electric-phase3"/>

        {/* Phase 4: Center -> Person */}
        <line x1="250" y1="250" x2="-28" y2="237" stroke="rgba(139, 92, 246, 1)" strokeWidth="3" className="nerve-line-glow electric-phase4"/>
      </svg>

      {/* Nodes */}
      {/* Center Node */}
      <div className="nerve-node center center-pulse">
        <svg className="node-border-progress" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="38" fill="none" stroke="rgba(139, 92, 246, 0.2)" strokeWidth="2"/>
          <circle cx="40" cy="40" r="38" fill="none" stroke="rgba(6, 182, 212, 1)" strokeWidth="3" 
            className="progress-circle center-progress" strokeLinecap="round"/>
        </svg>
        <FaThLarge />
      </div>

      {/* Outer Nodes */}
      <div className="nerve-node outer node-1 outer-pulse">
        <svg className="node-border-progress" viewBox="0 0 62 62">
          <circle cx="31" cy="31" r="29" fill="none" stroke="rgba(139, 92, 246, 0.2)" strokeWidth="2"/>
          <circle cx="31" cy="31" r="29" fill="none" stroke="rgba(6, 182, 212, 1)" strokeWidth="2.5" 
            className="progress-circle outer-progress" strokeLinecap="round"/>
        </svg>
        <FaWifi />
      </div>

      <div className="nerve-node outer node-2 outer-pulse">
        <svg className="node-border-progress" viewBox="0 0 62 62">
          <circle cx="31" cy="31" r="29" fill="none" stroke="rgba(139, 92, 246, 0.2)" strokeWidth="2"/>
          <circle cx="31" cy="31" r="29" fill="none" stroke="rgba(6, 182, 212, 1)" strokeWidth="2.5" 
            className="progress-circle outer-progress" strokeLinecap="round"/>
        </svg>
        <FaChartPie />
      </div>

      <div className="nerve-node outer node-4 outer-pulse">
        <svg className="node-border-progress" viewBox="0 0 62 62">
          <circle cx="31" cy="31" r="29" fill="none" stroke="rgba(139, 92, 246, 0.2)" strokeWidth="2"/>
          <circle cx="31" cy="31" r="29" fill="none" stroke="rgba(6, 182, 212, 1)" strokeWidth="2.5" 
            className="progress-circle outer-progress" strokeLinecap="round"/>
        </svg>
        <FaCommentDots />
      </div>

      <div className="nerve-node outer node-5 outer-pulse">
        <svg className="node-border-progress" viewBox="0 0 62 62">
          <circle cx="31" cy="31" r="29" fill="none" stroke="rgba(139, 92, 246, 0.2)" strokeWidth="2"/>
          <circle cx="31" cy="31" r="29" fill="none" stroke="rgba(6, 182, 212, 1)" strokeWidth="2.5" 
            className="progress-circle outer-progress" strokeLinecap="round"/>
        </svg>
        <FaUsers />
      </div>

      <div className="nerve-node outer node-6 outer-pulse">
        <svg className="node-border-progress" viewBox="0 0 62 62">
          <circle cx="31" cy="31" r="29" fill="none" stroke="rgba(139, 92, 246, 0.2)" strokeWidth="2"/>
          <circle cx="31" cy="31" r="29" fill="none" stroke="rgba(6, 182, 212, 1)" strokeWidth="2.5" 
            className="progress-circle outer-progress" strokeLinecap="round"/>
        </svg>
        <FaCog />
      </div>

      {/* Person Node */}
      <div className="nerve-node outer node-7 person-pulse">
        <svg className="node-border-progress" viewBox="0 0 62 62">
          <circle cx="31" cy="31" r="29" fill="none" stroke="rgba(139, 92, 246, 0.2)" strokeWidth="2"/>
          <circle cx="31" cy="31" r="29" fill="none" stroke="rgba(139, 92, 246, 1)" strokeWidth="3" 
            className="progress-circle person-progress" strokeLinecap="round"/>
        </svg>
        <FaUser />
      </div>
    </div>
  );
}
