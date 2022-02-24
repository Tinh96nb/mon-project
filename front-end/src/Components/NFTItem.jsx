import LazyImage from "Components/LazyImage";
import { Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { displayAddress, getFile, toDisplayNumber } from "utils/hepler";

function NFTItem({
  nft,
  i,
  priceToken,
}) {
  const avt = nft.owner?.avatar
    ? getFile(nft.owner.avatar)
    : "/assets/img/user/avatar.jpg";
  const typeMedia = nft?.mine_type?.split("/")[0];
  let media = nft.thumbnail ? nft.thumbnail : nft.media;
  media = media
    ? getFile(media, typeMedia === "video")
    : "/assets/img/portfolio/default.jpeg";
  return (
    <Col sm="6" lg="4" key={i}>
      <div className="single_portfolio">
        <Link to={`/detail/${nft.token_id}`}>
          <div className="portfolio_img">
            {typeMedia === "image" ? (
              <LazyImage src={media} alt={nft.name} />
            ) : (
              <video
                autoPlay={false}
                loop={true}
                playsInline={true}
                src={media}
              />
            )}
          </div>
        </Link>

        <div className="portfolio_content">
          <h5>{nft.name}</h5>
          <h1 className="portfolio_title">
            <img src="/assets/img/icons/main-icon.svg" />{" "}
            {nft.price
              ? toDisplayNumber(+parseFloat(nft.price).toFixed(2))
              : 0}{" "}
            MON{" "}
            <span>
              ${toDisplayNumber(nft ? parseFloat((+nft?.price * priceToken).toString()).toFixed(2) : 0)}
            </span>
          </h1>
          <div className="author">
            <img src={avt} alt={nft.owner?.address} />
            <Link to={`/creator/${nft?.owner?.address}`}>
              {nft?.owner?.username || displayAddress(nft?.owner?.address)}
              {nft?.owner?.verify ? <svg viewBox="0 0 24 24" aria-label="Verified account" className="verify r-1fmj7o5 r-4qtqp9 r-yyyyoo r-1xvli5t r-9cviqr r-f9ja8p r-og9te1 r-bnwqim r-1plcrui r-lrvibr"><g><path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"></path></g></svg> : null}
            </Link>
          </div>
        </div>
      </div>
    </Col>
  );
}

export default NFTItem;
