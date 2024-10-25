const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());

let libri = [];

// Endpoint per ottenere tutti i libri
app.get('/api/libri', (req, res) => {
    res.json(libri);
});

// Endpoint per ottenere un singolo libro tramite codice
app.get('/api/libri/:codice', (req, res) => {
    const libro = libri.find(l => l.codice === req.params.codice);
    libro ? res.json(libro) : res.status(404).json({ message: 'Libro non trovato' });
});

// Endpoint per aggiungere un nuovo libro
app.post('/api/libri', (req, res) => {
    const { nome, descrizione, quantita, prezzo, autore } = req.body;
    const nuovoLibro = {
        codice: uuidv4(),
        nome,
        descrizione,
        quantita,
        prezzo,
        autore
    };
    libri.push(nuovoLibro);
    res.status(201).json(nuovoLibro);
});

// Endpoint per eliminare un libro tramite codice
app.delete('/api/libri/:codice', (req, res) => {
    libri = libri.filter(l => l.codice !== req.params.codice);
    res.status(204).end();
});

// Endpoint per incrementare la quantità di un libro
app.get('/api/libri/:codice/incrementa', (req, res) => {
    const libro = libri.find(l => l.codice === req.params.codice);
    if (libro) {
        libro.quantita += 1;
        res.json(libro);
    } else {
        res.status(404).json({ message: 'Libro non trovato' });
    }
});

// Endpoint per decrementare la quantità di un libro
app.get('/api/libri/:codice/decrementa', (req, res) => {
    const libro = libri.find(l => l.codice === req.params.codice);
    if (libro) {
        libro.quantita = Math.max(libro.quantita - 1, 0);
        res.json(libro);
    } else {
        res.status(404).json({ message: 'Libro non trovato' });
    }
});

// Avvio del server
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server avviato sulla porta ${PORT}`));
}

module.exports = app;
