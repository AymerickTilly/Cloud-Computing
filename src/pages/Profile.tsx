import React, { useEffect, useState } from "react";
import { Form, Button, Card, Container, Row, Col, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
//import { getUserFromId } from "../api/getUser";
//import { getIdToken, getUserId } from "../auth/AuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileUpdateSchema, TprofileUpdateFormData } from "../schemas/TprofileUpdateSchema";
import { useAuthStore } from "../auth/AuthStore";
import { loadUserById } from "../api/loadUser";
import { updateUser } from "../api/updateUser";
import { User } from "../types/User";

type ProfileData = {
  username: string;
  address: string;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);

  const { userId } = useAuthStore();
  
  const {
  register,
  handleSubmit,
  setValue,
  formState: { errors, isDirty },
} = useForm<TprofileUpdateFormData>({
  resolver: zodResolver(profileUpdateSchema),
});

  useEffect(() => {
    async function fetchProfile() {
      const data = await loadUserById(userId);
      if (data) {
        setProfile(data);
        setValue("address", data.address);
      }
    }
    fetchProfile();
  }, [setValue, userId]);

  const onSubmit = async (formData: TprofileUpdateFormData) => {
  console.log("Form Data Submitted:", formData);

  try {
    if (!userId) {
      console.error("User ID is missing, cannot update profile.");
      return;
    }

    if (!profile){ 
      throw new Error("Failed to delete update profile.");
    }

    const userData: User = {
      userId,
      username: profile.username,
      address: formData.address,
      // Add other updatable fields here if needed (e.g., username, phone, etc.)
    };

    const response = await updateUser(userData);

    if (response) {
      console.log("User update successful:", response);
      setProfile((prev) => prev ? { ...prev, address: formData.address } : prev);
      setEditMode(false);
    } else {
      console.error("Failed to update user.");
    }
  } catch (error) {
    console.error("Error in profile update:", error);
  }
};


  return (
    <Container className="mt-5">
      <Card>
        <Card.Body>
          <Card.Title>Profile</Card.Title>
          {profile ? (
            <>
              <p><strong>Username:</strong> {profile.username}</p>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group controlId="formAddress">
                  <Form.Label>Delivery Address</Form.Label>
                  <Form.Control
                    type="text"
                    {...register("address")}
                    disabled={!editMode}
                  />
                  {errors.address && (
                    <Form.Text className="text-danger">
                      {errors.address.message}
                    </Form.Text>
                  )}
                </Form.Group>
                <div className="mt-3">
                  {editMode ? (
                    <Button variant="primary" type="submit" disabled={!isDirty}>
                      Update
                    </Button>
                  ) : (
                    <Button variant="outline-secondary" onClick={() => setEditMode(true)}>
                      Edit Address
                    </Button>
                  )}
                </div>
              </Form>
            </>
          ) : (
            <p>Loading profile...</p>
          )}
        </Card.Body>
      </Card>

      <Row className="mt-4">
        <Col>
          <Button variant="outline-dark" onClick={() => alert("Redirect to Orders page")}>
            View Orders
          </Button>
        </Col>
        <Col>
          <Button variant="outline-primary" onClick={() => setShowCartModal(true)}>
            View Cart
          </Button>
        </Col>
      </Row>

      <Modal show={showCartModal} onHide={() => setShowCartModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Your Cart</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Replace this with dynamic cart content */}
          <p>Cart contents will appear here...</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCartModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
