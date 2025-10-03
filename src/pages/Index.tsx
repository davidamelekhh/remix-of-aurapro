import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect client to their project
    navigate('/project/1');
  }, [navigate]);

  return null;
};

export default Index;
