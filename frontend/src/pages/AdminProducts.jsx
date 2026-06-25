import { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Row, Col, Badge, Spinner, Alert, Image } from 'react-bootstrap';
import api from '../api/axios';

const BOS = { ad: '', fiyat: '', stok: '', kategori_id: '', resim_url: '', aciklama: '' };

export default function AdminProducts() {
  const [urunler, setUrunler] = useState([]);
  const [kategoriler, setKategoriler] = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState(BOS);
  const [duzenle, setDuzenle] = useState(null);
  const [silOnay, setSilOnay] = useState(null);
  const [mesaj, setMesaj] = useState('');
  const [hata, setHata] = useState('');

  const yukle = () => {
    setLoading(true);
    Promise.all([api.get('/urunler'), api.get('/kategoriler')])
      .then(([u, k]) => { setUrunler(u.data); setKategoriler(k.data); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { yukle(); }, []);

  const ac = (urun = null) => {
    setDuzenle(urun);
    setForm(urun ? {
      ad: urun.ad,
      fiyat: urun.fiyat,
      stok: urun.stok,
      kategori_id: urun.kategori_id || '',
      resim_url: urun.resim_url || '',
      aciklama: urun.aciklama || '',
    } : BOS);
    setShow(true);
    setHata('');
  };

  const kaydet = async (e) => {
    e.preventDefault();
    try {
      const veri = {
        ...form,
        fiyat: Number(form.fiyat),
        stok: Number(form.stok),
        kategori_id: form.kategori_id ? Number(form.kategori_id) : null,
      };
      if (duzenle) await api.put(`/urunler/${duzenle.id}`, veri);
      else await api.post('/urunler', veri);
      setShow(false);
      setMesaj(duzenle ? 'Ürün güncellendi' : 'Ürün eklendi');
      yukle();
      setTimeout(() => setMesaj(''), 2500);
    } catch (err) {
      setHata(err.response?.data?.hata || 'İşlem başarısız');
    }
  };

  const sil = async () => {
    try {
      await api.delete(`/urunler/${silOnay.id}`);
      setSilOnay(null);
      setMesaj('Ürün silindi');
      yukle();
      setTimeout(() => setMesaj(''), 2500);
    } catch (err) {
      setHata(err.response?.data?.hata || 'Silinemedi');
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 style={{ color: 'var(--bordo)' }}>Ürün Yönetimi</h3>
        <Button className="btn-bordo" onClick={() => ac()}>+ Yeni Ürün</Button>
      </div>

      {mesaj && <Alert variant="success">{mesaj}</Alert>}
      {hata && <Alert variant="danger">{hata}</Alert>}

      {loading ? <Spinner animation="border" /> : (
        <Table responsive striped hover>
          <thead>
            <tr><th>ID</th><th>Görsel</th><th>Ad</th><th>Kategori</th><th>Fiyat</th><th>Stok</th><th>İşlemler</th></tr>
          </thead>
          <tbody>
            {urunler.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td><Image src={u.resim_url || `https://picsum.photos/seed/urun-${u.id}/50/50`} rounded style={{ width: 50, height: 50, objectFit: 'cover' }} onError={(e) => { if (!e.currentTarget.dataset.fb) { e.currentTarget.dataset.fb = '1'; e.currentTarget.src = `https://picsum.photos/seed/urun-${u.id}/50/50`; }}} /></td>
                <td>{u.ad}</td>
                <td><Badge className="badge-pudra">{u.kategori_ad || '-'}</Badge></td>
                <td>{Number(u.fiyat).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL</td>
                <td>{u.stok > 0 ? u.stok : <Badge bg="danger">Tükendi</Badge>}</td>
                <td>
                  <Button size="sm" className="btn-outline-bordo me-2" onClick={() => ac(u)}>Düzenle</Button>
                  <Button size="sm" variant="outline-danger" onClick={() => setSilOnay(u)}>Sil</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={show} onHide={() => setShow(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{duzenle ? 'Ürün Düzenle' : 'Yeni Ürün'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={kaydet}>
          <Modal.Body>
            {hata && <Alert variant="danger">{hata}</Alert>}
            <Row className="g-3">
              <Col md={12}>
                <Form.Label>Ürün Adı</Form.Label>
                <Form.Control required value={form.ad} onChange={(e) => setForm({ ...form, ad: e.target.value })} />
              </Col>
              <Col md={4}>
                <Form.Label>Fiyat (TL)</Form.Label>
                <Form.Control type="number" step="0.01" required value={form.fiyat} onChange={(e) => setForm({ ...form, fiyat: e.target.value })} />
              </Col>
              <Col md={4}>
                <Form.Label>Stok</Form.Label>
                <Form.Control type="number" required value={form.stok} onChange={(e) => setForm({ ...form, stok: e.target.value })} />
              </Col>
              <Col md={4}>
                <Form.Label>Kategori</Form.Label>
                <Form.Select value={form.kategori_id} onChange={(e) => setForm({ ...form, kategori_id: e.target.value })}>
                  <option value="">Seç...</option>
                  {kategoriler.map((k) => <option key={k.id} value={k.id}>{k.ad}</option>)}
                </Form.Select>
              </Col>
              <Col md={12}>
                <Form.Label>Resim URL</Form.Label>
                <Form.Control value={form.resim_url} onChange={(e) => setForm({ ...form, resim_url: e.target.value })} />
              </Col>
              <Col md={12}>
                <Form.Label>Açıklama</Form.Label>
                <Form.Control as="textarea" rows={3} value={form.aciklama} onChange={(e) => setForm({ ...form, aciklama: e.target.value })} />
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShow(false)}>İptal</Button>
            <Button type="submit" className="btn-bordo">Kaydet</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={!!silOnay} onHide={() => setSilOnay(null)} centered>
        <Modal.Header closeButton><Modal.Title>Ürün Sil</Modal.Title></Modal.Header>
        <Modal.Body>
          <strong>{silOnay?.ad}</strong> isimli ürünü silmek istediğinize emin misiniz?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setSilOnay(null)}>Vazgeç</Button>
          <Button variant="danger" onClick={sil}>Evet, Sil</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
