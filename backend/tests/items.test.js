// tests/items.test.js
import request from 'supertest';
import app from '../app.js';

describe('Items API', () => {
  test('POST /api/items creates a new item', async () => {
    const newItem = {
      title: 'Test Book',
      author: 'Test Author',
      mediaFormat: 'BOOK',
      location: 'SHELF-A1',
      barcode: '123456',
    };

    const res = await request(app)
      .post('/api/items')
      .send(newItem)
      .expect(201); // controller uses res.status(201)

    expect(res.body).toHaveProperty('_id');
    expect(res.body.title).toBe(newItem.title);
    expect(res.body.mediaFormat).toBe('BOOK');
    expect(res.body.status).toBe('AVAILABLE'); // default from schema
  });

  test('GET /api/items returns list that includes created item', async () => {
    const createRes = await request(app)
      .post('/api/items')
      .send({
        title: 'Another Book',
        author: 'Some Author',
        mediaFormat: 'BOOK',
        location: 'SHELF-B2',
        barcode: '999999',
      })
      .expect(201);

    const res = await request(app).get('/api/items').expect(200);

    // listItems returns array directly
    expect(Array.isArray(res.body)).toBe(true);

    const found = res.body.find(item => item._id === createRes.body._id);
    expect(found).toBeDefined();
    expect(found.title).toBe('Another Book');
  });

  test('PATCH /api/items/:id updates an item', async () => {
    const createRes = await request(app)
      .post('/api/items')
      .send({
        title: 'Editable Book',
        author: 'Original',
        mediaFormat: 'BOOK',
        location: 'SHELF-C3',
        barcode: '777777',
      })
      .expect(201);

    const id = createRes.body._id;

    const res = await request(app)
      .patch(`/api/items/${id}`)
      .send({ title: 'Updated Book' })
      .expect(200);

    expect(res.body._id).toBe(id);
    expect(res.body.title).toBe('Updated Book');
  });

  test('DELETE /api/items/:id removes an item', async () => {
    const createRes = await request(app)
      .post('/api/items')
      .send({
        title: 'To Delete',
        author: 'Temp',
        mediaFormat: 'BOOK',
        location: 'SHELF-Z9',
        barcode: '555555',
      })
      .expect(201);

    const id = createRes.body._id;

    await request(app).delete(`/api/items/${id}`).expect(204);

    const listRes = await request(app).get('/api/items').expect(200);
    const found = listRes.body.find(item => item._id === id);

    expect(found).toBeUndefined();
  });
});
