module.exports = {
    "default e2e": function(browser){
        var devServer = browser.globals.devServerURL;
        var driver = browser.url(devServer)
        .waitForElementVisible(".btn", 5000)
        .setValue('.btn', 'e2e产生的内容');
        browser.getText('.btn', function(result){ 
            console.log(result.value);
        });
        browser.end();
    }
}