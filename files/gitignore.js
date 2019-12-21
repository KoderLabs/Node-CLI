let ignore = '';

const makeGitIgnore = function () {

  ignore = `
  /.env
  /build/
  .vscode
  /node_modules/
  /public/attachments/
  package-lock.json
  /docker/
  `;

  return ignore;
};

module.exports = makeGitIgnore;
