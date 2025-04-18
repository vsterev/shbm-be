module.exports = {
  apps: [
    {
      name: "shbm-be",
      script: "./dist/src/app.js",
      instances: 1,
      wait_ready: true,
      exec_mode: "cluster",
    },
  ],
  deploy: {
    production: {
      user: "vsterev",
      host: "192.168.10.10",
      ref: "origin/master",
      repo: "git@github.com:vsterev/shbm-be.git",
      path: "/home/vsterev/git/shbm/pm2/shbm-backend",
      "post-deploy": "yarn && yarn build && pm2 startOrReload ecosystem.config.cjs --only shbm-be",
    },
  },
};
