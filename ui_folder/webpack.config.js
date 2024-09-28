   // webpack.config.js
   const Dotenv = require('dotenv-webpack');
   const path = require('path');

   console.log("NODE_ENV: " + process.env.NODE_ENV);
   console.log("dirname: " + __dirname);
   module.exports = {
       // ... other webpack config
       plugins: [
            new Dotenv({
                path: path.resolve(__dirname, `.env.${process.env.NODE_ENV}`),
            }),
       ]
   };