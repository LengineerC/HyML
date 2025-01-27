const path=require('path');

module.exports={
    target:"electron-main",
    mode:"production",
    entry:{
        main:path.resolve(__dirname,"../src/main/main.js"),
        preload:path.resolve(__dirname,"../src/main/preload.js"),
    },
    optimization:{
        minimize: true,
        // minimizer: [new TerserWebpackPlugin()], 
    },
    output: {
        path: path.resolve(__dirname, "../dist/main"),
        filename: "[name].js",
    },
    // resolve:{
    //     alias:{
    //         electron:require.resolve('electron'),
    //     },
    // },
};