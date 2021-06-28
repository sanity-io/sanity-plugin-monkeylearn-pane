# sanity-plugin-monkeylearn-pane

Send the contents of [Portable Text](https://www.sanity.io/docs/presenting-block-text) to [MonkeyLearn](https://monkeylearn.com/)'s API to Extract insights with the power of Machine Learning!

## Notes

1. You will need a [MonkeyLearn account](https://monkeylearn.com/) (free!) in order to use this plugin
2. By default the plugin will only display extraction results. To perform the below interactions back to your source Document, you will need to drop in your own Component in the Pane `options`.

![Generating tags and patching document with machine learning](https://user-images.githubusercontent.com/9684022/123431817-9af3b780-d5c1-11eb-993f-db8f1c8e24d5.gif)

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

- `extractors` ([string], required) The ID's of the [Text Extractors](https://monkeylearn.com/text-extractors/) you want to produce reports for.
- `field` (string, required) A [dot-notated string](https://www.npmjs.com/package/dlv) from the document object to a field containing the Portable Text array.
- `displayComponent` (React Component, optional) A custom Component for handling the report from each text extraction. You will need to BYO a Component that will accept the Document ID and Report as props, so that it can do something fancy like generating `tag` documents and sending a `patch` to the currently edited document.

## Customising the output

The example shown above is included in this repo, see [ReportTagCreator.js](https://github.com/sanity-io/sanity-plugin-monkeylearn-pane/blob/main/ReportTagCreator.js) – this Component takes the report, generates a `tag` document if one does not already exists, and can send a `patch` back to the currently edited document in an `array` of `references` named `tags`.

## License

MIT © Simeon Griggs
See LICENSE
