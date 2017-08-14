'use strict';

// npm run dev DO NOT read this file
process.env.VUE_ENV = 'server';
require('egg').startCluster({
    baseDir: __dirname,
    workers: 1,
    port: process.env.PORT // default to 7001
});
