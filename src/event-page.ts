import 'reflect-metadata';
// Rx operator
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/first';
// Rx observable
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/throw';
import { injectable } from 'inversify';
import { container, Export, invokeRPC, Remote, resolveAllRemote } from './utils/rpc';
import { RPCMessage } from './utils/message';
import './bangumi/api-proxy';
import './bangumi/web-proxy';
import './bangumi/synchronize';
import { BrowserStorage, ChromeStore } from './utils/browser-storage';
import { TYPES } from './utils/types';
import TabChangeInfo = chrome.tabs.TabChangeInfo;
import Tab = chrome.tabs.Tab;

@Remote()
@injectable()
export class BackgroundCore {
    @Export()
    verify():Promise<any> {
        console.log('verified');
        return new Promise<any>(resolve => {
            resolve('OK');
        });
    }

    @Export()
    openBgmForResult(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            chrome.tabs.query({active: true}, (queryResult) => {
                let previousTab = queryResult[0];
                if (!previousTab) {
                    reject('Don\'t close current page.');
                    return;
                }
                console.log(
                    '%c Deneb %c Logging into bgm.tv. ',
                    'color: #fff; margin: 1em 0; padding: 5px 0; background: #3498db;',
                    'margin: 1em 0; padding: 5px 0; background: #efefef;'
                );
                chrome.tabs.create({url: 'https://bgm.tv/login'}, (openedTab) => {
                    let urlChanged = false;
                    let tabUpdateListener = function (tabId: number, changeInfo: TabChangeInfo, tab: Tab) {
                        if (tabId === openedTab.id && !urlChanged && changeInfo.url && /^https:\/\/bgm\.tv\/?$/.test(changeInfo.url)) {
                            urlChanged = true;
                        }
                        if (tabId === openedTab.id && urlChanged && changeInfo.status === 'complete') {
                            chrome.tabs.executeScript(tabId, {file: 'content.js'}, (results) => {
                                if (results && results.length > 0 && results[0] === true) {
                                    setTimeout(() => {
                                        chrome.tabs.onUpdated.removeListener(tabUpdateListener);
                                        chrome.tabs.remove(tabId);
                                        chrome.tabs.update(previousTab.id as number, {active: true, highlighted: true});
                                        resolve({message: 'ok'});
                                    }, 3000);
                                } else {
                                    reject({message: 'login failed'});
                                }
                            });
                        }
                    };
                    chrome.tabs.onUpdated.addListener(tabUpdateListener);
                });
            });
        });
    }
}

container.bind<BrowserStorage>(TYPES.BrowserStorage).to(ChromeStore);

resolveAllRemote();

chrome.runtime.onMessageExternal.addListener(function (message: RPCMessage, sender, sendResponse) {
    invokeRPC(message)
        .then((result: any) => {
            sendResponse({error: null, result: result});
        }, (error: any) => {
            sendResponse({error: error, result: null});
        });
    return true;
});

function openSite(){
    chrome.tabs.query({}, function(tabs) {
        for (var i = 0, tab; tab = tabs[i]; i++) {
            if (tab.url && tab.url.startsWith(VEGA_HOST)) {
                chrome.tabs.update(tab.id ? tab.id : 0, {active: true});
                return;
            }
        }
        chrome.tabs.create({url: VEGA_HOST});
    });
}

chrome.browserAction.onClicked.addListener(openSite);
