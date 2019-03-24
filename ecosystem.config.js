module.exports = {
  apps: [{
    name: 'demo-web-app',
    script: './app.js'
  }],
  deploy: {
    production: {
      user: 'ubuntu',
      host: 'ec2-13-59-156-44.us-east-2.compute.amazonaws.com',
      key: '~/.ssh/web-app.pem',
      ref: 'origin/master',
      repo: 'git@github.com:sherifm/demo-web-app.git',
      path: '/home/ubuntu/demo-web-app',
      'post-deploy': 'npm install && pm2 startOrRestart ecosystem.config.js'
    }
  }
}
