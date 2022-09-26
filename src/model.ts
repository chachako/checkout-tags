import * as core from '@actions/core'
import * as github from '@actions/github'

import { Github } from './github'

/**
 * Represents the information of repository.
 *
 * @author Chachako
 */
export type RepositoryInfo = {
  owner: string
  name: string
}

/**
 * Inputs from Github Action
 *
 * @author Chachako
 */
export class Inputs {
  token = core.getInput('token', { required: true })
  base = parseRepo(core.getInput('base'))
  head = parseRepo(core.getInput('head'))
  filter = RegExp(core.getInput('filter'))
  overwrite = core.getBooleanInput('overwrite')
  stage = parseInt(core.getInput('stage') || '0')
  github: Github = new Github(github.getOctokit(this.token))
}

function parseRepo(repo: string): RepositoryInfo {
  const path = repo.split('/')
  if (path.length !== 2 || !path[0] || !path[1]) {
    throw new Error(
      `Invalid repository '${repo}'. Expected format {owner}/{repo}.`,
    )
  }
  return { owner: path[0], name: path[1] }
}
