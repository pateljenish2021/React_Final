import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, FormGroup } from "reactstrap";
import { Link } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, provider, db } from '../firebase';
import { toast } from 'react-toastify';
import googleimg from '../assets/images/google.png';
import { Spinner } from 'reactstrap';
 
const Signup = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);


  const signup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (password !== confirmPassword) {
        setLoading(false);
        toast.error('Passwords do not match.');
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        displayName: username,
        email,
      });
      await updateProfile(user, {
        displayName: username,
      });
      setLoading(false);
      toast.success('Account created successfully!');
    } catch (error) {
      console.error("Signup error:", error);
      setLoading(false);
      toast.error(error.message || 'An error occurred.');
    }
  };

  return (
    <section className="sect__bg">
      <Container>
        <Row>
          {loading ? (
            <Col lg='12' className="text-center">
              <Spinner color="primary" />
            </Col>
          ) : (
            <Row>
              <Col lg='6' className="m-auto text-center signup-form">
                <h3 className="fw-bold fs-2 mb-4">Welcome!</h3>
                <h6 className="mb-4">Sign Up to continue</h6>

                <Form className="auth__form" onSubmit={signup}>
                  <div className="auth__formo">
                    <button 
                      type="button" 
                      className="buy__button auth__btn google_btn" 
                      onClick={() => signInWithPopup(auth, provider)}
                      disabled={loading} 
                    >
                      <img src={googleimg} alt="" /> Sign Up with Google
                    </button>
                    <p className='OR'>OR</p>
                  </div>

                  <FormGroup className="form__group">
                    <input 
                      type="text" 
                      placeholder="Name" 
                      required 
                      value={username} 
                      onChange={e => setUsername(e.target.value)} 
                      disabled={loading} 
                    />
                  </FormGroup>
                  <FormGroup className="form__group">
                    <input 
                      type="email" 
                      placeholder="E-mail" 
                      required 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                      disabled={loading}
                    />
                  </FormGroup>
                  <FormGroup className="form__group">
                    <input 
                      type="password" 
                      placeholder="Password" 
                      required 
                      value={password} 
                      onChange={e => setPassword(e.target.value)} 
                      disabled={loading}
                    />
                  </FormGroup>
                  <FormGroup className="form__group">
                    <input 
                      type="password" 
                      placeholder="Confirm Password" 
                      required 
                      value={confirmPassword} 
                      onChange={e => setConfirmPassword(e.target.value)} 
                      disabled={loading}
                    />
                  </FormGroup>
                  <button 
                    type="submit" 
                    className="buy__button auth__btn"
                    disabled={loading} 
                  >
                    {loading ? <Spinner size="sm" color="light" /> : "Sign Up"}
                  </button>
                  <p>Already have an account? <Link to='/login'>Login</Link></p>
                </Form>
              </Col>
            </Row>
          )}
        </Row>
      </Container>
    </section>
  );
};

export default Signup;