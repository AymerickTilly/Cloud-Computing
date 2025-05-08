import { TsignUpConfirmSchema, signUpConfirmSchema } from "../schemas/TsignUpConfirmSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const ConfirmRegisterForm = () => {

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TsignUpConfirmSchema>({
    resolver: zodResolver(signUpConfirmSchema),
  });

  const onSubmit = async (data: TsignUpConfirmSchema) => {
    try {
      //const user = await signIn({ username: data.email, password: data.password});
      //console.log(user);
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
          <h3 className="text-center mb-4">Confirmation Code</h3>
          <Form onSubmit={handleSubmit(onSubmit)}>

          <Form.Group className="mb-3" controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                placeholder="Enter your username"
                {...register("username")}
                isInvalid={!!errors.username}
              />
              <Form.Control.Feedback type="invalid">
                {errors.username?.message}
              </Form.Control.Feedback>
            </Form.Group>


            <Form.Group className="mb-3" controlId="formCode">
              <Form.Label>Confirmation Code</Form.Label>
              <Form.Control
                placeholder="Enter the confirmation code"
                {...register("code")}
                isInvalid={!!errors.code}
              />
              <Form.Control.Feedback type="invalid">
                {errors.code?.message}
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
        </Col>
      </Row>
    </Container>
  );
};

export default ConfirmRegisterForm;