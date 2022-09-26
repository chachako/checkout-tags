import * as core from '@actions/core'

import { BranchPrefix } from '../consts'
import { Inputs } from '../model'
import { Stage } from './index'

export type UncheckedTags = string[]

/**
 * A stage to detect all tags in the **base repository**
 * that can be checked out to the **head repository**.
 *
 * ## Output
 *
 * All tag names that can be checked out.
 *
 * @author Chachako
 */
export const Detect: Stage<unknown, UncheckedTags> = async (
  globals: Inputs,
) => {
  core.debug('Detect stage')
  const unchecked: UncheckedTags = []
  try {
    const baseTags = await globals.github.listAllTags(globals.base)
    const headBranches = await globals.github.listAllBranches(globals.head)

    // Add all unchecked tags
    for (const tag of baseTags) {
      // The checked out branch is in the format
      // of "checkout-tags/<tag-name>"
      const correspondingBranch = `${BranchPrefix}${tag}`

      if (
        (!headBranches.includes(correspondingBranch) || globals.overwrite) &&
        globals.filter.test(tag)
      ) {
        unchecked.push(tag)
      }
    }
  } finally {
    const upToDate = unchecked.length === 0
    if (!upToDate) {
      core.info(`Unchecked tags found: '${unchecked.join(', ')}'`)
    }
    // Once succeeded, we can set all unchecked tag names
    // to Github workflow outputs
    core.setOutput('tags', unchecked.join('\n'))
    core.setOutput('up-to-date', upToDate)
  }

  return unchecked
}
