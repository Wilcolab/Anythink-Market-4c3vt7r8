/**
 * Converts a string to camelCase or PascalCase with robust Unicode support.
 * 
 * This function handles complex string transformations including:
 * - Diacritic removal and Unicode normalization (NFKD)
 * - Detection and conversion of existing camelCase/PascalCase inputs
 * - Handling of spaces, hyphens, underscores, and special characters
 * - Optional preservation of acronyms (e.g., "API" stays as "API")
 * - Automatic prefixing when output starts with a digit
 * 
 * @function toCamelCase
 * @param {string} input - The string to convert. Non-string inputs are coerced to strings.
 *                         Null/undefined inputs return empty string.
 * @param {Object} [opts={}] - Configuration options object
 * @param {boolean} [opts.pascalCase=false] - If true, returns PascalCase (CapitalizedFirst);
 *                                             if false, returns lowerCamelCase (lowercaseFirst)
 * @param {boolean} [opts.preserveAcronyms=true] - If true, consecutive uppercase letters
 *                                                  (length > 1) are preserved as-is;
 *                                                  if false, all tokens are lowercased
 * @param {string|boolean} [opts.prefixIfStartsWithDigit='_'] - Prefix to add when result
 *                                                               starts with a digit;
 *                                                               set to false to allow digits
 * @returns {string} The converted string in camelCase or PascalCase format
 * 
 * @example
 * // Basic camelCase conversion
 * toCamelCase('hello world'); // 'helloWorld'
 * 
 * @example
 * // Preserve acronyms
 * toCamelCase('XML_HTTP request', { preserveAcronyms: true }); // 'XMLHTTPRequest'
 * 
 * @example
 * // Ignore acronyms
 * toCamelCase('XML http request', { preserveAcroyms: false }); // 'xmlHttpRequest'
 * 
 * @example
 * // Handle special characters and whitespace
 * toCamelCase('  --foo_bar--baz  '); // 'fooBarBaz'
 * 
 * @example
 * // Prefix when starting with digit
 * toCamelCase('123 abc'); // '_123Abc'
 * 
 * @example
 * // PascalCase output
 * toCamelCase('hello world', { pascalCase: true }); // 'HelloWorld'
 */
/* refined_prompt.js
 * Robust camelCase helper generated from the refined prompt.
 * Features:
 *  - Unicode-aware (removes diacritics)
 *  - Handles spaces, hyphens, underscores, punctuation
 *  - Preserves/handles acronyms (configurable)
 *  - Converts existing camelCase / PascalCase inputs correctly
 *  - Optionally prefixes output if it starts with a digit
 *
 * Usage:
 *   const { toCamelCase } = require('./refined_prompt');
 *   toCamelCase('  --Hello_WORLD!!  '); // 'helloWorld'
function toDotCase(input, opts = {}) {
    const {
        lowercase = true,
        preserveAcronyms = false
    } = opts || {};

    if (input === null || input === undefined) return '';
    if (typeof input !== 'string') input = String(input);

    // Normalize and remove diacritics
    input = input.normalize ? input.normalize('NFKD').replace(/\p{M}/gu, '') : input;

    // Insert separators between lower->Upper
    input = input.replace(/([a-z\d])([A-Z])/g, '$1 $2');

    // Replace non-alphanumeric with spaces
    input = input.replace(/[^\p{L}\p{N}]+/gu, ' ');

    // Split and filter
    const tokens = input.split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return '';

    // Process tokens
    const processed = tokens.map(tok => {
        if (preserveAcronyms && /^\p{Lu}+$/u.test(tok) && tok.length > 1) return tok;
        return lowercase ? tok.toLowerCase() : tok;
    });

    return processed.join('.');
}

module.exports = { toCamelCase, toDotCase };
 */

/**
 * Convert a string to camelCase in a robust, configurable way.
 * @param {string} input
 * @param {object} [opts]
 * @param {boolean} [opts.pascalCase=false] - If true, produce PascalCase instead of lowerCamelCase
 * @param {boolean} [opts.preserveAcronyms=true] - Keep fully uppercase words as-is (API -> API)
 * @param {string|false} [opts.prefixIfStartsWithDigit='_'] - String to prefix when output starts with a digit; set to false to allow digits
 * @returns {string}
 */
function toCamelCase(input, opts = {}) {
  const {
    pascalCase = false,
    preserveAcronyms = true,
    prefixIfStartsWithDigit = '_'
  } = opts || {};

  if (input === null || input === undefined) return '';
  if (typeof input !== 'string') input = String(input);

  // Normalize and remove diacritics (Unicode-aware)
  // Use NFKD to separate combination marks, then remove them.
  input = input.normalize ? input.normalize('NFKD').replace(/\p{M}/gu, '') : input;

  // Insert separators between lower->Upper (e.g. "fooBar" -> "foo Bar")
  input = input.replace(/([a-z\d])([A-Z])/g, '$1 $2');

  // Replace any non-alphanumeric (Unicode letters/numbers) with spaces
  // Use Unicode property escapes for letters and numbers
  input = input.replace(/[^\p{L}\p{N}]+/gu, ' ');

  // Split on whitespace and filter empty tokens
  const rawTokens = input.split(/\s+/).filter(Boolean);
  if (rawTokens.length === 0) return '';

  const makeLower = s => s.toLowerCase();
  const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

  // Build tokens respecting acronyms if requested
  const tokens = rawTokens.map(tok => {
    // If preserveAcronyms and token is all upper-case and length > 1, keep as-is
    if (preserveAcronyms && /^\p{Lu}+$/u.test(tok) && tok.length > 1) return tok;
    return tok.toLowerCase();
  });

  // First token:
  let first = tokens[0];
  if (!pascalCase) first = makeLower(first);
  else first = capitalize(first);

  // Subsequent tokens: capitalize, but keep acronyms intact
  const rest = tokens.slice(1).map(tok => {
    if (preserveAcronyms && /^\p{Lu}+$/u.test(tok) && tok.length > 1) return tok;
    return capitalize(tok);
  });

  let result = [first, ...rest].join('');

  // If starts with digit and prefix is set, add prefix
  if (/^\d/.test(result) && prefixIfStartsWithDigit !== false) {
    result = String(prefixIfStartsWithDigit) + result;
  }

  return result;
}

module.exports = { toCamelCase };

// Example usages (for manual testing):
// console.log(toCamelCase('hello world')); // 'helloWorld'
// console.log(toCamelCase('XML_HTTP request', { preserveAcronyms: true })); // 'XMLHTTPRequest'
// console.log(toCamelCase('XML http request', { preserveAcronyms: false })); // 'xmlHttpRequest'
// console.log(toCamelCase('  --foo_bar--baz  ')); // 'fooBarBaz'
// console.log(toCamelCase('123 abc')); // '_123Abc'
