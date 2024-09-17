module.exports = {
  '*.ts?(x)': ['eslint --fix', 'prettier --write', 'tsc-files --noEmit'],
  '*.js?(x)': ['eslint --fix', 'prettier --write'],
  '*.{json,md,css}': ['prettier --write'],
};
