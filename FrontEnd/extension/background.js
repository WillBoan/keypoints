chrome.runtime.onInstalled.addListener(function() {

  // chrome.storage.sync.set({color: '#3aa757'}, function() {
  //   console.log("The color is green.");
  // });

  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [
        new chrome.declarativeContent.PageStateMatcher({
          // pageUrl: {hostEquals: 'developer.chrome.com'},
          pageUrl: {hostEquals: 'www.canlii.org', pathPrefix: '/en/ca/'},
        })
        // new chrome.declarativeContent.PageStateMatcher({
        //   pageUrl: { urlContains: 'g' },
        // })
      ],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
  
});
