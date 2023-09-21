'use strict';

// With background scripts you can communicate with popup
// and contentScript files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages
let isMerged = false;

import {callContract, contractABI} from "./sandbox.js";
import { PRIVATE_KEY, GIT_TOKEN} from './env'


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "saveSettings") {
      const { metamaskId, repoUrl } = request;
  
      chrome.storage.sync.set({ metamaskId, repoUrl }, () => {
        console.log("Settings saved in background");
        sendResponse({ message: "Settings saved" });
      });
    }
    return true;  // Will respond asynchronously.
  });
  

  


async function checkMergeStatus() {
  const userAddress = await new Promise((resolve) => {
    chrome.storage.sync.get(["metamaskId"], ({ metamaskId }) => {
      resolve(metamaskId);
    });
  });
  console.debug(userAddress);


  // ABI (Application Binary Interface) とメソッド名、パラメータを適切に設定してください
  const contractAddress = "0x1E8B9bb9e2830cb4466831093aEa63DA340603E9"
  const contractParams = [ userAddress, 1  ];
  const providerUrl = 'https://rpc-mumbai.maticvigil.com';
  const ABI = contractABI

  const { repoUrl } = await new Promise((resolve) => {
    chrome.storage.sync.get(["repoUrl"], resolve);
  });

  console.debug(repoUrl);
  const regex = /https:\/\/github\.com\/([^\/]+)\/([^\/]+)\/pulls\/(\d+)/;
  const match = repoUrl.match(regex);

  if (match) {
    const owner = match[1];
    const repo = match[2];
    const pull_number = match[3];

    try {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${pull_number}/merge`, {
        headers: {
          //  ここにgithubのtokenを入力
          'Authorization': `token ${GIT_TOKEN}`
        }
      });
      console.debug(response);
      if (response.status === 204) {
        console.log('The pull request has been merged.');
        isMerged = true;

        await callContract(contractAddress, ABI, contractParams, providerUrl);

        chrome.notifications.create({
          type: "basic",
          iconUrl: './icons/icon_32.png',
          title: 'Merge Completed',
          message: `You did a good job!! A pull request in ${repoUrl} was merged! You got 1hachi token.`
        });
      } else {
        console.log('The pull request has not been merged.');
        isMerged = false;
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
}

// 60秒ごとにマージ状態を確認
setInterval(checkMergeStatus, 20000);
// 60000
