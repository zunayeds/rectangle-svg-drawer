import { useEffect, useRef, useState } from 'react';
import './App.css';
import { Constants } from './utilities/constants';
import { RectangleSvg } from './components/rectangle-svg/RectangleSvg';
import useAxios from './hooks/useAxios';
import { ToastContainer } from 'react-toastify';
import {
    showErrorMessage,
    isValidFileFormat,
    showSuccessMessage,
    getPerimeter,
} from './utilities/helper';
import { SyncLoader } from 'react-spinners';
import { FileFormatModal } from './components/file-format-modal/FileFormatModal';

function App() {
    const initialFetchRef = useRef(false);
    const inputFile = useRef<HTMLInputElement>(null);
    const [rectangleWidth, setRectangleWidth] = useState<number | undefined>(
        undefined
    );
    const [rectangleHeight, setRectangleHeight] = useState<number | undefined>(
        undefined
    );
    const [perimeter, setPerimeter] = useState<number | undefined>(undefined);
    const {
        response,
        error,
        loading,
        successfullyCompleted,
        fetchData,
        saveData,
    } = useAxios();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [pendingRequest, setPendingRequest] = useState<
        { width: number; height: number } | undefined
    >(undefined);

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (!isValidFileFormat(file)) {
                showErrorMessage(Constants.InvalidFileTypeError);
            } else {
                const reader = new FileReader();
                reader.onload = onFileReaderOnLoad;
                reader.readAsText(file);
            }

            // Clear current file selection
            if (inputFile.current) {
                inputFile.current.value = '';
            }
        }
    };

    const onFileReaderOnLoad = (e: any) => {
        try {
            const fileContent = JSON.parse(e.target.result);
            if (!fileContent.width || !fileContent.height) {
                setIsModalOpen(true);
            } else {
                // Set Rectangle width and height from file and call save API
                const width = fileContent.width;
                const height = fileContent.height;
                setRectangleWidth(width);
                setRectangleHeight(height);
                onChangingDimention(width, height);
                saveRectangle(width, height);
            }
        } catch (error) {
            setIsModalOpen(true);
        }
    };

    const onUploadButtonClick = () => {
        // Immitate default file input's button click
        inputFile.current?.click();
    };

    const onChangingDimention = (width: number, height: number) => {
        setPerimeter(getPerimeter(width, height));
    };

    const onDimentionChanged = (width: number, height: number) => {
        if (width != rectangleWidth || height != rectangleHeight) {
            // Set new width and height when resizing finished
            setRectangleWidth(width);
            setRectangleHeight(height);

            if (loading) {
                // If currently saving then store the latest dimentions as pending request
                setPendingRequest({ width, height });
            } else {
                // If there is no pending requests or not processing a request then call save API
                saveRectangle(width, height);
            }
        }
    };

    const getRectangle = () => {
        fetchData(Constants.RectangleApiUrl);
    };

    const saveRectangle = (width: number, height: number) => {
        saveData(Constants.RectangleApiUrl, 'POST', {
            width,
            height,
        });
    };

    const processPendingRequest = () => {
        if (pendingRequest) {
            saveRectangle(pendingRequest.width, pendingRequest.height);
            setPendingRequest(undefined);
        }
    };

    useEffect(() => {
        if (!initialFetchRef.current) {
            initialFetchRef.current = true;
            getRectangle();
        }
    }, []);

    useEffect(() => {
        if (rectangleWidth && error?.length) {
            // Show error from only the save API
            showErrorMessage(error);

            // Process new save request if any request pending
            processPendingRequest();
        }
    }, [error]);

    useEffect(() => {
        if (!response && successfullyCompleted) {
            // Show success message only the save API
            showSuccessMessage(Constants.SaveSuccessMessage);

            // Process new save request if any request pending
            processPendingRequest();
        }
    }, [successfullyCompleted]);

    useEffect(() => {
        if (!rectangleWidth && response != null) {
            // Set initial dimention from get API
            const width = (response as any).width;
            const height = (response as any).height;
            setRectangleWidth(width);
            setRectangleHeight(height);
            onChangingDimention(width, height);
        }
    }, [response]);

    return (
        <>
            <div className="header-div">
                <div>
                    <input
                        type="file"
                        hidden
                        accept=".json"
                        ref={inputFile}
                        onChange={onFileChange}
                    />
                    <button
                        className="upload-button"
                        hidden={rectangleWidth != undefined}
                        onClick={onUploadButtonClick}
                    >
                        Upload Initial File
                    </button>
                    {perimeter ? (
                        <p className="perimeter">Perimeter: {perimeter}</p>
                    ) : (
                        <></>
                    )}
                </div>
                <SyncLoader
                    loading={loading && rectangleHeight != undefined}
                    size={20}
                    aria-label="Loading..."
                />
            </div>
            <br />
            <RectangleSvg
                key={`rect-${rectangleWidth}-${rectangleHeight}`}
                height={rectangleHeight}
                width={rectangleWidth}
                onChangingDimentions={onChangingDimention}
                onDimentionsChanged={onDimentionChanged}
            />
            <ToastContainer position="top-center" />
            <FileFormatModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}

export default App;
