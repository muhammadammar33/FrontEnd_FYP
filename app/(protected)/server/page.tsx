import { currentUser } from '@/lib/auth';
import { UserInfo } from '@/components/User-Info/user-info';

const ServerPage = async () => {
    const user = await currentUser();

    return <UserInfo label="💻 Server Component" user={user} />;
};

export default ServerPage;