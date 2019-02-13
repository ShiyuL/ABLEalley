"use strict";

var global = window;
var castReceiverManager;
var messageBus;
var doc = global.document;
var namespace = "urn:x-cast:com.bus";
var dom = {
  message: doc.getElementById("message")
};
var context, player;


function init() {
  context = cast.framework.CastReceiverContext.getInstance();
  context.addCustomMessageListener(namespace, showMessage);





  context.start();
}

function showMessage(e){
  dom.message.innerHTML = 'yo';

}

global.onload = init;
dom.message.innerHTML = 'changed';