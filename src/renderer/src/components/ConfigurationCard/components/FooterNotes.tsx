import React from 'react'

const FooterNotes: React.FC = () => {
  return (
    <div className="footer-notes">
      <div className="note-item">
        <span className="note-icon">?</span>
        <span className="note-text">
          Import Configuration: Select a JSON file to import and overwrite current settings
        </span>
      </div>
      <div className="note-item">
        <span className="note-icon">?</span>
        <span className="note-text">
          Export Configuration: Save current settings to a JSON file in the new standardized format
        </span>
      </div>
    </div>
  )
}

export default FooterNotes
