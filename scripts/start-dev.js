const { exec } = require("child_process");
const net = require('net');

const RENDERER_PROCESS_PORT=3000;

const startRenderer = exec("cross-env NODE_ENV=development webpack serve --config config/webpack.dev.js");

const checkPort = (port) => {
    return new Promise((resolve) => {
        const server = net.createServer();

        server.once('error', () => {
            resolve(true);
        });

        server.once('listening', () => {
            server.close(() => resolve(false));
        });

        server.listen(port);
    });
};

let startedListening = false;
const waitForPortOccupied = async (port) => {
    if (!startedListening) startedListening = true;
    while (true) {
        const isPortOccupied = await checkPort(port);
        if (isPortOccupied) {
            break;
        } else {
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }
};


startRenderer.stdout?.on('data', (data) => {
    // console.log(`Renderer Process: ${data}`);

    if (!startedListening) {
        waitForPortOccupied(RENDERER_PROCESS_PORT).then(() => {
            console.log("✅ Webpack Dev Server started, starting main process...");

            const startMain = exec("cross-env NODE_ENV=development electron .");

            startMain.stdout?.on('data', (data) => {
                console.log(`Main Process: ${data}`);
            });

            startMain.stderr?.on('data', (data) => {
                console.error(`Main Process Error: ${data}`);
            });

            startMain.on('close', (code) => {
                console.log(`Main process exited with code ${code}`);

                if (startRenderer) {
                    console.log("Closing Webpack Dev Server...");
                    startRenderer.kill('SIGKILL');
                }
            });
        });
    }
});

// startRenderer.stderr?.on('data', (data) => {
//     console.error(`Renderer Process Error: ${data}`);
// });

startRenderer.on('close', (code) => {
    console.log(`Renderer process exited with code ${code}`);
});