import {MediaServer} from "./components/MediaServer";
import {WebServer} from "./components/WebServer";
import {StreamStatusServer} from "./components/StreamStatusServer";

new MediaServer().start();
new WebServer().start();
new StreamStatusServer().start();

// (async() => {
//     console.log("Running");
//     const browser = await puppeteer.launch();
//     const Page = await browser.newPage();
//     Page.
//     await Page.navigate({url: 'http://www.goodboydigital.com/pixijs/examples/12-2/'});
//     await Page.loadEventFired();
//     await Page.startScreencast({format: 'png', everyNthFrame: 1});
//
//     let counter = 0;
//     while(counter < 100){
//         const {data, metadata, sessionId} = await Page.screencastFrame();
//         console.log(metadata);
//         await Page.screencastFrameAck({sessionId: sessionId});
//     }
// })();