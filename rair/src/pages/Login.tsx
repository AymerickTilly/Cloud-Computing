import { TsignInSchema, signInSchema } from "../schemas/TsignInSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signIn } from "../auth/SignIn";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const FormWithReactHookFormAndZod = () => {

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TsignInSchema>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: TsignInSchema) => {
    try {
      await signIn({ username: data.email, password: data.password });
      navigate('/');
    } catch (err: unknown) {
      console.log(err);
    }
    reset();
  };

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={10} md={6} lg={4}>
          <h3 className="text-center mb-4">Login</h3>
          <Form onSubmit={handleSubmit(onSubmit)}>
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

            <Button
              variant="primary"
              type="submit"
              disabled={isSubmitting}
              className="w-100"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </Form>

          <div className="text-center mt-3">
            <small>
              Don't have an account?{" "}
              <Link to="/register">Register here</Link>
            </small>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default FormWithReactHookFormAndZod;