import { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Tabs, Tab, Badge, Spinner, Alert } from 'react-bootstrap';
import api from '../api/axios';

export default function AdminUsersCategories() {
  return (
    <div>
      <h3 style={{ color: 'var(--bordo)' }} className="mb-3">Kullanıcı & Kategori Yönetimi</h3>
      <Tabs defaultActiveKey="kullanicilar" className="mb-3">
        <Tab eventKey="kullanicilar" title="Kullanıcılar">
          <KullaniciYonetimi />
        </Tab>
        <Tab eventKey="kategoriler" title="Kategoriler">
          <KategoriYonetimi />
        </Tab>
      </Tabs>
    </div>
  );
}

function KullaniciYonetimi() {
  const [liste, setListe] = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ ad: '', email: '', sifre: '', rol: 'musteri' });
  const [duzenle, setDuzenle] = useState(null);
  const [silOnay, setSilOnay] = useState(null);
  const [hata, setHata] = useState('');

  const yukle = () => {
    setLoading(true);
    api.get('/kullanicilar').then((r) => setListe(r.data)).finally(() => setLoading(false));
  };
  useEffect(() => { yukle(); }, []);

  const ac = (k = null) => {
    setDuzenle(k);
    setForm(k ? { ad: k.ad, email: k.email, sifre: '', rol: k.rol } : { ad: '', email: '', sifre: '', rol: 'musteri' });
    setShow(true);
    setHata('');
  };

  const kaydet = async (e) => {
    e.preventDefault();
    try {
      if (duzenle) await api.put(`/kullanicilar/${duzenle.id}`, { ad: form.ad, email: form.email, rol: form.rol });
      else await api.post('/kullanicilar', form);
      setShow(false);
      yukle();
    } catch (err) {
      setHata(err.response?.data?.hata || 'Hata');
    }
  };

  const sil = async () => {
    await api.delete(`/kullanicilar/${silOnay.id}`);
    setSilOnay(null);
    yukle();
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Toplam: {liste.length} kullanıcı</h5>
        <Button className="btn-bordo" onClick={() => ac()}>+ Yeni Kullanıcı</Button>
      </div>
      {loading ? <Spinner animation="border" /> : (
        <Table responsive striped hover>
          <thead><tr><th>ID</th><th>Ad</th><th>Email</th><th>Rol</th><th>Kayıt</th><th>İşlemler</th></tr></thead>
          <tbody>
            {liste.map((k) => (
              <tr key={k.id}>
                <td>{k.id}</td>
                <td>{k.ad}</td>
                <td>{k.email}</td>
                <td><Badge className={k.rol === 'admin' ? 'badge-bordo' : 'badge-pudra'}>{k.rol}</Badge></td>
                <td>{new Date(k.olusturma_tarihi).toLocaleDateString('tr-TR')}</td>
                <td>
                  <Button size="sm" className="btn-outline-bordo me-2" onClick={() => ac(k)}>Düzenle</Button>
                  <Button size="sm" variant="outline-danger" onClick={() => setSilOnay(k)}>Sil</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton><Modal.Title>{duzenle ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı'}</Modal.Title></Modal.Header>
        <Form onSubmit={kaydet}>
          <Modal.Body>
            {hata && <Alert variant="danger">{hata}</Alert>}
            <Form.Group className="mb-3"><Form.Label>Ad</Form.Label>
              <Form.Control required value={form.ad} onChange={(e) => setForm({ ...form, ad: e.target.value })} /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Email</Form.Label>
              <Form.Control type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Form.Group>
            {!duzenle && (
              <Form.Group className="mb-3"><Form.Label>Şifre</Form.Label>
                <Form.Control type="password" required value={form.sifre} onChange={(e) => setForm({ ...form, sifre: e.target.value })} /></Form.Group>
            )}
            <Form.Group className="mb-3"><Form.Label>Rol</Form.Label>
              <Form.Select value={form.rol} onChange={(e) => setForm({ ...form, rol: e.target.value })}>
                <option value="musteri">Müşteri</option>
                <option value="admin">Admin</option>
              </Form.Select></Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShow(false)}>İptal</Button>
            <Button type="submit" className="btn-bordo">Kaydet</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={!!silOnay} onHide={() => setSilOnay(null)} centered>
        <Modal.Header closeButton><Modal.Title>Kullanıcı Sil</Modal.Title></Modal.Header>
        <Modal.Body><strong>{silOnay?.ad}</strong> silinsin mi?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setSilOnay(null)}>Vazgeç</Button>
          <Button variant="danger" onClick={sil}>Evet, Sil</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

function KategoriYonetimi() {
  const [liste, setListe] = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ ad: '', aciklama: '' });
  const [duzenle, setDuzenle] = useState(null);
  const [silOnay, setSilOnay] = useState(null);

  const yukle = () => {
    setLoading(true);
    api.get('/kategoriler').then((r) => setListe(r.data)).finally(() => setLoading(false));
  };
  useEffect(() => { yukle(); }, []);

  const ac = (k = null) => {
    setDuzenle(k);
    setForm(k ? { ad: k.ad, aciklama: k.aciklama || '' } : { ad: '', aciklama: '' });
    setShow(true);
  };

  const kaydet = async (e) => {
    e.preventDefault();
    if (duzenle) await api.put(`/kategoriler/${duzenle.id}`, form);
    else await api.post('/kategoriler', form);
    setShow(false);
    yukle();
  };

  const sil = async () => {
    await api.delete(`/kategoriler/${silOnay.id}`);
    setSilOnay(null);
    yukle();
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Toplam: {liste.length} kategori</h5>
        <Button className="btn-bordo" onClick={() => ac()}>+ Yeni Kategori</Button>
      </div>
      {loading ? <Spinner animation="border" /> : (
        <Table responsive striped hover>
          <thead><tr><th>ID</th><th>Ad</th><th>Açıklama</th><th>İşlemler</th></tr></thead>
          <tbody>
            {liste.map((k) => (
              <tr key={k.id}>
                <td>{k.id}</td>
                <td><Badge className="badge-pudra">{k.ad}</Badge></td>
                <td>{k.aciklama}</td>
                <td>
                  <Button size="sm" className="btn-outline-bordo me-2" onClick={() => ac(k)}>Düzenle</Button>
                  <Button size="sm" variant="outline-danger" onClick={() => setSilOnay(k)}>Sil</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton><Modal.Title>{duzenle ? 'Kategori Düzenle' : 'Yeni Kategori'}</Modal.Title></Modal.Header>
        <Form onSubmit={kaydet}>
          <Modal.Body>
            <Form.Group className="mb-3"><Form.Label>Ad</Form.Label>
              <Form.Control required value={form.ad} onChange={(e) => setForm({ ...form, ad: e.target.value })} /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Açıklama</Form.Label>
              <Form.Control as="textarea" rows={3} value={form.aciklama} onChange={(e) => setForm({ ...form, aciklama: e.target.value })} /></Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShow(false)}>İptal</Button>
            <Button type="submit" className="btn-bordo">Kaydet</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={!!silOnay} onHide={() => setSilOnay(null)} centered>
        <Modal.Header closeButton><Modal.Title>Kategori Sil</Modal.Title></Modal.Header>
        <Modal.Body><strong>{silOnay?.ad}</strong> kategorisi silinsin mi?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setSilOnay(null)}>Vazgeç</Button>
          <Button variant="danger" onClick={sil}>Evet, Sil</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
