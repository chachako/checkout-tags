import { Inputs } from '../model'

/**
 * Represents the execution stage of the action.
 *
 * The output of the previous stage is executed as an `input`
 * argument.
 *
 * @author Chachako
 */
// eslint-disable-next-line
export type Stage<I = any, O = any> = (
  /** Global inputs from Github Action. */
  globals: Inputs,
  /** The output of the previous stage. */
  input: I,
) => Promise<O>

/**
 * Executes all `stages` in the order of the array.
 */
export async function executeStages(
  globals: Inputs,
  stages: Stage[],
): Promise<void> {
  let input: unknown = null
  for (const stage of stages) {
    input = await stage(globals, input)
  }
}

export * from './detect'
export * from './checkout'
