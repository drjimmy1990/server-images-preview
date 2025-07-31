const express = require('express');
const path = require('path');
const app = express();
const port = 3000; // The internal port Coolify will use

// This line is crucial for serving your image file
app.use('/images', express.static(path.join(__dirname, 'images')));

// =================================================================
//                 ACTION REQUIRED: EDIT THESE VALUES
// =================================================================

// We will replace this placeholder with your REAL public domain later.
const BASE_URL = "https://share.ai-eg.online"; 

// Replace this with your actual Facebook App ID.
const FACEBOOK_APP_ID = ""; 

// =================================================================

// The "database" of your shareable images
const images = {
    'test1': {
        title: 'My First Test Image',
        description: 'This preview was generated from a production server!',
        imagePath: '/images/1.png'
    },
    'another-image': {
        title: 'Another Awesome Image',
        description: 'This one is also dynamically generated.',
        imagePath: '/images/another.jpg' // Assuming you have another.jpg in the images folder
    }
};

// The main route that generates the HTML preview page
app.get('/share', (req, res) => {
    const imageId = req.query.id || 'test1';
    const imageData = images[imageId];

    if (!imageData) {
        return res.status(404).send('Image not found');
    }

    const fullImageUrl = `${BASE_URL}${imageData.imagePath}`;
    const fullPageUrl = `${BASE_URL}/share?id=${imageId}`;

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
            <meta property="fb:app_id" content="${FACEBOOK_APP_ID}" />
        </head>
        <body>
            <p>Redirecting you to the image...</p>
            <script>
                window.location.replace("${fullImageUrl}");
            </script>
        </body>
        </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
});

app.listen(port, () => {
    console.log(`✅ Server is running on port ${port}`);
});