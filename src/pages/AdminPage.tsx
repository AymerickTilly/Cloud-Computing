import { Button, Card, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {

    const navigate = useNavigate();


    return(
        <Container
      fluid
      className="d-flex align-items-center justify-content-center min-vh-100 bg-light"
    >
      <Card className="p-4 shadow" style={{ width: "100%", maxWidth: "400px" }}>
        <h2 className="text-center mb-4">Admin Dashboard</h2>

        <div className="d-grid gap-3">
          <Button variant="primary" size="lg" onClick={() => navigate("/admin/add-item")}>
            ➕ Add Item
          </Button>

          <Button variant="outline-secondary" size="lg" onClick={() => navigate("/admin/update-item")}>
            ✏️ Update Item
          </Button>

          <Button variant="secondary" size="lg" onClick={() => navigate("/admin/orders")}>
            📦 List Orders
          </Button>
        </div>
      </Card>
    </Container>
    )
}

export default AdminPage;