# GitHub Action for label filtering

If a labels exists on a pull_request, do something.



![Github Release Number](https://badgen.net/github/release/DanielTamkin/HasLabel)
![Twitter Follow](https://img.shields.io/twitter/follow/CodeHands?style=social)

After fiddling through workflow expression syntax for the past few hours, I found it easier just to make an action that specifically checked if a pull_request had a certain label or not. I plan to expand this to issues as well.

●  [Using the action](https://github.com/DanielTamkin/HasLabel#using-the-action) 
● [Install](https://github.com/DanielTamkin/HasLabel#install) 
● [Configuration](https://github.com/DanielTamkin/HasLabel#configuration)
● [Events](https://github.com/DanielTamkin/HasLabel#events)
● [Real world](https://github.com/DanielTamkin/HasLabel#real-world)


## Using the action

In this barebones example, we look to see if a pull_request pointing towards the `main` branch has a label 'preview'.

``` YAML

name: Has label

on:
 pull_request:
  types:
    - opened
    - synchronize
    - labeled
    - unlabeled
  branches:
    - main

jobs:
 haslabel:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v2
    - name: Labeled to preview
      id: haslabel
      uses: DanielTamkin/HasLabel@v1
      with:
        contains: 'preview'
    - name: Test action
      if: steps.haslabel.outputs.labeled-preview
      run: echo 'This pull_request has this label.'
    - name: Test action "no match"
      if: steps.haslabel.outputs.labeled-preview != 'true'
      run: echo 'This pull_request does not have this label.'
    - name: Test action "unlabeled"
      if: steps.haslabel.outputs.unlabeled
      run: echo 'This pull_request had this label removed.'


```

#### Install
Click the button 'Use this workflow', or if you're on the marketplace 'Use latest version.'

## Configuration
**Failure to supply either a `contains` __or__ `exact` label will result in job failure.**

You can either loosely check for a label, or strictly check, but not both. If you need to check for more than one label try and narrow down your usecases for your labels first. If you still need more than one label for a job to trigger, stack HasLabel! The Action outputs unique variables through the [`step.output`](https://docs.github.com/en/actions/reference/context-and-expression-syntax-for-github-actions#operators) context. 
``` YAML

with:
  contains: 'label' # a label contains this string
  exact: 'label'    # a label contains exactly this string.

```

## `contains: $labelname`  
###### Type: String


If a label contains the string provided, HasLabel will proceed by outputting `labeled-$labelname`. Useful for statically worded labels such as `docs` or `feat` where you have flexibility in the naming scheme.

## `exact: $labelname`  
###### Type: String

If a label contains the string provided, HasLabel will proceed by outputting `labeled-$labelname`. Useful for statically worded labels such as `docs` or `feat` where you have flexability in the naming scheme.

# Events

HasLabel handles labeled, synchronize & unlabeled events by outputting unique variables accessable through `steps.<stepid>.outputs.<event>-<label>`. I'd suggest learning more about the [steps context](https://docs.github.com/en/actions/reference/context-and-expression-syntax-for-github-actions#operators) so to best utilize this Action.

## `labeled`, `synchronize`  
###### Outputs: `labeled-$labelname` 
###### Usage: `steps.<stepid>.outputs.labeled-$labelname` 

Replace $labelname with the label name you specified.
If the supplied label is found, HasLabel will signify this by outputting a unique variable in the form of `labeled-$labelname`, perfect for custom logic.
This also goes for the unique `synchronize` event, allowing pull_request's dependent on push events on pull_requests


Example: A Step triggered when a pull_request has label `preview`.
``` YAML
  - name: Test action "no match"
    if: steps.haslabel.outputs.labeled-preview
    run: echo 'Handle a unlabeled event'
```


## `unlabeled`  
###### Outputs: `unlabeled-$labelname` 
###### Usage: `steps.<stepid>.outputs.unlabeled-$labelname` 

Replace $labelname with the label name you specified.
If the supplied label is either not found or was just removed, HasLabel will signify this by outputting a unique variable in the form of `unlabeled-$labelname`. Especially useful if you want to trigger steps based on a loss of a label. Such as review checks, stagging builds or approvals.

Example: A Step triggered when a label is no-longer present.
``` YAML
  - name: Test action "no match"
    if: steps.haslabel.outputs.unlabeled-preview
    run: echo 'Handle a unlabeled event'
```

# Real World
This is a good real-world example where you trigger @nwtgck's Netlify deploy action once the label `preview` is added.

You could just as easily have this action work in a single job too! Accessing the outputs of a step are easy to access through: `steps.<jobid>.outputs.<labeled/unlabeled>-<label>`

``` YAML
name: Preview

on:
 pull_request:
  types:
    - opened
    - synchronize
    - labeled
    - unlabeled
  branches:
    - master

jobs:
  haslabel:
    name: analyse labels
    runs-on: ubuntu-latest
    outputs:
      preview: ${{ steps.haslabel.outputs.labeled-preview }}
    steps:
      - name: Cancel Previous Runs
        uses: styfle/cancel-workflow-action@0.4.1
        with:
          access_token: ${{ github.token }}
      - uses: actions/checkout@v2
      - name: Labeled to preview
        id: haslabel
        uses: DanielTamkin/HasLabel@v1
        with:
          contains: 'preview'
  deploy:
    name: deploy
    needs: haslabel
    if: needs.haslabel.outputs.preview
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v1.1
        with:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
        timeout-minutes: 1

```

## Contact

This is my first GitHub action, i'd love feedback! Create an issue or [Tweet me](https://www.twitter.com/CodeHands).



## License
<!--- If you're not sure which open license to use see https://choosealicense.com/--->

This project uses the [MIT](https://choosealicense.com/licenses/mit/) license.
