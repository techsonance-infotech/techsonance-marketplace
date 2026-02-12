import { Outlet, useNavigate, useParams } from 'react-router';
import type { RootState } from '../../../store';
import { useSelector } from 'react-redux';
import { ArrowLeft, LogIn, UserCircle2, UserPlus } from 'lucide-react';

export function Unauthorized() {
    const { user } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();

    if (!user) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center bg-white px-4">
                <div className="max-w-md w-full text-center space-y-8 p-10 border border-gray-100 rounded-3xl shadow-sm">
                    <div className="flex flex-col items-center gap-4">
                        <div className="bg-blue-50 p-6 rounded-full">
                            <UserCircle2 size={64} className="text-blue-500" />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold text-gray-900"></h1>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Log in to view your orders, manage your wishlist, and update your personal settings.
                            </p>
                        </div>
                    </div>


                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => navigate('/auth/customerLogin', { replace: true })}
                            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-md active:scale-95"
                        >
                            <LogIn size={18} />
                            Login Now
                        </button>

                        <button
                            onClick={() => navigate('/auth/customerRegister', { replace: true })}
                            className="w-full flex items-center justify-center gap-2 bg-white border-2 border-gray-200 hover:border-gray-900 text-gray-900 font-semibold py-3 px-6 rounded-xl transition-all active:scale-95"
                        >
                            <UserPlus size={18} />
                            Create an Account
                        </button>
                    </div>


                    <button
                        onClick={() => navigate('/shopping')}
                        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-blue-600 transition-colors"
                    >
                        <ArrowLeft size={14} />
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }
    return (
        <Outlet />
    )
}
