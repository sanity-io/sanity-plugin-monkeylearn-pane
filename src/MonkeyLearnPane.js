import PropTypes from 'prop-types'
import React, {useMemo, useState, useEffect} from 'react'
import MonkeyLearn from 'monkeylearn'
import {
  ThemeProvider,
  studioTheme,
  Grid,
  Inline,
  Button,
  Card,
  Text,
  Label,
  Stack,
} from '@sanity/ui'
import delve from 'dlv'
import {FiExternalLink, FiX} from 'react-icons/fi'

import toPlainText from './helpers/toPlainText'
import GetExtraction from './GetExtraction'

function MonkeyLearnPane({document: sanityDocument, options}) {
  const {extractors, apiKey, field, displayComponent} = options
  const ml = useMemo(() => new MonkeyLearn(apiKey), [])

  const {displayed} = sanityDocument
  const {_id} = displayed
  const text = delve(displayed, field)
  const docId = _id.replace(`drafts.`, ``)

  // eslint-disable-next-line camelcase
  const data = useMemo(() => [{external_id: docId, text: toPlainText(text)}], [displayed])

  const [allExtractors, setAllExtractors] = useState([])
  const [activeExtractors, setActiveExtractors] = useState({})

  useEffect(() => {
    // Get all extractors from API
    if (!allExtractors.length) {
      ml.extractors
        .list()
        .then((response) => setAllExtractors(response.body))
        // eslint-disable-next-line no-console
        .catch((error) => console.log(error))
    }
  }, [ml])

  if (!apiKey) return `No MonkeyLearn API Key Provided`

  return (
    <ThemeProvider theme={studioTheme}>
      <Grid columns={1} gap={4} padding={4}>
        {allExtractors?.length > 0 ? (
          allExtractors
            .filter((ex) => extractors?.length > 0 && extractors.includes(ex.id))
            .map((ex) => (
              <Card key={ex.id}>
                <Inline space={2}>
                  <Button
                    fontSize={2}
                    padding={3}
                    tone="positive"
                    mode="ghost"
                    onClick={() =>
                      setActiveExtractors({
                        ...activeExtractors,
                        [ex.id]: Boolean(!activeExtractors[ex.id]),
                      })
                    }
                  >
                    <Inline space={2} align="center" padding={2}>
                      {activeExtractors[ex.id] ? <FiX /> : <FiExternalLink />}
                      <Text size={2}>{activeExtractors[ex.id] ? `Close` : `Extract`}</Text>
                    </Inline>
                  </Button>
                  <Stack space={2}>
                    <Label>{ex.name.replace(`Extractor`, ``)}</Label>
                    <Text size={1}>{ex.description}</Text>
                  </Stack>
                </Inline>
                {activeExtractors[ex.id] && (
                  <GetExtraction
                    displayComponent={displayComponent}
                    docId={docId}
                    ml={ml}
                    data={data}
                    modelId={ex.id}
                  />
                )}
              </Card>
            ))
        ) : (
          <Card>
            <Text size={2}>Loading Extractors...</Text>
          </Card>
        )}
      </Grid>
    </ThemeProvider>
  )
}

MonkeyLearnPane.propTypes = {
  document: PropTypes.shape({
    displayed: PropTypes.shape({
      _id: PropTypes.string.isRequired,
    }),
  }),
  options: PropTypes.shape({
    apiKey: PropTypes.string.isRequired,
    extractors: PropTypes.arrayOf(PropTypes.string),
    field: PropTypes.string.isRequired,
    displayComponent: PropTypes.func,
  }),
}

export default MonkeyLearnPane
