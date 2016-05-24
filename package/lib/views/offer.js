'use babel';

import QRCode from '../qr-code';
import { recieveOffer } from '../web-rtc';
import $ from 'jquery';

export default class OfferView {

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('atomvr-offer');

    this.offer = document.createElement('span');
    this.button = document.createElement('button');
    this.input = document.createElement('textarea');

    // Append children
    this.element.appendChild(this.offer);
    this.element.appendChild(this.button);

    // Handle events
    this.button.onclick = this.handleGetOffer.bind(this);
  }

  setOffer(offer) {
    // var qrcode = QRCode(40, 'M');

    // qrcode.addData(offer);
    // qrcode.make();

    // this.element.innerHTML = qrcode.createImgTag();
    this.offer.innerHTML = offer;
  }

  handleGetOffer() {
    this.element.removeChild(this.offer);
    this.element.appendChild(this.input);

    // re-assign event handler
    this.button.onclick = this.handleSetOffer.bind(this);
  }

  handleSetOffer() {
    console.log(this.input.value);
    recieveOffer(this.input.value.replace(/[\t\r]+/g, '').replace(/[\n]/g, '\\n'));
    // recieveOffer(this.input.value.replace(/\r/g, '').replace(/[\x20\t\r\n\f]+/g, ' '));
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }

}
