'use babel';

import { desktopCapturer } from 'electron';

/*
  WebRTC stream manager
 */

var connection, dataChannel;

const sdpConstraints = {
  optional: [],
  mandatory: { OfferToReceiveVideo: true }
};

const cfg = {'iceServers': [{'url': 'stun:23.21.150.121'}]},
      con = { 'optional': [{'DtlsSrtpKeyAgreement': true}] };

  export function createOffer(cb) {
   navigator.getUserMedia =   navigator.getUserMedia   || navigator.webkitGetUserMedia;
   window.RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection;

   connection = new RTCPeerConnection(cfg, con);

   connection.onicecandidate = function (e) {
     if (e.candidate === null) {
       cb(connection.localDescription);
     }
   };

   connection.createOffer(
    function (desc) {
      connection.setLocalDescription(desc, function () {}, function () {});
    },
    function () {
      console.warn("Couldn't create offer");
    },
   sdpConstraints);
  }

 export function attachStream() {

 }

 export function captureDesktop() {
  //  connection.addStream()
  //  dataChannel = connection.createDataChannel('test', {reliable: true})

   desktopCapturer.getSources({types: ['window', 'screen']}, function(error, sources){
     console.log(sources);

     if (error) throw error;

     navigator.webkitGetUserMedia({
       audio: false,
       video: {
         mandatory: {
           chromeMediaSource: 'desktop',
           chromeMediaSourceId: sources[1].id,
           minWidth: 1280,
           maxWidth: 1280,
           minHeight: 720,
           maxHeight: 720
         }
       }
     }, gotStream, getUserMediaError);
     return;
   });
 }
