

const NewsletterFooter = () => {
    return (
        <div className="footer-top flx-between gap-3">
            <div className="footer-top__left">
                <span className="icon">
                    <img src="assets/images/icons/envelop-icon.svg" alt=""/>
                </span>
                <h2 className="text text-white mb-0">Subscribe to My newsletter</h2>
            </div>
            <form action="#" className="subscribe-form d-flex align-items-center gap-3">
                <div className="position-relative w-100">
                    <input type="text" className="common-input common-input--withLeftIcon w-100" placeholder="Enter Your Email Address"/>
                    <span className="input-icon input-icon--left text-gradient font-20 line-height-1"><i className="far fa-envelope"></i></span>
                </div>
                <button type="submit" className="btn btn-main flex-shrink-0 fw-normal">Subscribe</button>
            </form>
        </div>
    );
};

export default NewsletterFooter;