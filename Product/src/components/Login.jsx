import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, FormGroup } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import { toast } from 'react-toastify';
import googleimg from '../assets/images/google.png';
import { Spinner } from 'reactstrap'; 

const Login = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const signInWithEmail = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      setLoading(false);
      toast.success('Login successful');
      navigate('/home');
    } catch (error) {
      setLoading(false);
      if (error.code === "auth/user-not-found") {
        toast.error('User not found. Please sign up to continue.');
      } else if (error.code === "auth/wrong-password") {
        toast.error('Wrong password. Please try again.');
      } else {
        toast.error('An error occurred. Please try again later.');
      }
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      setLoading(false);
      toast.success('Login successful');
      navigate('/home');
    } catch (error) {
      setLoading(false);
      toast.error('An error occurred. Please try again later.');
    }
  };

  return (
    <>
      <section className="sect__bg">
        <Container>
          <Row>
            {loading ? (
              <Col lg='12' className="text-center">
                <Spinner color="primary" />
              </Col>
            ) : (
              <Row>
                <Col lg='5' className="m-auto text-center login-form">
                  <h3 className="fw-bold fs-2 mb-4">Login to continue</h3>

                  <Form className="auth__form" onSubmit={signInWithEmail}>
                    <button 
                      type="button" 
                      className="buy__button auth__btn google_btn" 
                      onClick={handleGoogleLogin}
                      disabled={loading} 
                    >
                      <img src={googleimg} alt="" /> Login with Google
                    </button>
                    <p className="OR">OR</p>

                    <FormGroup className="form__group">
                      <input 
                        type="email" 
                        placeholder="E-mail" 
                        value={email} 
                        onChange={e => setEmail(e.target.value)} 
                        disabled={loading} 
                      />
                    </FormGroup>
                    <FormGroup className="form__group">
                      <input 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        disabled={loading} 
                      />
                    </FormGroup>

                    <button 
                      type="submit" 
                      className="buy__button auth__btn"
                      disabled={loading} 
                    >
                      {loading ? <Spinner size="sm" color="light" /> : "Login"}
                    </button>
                    <p>Don't have an account? <Link to='/signup'>Sign Up</Link></p>
                  </Form>
                </Col>
              </Row>
            )}
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Login;
