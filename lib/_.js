((global) => { 'use strict';

/**
 * Common utilities shared accross
 * background, popup, and content scripts
 */
global._ = {

  /**
   * Debugging tool to circumnavigate console logging "live" objects
   *
   * @param  {String} msg
   * @param  {*} obj
   */
  inspect(msg, obj) {
    try {
      console.log(`${msg}: %o`, JSON.parse(JSON.stringify(obj)));
    } catch (e) {
      console.warn('inspect error (most likely a circular reference)');
    }
  },

  /**
   * This function traverses a DOM (sub)tree and executes a
   * given function on each Element and Text node it visits.
   *
   * @author Douglas Crockford
   */
  walk(node, fn) {
    fn(node);
    node = node.firstChild;
    while (node) {
      this.walk(node, fn);
      node = node.nextSibling;
    }
  }

};

// end iife
})(this);
