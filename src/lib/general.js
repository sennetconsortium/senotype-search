Object.assign(String.prototype, {
  contains(t) {
    return this.indexOf(t) !== -1;
  },
  toCamelCase() {
    return this.replace(/\s(.)/g, function (a) {
      return a.toUpperCase();
    })
      .replace(/\s/g, '')
      .replace(/^(.)/, function (b) {
        return b.toLowerCase();
      });
  },
  toTitleCase() {
    return this.replace(
      /\w\S*/g,
      (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase(),
    );
  },
  toDashedCase() {
    return this.replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase();
  },
  upCaseFirst() {
    if (this.length === 0) {
      return '';
    }
    return this.charAt(0).toUpperCase() + this.slice(1);
  },
  format() {
    let args = arguments;
    return this.replace(/{(\d+)}/g, function (match, number) {
      return typeof args[number] != 'undefined' ? args[number] : match;
    });
  },
  eq(s2, insensitive = true) {
    let res = this === s2;
    if (insensitive && this !== undefined && s2 !== undefined) {
      res = this?.toLowerCase() === s2?.toLowerCase();
    }
    return res;
  },
  csvToJson(delimiter = ",")  {
  const [headers, ...rows] = this.split("\n");
  const headerArray = headers.split(delimiter);
  
  return rows.map(row => {
    const values = row.split(delimiter);
    return headerArray.reduce((obj, header, index) => {
      obj[header.trim()] = values[index]?.trim();
      return obj;
    }, {});
  });
}
});

export const flipObj = (obj) => {
  return Object.keys(obj).reduce((ret, key) => {
    ret[obj[key]] = key;
    return ret;
  }, {});
};

export const parseOntologyTerm = (val) => {
  if (!window.ONTOLOGY_CACHE) return val;
  for (const o in window.ONTOLOGY_CACHE) {
    if (window.ONTOLOGY_CACHE[o].termsFlipped) {
      if (val in window.ONTOLOGY_CACHE[o].termsFlipped) {
        return window.ONTOLOGY_CACHE[o].termsFlipped[val];
      }
    }
  }
  return val;
};

export const organHierarchy = (term) => {
  if (!window.ONTOLOGY_CACHE || !Object.values(window.ONTOLOGY_CACHE).length)
    return term;
  if (term.contains('Mammary Gland')) return 'Mammary Gland';

  if (window.ONTOLOGY_CACHE.organ_types && window.ONTOLOGY_CACHE.organ_types.hierarchy) {
    if (term in window.ONTOLOGY_CACHE.organ_types.hierarchy) {
      return window.ONTOLOGY_CACHE.organ_types.hierarchy[term];
    }
  }
  const r = new RegExp(/.+?(?=\()/);
  const res = term.match(r);

  return res && res.length ? res[0].trim() : term;
}

export function autoBlobDownloader(data, type, filename) {
  const a = document.createElement('a');
  const url = window.URL.createObjectURL(new Blob(data, { type }));
  a.href = url;
  a.download = filename;
  document.body.append(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

export function getProtocolId(protocolUrl) {
    // The ID is everything after "doi.org/" and before a /{version}
    const regex = /doi\.org\/([^\/]+\/[^\/]+)/
    const match = protocolUrl.match(regex);

    return match ? match[1] : null;
}
