describe("RR p13n Libarary", function() {
  it('should define RR in global scope', function(){
    expect(RR).not.toBeNull();
  });

  it('should expose a RR.context method', function(){
    expect(RR.context).toBeDefined();
  });

  it('should expose a RR.fetch method', function(){
    expect(RR.fetch).toBeDefined();
  });

  it('should expose a RR.log method', function(){
    expect(RR.log).toBeDefined();
  });
});

describe("RR.context()", function() {
  afterEach(function() {
    RR.context('delete');
  });

  it('should return a context', function(){
    expect(RR.context()).not.toBeNull();
  });

  it('should be able to set the ApiKey', function(){
    var ApiKey = 'abc123';
    RR.context({'ApiKey':ApiKey});
    expect(RR.context('ApiKey')).toEqual(ApiKey);
  });

  it('should default the env "recs"', function(){
    expect(RR.context('env')).toEqual('recs');
  });

  it('should be able to set the env', function(){
    RR.context({'env':'testEnv'});
    expect(RR.context('env')).toEqual('testEnv');
  });

  it('should be able to set the apiClientKey', function(){
    RR.context({'apiClientKey':'1234'});
    expect(RR.context('apiClientKey')).toEqual('1234');
  });

  it('should be able to set the placements', function(){
    RR.context({'placements':'|home_page.rr1|home_page.rr2'});
    expect(RR.context('placements')).toEqual('|home_page.rr1|home_page.rr2');
  });

  it('should be able to set the userId', function(){
    RR.context({'userId':'0987poiuy'});
    expect(RR.context('userId')).toEqual('0987poiuy');
  });

  it('should be able to set the sessionId', function(){
    RR.context({'sessionId':'567aaa'});
    expect(RR.context('sessionId')).toEqual('567aaa');
  });

  it('should be able to set multiple objects from a context object', function(){
    RR.context({'sessionId':'567bbb','userId':'0987poiuyb'});
    expect(RR.context('userId')).toEqual('0987poiuyb');
    expect(RR.context('sessionId')).toEqual('567bbb');
  });

  it('should be able to set a single context value if two arguments are passed', function(){
    RR.context('sessionId', '567ccc');
    expect(RR.context('sessionId')).toEqual('567ccc');
  });

  it('should return the value of a set context var when a single argument is passed', function(){
    RR.context('sessionId', '567ddd');
    expect(RR.context('sessionId')).toEqual('567ddd');
  });
});


describe("RR.log()", function() {

  it('should return a context', function(){
    expect(RR.context()).not.toBeNull();
  });

});


describe("RR.fetch()", function() {

  it('should return a context', function(){
    expect(RR.context()).not.toBeNull();
  });

});