import * as core from '@actions/core'

import { Inputs } from './model'
import { checkout, detect, executeStages } from './stage'

async function run() {
  try {
    const inputs = new Inputs()
    switch (inputs.stage) {
      case 0:
        await executeStages(inputs, [detect, checkout])
        break
      case 1:
        await detect(inputs, null)
        break
      case 2:
        await checkout(inputs, core.getInput('stage2-tags').split('\n'))
        break
      default:
        core.setFailed(`Invalid stage: ${inputs.stage}`)
    }
  } catch (error) {
    core.setFailed(error instanceof Error ? error.message : String(error))
  }
}

await run()
