/**
 * @file RichRelevance framework dynamic personalization
 * @author Scott Brown
 * @version 2.0
 * 
 * //TODO 
 * @todo Documentation
 * @todo Unit Test
 * @todo Wire up internal events with hierarchy
 * @todo Placement requests
 * @todo Test Integration Page
 * @todo Get onto clients.richrelevance.com
 * @todo Next / multiple request per page
 * @todo persist session / userId
 * @todo persit context between page loads
 * @todo limited blockItemId
 * @todo "use strict";
 * @todo legacy module
 * @todo html module
 * @todo querystring params (r3_useDummyData)
 */

/**
 *  The core namespace for RichRelevance code
 *    <ul>
 *      <li>maintains or clears context</li>
 *      <li>makes request for dynamic content</li>
 *    </ul>
 *
 *  @namespace RR
 *  @global
 *
 *  @example
 *  // simple integration
 *  RR.context({apiKey:'c3c5705fd6524a22', apiClientKey:"18ac925e20f98239"});
 *  RR.log();
 */
var RR = (function (){
  var _context = {
    apiKey: '',
    apiClientKey: '',
    env: 'recs',
    userId: '',
    sessionId: ''
  };

  /**
   *  fetch mates a request to RR servers for dynamic content. Content will be returned as JSONP and send to a callback function
   *  passed to fetch. Additional context can also be passed to fetch, any values not passed with be inherited from the global
   *  context.
   *
   *  @memberof RR
   * 
   *  @method fetch
   *  @param callback {Function} the callback function for the request
   *  @param context {Object}  limited context for the request only, any values not set defer to global context. Optional
   *  @return {Object} returns the context used for the request
   *
   *  @example
   *  // call fetch passing a callback function and a context object
   *  RR.fetch(function(recs){console.log(recs);}, {id:123, name:"TicTacs"});
   */
  fetch = function(callback, context){
    var currentContext = context_get(),
        src = '',
        masterCallback;

    // Add passed context to current defering to passed for conflicts
    for (var attrname in context) { currentContext[attrname] = context[attrname]; }
    currentContext.timstamp = new Date().getTime();

    // Define callback fucntion
    masterCallback = function(){
      console.log('masterCallback');

      //TODO: add returned items to array of used items

      if(typeof callback === 'function') {
        callback();
      }
    };
    window['callback_' + currentContext.timstamp] = masterCallback;

    // Build URL and make request
    var src = RR.utilty.getRequestURL(currentContext, 'callback_' + currentContext.timstamp);
    RR.utilty.addScript(src);
  };

  /**
   *  context manages setting, getting, and persisting the recommendation context. The context defines user and page attributes
   *  that enable recommendations
   *
   *  @method context
   *  @memberof RR
   *  @param key {function} the key for a value to set or get; or an object that contains key value pairs to set
   *  @param value {type context} value to set if key was passed. Optional
   *  @return {type context } may return context
   *
   *  @example
   *  // set the product id
   *  RR.context({productId: '123abc'});
   *  @example
   *  // set the product id and name
   *  RR.context({productId: '123abc', productName: 'tic-tak'});
   *  @example
   *  // get the product id
   *  RR.context('productId');
   *  @example
   *  // get full context
   *  RR.context();
   *  @example
   *  // persist context
   *  RR.context('save');
   *  @example
   *  // get persisted context
   *  RR.context('load');
   */
  context_disambiguation = function(){
    var args = arguments;

    /* Determie correct code path by 
     * evaluating the arguments passed
     * ===============================
     * - get_context
     * - set_context
     * - save_context
     * - load_context
     * - delete_context
     */

    if (args.length === 0){
      // if nothing is pass return context
      return context_get();
    } else if (args.length === 1){
      // check type
      if (typeof args[0] === 'string'){
        // check if rr reserved word
        switch (args[0].toLowerCase()){
          case 'save':
            return context_save();
            break;
          case 'load':
            return context_load();
            break;
          case 'delete':
            return context_delete();
            break;
          default:
            return context_get(args[0]);
            break;
        }
      } else if (typeof args[0] === 'object'){
        // recursivly call this passing object properties
        for (var name in args[0]) {
          if (args[0].hasOwnProperty(name)) {
            context_disambiguation(name, args[0][name]);
          }
        }
      }
    } else if (args.length === 2){
      // if two arguments are passed assume key value pari to set
      context_set(args[0], args[1]);
    } else {
      // Dont know what to do with more that 2 arguments
      throw "incorrect number of arguments";
    }
  };

  context_get = function(key){
    if(key) {
      return _context[key];
    } else {
      return _context;
    }
  };
  context_set = function(key, value){ 
    //TODO: sanity checking 
    _context[key] = value;
  };
  context_save = function(){ console.log('save'); };
  context_load = function(){ console.log('laod'); };
  context_delete = function(){ 
    _context = {
      apiKey: '',
      apiClientKey: '',
      env: 'recs',
      userId: '',
      sessionId: ''
    };
  };

  /**
   *  log a page view or on page event to RR.
   * 
   *  @method log
   *  @memberof RR
   *
   *  @example
   *  // log a add to cart event
   *  RR.log({'productId':'123abc': 'event':'add to cart'});
   */
  log = function(event){
    //TODO: convert event to url parm
    RR.utilty.getLogURL(JSON.stringify(event));
  };

  return {
    fetch: fetch,
    context: context_disambiguation,
    log: log
  }
})();

/**
 *  utilty a page view or on page event to RR.
 * 
 *  @namespace RR.utilty
 *  @memberof RR
 */
RR.utilty = (function (){
  var head= document.getElementsByTagName('head')[0];
  
 /**
   *  adds a &lt;script&gt; tag to the document &lt;head&gt;
   * 
   *  @method addScript
   *  @public
   *  @memberof RR.utilty
   */
  addScript = function(src){
    var script= document.createElement('script');
      script.type= 'text/javascript';
      script.src= src;
      head.appendChild(script);
  };

  getCookieValue = function(key){
    return 'temp';
  };

  /**
   *  builds the request url for recommendations
   * 
   *  @method getRequestURL
   *  @public
   *  @memberof RR.utilty
   *
   *  @todo sanity checks
   *  @todo build string more dynamically
   *  @todo if context does not include placements use RR.utility.log();
   */
  getRequestURL = function(context, callbackName){

    //TODO: if context does not include placements use RR.utility.log();

    var protocol = context.protocol || window.location.protocol; 

    //create src from context
    return protocol + '//'+context.env+'.richrelevance.com/rrserver/api/rrPlatform/recsForPlacements?apiClientKey='+context.apiClientKey+'&apiKey='+context.apiKey+
          '&productId=&placements='+context.placements+'&userId='+context.userId+'&sessionId='+context.sessionId+'&jsonp=true&jcb='+callbackName;  
  };

  /**
   *  builds the logging url for pageviews or events
   * 
   *  @method getLogURL
   *  @public
   *  @memberof RR.utilty
   */
  getLogURL = function(context, callbackName){
    //TODO: build request properly
    return 'http://'+context.env+'.richrelevance.com/rrserver/log?a='+context.apiKey+'&ts=1360118262771&pt=%7Ccategory_page&u=36b78f6f-5ea0-492d-9faf-86e741b6c18b&s=mvfhbo45bbng5suruaxqnvip&0=like&1=product&2=undefined';
  };

  return {
    addScript: addScript,
    getRequestURL: getRequestURL,
    getLogURL: getLogURL
  }
}());

/**
 *  Events. Pub/Sub system for Loosely Coupled logic.
 *  Based on Peter Higgins' port from Dojo to jQuery
 *  https://github.com/phiggins42/bloody-jquery-plugins/blob/master/pubsub.js
 *
 *  Re-adapted to vanilla Javascript
 *
 *  @namespace RR.events
 */
RR.events = (function (){
  var cache = {},

  /**
   *  RR.events.publish
   *  e.g.: RR.events.publish("/Article/added", [article], this);
   *
   *  @memberof RR.events
   *
   *  @method publish
   *  @param topic {String}
   *  @param args {Array}
   *  @param scope {Object} Optional
   */
  publish = function (topic, args, scope) {
    if (cache[topic]) {
      var thisTopic = cache[topic],
        i = thisTopic.length - 1;

      for (i; i >= 0; i -= 1) {
        thisTopic[i].apply( scope || this, args || []);
      }
    }
  },

  /**
   *  Events.subscribe
   *  e.g.: Events.subscribe("/Article/added", Articles.validate)
   *
   *  @memberof RR.events
   *
   *  @method subscribe
   *  @param topic {String}
   *  @param callback {Function}
   *  @return Event handler {Array}
   */
  subscribe = function (topic, callback) {
    if (!cache[topic]) {
      cache[topic] = [];
    }
    cache[topic].push(callback);
    return [topic, callback];
  },

  /**
   *  Events.unsubscribe
   *  e.g.: var handle = Events.subscribe("/Article/added", Articles.validate);
   *    Events.unsubscribe(handle);
   *
   *  @memberof RR.events
   *
   *  @method unsubscribe
   *  @param handle {Array}
   *  @param completly {Boolean}
   *  @return {type description }
   */
  unsubscribe = function (handle, completly) {
    var t = handle[0],
      i = cache[t].length - 1;

    if (cache[t]) {
      for (i; i >= 0; i -= 1) {
        if (cache[t][i] === handle[1]) {
          cache[t].splice(cache[t][i], 1);
          if(completly){ delete cache[t]; }
        }
      }
    }
  };

  return {
    publish: publish,
    subscribe: subscribe,
    unsubscribe: unsubscribe
  };
}());


/**
 *  Recs handles recs specific logic
 *
 *  @namespace RR.recs
 */
RR.recs = (function (){

}());


/**
 *  Ads handles ads specific logic
 *
 *  @namespace RR.ads
 */
RR.ads = (function (){

}());


/**
 *  Promo handles recs specific logic
 *
 *  @namespace RR.promo
 */
RR.promo = (function (){

}());


/**
 *  HTML handles injection of HTML content
 *
 *  @namespace RR.html
 */
RR.html = (function (){

}());


/**
 *  Legacy handles legacy specific logic
 *
 *  @namespace RR.legacy
 */
RR.legacy = (function (){

}());