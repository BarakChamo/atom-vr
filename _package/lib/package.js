'use babel';

import PackageView from './package-view';
import { CompositeDisposable } from 'atom';
import WebRTC from './web-rtc';
import QRCode from './qr-code';

export default {

  packageView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.packageView = new PackageView(state.packageViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.packageView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'package:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.packageView.destroy();
  },

  serialize() {
    return {
      packageViewState: this.packageView.serialize()
    };
  },

  toggle() {
    console.log('Package was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
