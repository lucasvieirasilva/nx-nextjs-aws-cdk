module.exports = {
  '{apps,libs,migrations}/**/*.{ts,js,jsx,tsx,json,yaml,md,html,css,scss}': [
    'pnpm nx affected --target lint --uncommitted --fix true',
    'pnpm nx format:write --uncommitted',
  ],
  '*.{js,ts,md,json}': ['pnpm nx format:write --uncommitted'],
};
