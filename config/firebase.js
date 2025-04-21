const admin = require("firebase-admin");
const serviceAccount = require('./albazar-c3f51-firebase-adminsdk-fbsvc-4449c13ce4.json');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../config.env') });


try {
    console.log("jjjjj",process.env.PORT)
    admin.initializeApp({
        credential: admin.credential.cert({
            type: process.env.FIREBASE_TYPE,
            project_id: process.env.FIREBASE_PROJECT_ID,
            private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
            private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            client_email: process.env.FIREBASE_CLIENT_EMAIL,
            client_id: process.env.FIREBASE_CLIENT_ID,
            auth_uri: process.env.FIREBASE_AUTH_URI,
            token_uri: process.env.FIREBASE_TOKEN_URI,
            auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
            client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
            universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN
        })
    });
    console.log('Firebase Admin SDK initialized successfully');
} catch (error) {
    console.error('Firebase Admin initialization error:', error);
    // Log specific error details for debugging
    if (error.errorInfo) {
        console.error('Error code:', error.errorInfo.code);
        console.error('Error message:', error.errorInfo.message);
    }
}

module.exports = admin;

