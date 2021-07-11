/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import { useSetRecoilState } from 'recoil';
import { isMobileState } from '../data/state';

export const IsMobileCalculator = () => {
    const setIsMobileState = useSetRecoilState(isMobileState);

    function handleWindowSizeChange() {
        setIsMobileState(window.innerWidth < 768);
    }

    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);

    return (<></>)
}
