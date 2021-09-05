import { useEffect } from 'react'
import { useState } from 'react'
import {Container, Row, Col} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { getAllowance, setMAxAllowance } from 'redux/userReducer'
import { displayAddress, getFile, toDisplayNumber } from 'utils/hepler'
import toast from './Toast'

const DetailsHero = ({detail}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  
  const {userAddress, priceToken, contractMarket, contractToken} = useSelector((state) => state.home)
  const {allowance} = useSelector((state) => state.user)
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userAddress && contractToken) {
      dispatch(getAllowance());
    }
  }, [userAddress, contractToken])

  const setBuy = () => {
    contractMarket.methods
    .purchase(detail.token_id)
    .send({from: userAddress})
    .then((res) => {
      setLoading(false)
      toast.success("Buy NFT successfully!");
      history.push(`/creator/${userAddress}`)
    })
    .catch((e) => {
      setLoading(false)
      toast.error({message: "Buy NFT error!"});
    })
  }
  
  if (!detail) return null;
  return (
    <>
      <div className="detailsHeroArea">
      <Container>
        <Row>
          <Col xs="12" lg="6" className="align-self-center">
            <div className="detailsHeroImg">
              <img src={getFile(detail?.media)} alt={detail?.name} />
            </div>
          </Col>
          <Col xs="12" lg="6" className="align-self-center">
            <div className="detailsHeroDeta">
              <h1>{detail?.name}</h1>
              <p>{detail?.description}.</p>

              <h6 className="current_price">Current Price</h6>
              <h2>
                <img src="/assets/img/icons/main-icon.png" alt="icon price" />
                {toDisplayNumber(detail?.price || 0)}
              </h2>
              <h5>${toDisplayNumber(detail ? +detail.price*priceToken : 0)}</h5>

              <button
                className="buyNow_btn"
                disabled={loading}
                onClick={() => {
                  setLoading(true)
                  const cb = (res) => {
                    setLoading(false);
                    if (res) toast.success("Approve successfully, you can buy NFT!")
                    else toast.error({message: "You must be approve to buy NFT!"});
                  }
                  if (+allowance <= +detail.price)
                    return dispatch(setMAxAllowance(cb))
                  return setBuy();
                }}
              >
                {loading && <div className="loader"></div>}
                {+allowance <= +detail.price ? 'Approve to buy' : 'buy now'}{loading && '...'}
              </button>
              <div className="creators_details row justify-content-between">
                <div className="col">
                  <p>Creator: <span>
                    {detail?.author?.username || displayAddress(detail?.author?.address)}
                  </span></p>
                  <p>Metadata: 
                    <a href={`${detail.metadata.replace("ipfs://", "https://ipfs.io/ipfs/")}`} target="_blank"><span> view ipfs</span></a>
                  </p>
                </div>
                <div className="col text-right">
                  <p>Amount trade: <span>{detail?.amount_trade}</span></p>
                  <p>Total vol: <span>{detail?.total_vol} MON</span></p>
                </div>
              </div>
              <div className="creator_addre">
                <p>Contract Address: <span>
                  {displayAddress(process.env.REACT_APP_CONTRACT_NFT, 8, 6)}
                </span></p>
                <p>Token ID: <span>{detail?.token_id}</span></p>
                <p>Blockchain: <span>Binance Smart Chain</span></p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      </div>
    </>
  )
}

export default DetailsHero
