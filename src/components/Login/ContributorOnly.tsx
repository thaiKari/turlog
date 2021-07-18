import React, { Suspense } from 'react'
import { useRecoilValue } from 'recoil';
import { isContributorState } from '../../data/user';

interface Props {

}

const ContributorOnlyContent: React.FC<Props> = ({ children }) => {
    const isContributor = useRecoilValue(isContributorState);

    if (!isContributor) return <div></div>;
    return <>{children}</>
}


export const ContributorOnly: React.FC<Props> = (props) => {
    return(
    <Suspense fallback={<></>}>
        <ContributorOnlyContent {...props} />
    </Suspense>)

}
