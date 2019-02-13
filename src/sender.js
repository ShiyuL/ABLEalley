"use strict";
var global = window;
var doc = global.document;
var con = global.console;
var chr = global.chrome;
var applicationID = "39FBD2DE";
var namespace = "urn:x-cast:com.bus";
var session = null;
var apiConfig;
var dom = {
  message: doc.getElementById("message")
};



function sessionListener(e) {
  con.log('here');
  con.log("New session ID:" + e.sessionId);
  session = e;
  // session.addUpdateListener(sessionUpdateListener);
  // session.addMessageListener(namespace, receiverMessage);
}

function receiverListener(e) {
  if (e === "available") {
    con.log("receiver found");
  } else {
    con.log("receiver list empty");
  }
}

function onInitSuccess(e){
  con.log("init success");

}

function onError(e){
  con.log("init error");
  con.log(e);
}

function initializeCastApi() {
  var sessionRequest = new chr.cast.SessionRequest(applicationID);
    apiConfig = new chr.cast.ApiConfig(
      sessionRequest,
      sessionListener,
      receiverListener
    );
}

function startSession(){
  chr.cast.initialize(apiConfig, onInitSuccess, onError);

  var castContext = cast.framework.CastContext.getInstance();
  castContext.setOptions({
          receiverApplicationId: '39FBD2DE'
  });
  castContext.requestSession( onInitSuccess, onError);
  
}

function sendMessage(message) {
  var castSession = cast.framework.CastContext.getInstance().getCurrentSession();
  castSession.sendMessage(namespace,{"message": message});

}

function stopCasting() {
  var castSession = cast.framework.CastContext.getInstance().getCurrentSession();
  castSession.endSession(true);
}

window["__onGCastApiAvailable"] = function(isAvailable) {
  if (isAvailable) {
    initializeCastApi();
  }
};
