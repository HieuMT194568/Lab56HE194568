import React from 'react'
import { Button, Col, Container, Form, Row, Table } from 'react-bootstrap'
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import { useEffect } from 'react';
import { useState } from 'react';

function Subjects() {
  const [searchParams, setSearchParams] = useSearchParams();
  const keywords = searchParams.get("keywords") || "";

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
  const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchParams(value ? { keywords: value } : {}, { replace: true });
  };

  const search = keywords.trim().toLowerCase();
  const filteredSubjects = res.filter((subject) =>
    subject.name.toLowerCase().includes(search) ||
    subject.id.toLowerCase().includes(search),
  );

  return (
        <Container >
             <Row className='p-5'><h2 bordered>Hello, {user?.email} ({user?.role})</h2></Row>
      <Row className='p-3'>
        <Col xs={10}>
        <h2 bordered>Danh sách Môn học</h2>
        <Row className='p-3'>
        <Form.Control
          type="search"
          className="mb-3"
          placeholder="Tìm theo mã môn hoặc tên môn học"
          aria-label="Tìm theo mã môn hoặc tên môn học"
          value={keywords}
          onChange={handleSearch}
        />
        <Table striped bordered >
      <thead>
        <tr>
          <th>Mã môn  </th>
          <th>Tên môn học</th>
          <th>Số lượng câu hỏi</th>
          <th>Tools</th>
        </tr>
      </thead>
      <tbody>
       
        {filteredSubjects.map((e, index) => ( <tr key={index}>
          <td>{e.id}</td>
          <td>{e.name}</td>
          <td>{e.questionsCount}</td>
          <td>
            <Button as={Link} to={`/questions/${e.id}`} size="sm" className="me-2">
              Bộ câu hỏi
            </Button>
            <Button size="sm" variant="secondary">
              Thông tin
            </Button>
          </td>
          </tr>))}
        
      </tbody>
    </Table>
    </Row>
         </Col>
        <Col>< button className="btn bg-danger ms-3" onClick={handleLogout}>
            Quay lại danh sách môn
          </button> </Col>
      </Row>
    </Container>
  )
}

export default Subjects