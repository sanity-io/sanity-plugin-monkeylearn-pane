import PropTypes from 'prop-types'
import React, {useState, useEffect} from 'react'
import {Card, Text, Stack, Spinner} from '@sanity/ui'

import ExampleReport from './ExampleReport'

export default function GetExtraction({displayComponent, docId, docType, ml, modelId, data}) {
  const [reports, setReports] = useState([])
  const [empty, setEmpty] = useState(false)

  useEffect(() => {
    if (!reports.length && modelId) {
      ml.extractors
        .extract(modelId, data)
        .then((response) => {
          if (response?.body?.length && response?.body[0].extractions?.length) {
            setReports(response?.body[0].extractions)
            setEmpty(false)
            return
          }

          setReports([])
          setEmpty(true)
        })
        // eslint-disable-next-line no-console
        .catch((error) => console.log(error.response))
    }
  }, [])

  if (reports.length > 0) {
    return (
      <Card marginY={2} borderTop={1}>
        <Stack space={0}>
          {reports.map((report) =>
            React.createElement(displayComponent ?? ExampleReport, {
              key: report.parsed_value,
              report,
              docId,
              docType
            })
          )}
        </Stack>
      </Card>
    )
  }

  if (empty) {
    return (
      <Card marginY={2}>
        <Text size={2}>No matches found</Text>
      </Card>
    )
  }

  return (
    <Card marginY={2}>
      <Spinner muted />
    </Card>
  )
}

GetExtraction.propTypes = {
  data: PropTypes.array,
  docId: PropTypes.string.isRequired,
  displayComponent: PropTypes.func,
  ml: PropTypes.func.isRequired,
  modelId: PropTypes.string.isRequired,
}
