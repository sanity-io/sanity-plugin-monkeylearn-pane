import {Box, Card, Stack, Text} from '@sanity/ui'
import PropTypes from 'prop-types'
import React from 'react'

export default function ExampleReport({report, docId}) {
  const allProps = {docId, ...report}

  return (
    <Card paddingY={4} borderBottom>
      <Stack space={4}>
        {Object.keys(allProps).map((key) => (
          <Box key={key}>
            <Text size={1}>
              <code>{key}</code>{` `}
              {typeof allProps[key] == 'string' ? allProps[key] : JSON.stringify(allProps[key])}
            </Text>
          </Box>
        ))}
      </Stack>
    </Card>
  )
}

ExampleReport.propTypes = {
  report: PropTypes.array,
  docId: PropTypes.string,
}

ExampleReport.defaultProps = {
  report: [],
  docId: ``,
}
