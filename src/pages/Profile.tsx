import React, { useState, useRef } from 'react';
import { Container, Form, Button, Image } from 'react-bootstrap';
import profilePlaceholder from '../assets/profile-placeholder.jpg'; // You can keep this as default

const Profile = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [profileImage, setProfileImage] = useState<string | undefined>(profilePlaceholder);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    alert(`Saved Profile:\nName: ${name}\nEmail: ${email}\nAddress: ${address}`);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  return (
    <Container style={{ maxWidth: 600, marginTop: 50, fontFamily: 'Times New Roman, serif' }}>
      <h2 className="mb-4 text-center">Profile</h2>

      <div className="text-center mb-4">
        <Image
          src={profileImage}
          alt="Profile"
          roundedCircle
          width={120}
          height={120}
          style={{ objectFit: 'cover', cursor: 'pointer' }}
          onClick={handleImageClick}
          title="Click to upload a new photo"
        />
        <input
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={handleImageChange}
        />
        <div style={{ fontSize: '0.9rem', marginTop: '8px', color: 'gray' }}>Click photo to update</div>
      </div>

      <Form>
        <Form.Group className="mb-3" controlId="profileName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="profileEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-4" controlId="profileAddress">
          <Form.Label>Address</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter your address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </Form.Group>

        <div className="d-grid gap-2">
          <Button variant="primary" size="lg" onClick={handleSave}>
            Save
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default Profile;
