function transformId(doc, ret) {
    if (Array.isArray(ret)) {
      ret.forEach((item) => transformId(null, item));
    } else if (ret && typeof ret === 'object') {
      Object.keys(ret).forEach((key) => {
        if (key === '_id') {
          ret.id = ret[key];
          delete ret[key];
        } else {
          transformId(null, ret[key]);
        }
      });
    }
  }
  module.exports = transformId;
  