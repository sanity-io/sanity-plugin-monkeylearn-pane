# sanity-plugin-monkeylearn-pane

Send the contents of [Portable Text](https://www.sanity.io/docs/presenting-block-text) to [MonkeyLearn](https://monkeylearn.com/)'s API to Extract insights.

Drop in your own Component (like in this example below) to feed that data back into your content.

## Installation

```
sanity install monkeylearn-pane
```

This is designed to be used as a [Component inside of a View](https://www.sanity.io/docs/structure-builder-reference#c0c8284844b7).

```js
// ./src/deskStructure.js
import MonkeyLearnPane from 'sanity-plugin-monkeylearn-pane'

// ...all other list items

S.view
  .component(MonkeyLearnPane)
  .options({
    apiKey: 'xxx',
    extractors: [`ex_vqBQ7V9B`],
    field: 'content',
    displayComponent: <Report />,
  })
  .title('Analysis')
```

The `.options()` configuration works as follows:

- `apiKey` (string, required) An API Key from [MonkeyLearn](https://monkeylearn.com/). **Note:** This will bundle your key into the Sanity Studio Client. Currently only safe to use on a Private Repository
- `extractors` ([string], required) The ID's of the [Text Extractors](https://monkeylearn.com/text-extractors/) you want to produce reports for.
- `field` (string, required) A [dot-notated string](https://www.npmjs.com/package/dlv) from the document object to a field containing the Portable Text array.
- `displayComponent` (React Component, optional) A custom Component for handling the report from each text extraction. You will need to BYO a Component that will accept the Document ID and Report as props, so that it can do something fancy like generating `tag` documents and sending a `patch` to the currently edited document.

## Customising the output

The example shown above is included in this repo, see [ReportTagCreator.js](https://github.com/sanity-io/sanity-plugin-monkeylearn-pane/blob/main/ReportTagCreator.js) – this Component takes the report, generates a `tag` document if one does not already exists, and can send a `patch` back to the currently edited document in an `array` of `references` named `tags`.

## License

MIT © Simeon Griggs
See LICENSE
