'use babel';

import PackageView from './package-view';
import { CompositeDisposable } from 'atom';
import { createOffer, captureDesktop } from './web-rtc';
import LZstring from 'lz-string';

import OfferView from './views/offer'

export default {

  packageView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    // Initialize offer view
    this.offerView = new OfferView();
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.offerView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atomvr:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.offerView.destroy();
  },

  serialize() {
    return {
    };
  },

  toggle() {
    createOffer(offer => {
      const offerString = JSON.stringify(offer);
      // Show offer
      // this.offerView.setOffer(LZstring.compressToBase64(JSON.stringify(offer)));
      atom.clipboard.write(offerString);
      this.offerView.setOffer(offerString);

      // Start streaming video
      captureDesktop(stream => {
        console.log('STREAM CONNECTED');
      })
    });

    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
