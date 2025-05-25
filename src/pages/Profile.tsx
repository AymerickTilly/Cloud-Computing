import { useEffect, useState } from "react";
import { Form, Button, Card, Container, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
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

      if (!profile) {
        throw new Error("Failed to update profile.");
      }

      const userData: User = {
        userId,
        username: profile.username,
        address: formData.address,
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
      <Card className="p-4 shadow-sm rounded-4">
        <Row className="align-items-center">
          <Col md={2} className="text-center mb-3 mb-md-0">
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                backgroundColor: "#e9ecef",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px",
                fontWeight: "bold",
              }}
            >
              {profile?.username?.[0]?.toUpperCase() || "U"}
            </div>
          </Col>
          <Col md={10}>
            <h4 className="mb-1">Profile</h4>
            <p className="mb-4 text-muted">{profile?.username}</p>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Form.Group controlId="formAddress">
                <Form.Label><strong>Delivery Address</strong></Form.Label>
                <Form.Control
                  type="text"
                  {...register("address")}
                  disabled={!editMode}
                  className="rounded-3"
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
                    Save Changes
                  </Button>
                ) : (
                  <Button variant="outline-secondary" onClick={() => setEditMode(true)}>
                    Edit Address
                  </Button>
                )}
              </div>
            </Form>
          </Col>
        </Row>
      </Card>
    </Container>
  );
}
