function toKebabCase(str) {
    return str
        // Handle camelCase by inserting hyphen before uppercase letters
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        // Handle snake_case by replacing underscores with hyphens
        .replace(/_/g, '-')
        // Handle spaces by replacing with hyphens
        .replace(/\s+/g, '-')
        // Convert to lowercase
        .toLowerCase()
        // Remove duplicate hyphens
        .replace(/-+/g, '-')
        // Strip leading and trailing hyphens
        .replace(/^-+|-+$/g, '');
}

// Test cases
console.log(toKebabCase('helloWorld'));        // hello-world
console.log(toKebabCase('hello_world'));       // hello-world
console.log(toKebabCase('hello world'));       // hello-world
console.log(toKebabCase('HelloWorld'));        // hello-world
console.log(toKebabCase('hello--world'));      // hello-world
console.log(toKebabCase('-hello-world-'));     // hello-world