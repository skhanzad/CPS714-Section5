// tests/loans.test.js
import request from 'supertest';
import app from '../app.js';

async function createAvailableItem() {
  const res = await request(app)
    .post('/api/items')
    .send({
      title: 'Loanable Book',
      author: 'Loan Author',
      mediaFormat: 'BOOK',
      location: 'SHELF-L1',
      barcode: String(Math.random()).slice(2), // random so unique
    })
    .expect(201);

  return res.body;
}

describe('Loans API', () => {
  test('POST /api/loans/checkout sets status to CHECKED_OUT', async () => {
    const item = await createAvailableItem();

    const res = await request(app)
      .post('/api/loans/checkout')
      .send({ item_id: item._id, member_id: 'MEM123' })
      .expect(200);

    expect(res.body._id).toBe(item._id);
    expect(res.body.status).toBe('CHECKED_OUT');
  });

  test('POST /api/loans/checkin sets status back to AVAILABLE', async () => {
    const item = await createAvailableItem();

    await request(app)
      .post('/api/loans/checkout')
      .send({ item_id: item._id, member_id: 'MEM123' })
      .expect(200);

    const res = await request(app)
      .post('/api/loans/checkin')
      .send({ item_id: item._id })
      .expect(200);

    expect(res.body._id).toBe(item._id);
    expect(res.body.status).toBe('AVAILABLE');
  });

  test('second checkout on same item returns 409', async () => {
    const item = await createAvailableItem();

    await request(app)
      .post('/api/loans/checkout')
      .send({ item_id: item._id, member_id: 'MEM123' })
      .expect(200);

    const res = await request(app)
      .post('/api/loans/checkout')
      .send({ item_id: item._id, member_id: 'MEM999' })
      .expect(409);

    expect(res.body.error).toBe('Item not available for checkout');
  });
});
