import UserDetails from '../Components/UserDetails'
import DetailNFT from '../Components/DetailNFT'
import HistoryTable from '../Components/historyTable'
import { useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getDetail, getHistoryTrade } from 'redux/nftReducer';

export default function Detail() {
  const dispatch = useDispatch();
  const history = useHistory();

  const { tokenId } = useParams();
  const { detail, histories } = useSelector((state) => state.nft)

  useEffect(() => {
    if (tokenId) {
      dispatch(getDetail(tokenId));
      dispatch(getHistoryTrade(tokenId))
    }
  }, [tokenId])

  if (detail && +detail.status !== 2) {
    history.push("/marketplace");
  }
  return (
    <>
    <UserDetails tokenId={tokenId} owner={detail?.owner}/>
    <DetailNFT detail={detail} />
    <HistoryTable histories={histories} />
    </>
  )
}
