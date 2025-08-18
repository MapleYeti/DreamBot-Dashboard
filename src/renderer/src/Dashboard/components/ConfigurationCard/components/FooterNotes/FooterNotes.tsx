import React from 'react'
import HelpText from '../../../../../components/HelpText'

const FooterNotes: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <HelpText icon="💡" variant="info">
        Configuration changes are applied when you click Save
      </HelpText>
      <HelpText icon="💡" variant="info">
        Bot configurations can be imported/exported for backup purposes
      </HelpText>
      <HelpText icon="💡" variant="info">
        DreamBot VIP features require an active subscription
      </HelpText>
    </div>
  )
}

export default FooterNotes
