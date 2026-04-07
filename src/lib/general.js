Object.assign(String.prototype, {
  toCamelCase() {
    return this.replace(/\s(.)/g, function (a) {
      return a.toUpperCase();
    })
      .replace(/\s/g, '')
      .replace(/^(.)/, function (b) {
        return b.toLowerCase();
      });
  },
  toDashedCase() {
    return this
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .toLowerCase();
  },
  upCaseFirst() {
    if (this.length === 0) {
      return "";
    }
    return this.charAt(0).toUpperCase() + this.slice(1);
  },
  format() {
    let args = arguments;
    return this.replace(/{(\d+)}/g, function (match, number) {
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
        ;
    });
  }
})

export const flipObj = (obj) => {
    return Object.keys(obj).reduce((ret, key) => {
        ret[obj[key]] = key;
        return ret;
    }, {})
}