import { useEffect, useState } from 'react';
import './RectangleSvg.css';

export interface RectangeSvgProps {
    width: number | undefined;
    height: number | undefined;
    onChangingDimentions: (width: number, height: number) => void;
    onDimentionsChanged: (width: number, height: number) => void;
}

export function RectangleSvg(props: RectangeSvgProps) {
    const svgWidth = '100%';
    const svgHeight = '88vh';
    const minimumRectangleWidth = 40;
    const minimumRectangleHeight = 40;
    const boundaryMargin = 20;

    const [rectangle, setRectangle] = useState({
        x: boundaryMargin,
        y: boundaryMargin,
        width: props.width ?? 0,
        height: props.height ?? 0,
    });
    const [dragging, setDragging] = useState<string | null>(null);
    const [cursor, setCursor] = useState('default');

    const handleMouseDown = (e: any) => {
        const margin = 10;
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const { x, y, width, height } = rectangle;

        // Set dragging direction
        if (mouseX > x + width - margin && mouseY > y + height - margin) {
            setDragging('bottom-right');
        } else if (mouseX > x + width - margin) {
            setDragging('right');
        } else if (mouseY > y + height - margin) {
            setDragging('bottom');
        }
    };

    const handleMouseMove = (e: any) => {
        if (!dragging) return;

        let newRect = { ...rectangle };
        const offsetX = e.movementX;
        const offsetY = e.movementY;

        // Get SVG dimensions
        const svgElement = document.querySelector('svg');
        if (!svgElement) return;
        const svgWidth = svgElement.clientWidth - boundaryMargin;
        const svgHeight = svgElement.clientHeight - boundaryMargin;

        if (dragging === 'right') {
            newRect.width = Math.min(
                svgWidth - rectangle.x, // Maximum width based on SVG boundary
                Math.max(minimumRectangleWidth, rectangle.width + offsetX)
            );
        } else if (dragging === 'bottom') {
            newRect.height = Math.min(
                svgHeight - rectangle.y, // Maximum height based on SVG boundary
                Math.max(minimumRectangleHeight, rectangle.height + offsetY)
            );
        } else if (dragging === 'bottom-right') {
            newRect.width = Math.min(
                svgWidth - rectangle.x, // Maximum width based on SVG boundary
                Math.max(minimumRectangleWidth, rectangle.width + offsetX)
            );
            newRect.height = Math.min(
                svgHeight - rectangle.y, // Maximum height based on SVG boundary
                Math.max(minimumRectangleHeight, rectangle.height + offsetY)
            );
        }

        setRectangle(newRect);
        props.onChangingDimentions(newRect.width, newRect.height);
    };

    const handleMouseUp = () => {
        setDragging(null);
        props.onDimentionsChanged(rectangle.width, rectangle.height);
    };

    function isValidRectangle(): boolean {
        return (
            rectangle.height != undefined &&
            rectangle.width != undefined &&
            rectangle.height >= minimumRectangleHeight &&
            rectangle.width >= minimumRectangleWidth
        );
    }

    useEffect(() => {
        const updateCursor = (e: MouseEvent) => {
            const margin = 5;
            const mouseX = e.clientX;
            const mouseY = e.clientY;

            // Get the SVG element's bounding rectangle
            const svgRect = document
                .querySelector('svg')
                ?.getBoundingClientRect();
            if (!svgRect) return;

            // Calculate actual screen coordinates
            const screenX = svgRect.x + rectangle.x;
            const screenY = svgRect.y + rectangle.y;
            const rectRight = screenX + rectangle.width;
            const rectBottom = screenY + rectangle.height;

            // Check if mouse is within the rectangle area
            const isNearRectangle =
                mouseX >= screenX - margin &&
                mouseX <= rectRight + margin &&
                mouseY >= screenY - margin &&
                mouseY <= rectBottom + margin;

            if (!isNearRectangle) {
                setCursor('default');
                return;
            }

            // Edge detection using screen coordinates
            const isNearRightEdge = Math.abs(mouseX - rectRight) <= margin;
            const isNearBottomEdge = Math.abs(mouseY - rectBottom) <= margin;

            // Sett cursor icon
            if (isNearRightEdge && isNearBottomEdge) {
                setCursor('nwse-resize');
            } else if (isNearRightEdge) {
                setCursor('ew-resize');
            } else if (isNearBottomEdge) {
                setCursor('ns-resize');
            } else {
                setCursor('default');
            }
        };

        window.addEventListener('mousemove', updateCursor);
        return () => window.removeEventListener('mousemove', updateCursor);
    }, [rectangle]);

    return isValidRectangle() ? (
        <svg
            className="main-svg"
            width={svgWidth}
            height={svgHeight}
            style={{ cursor }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onMouseDown={handleMouseDown}
        >
            {/* Rectangle */}
            <rect
                x={rectangle.x}
                y={rectangle.y}
                width={rectangle.width}
                height={rectangle.height}
                fill="lightblue"
                stroke="black"
                strokeWidth="1"
            />
        </svg>
    ) : (
        <></>
    );
}
