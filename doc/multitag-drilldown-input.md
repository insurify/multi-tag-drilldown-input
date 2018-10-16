## jQuery#multitag-drilldown-input

The UI component of multi-tag-drilldown-input.js is available as a jQuery plugin. It's
responsible for rendering suggestions for a hierarchical series of values and handling DOM interactions.

## Table of Contents (WIP)

- [Features](#features)
- [Usage](#usage)
  - [API](#api)
  - [Options](#options)
  - [Datasets](#datasets)
  - [Custom Events](#custom-events)
  - [Class Names](#class-names)

## Features

- Displays suggestions to end-users as they type
- Shows top suggestion as a hint (i.e. background text)
- Supports custom templates to allow for UI flexibility
- Works well with RTL languages and input method editors
- Highlights query matches within the suggestion
- Triggers custom events to encourage extensibility

## Usage

### API

#### jQuery#multiTagDrilldownInput(options)

```javascript
$('#tag_input').multiTagDrilldownInput(options);
```

### Options

#### General Options

When initializing a multiTagDrilldownInput there are a number of options you can configure, some are general and some specific to each separate input tag.

- `alwaysVisible` - if `true` when the component is loaded the suggestion box opens automatically. Defaults to `false`.

- `disableMobileKeyboard` - if `true` when a mobile device is selected, typing on the input will be disabled and all the selections are done by tapping. Defaults to `false`.

- `complete` - a function that when present will be executed once the last input has been selected. It'll receive all the selections as parameters.

- `onTagAdded` - a function that when present will be called every time a tag is created by selecting from its list of options. It will receive it's own configuration and value as parameters. This can be useful for event tracking for example.

- `tagsOptions` - an array of objects each of which will contain the individual option for that tag.

#### Tag Options

- `data_holder_name` - the name for the current tag. This will be added as a class on the list layout (?)

- `min_length` - The minimum character length needed before suggestions start
  getting rendered.

- `highlight` - If `true`, when suggestions are rendered, pattern matches
  for the current query in text nodes will be wrapped in a `strong` element with its class set to `{{classNames.highlight}}`. Defaults to `true`.

- `hint` -

### Datasets

### Custom events

### Class Names
