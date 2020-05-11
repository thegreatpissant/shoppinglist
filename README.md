Version of the final application from the Traversy Media Tutorial  "Build an Electron App in Under 60 Minutes"

Youtube link
https://www.youtube.com/watch?v=kN1Czs0m1SU


Modifications include 
The use of IPC from the main thread to the render thread for each window.
Local loading of .css file


See the following for a discussion when you get to that point in the tutorial (28:39, https://youtu.be/kN1Czs0m1SU?t=1719)
@@REFERENCE: https://stackoverflow.com/questions/19059580/client-on-node-uncaught-referenceerror-require-is-not-defined
Discussion https://github.com/electron/electron/issues/9920#issuecomment-575839738  
in that post the proposed solution: 'fn' should be 'func'
Better example https://github.com/electron/electron/issues/21437#issuecomment-573522360
This is to ultimatly ensure only specific modules are shared to the client side.



--inst--
Clone repo
npm install
npm run package-linux
