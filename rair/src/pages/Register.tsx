import { handleSignUp } from "../auth/SignUp"; // Adjust path to your signUp.ts
import { TsignUpSchema, signUpSchema } from "../schemas/TsignUpSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TsignUpSchema>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: TsignUpSchema) => {
    try {
      const result = await handleSignUp({
        username: data.username,
        password: data.password,
        email: data.email,
      });

      if (result?.nextStep?.signUpStep === 'CONFIRM_SIGN_UP') {
        navigate('/confirmRegister', { state: { username: data.username } });
      } else if (result?.isSignUpComplete) {
        navigate('/login'); // fallback
      }
    } catch (err) {
      console.error("Signup error:", err);
    }
    reset();
  };

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={10} md={6} lg={4}>
          <h3 className="text-center mb-4">Create your account</h3>
          <Form onSubmit={handleSubmit(onSubmit)}>

            <Form.Group className="mb-3" controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                placeholder="Enter username"
                {...register("username")}
                isInvalid={!!errors.username}
              />
              <Form.Control.Feedback type="invalid">
                {errors.username?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                {...register("email")}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                {...register("password")}
                isInvalid={!!errors.password}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formConfirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm password"
                {...register("confirmpassword")}
                isInvalid={!!errors.confirmpassword}
              />
              <Form.Control.Feedback type="invalid">
                {errors.confirmpassword?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              disabled={isSubmitting}
              className="w-100"
            >
              {isSubmitting ? "Creating your account ..." : "Sign up"}
            </Button>
          </Form>

          <div className="text-center mt-3">
            <small>
              Already have an account?{" "}
              <Link to="/login">Login</Link>
            </small>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterForm;
