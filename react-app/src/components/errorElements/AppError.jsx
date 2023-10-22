import '../../css/AppError.css';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AppError = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate('/');
    }, 2000);
  }, []);

  return (
    <div className='errorElement'>
      something went wrong, redirecting...
    </div>
  );
};

export default AppError;