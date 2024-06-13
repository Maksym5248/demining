module.exports = {
    '**/*.(ts|tsx)': () => 'yarn check:tsc',
    '**/*.(ts|tsx|js|jsx)': (filenames) => [`yarn check:eslint -- ${filenames.join(' ')}`],
    '**/*.(md|json|yml|html)': (filenames) => `yarn check:prettier -- ${filenames.join(' ')}`,
};
