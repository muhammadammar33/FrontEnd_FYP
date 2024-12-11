import Image from 'next/image';
import Elysian from '@/public/images/Ely.gif';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-screen flex bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-300 to-blue-900">
            <div className="flex-1 flex items-center justify-center">
                <Image className="h-3/2 w-3/2 rounded-full inset-0 object-cover" src={Elysian} alt="Logo" />
            </div>
            <div className="flex-1 flex items-center justify-center">
                {children}
            </div>
        </div>
    );
};

export default AuthLayout;
