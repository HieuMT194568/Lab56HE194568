import React, { useEffect, useState } from 'react'
import { Alert, Button, Card, Col, Container, Row, Table } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom';
import api from '../api/axios';

function Questions() {
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const [res,setRes] =useState([]);
  
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

const subjectName = res.filter((e) => (e.id.toLowerCase().includes(questions[0].subjectId)) ) ;


  return (
    <Container >
             <Row className='p-5'><h2 bordered>Hello, {user?.email} ({user?.role})</h2></Row>
      <Row className='p-3'>
        <Col xs={10}>
        <h2 bordered>Bộ câu hỏi môn: {subjectName.name}</h2>
        <Row className='p-3'>
        
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
       
        {questions.map((e, index) => (
           <tr key={index}>
          <td>{index + 1}</td>
          <td>{e.content}</td>
          <td> {e.options.map((p)=> <>{p},</> )} </td>
          <td>{e.correctAnswer}</td>
          <td>
            <Button as={Link} to={`/questions/${e.id}`} size="sm" className="me-2">
              Sửa
            </Button>
            <Button size="sm" variant="secondary">
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
    </Container>
  )
}

export default Questions
