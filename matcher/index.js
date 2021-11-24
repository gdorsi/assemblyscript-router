
const matcher = require('../build/index');


function match(routes, url) {
    const id = matcher.match(routes, (url));
  
    if (id > -1 && matcher.getHasParams() === 1) {
      const aParams = matcher.getParams();
  
      let params = {};
  
      for (let i = 0; i < pParams.length; i += 2) {
        if (aParams[i] !== 0) {
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