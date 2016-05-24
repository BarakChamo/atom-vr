'use babel';
navigator.getUserMedia =   navigator.getUserMedia   || navigator.webkitGetUserMedia;
window.RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection;
import { desktopCapturer } from 'electron';

/*
  WebRTC stream manager
 */

var localConnection, remoteConnection, dataChannel, videoFeed;

const sdpConstraints = {
  optional: [],
  mandatory: { OfferToReceiveVideo: true }
};

const cfg = {'iceServers': [{'url': 'stun:23.21.150.121'}]},
      con = { 'optional': [{'DtlsSrtpKeyAgreement': true}] };

  function handleRemoteOffer(offerDesc) {
    remoteConnection.setRemoteDescription(offerDesc, function(){
      console.log('SET REMOTE');
      remoteConnection.createAnswer(
        function (answerDesc) {
          console.log('ANSWER', answerDesc);
          remoteConnection.setLocalDescription(answerDesc);
        },
        function (error) {
          console.warn("Couldn't create offer", error);
        },
        sdpConstraints
      );
    }, function(err){console.log(err);});
  }

  export function createOffer(cb) {
   localConnection = new RTCPeerConnection(cfg, con);
   remoteConnection = new RTCPeerConnection(cfg, con);

   localConnection.onicecandidate = function (e) {
     if (e.candidate === null) {
       cb(localConnection.localDescription);
     }
   };

   localConnection.createOffer(
    function (desc) {
      localConnection.setLocalDescription(desc, function () {}, function () {});
    },
    function () {
      console.warn("Couldn't create offer");
    },
   sdpConstraints);
  }

  export function recieveOffer(offer, cb) {
    var offerDesc = new RTCSessionDescription(JSON.parse(offer));
    handleRemoteOffer(offerDesc);
  }

 export function attachStream() {

 }

 export function captureDesktop(gotStream) {
  //  dataChannel = localConnection.createDataChannel('test', {reliable: true})

   desktopCapturer.getSources({types: ['screen']}, function(error, sources){
     if (error) throw error;

     navigator.webkitGetUserMedia({
       audio: false,
       video: {
         mandatory: {
           chromeMediaSource: 'desktop',
           chromeMediaSourceId: sources[0].id,
           minWidth: 1280,
           maxWidth: 1280,
           minHeight: 720,
           maxHeight: 720
         }
       }
     }, stream => {
       localConnection.addStream(stream);
       remoteConnection.addStream(stream);
       gotStream(stream);
     }, function(error){
       console.log(error);
     });
     return;
   });
 }
