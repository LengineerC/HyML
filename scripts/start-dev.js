const { exec } = require("child_process");

const startMain = exec("cross-env NODE_ENV=development electron .");
const startRenderer = exec("cross-env NODE_ENV=development webpack serve --config config/webpack.dev.js");

startMain.stdout.on('data', (data) => {
    console.log(`Main Process: ${data}`);
});

startMain.stderr.on('data', (data) => {
    console.error(`Main Process Error: ${data}`);
});


// startRenderer.stdout.on('data', (data) => {
//     console.log(`Renderer Process: ${data}`);
// });

// startRenderer.stderr.on('data', (data) => {
//     console.error(`Renderer Process Error: ${data}`);
// });


startMain.on('close', (code) => {
    console.log(`Main process exited with code ${code}`);
});

startRenderer.on('close', (code) => {
    console.log(`Renderer process exited with code ${code}`);
});