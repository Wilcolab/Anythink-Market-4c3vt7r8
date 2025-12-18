const { buildBasicPrompt } = require('./basic_prompt');

/* basic_prompt.js
 * Helper to build simple prompts for zero- or few-shot tasks.
 * Usage:
 *   const { buildBasicPrompt } = require('./basic_prompt');
 *   const prompt = buildBasicPrompt({
 *     task: 'Summarize the following text in one sentence.',
 *     constraints: 'Max 25 words. No analysis.',
 *     input: '...'
 *   });
 */

function buildBasicPrompt({ task, audience = '', constraints = '', input = '', desiredOutput = '' } = {}) {
  if (!task) throw new Error('`task` is required');

  const sections = [];
  sections.push(`Task: ${task}`);
  if (audience) sections.push(`Audience: ${audience}`);
  if (constraints) sections.push(`Constraints: ${constraints}`);
  if (input) sections.push(`Input: ${input}`);
  if (desiredOutput) sections.push(`Desired output: ${desiredOutput}`);

  return sections.join('\n\n');
}

module.exports = { buildBasicPrompt };
const camelCasePrompt = buildBasicPrompt({
    task: 'Convert a string to camelCase format.',
    constraints: 'First word lowercase, subsequent words capitalized with no spaces.',
    input: 'Amazing job man',
    desiredOutput: 'amazingJobMan'
});

console.log(camelCasePrompt);