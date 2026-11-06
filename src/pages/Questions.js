import React, { useEffect, useState } from 'react'
import { Alert, Button, Col, Container, Form, InputGroup, Modal, Row, Table } from 'react-bootstrap'
import { useParams } from 'react-router-dom';
import api from '../api/axios';

function Questions() {
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const [res,setRes] =useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ content: "", options: [], correctIndex: -1 });
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/subjects');
        setRes(res.data);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
      }
    };

    fetch();
  }, []);
  useEffect(() => {
    const load = async () => {
      try {
        const res1 = await api.get('/questions', { params: { subjectId: id } });
        setQuestions(res1.data);
      } catch (err) {
        console.error('Lỗi khi lấy dữ liệu:', err);
        setError('Không thể tải bộ câu hỏi');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const subjectName = res.find((e) => e.id === id)?.name;

  const openEdit = (question) => {
    // Dữ liệu cũ có thể lưu nhiều đáp án trong một chuỗi, cách nhau bởi dấu ";"
    const options = question.options
      .flatMap((option) => option.split(';'))
      .map((option) => option.trim())
      .filter(Boolean);

    setForm({
      content: question.content,
      options,
      correctIndex: options.indexOf(question.correctAnswer),
    });
    setFormError("");
    setEditing(question);
  };

  const updateOption = (index, value) => {
    setForm((prev) => ({
      ...prev,
      options: prev.options.map((option, i) => (i === index ? value : option)),
    }));
  };

  const addOption = () => {
    setForm((prev) => ({ ...prev, options: [...prev.options, ""] }));
  };

  const removeOption = (index) => {
    setForm((prev) => {
      let correctIndex = prev.correctIndex;
      if (index === correctIndex) correctIndex = -1;
      else if (index < correctIndex) correctIndex -= 1;

      return {
        ...prev,
        options: prev.options.filter((_, i) => i !== index),
        correctIndex,
      };
    });
  };

  const handleSave = async (event) => {
    event.preventDefault();

    const content = form.content.trim();
    const options = form.options.map((option) => option.trim());

    if (!content) {
      setFormError("Vui lòng nhập nội dung câu hỏi");
      return;
    }
    if (options.length < 2 || options.some((option) => !option)) {
      setFormError("Cần ít nhất 2 đáp án và không được để trống đáp án nào");
      return;
    }
    if (new Set(options).size !== options.length) {
      setFormError("Các đáp án không được trùng nhau");
      return;
    }
    if (form.correctIndex < 0) {
      setFormError("Vui lòng chọn đáp án đúng");
      return;
    }

    setSaving(true);
    try {
      const updated = await api.patch(`/questions/${editing.id}`, {
        content,
        options,
        correctAnswer: options[form.correctIndex],
      });
      setQuestions((prev) => prev.map((q) => (q.id === editing.id ? updated.data : q)));
      setEditing(null);
    } catch (err) {
      console.error('Lỗi khi cập nhật câu hỏi:', err);
      setFormError("Không thể lưu câu hỏi");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (question) => {
    if (!window.confirm(`Bạn có chắc muốn xóa câu hỏi "${question.content}"?`)) return;

    setError("");
    try {
      await api.delete(`/questions/${question.id}`);
    } catch (err) {
      console.error('Lỗi khi xóa câu hỏi:', err);
      setError("Không thể xóa câu hỏi");
      return;
    }

    const remaining = questions.filter((q) => q.id !== question.id);
    setQuestions(remaining);

    try {
      await api.patch(`/subjects/${id}`, { questionsCount: remaining.length });
    } catch (err) {
      console.error('Lỗi khi cập nhật số lượng câu hỏi:', err);
      setError("Đã xóa câu hỏi nhưng không cập nhật được số lượng câu hỏi của môn");
    }
  };


  return (
    <Container >
             <Row className='p-5'><h2 bordered>Hello, {user?.email} ({user?.role})</h2></Row>
      <Row className='p-3'>
        <Col xs={10}>
        <h2 bordered>Bộ câu hỏi môn: {subjectName}</h2>
        <Row className='p-3'>
        {error && <Alert variant="danger">{error}</Alert>}
         <Table striped bordered >
      <thead>
        <tr>
          <th>#  </th>
          <th>Nội dung câu hỏi</th>
          <th>Các đáp án</th>
          <th>Đáp án đúng</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
       
        {!loading && !error && questions.length === 0 && (
          <tr>
            <td colSpan={5} className="text-center">Môn học này chưa có câu hỏi</td>
          </tr>
        )}
        {questions.map((e, index) => (
           <tr key={e.id}>
          <td>{index + 1}</td>
          <td>{e.content}</td>
          <td>{e.options.join(', ')}</td>
          <td>{e.correctAnswer}</td>
          <td>
            <Button size="sm" className="me-2" onClick={() => openEdit(e)}>
              Sửa
            </Button>
            <Button size="sm" variant="danger" onClick={() => handleDelete(e)}>
              Xóa
            </Button>
          </td>
          </tr>))}

      </tbody>
    </Table>
    </Row>
         </Col>
        {/* <Col>< button className="btn bg-danger ms-3" onClick={handleLogout}>
            Logout
          </button> </Col> */}
      </Row>

      <Modal show={editing !== null} onHide={() => setEditing(null)}>
        <Form onSubmit={handleSave}>
          <Modal.Header closeButton>
            <Modal.Title>Sửa câu hỏi</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {formError && <Alert variant="danger">{formError}</Alert>}

            <Form.Group className="mb-3" controlId="questionContent">
              <Form.Label>Nội dung câu hỏi</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={form.content}
                onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
              />
            </Form.Group>

            <Form.Label>Các đáp án (chọn đáp án đúng)</Form.Label>
            {form.options.map((option, index) => (
              <InputGroup className="mb-2" key={index}>
                <InputGroup.Radio
                  name="correctAnswer"
                  aria-label={`Chọn đáp án ${index + 1} là đáp án đúng`}
                  checked={form.correctIndex === index}
                  onChange={() => setForm((prev) => ({ ...prev, correctIndex: index }))}
                />
                <Form.Control
                  aria-label={`Đáp án ${index + 1}`}
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                />
                <Button
                  variant="outline-danger"
                  disabled={form.options.length <= 2}
                  onClick={() => removeOption(index)}
                >
                  Bỏ
                </Button>
              </InputGroup>
            ))}
            <Button variant="outline-primary" size="sm" onClick={addOption}>
              Thêm đáp án
            </Button>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setEditing(null)}>
              Hủy
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Đang lưu..." : "Lưu"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  )
}

export default Questions
