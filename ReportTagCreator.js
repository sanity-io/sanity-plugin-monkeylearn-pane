/* eslint-disable react/jsx-no-bind */
/* eslint-disable camelcase */
import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Flex, Box, Card, Text, Inline, Button} from '@sanity/ui'
import sanityClient from 'part:@sanity/base/client'
import {FiBookmark} from 'react-icons/fi'
import {capitalCase} from 'change-case'
import {useDocumentOperation} from '@sanity/react-hooks'
import {nanoid} from 'nanoid'

const client = sanityClient.withConfig({apiVersion: `2021-05-19`})

export default function ReportReference({docId, report}) {
  const [tag, setTag] = useState()
  const {patch} = useDocumentOperation(docId, 'article')

  useEffect(() => {
    async function getTag() {
      const query = `*[_type == "tag" && title == $title && category == $category][0]`
      const queryParams = {
        title: report.parsed_value,
        category: capitalCase(report.tag_name),
      }
      const data = await client.fetch(query, queryParams)

      if (data) {
        setTag(data)
        // console.log(`Found: `, data)
      } else {
        const newTag = {
          _type: 'tag',
          title: report.parsed_value,
          category: queryParams.category,
        }

        const createTag = await client.create(newTag)
        setTag(createTag)
        // console.log(`Created: `, createTag)
      }
    }

    if (!tag) getTag()
  }, [])

  function addTag() {
    if (!tag?._id) return

    patch.execute([
      {setIfMissing: {tags: []}},
      {
        insert: {
          after: 'tags[-1]',
          items: [{_key: nanoid(), _type: `tag`, _ref: tag._id}],
        },
      },
    ])
  }

  return (
    <Card tone="default" paddingY={2} borderBottom={1} radius={0}>
      <Flex align="center">
        <Button tone="positive" disabled={Boolean(!tag?._id)} onClick={() => addTag()}>
          <Inline space={1} align="center">
            <FiBookmark />
            <Text size={1}>{tag?._id ? `Tag` : `Loading...`}</Text>
          </Inline>
        </Button>
        <Box paddingX={2}>
          <Text marginLeft={2} size={2}>
            {report?.parsed_value}
          </Text>
        </Box>
      </Flex>
    </Card>
  )
}

ReportReference.propTypes = {
  docId: PropTypes.string.isRequired,
  report: PropTypes.shape({
    parsed_value: PropTypes.string,
    tag_name: PropTypes.string,
  }).isRequired,
}
