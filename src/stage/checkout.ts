import { Stage, UncheckedTags } from './index'
import { Inputs } from '../model'
import { exec } from '@actions/exec'
import { BranchPrefix, Upstream } from '../consts'
import * as core from '@actions/core'

/**
 * A stage to checking out all unchecked tags from upstream.
 *
 * ## Input
 *
 * All tag names that can be checked-out.
 *
 * ## Output
 *
 * All checked-out branch names.
 *
 * @author Chachako
 */
export const Checkout: Stage<UncheckedTags> = async (
  globals: Inputs,
  input: UncheckedTags,
) => {
  core.debug('Checkout stage')
  const branches = input.map(tag => `${BranchPrefix}${tag}`)
  try {
    // Add upstream remote
    const upstreamUrl = await globals.github.getCloneUrl(globals.base)
    await exec('git', ['remote', 'add', Upstream, upstreamUrl])

    core.debug(`Upstream remote added: ${upstreamUrl}`)

    // Fetch input tags from upstream
    const refspecs = input.map(
      tag => `+refs/tags/${tag}:refs/tags/${BranchPrefix}${tag}`,
    )
    core.debug(`Fetching refspecs: ${refspecs.join(' ')}`)
    await exec('git', ['fetch', Upstream, ...refspecs, '--no-tags'])

    // Checkout input tags to local branches
    for (const branch of branches) {
      await exec('git', ['checkout', '-b', branch, `tags/${branch}`])
    }
  } finally {
    core.debug(`Checked out branches: ${branches.join(' ')}`)
    // Once succeeded, we can set the checked out local branches
    // to Github workflow outputs
    core.setOutput('branches', branches.join('\n'))
  }
}
