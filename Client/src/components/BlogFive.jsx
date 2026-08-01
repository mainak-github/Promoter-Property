
import { blogs } from '../data/HomeOneData/HomeOneData';
import SectionHeading from '../common/SectionHeading';
import BlogItemFive from './items/BlogItemFive';

const BlogFive = () => {
    return (
        <section className="blog padding-y-120">
            <div className="container container-two">

                <SectionHeading
                    headingClass="style-center"  
                    subtitle="Latest blog and news"
                    subtitleClass="bg-white" 
                    title="Investing in estate made lot easy" 
                    renderDesc={false}
                    desc="Real estate is a lucrative industry that involves the buying selling and renting of properties. It encompasses residential commercial and industrial properties Real estate agents play a crucial role in facilitating real estate"
                    renderButton={false}
                    buttonClass="btn-main"
                    buttonText="View More"
                />

                <div className="row gy-4">
                    {
                        blogs.slice(3,6).map((blogItem, blogIndex) => {
                            return (
                                <div className="col-lg-4 col-sm-6" key={blogIndex}>
                                    <BlogItemFive blogItem={blogItem}/>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </section>
    );
};

export default BlogFive;