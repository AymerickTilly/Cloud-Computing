import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Modal, Button, Container, Row, Col, Card, Form } from "react-bootstrap";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateItemSchema, TUpdateItemSchema } from "../schemas/TupdateItemSchemas";
import { loadProducts } from "../api/loadProducts";
import { uploadImage } from "../api/uploadImage";
import { updateAnItem } from "../api/updateAnItem";
import { deleteImage } from "../api/deleteImage";

type Product = {
  productId: string;
  name: string;
  category: string;
  description: string;
  price: number;
  stock: {
    size: string;
    stockAmount: number;
  }[];
  imageUrl: string;
  onSale?: boolean;
  salePrice?: number;
};

const UpdateItemPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TUpdateItemSchema>({
    resolver: zodResolver(updateItemSchema),
    defaultValues: {
      stock: [{ size: "M", stockAmount: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "stock",
  });

  const loadAndSetProducts = async () => {
    try {
      const loaded = await loadProducts();
      setProducts(loaded);
    } catch (err) {
      console.error("Failed to load products:", err);
    }
  };

  useEffect(() => {
    loadAndSetProducts();
  }, []);

  const openModal = (product: Product) => {
    setSelectedProduct(product);
    setUploadedImageUrl(product.imageUrl || null);

    setValue("name", product.name);
    setValue("category", product.category);
    setValue("description", product.description);
    setValue("price", product.price);
    setValue(
      "stock",
      product.stock.map((item) => ({
        size: item.size as "XS" | "S" | "M" | "L" | "XL" | "XXL",
        stockAmount: item.stockAmount,
      }))
    );
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    reset();
    setUploadedImageUrl(null);
  };

  const onSubmit = async (data: TUpdateItemSchema) => {
    if (!selectedProduct) {
      alert("No product selected.");
      return;
    }

    const productId = selectedProduct.productId;

    try {
      let imageUrl = uploadedImageUrl;

      if (data.image?.[0]) {
        if (selectedProduct.imageUrl) {
          const deleted = await deleteImage(selectedProduct.imageUrl);
          if (!deleted) {
            alert("Failed to delete old image.");
            return;
          }
        }

        imageUrl = await uploadImage(data.image[0]);
        if (!imageUrl) {
          alert("Image upload failed.");
          return;
        }
      } else if (!imageUrl) {
        alert("Please upload an image or keep the existing one.");
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { image, ...rest } = data;

      const updatedProduct = {
        productId,
        ...rest,
        imageUrl,
      };

      const result = await updateAnItem(updatedProduct);
      if (!result) {
        alert("Failed to update product.");
        return;
      }

      alert("Product updated successfully!");
      handleClose();
      await loadAndSetProducts(); // ✅ reload products after update
    } catch (err) {
      alert(`Failed to update product: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
  };

  return (
    <Container className="py-4">
      <Row className="g-4">
        {products.map((product) => (
          <Col key={product.productId} xs={12} sm={6} md={4}>
            <Card className="h-100 shadow-sm">
              <Row className="g-0 h-100">
                <Col xs={5} className="d-flex align-items-center justify-content-center p-2">
                  <Card.Img
                    src={product.imageUrl}
                    alt={product.name}
                    style={{ maxHeight: "200px", objectFit: "contain" }}
                  />
                </Col>
                <Col xs={7}>
                  <Card.Body>
                    <Card.Title className="fw-bold fs-5 mb-2">{product.name}</Card.Title>
                    <Card.Text>{product.description}</Card.Text>
                    <Card.Text>Price: ${product.price}</Card.Text>
                    {product.onSale && (
                      <Card.Text className="text-danger">Sale Price: ${product.salePrice}</Card.Text>
                    )}
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => openModal(product)}
                    >
                      Update Product Details
                    </Button>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal */}
      <Modal show={showModal} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" {...register("name")} isInvalid={!!errors.name} />
              <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} {...register("description")} isInvalid={!!errors.description} />
              <Form.Control.Feedback type="invalid">{errors.description?.message}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control type="number" step="0.01" {...register("price")} isInvalid={!!errors.price} />
              <Form.Control.Feedback type="invalid">{errors.price?.message}</Form.Control.Feedback>
            </Form.Group>

            <h5>Stock</h5>
            {fields.map((field, index) => (
              <Row key={field.id} className="align-items-end mb-3">
                <Col md={5}>
                  <Form.Label>Size</Form.Label>
                  <Form.Select {...register(`stock.${index}.size` as const)}>
                    {(["XS", "S", "M", "L", "XL", "XXL"] as const).map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={5}>
                  <Form.Label>Amount</Form.Label>
                  <Form.Control type="number" {...register(`stock.${index}.stockAmount` as const)} />
                </Col>
                <Col md={2}>
                  <Button variant="danger" onClick={() => remove(index)}>Remove</Button>
                </Col>
              </Row>
            ))}
            <Button variant="secondary" onClick={() => append({ size: "M", stockAmount: 0 })}>
              Add Stock
            </Button>

            <Form.Group className="mb-3 mt-3">
              <Form.Label>Image</Form.Label>
              <Form.Control type="file" accept="image/*" {...register("image")} />
              {uploadedImageUrl && (
                <div className="mt-3 d-flex justify-content-center">
                  <img
                    src={uploadedImageUrl}
                    alt="Uploaded"
                    style={{ maxWidth: "150px", maxHeight: "200px", objectFit: "contain" }}
                  />
                </div>
              )}
            </Form.Group>

            <Button type="submit" className="w-100">
              {isSubmitting ? "Updating..." : "Update Product"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default UpdateItemPage;
