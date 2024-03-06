import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
import { ListOnScrollProps, VariableSizeList, VariableSizeListProps } from 'react-window';

function easeInOut(t: number) {
    return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
}

interface Props extends VariableSizeListProps {
    duration?: number;
    onAnimationComplete?(): void;
}

export interface VirtualizedListRef {
    scrollToOffset: (offset: number) => boolean;
}

export const VirtualizedList = forwardRef<VirtualizedListRef, Props>(
    ({ duration = 1000, onAnimationComplete, onScroll, ...props }, fwdRef) => {
        const listRef = useRef<VariableSizeList>(null);

        const scrollOffsetInitial = useRef(0);
        const scrollOffsetFinal = useRef(0);
        const animationStartTime = useRef(0);

        const animate = useCallback(() => {
            requestAnimationFrame(() => {
                const now = Date.now();
                const ellapsed = now - animationStartTime.current;
                const scrollDelta = scrollOffsetFinal.current - scrollOffsetInitial.current;
                const easedTime = easeInOut(Math.min(1, ellapsed / duration));
                const scrollOffset = scrollOffsetInitial.current + scrollDelta * easedTime;

                listRef.current?.scrollTo(scrollOffset);

                if (ellapsed >= duration || scrollDelta === 0) {
                    animationStartTime.current = 0;
                    scrollOffsetInitial.current = scrollOffsetFinal.current;
                    onAnimationComplete?.();
                } else {
                    animate();
                }
            });
        }, [duration, onAnimationComplete]);

        useImperativeHandle(
            fwdRef,
            () => ({
                scrollToOffset(offset: number) {
                    if (animationStartTime.current) return false;
                    animationStartTime.current = Date.now();
                    scrollOffsetFinal.current = offset;
                    animate();
                    return true;
                },
            }),
            [animate]
        );

        const onScrollWrapper = useCallback(
            (onScrollProps: ListOnScrollProps) => {
                if (!onScrollProps.scrollUpdateWasRequested) {
                    scrollOffsetInitial.current = onScrollProps.scrollOffset;
                }

                onScroll?.(onScrollProps);
            },
            [onScroll]
        );

        return <VariableSizeList {...props} onScroll={onScrollWrapper} ref={listRef} />;
    }
);
