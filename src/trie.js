var marexandre;
(function (marexandre) {
  'use strict';

  var Trie = (function() {
    function Trie(_list_) {
      this.list = {
        children: {}
      };
      // Initialize
      this.addFromArray(_list_ || []);
    }

    /**
     * addFromArray adds an givet array of strings to the trie dictionary
     * @param  {Array} _list_ Array of string to add to the dictionary
     */
    Trie.prototype.addFromArray = function(_list_) {
      var self = this;

      for (var i = 0, imax = _list_.length; i < imax; i++) {
        self.add( _list_[i] );
      }
    };


    /**
     * add adds an givet string to the trie dictionary
     * @param  {String} _text_ String to add to the trie dictionary
     */
    Trie.prototype.add = function(_word_) {
      var self = this;
      var obj = self.list;

      for (var j = 0, jmax = _word_.length; j < jmax; j++) {
        var c = _word_[j];

        if (obj.children[c] == null) {
          obj.children[c] = {
            children: {},
            value: c,
            is_end: j === jmax - 1 // Check if at the last letter
          };
        }

        obj = obj.children[c];
      }
    };

    /**
     * hasWord returns an Boolean if a given string exists in the trie dictionary
     * @param  {String} _text_ String to search for in the trie dictionary
     * @type {Boolean}
     */
    Trie.prototype.hasWord = function(_text_) {
      var self = this;
      var children = self.list.children;
      var flg = false;

      for (var i = 0, imax = _text_.length; i < imax; i++) {
        var c = _text_[i];
        var exists = children.hasOwnProperty(c.toString());

        if (exists) {
          if (children[c].is_end && i === imax - 1) {
            flg = true;
            break;
          }
          children = children[c].children;
        } else {
          break;
        }
      }
      return flg;
    };

    /**
     * getIndices returns an Array of indices that matched from a give string
     * @param  {String} _text_ String from which to get indices
     * @type {Array} [{start: 1, end: 3}, ...]
     */
    Trie.prototype.getIndices = function(_text_) {
      var self = this;
      var result = [];
      var remainingText = '';
      var currentNode = self.list;
      var start = -1, end = -1;

      for (var i = 0, imax = _text_.length; i < imax; i++) {
        remainingText = _text_.slice(i);

        // TODO: Need to refactor this loop :(
        for (var j = 0, jmax = remainingText.length; j < jmax; j++) {
          var c = remainingText[j];

          if (self.hasChildrenWithValue(currentNode, c)) {
            currentNode = currentNode.children[c];
            start = i;
            // Check if next character exists in children, and if does dive deeper
            var nextChar = remainingText[j + 1];
            if (nextChar) {
              if (currentNode.is_end) {
                end = start + j;
              }
              if (!self.hasChildrenWithValue(currentNode, nextChar)) {
                break;
              }
            } else {
              if (currentNode.is_end) {
                end = start + j;
                break;
              }
              break;
            }
          } else {
            break;
          }
        }
        // If there was a match save it.
        if (start !== -1 && end !== -1) {
          result.push({
            start: start,
            end: end + 1
          });
          i = end;
        }
        // Reset for next round
        start = -1;
        end = -1;
        currentNode = self.list;
      }

      return result;
    };

    /**
     * hasChildrenWithValue returns if node of trie has a child
     * @param  {trie} node Object tire node
     * @param  {String} char value of trie node
     * @type {boolean} true if node has a child
     */
    Trie.prototype.hasChildrenWithValue = function(node, char) {
      return node.children.hasOwnProperty(char.toString());
    };

    return Trie;
  })();

  marexandre.Trie = Trie;
})(marexandre || (marexandre = {}));
