import React from 'react';
import { Empty, Button } from 'antd';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; 

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f4f4f4',
      padding: '20px',
      flexDirection: 'column'
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          textAlign: 'center',
          padding: '20px',
          borderRadius: '10px',
          backgroundColor: '#fff',
          boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)',
          width: '100%',
          maxWidth: '600px'
        }}
      >
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={<span style={{ fontSize: '24px', fontWeight: 'bold' }}>404 - Page Not Found</span>}
        />
        
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            type="primary"
            size="large"
            onClick={() => navigate('/dashboard')}
            style={{ marginTop: '20px', fontSize: '16px', padding: '10px 20px' }}
          >
            Go Back to Home
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PageNotFound;
