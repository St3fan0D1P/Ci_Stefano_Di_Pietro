const request = require('supertest');
const app = require('./app'); // Assicurati che app.js esporti l'app

describe("Test API gestione libri", () => {
    let codiceLibro;

    it("POST /api/libri - Aggiunge un nuovo libro", async () => {
        const response = await request(app)
            .post('/api/libri')
            .send({
                nome: "Il nome della rosa",
                descrizione: "Un romanzo storico di Umberto Eco",
                quantita: 10,
                prezzo: 20.99,
                autore: "Umberto Eco"
            });
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty("codice");
        codiceLibro = response.body.codice; // Salva il codice per i test successivi
    });

    it("GET /api/libri - Restituisce tutti i libri", async () => {
        const response = await request(app).get('/api/libri');
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it("GET /api/libri/:codice - Restituisce un libro tramite codice", async () => {
        const response = await request(app).get(`/api/libri/${codiceLibro}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.codice).toBe(codiceLibro);
    });

    it("GET /api/libri/:codice/incrementa - Incrementa la quantità di un libro", async () => {
        const response = await request(app).get(`/api/libri/${codiceLibro}/incrementa`);
        expect(response.statusCode).toBe(200);
        expect(response.body.quantita).toBe(11); // Dovrebbe essere aumentato a 11
    });

    it("GET /api/libri/:codice/decrementa - Decrementa la quantità di un libro", async () => {
        const response = await request(app).get(`/api/libri/${codiceLibro}/decrementa`);
        expect(response.statusCode).toBe(200);
        expect(response.body.quantita).toBe(10); // Dovrebbe essere decrementato a 10
    });

    it("DELETE /api/libri/:codice - Elimina un libro tramite codice", async () => {
        const response = await request(app).delete(`/api/libri/${codiceLibro}`);
        expect(response.statusCode).toBe(204);

        const getResponse = await request(app).get(`/api/libri/${codiceLibro}`);
        expect(getResponse.statusCode).toBe(404);
    });
});