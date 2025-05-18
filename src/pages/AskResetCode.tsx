import { useForm } from "react-hook-form";
import { askCodeResetSchema, TaskCodeResetSchema } from "../schemas/TaskCodeResetSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useAuthStore } from "../auth/AuthStore";
import handleResetPassword from "../auth/SendPwdVerificationCode";

const AskResetCode = () => {

    const navigate = useNavigate();
    const {setPasswordReset, setEmail} = useAuthStore();

    const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TaskCodeResetSchema>({
    resolver: zodResolver(askCodeResetSchema),
  });

  const onSubmit = async (data: TaskCodeResetSchema) => {
    try {
        await handleResetPassword(data.email);
        setEmail(data.email)
        navigate("/resetPassword")
    } catch (err: unknown) {
      setPasswordReset(false)
      console.log(err);
    }
    reset();
  };

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={10} md={6} lg={4}>
          <h3 className="text-center mb-4">Reset Password</h3>
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

            <Button
              variant="primary"
              type="submit"
              disabled={isSubmitting}
              className="w-100"
            >
              {isSubmitting ? "Sending reset password information..." : "Reset password"}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default AskResetCode;