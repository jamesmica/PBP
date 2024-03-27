const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.static('public')); // 'public' est le dossier contenant vos fichiers HTML, JS, CSS, CSV

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});