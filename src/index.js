import React, {useState, useEffect} from 'react'
import {useSecrets, SettingsView} from 'sanity-secrets'
import {ThemeProvider, Spinner, Flex} from '@sanity/ui'

import MonkeyLearnPane from './MonkeyLearnPane'

const namespace = 'sanity-plugin-monkeylearn-pane'
const pluginConfigKeys = [
  {
    key: 'mlApiKey',
    title: 'MonkeyLearn API key',
  },
]

export default function Pane(props) {
  const {loading, secrets} = useSecrets(namespace)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    setShowSettings(!secrets?.mlApiKey)
  }, [secrets])

  if (loading) {
    return (
      <ThemeProvider>
        <Flex padding={4} justify="center" align="center">
          <Spinner muted />
        </Flex>
      </ThemeProvider>
    )
  }

  if (showSettings) {
    return (
      <ThemeProvider>
        <SettingsView
          namespace={namespace}
          keys={pluginConfigKeys}
          onClose={() => setShowSettings(false)}
        />
      </ThemeProvider>
    )
  }

  return <MonkeyLearnPane {...props} mlApiKey={secrets.mlApiKey} />
}
