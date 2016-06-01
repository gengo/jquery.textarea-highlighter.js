
var marexandre;
var helper = new marexandre.Helper();

var v0_6_0 = function(text, list, useWordBase) {
  useWordBase = useWordBase || true;

  var indicesList = [];
  var item, trie, trieIndices;

  for (var i = 0, imax = list.length; i < imax; i++) {
    item = list[i];

    if (item._trie) {
      trie = item._trie;
    } else {
      trie = new marexandre.Trie(item.match);
      item._trie = trie;
    }

    trieIndices = trie.getIndices(text);
    trieIndices = helper.removeOverlapingIndices(trieIndices);

    indicesList.push({ 'indices': trieIndices, 'type': item.matchClass });
  }

  var flattened = helper.flattenIndicesList(indicesList);
  flattened = helper.orderBy(flattened, 'start');
  flattened = helper.removeOverlapingIndices(flattened);
  flattened = helper.cleanupOnWordBoundary(text, flattened, useWordBase);

  var tokenized = helper.makeTokenized(text, flattened);

  return helper.createHTML(tokenized);
};
