//documentを使う関数を入れる
document.addEventListener("DOMContentLoaded", () => {
  const saveButton = document.getElementById("save");

  saveButton.addEventListener("click", (e) => {
    e.preventDefault();
    const metamaskId = document.getElementById("metamaskIdInput").value;
    const repoUrl = document.getElementById("repoUrl").value;
    console.log(metamaskId, repoUrl)
    // background.jsにメッセージを送る
    chrome.runtime.sendMessage({ action: "saveSettings", metamaskId, repoUrl }, (response) => {
      console.log(response);
    });

  });
});

