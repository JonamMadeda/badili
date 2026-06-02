const { execSync } = require('child_process');

const isVercel = !!process.env.VERCEL;

// On Vercel we only build the frontend; Render handles the backend separately via render.yaml
if (!isVercel) {
  execSync('npm run build --prefix backend', { stdio: 'inherit', shell: true });
}

if (isVercel) {
  execSync('npm install --prefix frontend', { stdio: 'inherit', shell: true });
}
execSync('npm run build --prefix frontend', { stdio: 'inherit', shell: true });
