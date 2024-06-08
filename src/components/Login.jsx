import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import "../styles/login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform login logic here, such as making an API call
    // Example: apiService.login({ email, password });
    // For demonstration purposes, let's just show a success message
    setMessage("Login successful!");
  };

  return (
    <Container fluid className="login-container">
      <Row className="justify-content-center align-items-center h-100">
        <Col xs={12} md={6}>
          <div className="login-box p-4">
            <h2 className="mb-4">Login</h2>
            {message && <Alert variant="success">{message}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formEmail" className="mb-3">
                <Form.Control
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control-login"
                  required
                />
              </Form.Group>

              <Form.Group controlId="formPassword" className="mb-3">
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control-login"
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="btn-login">
                Login
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
