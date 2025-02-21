module.exports = {
  apps: [
    {
      name: "admin",
      script: "./src/app.js",
      instances: 1,
      exec_mode: "cluster",
      watch: false,
      max_memory_restart: "1G",
      autorestart: true,
      env_development: {
        NODE_ENV: "development",
        PORT: 5001,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 5001,
      },
      error_file: "logs/pm2/err.log",
      out_file: "logs/pm2/out.log",
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      wait_ready: true,
      listen_timeout: 3000,
    },
  ],
};
