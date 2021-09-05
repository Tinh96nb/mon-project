import UserDetails from '../Components/UserDetails'
import DetailsHero from '../Components/DetailsHero'
import HistoryTable from '../Components/historyTable'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getDetail, getHistoryTrade } from 'redux/nftReducer';

export default function DetailNFT() {
  const dispatch = useDispatch();

  const { tokenId } = useParams();
  const { detail, histories } = useSelector((state) => state.nft)

  useEffect(() => {
    if (tokenId) {
      dispatch(getDetail(tokenId));
      dispatch(getHistoryTrade(tokenId))
    }
  }, tokenId)

  return (
    <>
    <UserDetails owner={detail?.owner}/>
    <DetailsHero detail={detail} />
    <HistoryTable histories={histories} />
    </>
  )
}
