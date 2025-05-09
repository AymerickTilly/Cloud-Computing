import { useAuthStore } from '../auth/AuthStore'; // adjust the path as needed

const Home = () => {
  const { user, email, groups, loading } = useAuthStore();
  console.log(email)

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Home Page</h1>
      {user ? (
        <>
          <p>Welcome, {email}!</p>
          <p>Your groups: {groups.join(', ') || 'None'}</p>
        </>
      ) : (
        <p>You are not logged in.</p>
      )}
    </div>
  );
};

export default Home;
