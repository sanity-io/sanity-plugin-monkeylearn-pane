import PropTypes from 'prop-types'
import React, {useMemo, useState, useEffect} from 'react'
import MonkeyLearn from 'monkeylearn'
import {
  ThemeProvider,
  studioTheme,
  Grid,
  Box,
  Button,
  Card,
  Text,
  Label,
  Stack,
  Flex,
} from '@sanity/ui'
import delve from 'dlv'
import {FiExternalLink, FiX} from 'react-icons/fi'

import toPlainText from './helpers/toPlainText'
import GetExtraction from './GetExtraction'

function MonkeyLearnPane({document: sanityDocument, options, mlApiKey}) {
  const {extractors, field, displayComponent} = options
  const ml = useMemo(() => new MonkeyLearn(mlApiKey), [])

  const {displayed} = sanityDocument
  const {_id, _type} = displayed
  const text = delve(displayed, field)
  const docId = _id
  const docType = _type

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

  if (!mlApiKey) return `No MonkeyLearn API Key Provided`

  return (
    <ThemeProvider theme={studioTheme}>
      <Grid columns={1} gap={4} padding={4}>
        {allExtractors?.length > 0 ? (
          allExtractors
            .filter((ex) => extractors?.length > 0 && extractors.includes(ex.id))
            .map((ex) => (
              <Card key={ex.id}>
                <Flex align="center" space={2}>
                  <Button
                    fontSize={2}
                    tone="positive"
                    mode="ghost"
                    onClick={() =>
                      setActiveExtractors({
                        ...activeExtractors,
                        [ex.id]: Boolean(!activeExtractors[ex.id]),
                      })
                    }
                  >
                    <Flex space={2} align="center">
                      {activeExtractors[ex.id] ? <FiX /> : <FiExternalLink />}
                      <Text size={2}>{activeExtractors[ex.id] ? `Close` : `Extract`}</Text>
                    </Flex>
                  </Button>
                  <Box flex={1}>
                    <Stack space={2}>
                      <Label>{ex.name.replace(`Extractor`, ``)}</Label>
                      <Text size={1}>{ex.description}</Text>
                    </Stack>
                  </Box>
                </Flex>
                {activeExtractors[ex.id] && (
                  <GetExtraction
                    displayComponent={displayComponent}
                    docId={docId}
                    docType={docType}
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
    extractors: PropTypes.arrayOf(PropTypes.string),
    field: PropTypes.string.isRequired,
    displayComponent: PropTypes.func,
  }),
  mlApiKey: PropTypes.string.isRequired,
}

export default MonkeyLearnPane
