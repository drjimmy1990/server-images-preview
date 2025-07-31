const express = require('express');
const path = require('path');
const app = express();
const port = 3000; // The port your local server will run on

// This line tells Express to serve static files (like your image) from the 'images' folder
app.use('/images', express.static(path.join(__dirname, 'images')));


// =================================================================
//                 ACTION REQUIRED: EDIT THESE VALUES
// =================================================================

// 1. Your ngrok public URL (you've already done this)
const BASE_URL = "https://touching-reasonably-rooster.ngrok-free.app"; 

// 2. Your Facebook App ID (get this from developers.facebook.com/apps)
const FACEBOOK_APP_ID = "2067909173723759"; 

// =================================================================

// The database of your shareable images
const images = {
    'test1': {
        title: 'My First Test Image',
        description: 'This preview was generated locally with VS Code and ngrok!',
        imagePath: '/images/1.png'
    }
    // You can add more images here later
};

// The main route that generates the HTML preview page
app.get('/share', (req, res) => {
    const userAgent = req.get('User-Agent') || '';
    const isFacebookCrawler = userAgent.includes('facebookexternalhit');

    console.log(`Request from User-Agent: ${userAgent}`);
    console.log(`Is it Facebook's crawler? ${isFacebookCrawler}`);

    const imageId = req.query.id || 'test1';
    const imageData = images[imageId];

    if (!imageData) {
        return res.status(404).send('Image not found');
    }

    const fullImageUrl = `${BASE_URL}${imageData.imagePath}`;
    const fullPageUrl = `${BASE_URL}/share?id=${imageId}`;
    
    const redirectTag = isFacebookCrawler 
        ? '' 
        : `<meta http-equiv="refresh" content="0; url=${fullImageUrl}" />`;

    const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>${imageData.title}</title>
            <meta property="og:title" content="${imageData.title}" />
            <meta property="og:description" content="${imageData.description}" />
            <meta property="og:image" content="${fullImageUrl}" />
            <meta property="og:url" content="${fullPageUrl}" />
            <meta property="og:type" content="website" />
            
            <!-- THIS IS THE NEW LINE THAT FIXES THE WARNING -->
            <meta property="fb:app_id" content="${FACEBOOK_APP_ID}" />
            
            <!-- This tag will now only be present for real users, not the crawler -->
            ${redirectTag}
        </head>
        <body>
            <p>You can see this page because you are the Facebook crawler. A real user would be redirected to the image.</p>
        </body>
        </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
});

app.listen(port, () => {
    console.log(`✅ Local server is running on http://localhost:${port}`);
    console.log(`   Waiting for ngrok to expose this port...`);
});