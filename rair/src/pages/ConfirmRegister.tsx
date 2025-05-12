import { TsignUpConfirmSchema, signUpConfirmSchema } from "../schemas/TsignUpConfirmSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { handleSignUpConfirmation } from "../auth/ConfirmSignUp";
import { signIn } from "../auth/SignIn";
import { useAuthStore } from "../auth/AuthStore";

const ConfirmRegisterForm = () => {

  const navigate = useNavigate();
  const { resetAuth, setLoading, pendingUsername } = useAuthStore.getState();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TsignUpConfirmSchema>({
    resolver: zodResolver(signUpConfirmSchema),
  });

  // Rest of the component
  const onSubmit = async (data: TsignUpConfirmSchema) => {
    try {
      await handleSignUpConfirmation({
        username: data.email,
        confirmationCode: data.code,
      });
  
      // Proceed to sign in after confirmation
      try {
        await signIn({ username: data.email, password: data.password });
        useAuthStore.getState().setPendingUsername(null);
        navigate('/');
      } catch (err: unknown) {
        console.error("Sign-in error after confirmation:", err);
        console.log("There was an error with your sign up confirmation")
        resetAuth()
        setLoading(false)
        navigate('/login');
      }
    } catch (err) {
      console.error("Confirmation error:", err);
      console.log("Another error")
      resetAuth()
      setLoading(false)
    }
  
    reset();
  };
  

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={10} md={6} lg={4}>
          <h3 className="text-center mb-4">Confirmation Code</h3>
          <Form onSubmit={handleSubmit(onSubmit)}>

          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
                type="email"
                placeholder={pendingUsername ? pendingUsername : "Enter your email"}
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