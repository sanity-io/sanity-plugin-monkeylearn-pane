export default function toPlainText(blocks = []) {
  if (!Array.isArray(blocks)) return [blocks]

  const blockString = blocks
    .map((block) => {
      if (block._type !== 'block' || !block.children) {
        return ''
      }

      return block.children.map((child) => child.text).join('')
    })
    .join('\n\n')

  return blockString
}
