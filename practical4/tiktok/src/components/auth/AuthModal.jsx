'use client';
import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { LoginForm, RegisterForm } from './AuthForms';

export default function AuthModal({ isOpen, onClose }) {
  const [mode, setMode] = useState('login');

  const handleClose = () => {
    setMode('login');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      {mode === 'login'
        ? <LoginForm onSuccess={handleClose} onSwitchToRegister={() => setMode('register')} />
        : <RegisterForm onSuccess={handleClose} onSwitchToLogin={() => setMode('login')} />
      }
    </Modal>
  );
}