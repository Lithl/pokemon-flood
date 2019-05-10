import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import { customElement, /*listen,*/ observe, property, /*, query*/ } from '@polymer/decorators';
// import {DeclarativeEventListeners} from '@polymer/decorators/lib/declarative-event-listeners';
// import {DomRepeat} from '@polymer/polymer/lib/elements/dom-repeat';

// import {PaperTree, TreeNode, RootIconType, RootNodeData, ParentNodeData, LeafNodeData} from '../paper-tree';
// import {MenuBar} from '../menu-bar';
// import {RichEditorCollection} from '../rich-editor-collection';
// import '../resizable-panel';

import * as template from './template.html';
// import {fileMenu, editMenu, insertMenu, formatMenu, helpMenu} from './menu-config';
// import {
  // fileMenu_openRecent as openRecent,
  // fileMenu_exportTo_googleDrive as googleDrive
// } from './menu-config/file-menu';
// import {generateProject} from './sidebar-config';
// import {nth} from '../../util';

import '../../common.scss?name=common';
import './index.scss?name=main';

/**
 * Main app; much of the state will be stored here, and the only element of the
 * page the user interactis with that isn't a child of this component should be
 * the signin/signout button for Google accounts (the loader doesn't handle
 * being in a shadow root well)
 */
@customElement('flood-app')
export class FloodApp extends /*DeclarativeEventListeners(*/PolymerElement/*)*/ {
  static get template() {
    // @ts-ignore
    return html([template]);
  }

  @property()
  googleUser!: gapi.auth2.GoogleUser;

  ready() {
    super.ready();
  }

  // @listen('report-bug', document)
  // reportBug() {
  //   open(
  //       'https://github.com/Lithl/flood-app/issues/new?labels=bug,triage&assignee=lithl',
  //       'bug-report');
  // }

  /**
   * User logged in or out of their Google account; enable/disable the Google
   * Drive export menu item
   */
  @observe('googleUser')
  protected googleUserChanged(user: gapi.auth2.GoogleUser) {
    if (user) {
      setTimeout(() => {
        this.style.display = 'block';
      }, 1500);
    } else {
      this.style.display = 'none';
    }
  }
}
