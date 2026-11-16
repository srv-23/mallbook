// Escape user input before it reaches a MongoDB $regex. Without this a search
// term containing "(" or "[" is treated as a pattern and throws, turning a
// harmless query string into a 500.
const escapeRegex = (value = '') => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

module.exports = { escapeRegex };
