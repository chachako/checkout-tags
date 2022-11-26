# Checkout Tags

This action checks-out the tags you want from the upstream in your current git work directory.

> A good scenario is to keep your forks synced with new tags in upstream at any time: *Check out all new tags in the upstream repository regularly through GitHub Action.*

## Usage

### Pre-requisites

- Create a workflow `.yml` file in your repositories `.github/workflows` directory.
  [Examples](#Examples) are available below. For more information, reference the GitHub Help
  Documentation
  for [Creating a workflow file](https://help.github.com/en/articles/configuring-a-workflow#creating-a-workflow-file).
- Both the upstream and fork must be in the Github network.

###  Optional Inputs

#### base: ''

> **Base (upstream) repository name with owner. For example, '`torvalds/linux`'.**
>
> 
>
> **Warning**
>
> If the value is not specified, the default value is the upstream repository of the current fork repository, and if the current repository is not a fork, the workflow will fail.

------

#### head: ${{ github.repository }}

> **Head (fork) repository name with owner. For example, '`pop-os/linux`'.**
>
> 
>
> **Note**
>
> If the value is not specified, the default value is the current repository.

------

#### overwrite: false

> **Whether to check out and overwrite the existing branches corresponding to the tags (in "`checkout-tags/<tag-name>`" format), otherwise skip them.**

------

#### filter: '.*'

> **Filter tags by regular expression. For example, the regex "`^v[2-9]\..*`" controls only check out tags larger than the "`v2`" version.**

------

#### token: ${{ github.token }}

> **Personal access token (PAT) used to access repositories.**
>
> 
>
> **Note**
>
> We recommend using a service account with the least permissions necessary.
> Also when generating a new PAT, select the least scopes necessary.
> 
> [Learn more about creating and using encrypted secrets](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/creating-and-using-encrypted-secrets)


------

#### stage: ''

> **Stage to be executed can be '`1`' or '`2`'.**
>
> 
>
> **Note**
>
> The action is divided into two stages. The first stage is used to detect the existence of tags that need to be checked out, and the second stage is used to check out tags.
>
> 
>
> For example, the "up-to-date" output of the first stage can be used to determine whether the repository needs to be checkout, thus saving time.
>
> 
>
> If the value is not specified, that means two stages are executed in order.

##### stage1-branch-prefixes: ''

> **Branch prefixes for detecting checked-out branches. Multiple prefixes are separated by semicolons, such as `checkout-tags/;checkout-tags/`.**

##### stage2-tags: ''

> **Tags to be checked out in the second stage. This value should be the output value of the first stage.**
>
> 
>
> **Note**
>
> The value is a string of tags separated by line breaks (`\n`).
>
> **Warning**
>
> If the input of '`stage`' is '`2`', but this value is not specified, the workflow will fail.

### Outputs

#### up-to-date

> **A boolean value represents whether there is any new tag to check out.**

------

#### tags

> **A (multi-line) string value represents the list of tags to be checked out.**

------

#### branches

> **A (multi-line) string value represents the checked out list of branches.**
>
> 
>
> **Note**
>
> All branches name are in format of "`checkout-tags/<tag-name>`", and all branches are checked out from the corresponding tags.

### Examples

```yaml
name: Sync tags on schedule
on:
  schedule:
    - cron: '0 0 * * *'
jobs:
  sync:
    runs-on: ubuntu-latest
    steps:      
      - name: Checkout head repository
        uses: actions/checkout@v3

      - name: Checkout new tags to branches
        id: checkout-tags
        uses: chachako/checkout-tags@v1
        with:
          base: torvalds/linux

      - name: Push all new branches
        run: |
          while read branch; do
            ...
            git push origin $branch
          done <<< "${{ steps.checkout-tags.outputs.branches }}"
```

## License

```
Copyright (c) 2022. Chachako

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

In addition, if you fork this project, your forked code file must contain
the URL of the original project: https://github.com/chachako/tags-sync
```

