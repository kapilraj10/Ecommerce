import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading');
  const { user } = useAuth();

  useEffect(() => {
    const verify = async () => {
      const token = searchParams.get('token');
      if (!token) { setStatus('error'); return; }
      try {
        await api.get(`/auth/verify-email/${token}`);
        setStatus('success');
        toast.success('Email verified successfully!');
      } catch {
        setStatus('error');
      }
    };
    verify();
  }, [searchParams]);

  const handleResend = async () => {
    try {
      await api.post('/auth/resend-verification');
      toast.success('Verification email sent');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="text-center max-w-md animate-fade-in">
        {status === 'loading' && <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-200 border-t-primary-600 mx-auto" />}
        {status === 'success' && (
          <>
            <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
              <FiCheckCircle className="h-10 w-10 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Email Verified!</h1>
            <p className="text-gray-500 mb-6">Your email has been verified successfully.</p>
            <Link to="/profile" className="btn-primary">Go to Profile</Link>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <FiXCircle className="h-10 w-10 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Verification Failed</h1>
            <p className="text-gray-500 mb-6">The verification link is invalid or has expired.</p>
            {user && <button onClick={handleResend} className="btn-primary">Resend Verification Email</button>}
            {!user && <Link to="/login" className="btn-primary">Login</Link>}
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;