
const matcher = require('../build/index');

const emptyObj = {};

function match(routes, url) {
  const id = matcher.match(routes, url, url.length);

  if (id > -1 && matcher.getParamsSize() > 0) {
    const aParams = matcher.getParams();

    let params = {};

    for (let i = 0; i < aParams.length; i += 2) {
      if (aParams[i] !== undefined) {
        params[aParams[i]] = aParams[i + 1];
      }
    }

    return { id, params };
  }

  return { id, params: emptyObj };
}

module.exports = {
  create: matcher.create,
  add: matcher.add,
  match,
}