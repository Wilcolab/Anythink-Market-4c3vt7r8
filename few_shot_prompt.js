/* few_shot_prompt.js
 * Helper to build few-shot prompts (task + labeled examples).
 *
 * Usage:
 *   const { buildFewShotPrompt } = require('./few_shot_prompt');
 *   const prompt = buildFewShotPrompt({
 *     task: 'Classify sentiment of the sentence.',
 *     instructions: 'Answer with POSITIVE, NEGATIVE, or NEUTRAL only.',
 *     constraints: 'One-word label only.',
 *     examples: [
 *       { input: 'I love this product.', output: 'POSITIVE' },
 *       { input: 'This is the worst.', output: 'NEGATIVE' }
 *     ],
 *     input: 'It was okay, nothing special.'
 *   });
 */
function toCamelCase(str) {
    return str
        .split(/[\s_-]+/)
        .map((word, index) => {
            if (index === 0) return word.toLowerCase();
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join('');
}

module.exports = { buildFewShotPrompt, toCamelCase };

function _formatExample(idx, ex) {
  const exInput = ('input' in ex) ? ex.input : JSON.stringify(ex.inputs ?? ex.example ?? '');
  const exOutput = ('output' in ex) ? ex.output : JSON.stringify(ex.outputs ?? ex.result ?? '');
  return `Example ${idx + 1}:\nInput: ${exInput}\nOutput: ${exOutput}`;
}

function buildFewShotPrompt({
  task,
  instructions = '',
  constraints = '',
  examples = [],
  input = '',
  desiredOutput = ''
} = {}) {
  if (!task) throw new Error('`task` is required');
  if (!Array.isArray(examples) || examples.length === 0) throw new Error('`examples` must be a non-empty array');

  const parts = [];
  parts.push(`Task: ${task}`);
  if (instructions) parts.push(`Instructions: ${instructions}`);
  if (constraints) parts.push(`Constraints: ${constraints}`);

  parts.push('Examples:');
  examples.forEach((ex, i) => parts.push(_formatExample(i, ex)));

  if (input) parts.push(`Input: ${input}`);
  if (desiredOutput) parts.push(`Desired output: ${desiredOutput}`);

  return parts.join('\n\n');
}

module.exports = { buildFewShotPrompt };
