MOODIFY
MOODIFY is a mood-based music player. Users can detect their mood with the camera or choose a mood manually, then listen to matching songs. Signed-in users also get listening analytics, including recent moods, recently played songs, and most-listened tracks.

Features
Camera-based facial expression detection
Manual mood selection: happy, sad, angry, and neutral
Mood-filtered song recommendations
User signup and login with JWT authentication
Seven-day mood and listening dashboard
Recently played song history
Most-listened song ranking
Admin-only song uploads
Batch audio uploads through ImageKit
MongoDB storage for users, songs, and listening events
Responsive dark cinematic interface
Project Structure
.
├── Backend/
│   ├── server.js
│   ├── package.json
│   └── src/
└── Frontend/
    ├── package.json
    ├── public/models/
    └── src/
Requirements
Node.js 18 or newer
MongoDB Atlas or a local MongoDB instance
ImageKit account for audio uploads
A modern browser with camera access
Local Setup
Backend
cd Backend
npm install
npm start
The backend runs on http://localhost:5000.

Frontend
Open a second terminal:

cd Frontend
npm install
npm run dev
Open the Vite URL, usually http://localhost:5173.

Environment Variables
Create Backend/.env using Backend/.env.example:

MONGODB_URL=your_mongodb_connection_string
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
ADMIN_PASSWORD=your_admin_password
JWT_SECRET=your_long_random_secret
FRONTEND_URL=http://localhost:5173
Create Frontend/.env using Frontend/.env.example:

VITE_API_URL=http://localhost:5000
Never commit .env files or expose private keys in frontend code.

Using The App
Users
Open /signup and create an account.
Open the player at /.
Allow camera access for facial expression detection, or choose a mood manually.
Play a song to record it in your personal listening history.
Open /dashboard to view mood and listening analytics.
Admin
Open /wp-admin.
Enter the ADMIN_PASSWORD from the backend environment.
Enter the artist name and choose a mood.
Select up to 20 legally obtained audio files.
Upload the tracks.
Song titles are generated from filenames. Only the admin-protected upload endpoint can add songs.

API Endpoints
Method	Endpoint	Purpose
GET	/health	Deployment health check
GET	/	API status
GET	/app/songs	List songs
POST	/app/song	Admin-only song upload
POST	/auth/signup	Create an account
POST	/auth/login	Log in
GET	/analytics/summary	Get the signed-in user's dashboard data
POST	/analytics/plays	Record a song play
POST	/analytics/moods	Record a detected mood
Testing
Run the frontend checks:

cd Frontend
npm run lint
npm run build
Run backend syntax checks:

cd Backend
Get-ChildItem -Path src -Recurse -Filter *.js | ForEach-Object { node --check $_.FullName }
Deploying To Render
Deploy the backend and frontend as separate Render services.

Backend Web Service
Root directory: Backend
Build command: npm install
Start command: npm start
Add these environment variables in Render:

MONGODB_URL=your_mongodb_connection_string
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
ADMIN_PASSWORD=your_admin_password
JWT_SECRET=your_long_random_secret
FRONTEND_URL=https://your-frontend.onrender.com
After deployment, verify:

https://your-backend.onrender.com/health
Expected response:

{"status":"ok"}
Frontend Static Site
Root directory: Frontend
Build command: npm install && npm run build
Publish directory: dist
Add this environment variable:

VITE_API_URL=https://your-backend.onrender.com
Add a Render rewrite rule for React Router:

Source: /*
Destination: /index.html
Action: Rewrite
The rewrite is required for /login, /signup, /dashboard, and /wp-admin to work after refreshing the page.

Camera access requires HTTPS in production. Render provides HTTPS automatically.

Security Notes
Use strong, unique values for ADMIN_PASSWORD and JWT_SECRET.
Rotate MongoDB, ImageKit, and JWT credentials if they have been exposed.
Upload only audio files you are legally allowed to store and stream.
Keep ImageKit private keys and MongoDB credentials on the backend only.
