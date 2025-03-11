import { BeatLoader } from 'react-spinners';

const Loading = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <BeatLoader color="#6cb4e4" />
        </div>
    );
};

export default Loading;