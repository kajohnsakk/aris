import React, { Component } from 'react'
import { withTranslation, Trans } from 'react-i18next';
// import CircularProgress from "@material-ui/core/CircularProgress";
// import SimpleImageSlider from "react-simple-image-slider";
import { withStyles } from "@material-ui/core/styles";
import Cookies from "js-cookie";
import Axios from "axios";
import TagManager from 'react-gtm-module';

// import logo from '../assets/Logobanner.png';
import topright from '../assets/KV-banner.png';
import imgneed1 from '../assets/ic_Opportunities.png';
import imgneed2 from "../assets/IC_SalesProcess.png";
import imgneed3 from "../assets/IC_Streaming.png";
import midleft from '../assets/KV_OurSolutions.png';
import sol1 from "../assets/IC_Automated.png";
import sol2 from "../assets/IC_Conversational.png";
import sol3 from "../assets/IC_Professional.png";
// import img1 from "../assets/Artboard1.jpg";
// import no1 from "../assets/IC_num1.png";
// import no2 from "../assets/IC_num2.png";
// import no3 from "../assets/IC_num3.png";
// import footerlogo from "../assets/LOGO_footer.png";
// import { Carousel } from 'react-responsive-carousel';
import Navigation from './Navigation';
import i18n from './i18n';

const styles = theme => ({
    layoutRoot: {},
    highlightText: {
        color: theme.palette.primary.color,
        fontWeight: "bolder"
    },
});



class HomePage extends Component {
    state = {
        email: '',
        about: false,
        contact: false,
        blog: false,
        fontFamily: "kanit ",
        textFont: "kanit ",
        allowCookie: false
    }    

    toggleAbout = () => {
        this.setState({ about: !this.state.about });
    }

    toggleContact = () => {
        this.setState({ contact: !this.state.contact });
    }

    doAllowCookie = () => {
        Cookies.set("ALLOW_COOKIE", "TRUE")
        this.setState({ allowCookie: true });
    }

    async componentDidMount() {
        if (Cookies.get("isLoggedIn") === "true"){
            let cookieValue = Cookies.get("email");
            let res = await Axios.get('https://beta.arislab.ai/api/utility/emailDecoder/encodedEmail/' + cookieValue)
            // let res = await Axios.get('https://beta.arislab.ai/api/utility/emailDecoder/encodedEmail/6cb31edb6194bae2f23cc5a9345252c998e962c9e96c502cdc9a90c34be8a8f77f04cad73a')
            let email = res.data.result;
            this.setState({
                email: email
            })
        }

        if (Cookies.get('ALLOW_COOKIE')) {
            this.setState({
                allowCookie: true
            });
        }

        const tagManagerArgs = {
            dataLayer: {
                event: 'ARIS',
                pageCategory: 'Homepage',
                pageAction: 'View',
                pageLabel: 'Aris Homepage',
                pageUser: this.state.email || "Anonymous"
            }
        }
        TagManager.dataLayer(tagManagerArgs)

        const tagManagerArgs1 = {
            dataLayer: {
                event: 'ARIS',
                pageCategory: 'Homepage',
                pageAction: 'View',
                pageLabel: '1. Visit Homepage',
                pageUser: this.state.email || "Anonymous"
            }
        }
        TagManager.dataLayer(tagManagerArgs1)
    }

    componentDidUpdate() {
        if (i18n.language === "en" && this.state.fontFamily !== "fredoka "){
            this.setState({
                fontFamily: "fredoka ",
                textFont: "roboto "
            })
        }

        if (i18n.language === "th" && this.state.fontFamily !== "kanit "){
            this.setState({
                fontFamily: "kanit ",
                textFont: "kanit "
            })
        }

    }

    componentWillUnmount() {
        const tagManagerArgs = {
            dataLayer: {
                event: 'ARIS',
                pageCategory: 'Homepage',
                pageAction: 'Leave',
                pageLabel: 'Aris Homepage',
                pageUser: this.state.email|| "Anonymous"
            }
        }
        TagManager.dataLayer(tagManagerArgs)

        const tagManagerArgs1 = {
            dataLayer: {
                event: 'ARIS',
                pageCategory: 'Homepage',
                pageAction: 'Leave',
                pageLabel: '0. Drop',
                pageUser: this.state.email || "Anonymous"
            }
        }
        TagManager.dataLayer(tagManagerArgs1)
    }

    clickButton = (name) => {
        const tagManagerArgs = {
            dataLayer: {
                event: 'ARIS',
                pageCategory: 'Homepage',
                pageAction: 'Click',
                pageLabel: 'Click ' + name,
                pageUser: this.state.email || "Anonymous"
            }
        }
        TagManager.dataLayer(tagManagerArgs);

        const tagManagerArgs1 = {
            dataLayer: {
                event: 'ARIS',
                pageCategory: 'Homepage',
                pageAction: 'Click',
                pageLabel: '2. Click Signup',
                pageUser: this.state.email || "Anonymous"
            }
        }
        TagManager.dataLayer(tagManagerArgs1)

        if (name === "Homepage sign up button"){
            window.location.href = "https://beta.arislab.ai";
        }
    }

    render() {
        const { fontFamily, textFont } = this.state

        const images = [
            { url: "../assets/Artboard1.jpg" },
            { url: "assets/Artboard2.jpg" },
            { url: "assets/Artboard3.jpg" },
            { url: "assets/Artboard4.jpg" },
            { url: "assets/One-page-benefit.jpg" }
        ];


        return (
            <div className={fontFamily}>
                {/* <div className="m-auto"> */}
                    <Navigation email={this.state.email}/>
                {/* </div> */}
                

                {/* <div>
                    <SimpleImageSlider
                        width={896}
                        height={504} 
                        images={images}
                    />
                </div> */}

                {/* <Carousel>
                    <div>
                        <img src={img1} />
                    </div>
                </Carousel> */}

                {/* -------------------------------------------------------------Start of top Section ------------------------------------------------------------------------------ */}

                <div className='top'>
                    <div className='container mx-auto'>
                        <div className='flex pt-24'>
                            <div className='md:pl-24 md:pt-20 w-full md:w-1/2 text-center md:text-left'>
                                <svg className="mb-4" width="145" height="53" viewBox="0 0 145 53" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.3687 42.1359C1.53967 33.3524 1.53967 19.1046 10.3687 10.3153C19.1976 1.52593 33.5192 1.53174 42.354 10.3153L45.001 7.68195C34.7053 -2.56065 18.0173 -2.56065 7.72171 7.68195C-2.5739 17.9246 -2.5739 34.5266 7.72171 44.7693C18.0173 55.0119 34.7053 55.0119 45.001 44.7693L42.354 42.1359C33.525 50.9253 19.2035 50.9253 10.3687 42.1359Z" fill="white"/>
                                    <path d="M40.2475 12.6764C32.6397 5.10785 20.3107 5.10785 12.7029 12.6764C8.89902 16.4607 7 21.4193 7 26.3778H9.50086C9.50086 22.0529 11.1603 17.7338 14.4734 14.4378C21.1053 7.83999 31.8509 7.83999 38.4828 14.4378C45.1148 21.0356 45.1148 31.7258 38.4828 38.3236C35.1698 41.6196 30.8225 43.2706 26.4752 43.2706V45.7585C31.4594 45.7585 36.4436 43.8693 40.2475 40.085C47.8552 32.5164 47.8552 20.245 40.2475 12.6764Z" fill="white"/>
                                    <path d="M35.2272 25.7428L27.6136 30.1201L20 34.4915V25.7428V17L27.6136 21.3714L35.2272 25.7428Z" fill="white"/>
                                    <path d="M78.5045 12C76.6113 12 75.0629 13.4649 74.9285 15.3134C72.7256 13.3486 69.6112 12.1686 66.4326 12.1686C59.4383 12.1686 52 17.3945 52 27.0733C52 31.311 53.5777 35.165 56.435 37.9379C59.0877 40.5072 62.7105 41.9779 66.3741 41.9779C69.6054 41.9779 72.6847 40.7688 74.911 38.6877V38.6936C74.911 40.6642 76.5237 42.2628 78.4987 42.2628C80.4795 42.2628 82.0863 40.6584 82.0863 38.6936V15.5692C82.0922 13.5986 80.4853 12 78.5045 12ZM67.2039 35.3162C62.6813 35.3162 59.1345 31.6714 59.1345 27.0151C59.1345 22.3937 62.6754 18.7722 67.2039 18.7722C71.7264 18.7722 75.2732 22.3937 75.2732 27.0151C75.2732 31.6714 71.7264 35.3162 67.2039 35.3162Z" fill="white"/>
                                    <path d="M113.588 12C111.607 12 110 13.6044 110 15.5692V38.6877C110 40.6584 111.613 42.257 113.588 42.257C115.563 42.257 117.175 40.6525 117.175 38.6877V15.5692C117.175 13.5986 115.569 12 113.588 12Z" fill="white"/>
                                    <path d="M104.325 12.7208H103.367H100.971H100.819C100.761 12.7208 100.708 12.7266 100.65 12.7266H100.62C97.9442 12.7964 95.7472 13.6974 94.1695 15.3599C94.0585 13.4881 92.4926 12 90.5877 12C88.6069 12 87 13.6044 87 15.5692V38.6877C87 40.6584 88.6127 42.257 90.5877 42.257C92.5685 42.257 94.1754 40.6525 94.1754 38.6877V25.0212C94.6195 21.173 96.3315 19.6035 100.083 19.6035H100.778H100.784H100.819H104.319C106.224 19.6035 107.778 18.063 107.778 16.1621C107.778 14.2613 106.23 12.7208 104.325 12.7208Z" fill="white"/>
                                    <path d="M117.209 6.55286C117.35 4.36792 115.685 2.48272 113.488 2.34216C111.292 2.20159 109.397 3.85888 109.256 6.04382C109.115 8.22876 110.78 10.114 112.977 10.2545C115.173 10.3951 117.068 8.7378 117.209 6.55286Z" fill="white"/>
                                    <path d="M134.736 23.6029L134.666 23.5854C130.769 22.7251 128.736 22.2077 128.736 20.8242C128.736 19.2372 130.383 18.1735 132.832 18.1735C135.303 18.1735 137.342 19.1849 138.435 20.9463C139.037 22.1089 140.206 22.8181 141.503 22.8181C143.402 22.8181 144.944 21.2834 144.944 19.3942C144.944 18.7838 144.775 18.1793 144.459 17.6445L144.454 17.6328L144.448 17.6212C144.413 17.5689 144.296 17.3887 144.214 17.2841C141.812 13.8776 137.775 12 132.837 12H132.703C129.548 12 126.679 12.9533 124.622 14.6798C122.67 16.3191 121.548 18.5978 121.548 20.9288C121.548 27.6139 128.087 28.9916 131.599 29.7298L132.276 29.8693C135.689 30.5611 137.757 31.0784 137.757 32.5026C137.757 34.5605 135.56 35.4789 133.387 35.4789C130.559 35.4789 128.315 34.2059 126.895 31.8051C126.27 30.5785 125.025 29.817 123.646 29.817C121.636 29.817 120 31.4447 120 33.4444C120 34.3512 120.421 35.1185 120.783 35.6824C123.313 39.7283 127.579 41.8675 133.112 41.8675H133.235C137.851 41.8675 140.603 40.1352 142.093 38.6819C143.846 36.9787 144.892 34.6244 144.892 32.3922C144.892 25.8234 138.534 24.4341 134.736 23.6029Z" fill="white"/>
                                </svg>

                                <h1 className='whitespace-no-wrap text-white header-l md:header-xl'><Trans i18nKey="homePage.title1">SOCIAL COMMERCE</Trans> </h1>
                                <h1 className='text-yellow header-l md:header-xl pb-2'><Trans i18nKey="homePage.title11"></Trans></h1>
                                <p className={textFont + "text-white mb-0 text-lg tracking-wide pb-1"}> <Trans i18nKey="homePage.title2"/></p>
                                <p className={textFont + "text-white mb-0 text-lg tracking-wide"}> <Trans i18nKey="homePage.title21" /></p>
                                <button
                                    type='button'
                                    style={{ letterSpacing: '1px', border: '2px', borderRadius: '40px', width: '150px', height: '40px', color: '#EB3390', backgroundColor: "#FFFFFF", fontSize: '13pt', fontStyle: 'Bold', marginTop: '25px' }}
                                    variant='light'
                                    // href='https://beta.arislab.ai'
                                    onClick={(event) => this.clickButton('Homepage sign up button')}
                                    >
                                        <Trans i18nKey="homePage.signUp"/>
                                </button>

                            </div>
                            <div className='hidden md:flex md:w-1/2 items-center'>
                                <img
                                    alt=""
                                    src = {topright}
                                    width = '100%'
                                    // height = '100%'
                                    className='md:w-5/6'
                                />
                            </div>
                        </div>
                    </div>
                </div>


                {/* -------------------------------------------------------------End of top Section ------------------------------------------------------------------------------ */}

                <div className='container mx-auto'>
                    <div className='row'>
                        <div className='col pb-8'>
                            <div align='center'>
                                <h1><Trans i18nKey="homePage.weKnow" /></h1>
                                <h6><Trans i18nKey="homePage.hardwork" /> </h6>
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-col md:flex-row content-center justify-center pb-6'>
                        
                        <div className='col px-12 pb-12 md:pb-0 md:pr-12 text-center'>
                            <img
                                alt=""
                                src={imgneed1}
                                style = {{marginBottom: '6%'}}
                            />
                            <h4 align='center'> <Trans i18nKey="homePage.need11" /> </h4>
                            <h1 className="homepage-pink font-bold" align='center'> <Trans i18nKey="homePage.need12" />  </h1>
                            <h6 align='center' className={textFont}> <Trans i18nKey="homePage.need13" />  </h6>
                        </div>

                        <div className='col px-12 pb-12 md:pb-0 text-center'>
                            <img
                                alt=""
                                src={imgneed2}
                                style={{ marginBottom: '6%' }}
                            />
                            <h4 align='center'> <Trans i18nKey="homePage.need21" />  </h4>
                            <h1 className="homepage-pink font-bold" align='center' > <Trans i18nKey="homePage.need22" /> </h1>
                            <h6 align='center' className={textFont + 'h6'}> <Trans i18nKey="homePage.need23" /> </h6>
                            <h6 align='center' className={textFont + 'h6'}> <Trans i18nKey="homePage.need24" />  </h6>
                        </div>
                        <div className='col px-12 md:pl-12 text-center'>
                            <img
                                alt=""
                                src={imgneed3}
                                style={{ marginBottom: '6%' }}
                            />
                            <h4 align='center'> <Trans i18nKey="homePage.need31" />  </h4>
                            <h1 className="homepage-pink font-bold" align='center'> <Trans i18nKey="homePage.need32" />  </h1>
                            <h6 align='center' className={textFont}> <Trans i18nKey="homePage.need33" />  </h6>
                        </div>
                        
                    </div>

                    <hr />

                    <div className='container lg-auto'>
                        <div className='flex pt-6'>
                            <div className='col w-1/2 hidden md:block pt-12 align-left'>
                                <img
                                    alt=""
                                    src={midleft}
                                    width='80%'
                                    // height='85%'
                                />
                            </div> 

                            <div className='col w-full md:w-1/2 md:mt-24'>
                                <div className='row text-center'>
                                    <div className='flex-col inline'>
                                        <h1 align=''> <Trans i18nKey="homePage.solutions" />  </h1>
                                        <h6 className={textFont + "text-grey-dark"} align='' > <Trans i18nKey="homePage.solutionSub" />  </h6>
                                        <h6 className={textFont + "text-grey-dark"} align='' > <Trans i18nKey="homePage.solutionSub2" /> </h6>
                                    </div>
                                </div>

                                <div className='flex row text-center justify-center md:text-left md:justify-start mt-4'>
                                    <div className='hidden md:block w-1/6 pl-3'>
                                        <img
                                            alt=""
                                            src={sol1}
                                        />
                                    </div>

                                    <div className='col'>
                                        <div className='block md:hidden mt-4 md:mt-0'>
                                            <img
                                                alt=""
                                                src={sol1}
                                            />
                                        </div>
                                        <h1 ><Trans i18nKey="homePage.sol1" /> </h1>
                                        <h6 >
                                            <ul className={textFont}>
                                                <li > <Trans i18nKey="homePage.sol11" /> </li>
                                            </ul>
                                        </h6>
                                    </div>

                                </div>

                                <div className='flex row text-center justify-center md:text-left md:justify-start mt-4'>
                                    <div className='hidden md:block w-1/6 pl-3 pt-8'>
                                        <img
                                            alt=""
                                            src={sol2}
                                        />
                                    </div>
                                    <div className='col'>
                                        <div className='block md:hidden mt-4 md:mt-0'>
                                            <img
                                                alt=""
                                                src={sol2}
                                            />
                                        </div>
                                        <h1 ><Trans i18nKey="homePage.sol2" /></h1>
                                        <h6 >
                                            <ul className={textFont}>
                                                <li><Trans i18nKey="homePage.sol21" /></li>
                                                <li><Trans i18nKey="homePage.sol22" /></li>
                                            </ul>
                                        </h6>
                                    </div>
                                </div>

                                <div className='flex row text-center justify-center md:text-left md:justify-start mt-4'>
                                    <div className='hidden md:block w-1/6 pl-3 pt-4'>
                                        <img
                                            alt=""
                                            src={sol3}
                                        />
                                    </div>
                                    <div className='col pt-2'>
                                        <div className='block md:hidden'>
                                            <img
                                                alt=""
                                                src={sol3}
                                            />
                                        </div>
                                        <h1 ><Trans i18nKey="homePage.sol3" /></h1>
                                        <h6 >
                                            <ul className={textFont}>
                                                <li><Trans i18nKey="homePage.sol31" /></li>
                                                <li><Trans i18nKey="homePage.sol32" /></li>
                                                <li><Trans i18nKey="homePage.sol33" /></li>
                                            </ul>
                                        </h6>
                                    </div>
                                </div>

                                <div className="flex justify-center">
                                    <a variant='light'
                                        onClick={(event) => this.clickButton("Homepage free to use button")}
                                        href='https://beta.arislab.ai'
                                        className="py-2 px-6 mr-4 rounded-full free-to-use-pink-btn mt-8"
                                        // style={{marginTop: '5%', letterSpacing: '1px', border: '2px', borderRadius: '40px', width: '170px', height: '44px', backgroundColor: '#EB3390', color: '#FFFFFF', fontFamily: 'Fredoka One', fontSize: '12pt' }}
                                        >
                                        FREE TO USE
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* -------------------------------------------------------------End of middle Section ------------------------------------------------------------------------------ */}


                <div className='pinkBody text-white mt-12'>
                
                    <div className='container mx-auto h-full pt-12 pb-12 lg:pb-0'>
                        <div className='mb-6 text-center'>
                            <h1 className="mb-2"><Trans i18nKey="homePage.start1" /></h1>
                            <div><Trans i18nKey="homePage.start2" /></div>
                        </div>

                        <div className='flex flex-col lg:flex-row lg:mt-20 justify-between steps-mx-percent'>
                            <div className='flex justify-start lg:justify-center mb-4 lg:mb-0'>
                                <div className='w-3/8'>
                                    {/* <img
                                        alt=""
                                        src={no1}
                                    /> */}
                                    <svg width="96" height="96" viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="55" cy="55" r="55" fill="white" fill-opacity="0.25"/>
                                        <path d="M51.696 31.024C52.944 29.776 54.288 29.152 55.728 29.152C57.216 29.152 58.368 29.272 59.184 29.512C60 29.752 60.624 30.04 61.056 30.376C61.488 30.664 61.824 31.168 62.064 31.888C62.304 32.704 62.424 33.976 62.424 35.704V75.808C62.424 76.912 62.376 77.752 62.28 78.328C62.232 78.856 62.016 79.48 61.632 80.2C60.96 81.496 59.088 82.144 56.016 82.144C53.04 82.144 51.192 81.52 50.472 80.272C50.088 79.552 49.848 78.904 49.752 78.328C49.704 77.704 49.68 76.816 49.68 75.664V49.96L48.744 50.824C46.776 52.312 45.096 53.056 43.704 53.056C42.312 53.056 40.848 52.216 39.312 50.536C37.824 48.856 37.08 47.368 37.08 46.072C37.08 44.776 37.944 43.36 39.672 41.824L51.48 31.168L51.696 31.024Z" fill="white"/>
                                    </svg>

                                </div>
                                <div className="flex flex-col justify-center ml-2 mr-4">
                                    <div className="text-xl font-medium"><Trans i18nKey="homePage.step1" /></div>
                                    <div className={textFont}><Trans i18nKey="homePage.step11" /></div>
                                </div>
                            </div>

                            <div className='flex justify-start lg:justify-center mb-4 lg:mb-0'>
                                <div className='w-3/8'>
                                    {/* <img
                                        alt=""
                                        src={no2}
                                    /> */}
                                    <svg width="96" height="96" viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="55" cy="55" r="55" fill="white" fill-opacity="0.25"/>
                                        <path d="M70.432 69.328C72.4 69.328 73.792 69.568 74.608 70.048C75.472 70.48 76.048 71.176 76.336 72.136C76.624 73.048 76.768 74.272 76.768 75.808C76.768 77.296 76.6 78.496 76.264 79.408C75.976 80.32 75.472 80.944 74.752 81.28C73.696 81.856 72.208 82.144 70.288 82.144H42.136C40.408 82.144 38.92 81.496 37.672 80.2C36.424 78.904 35.8 77.392 35.8 75.664C35.8 73.072 36.688 70.696 38.464 68.536C40.288 66.328 42.472 64.456 45.016 62.92C47.56 61.336 50.104 59.8 52.648 58.312C55.192 56.776 57.352 55.048 59.128 53.128C60.952 51.208 61.864 49.168 61.864 47.008C61.864 46.576 61.696 45.976 61.36 45.208C61.024 44.392 60.64 43.744 60.208 43.264C59.824 42.736 59.2 42.256 58.336 41.824C57.472 41.392 56.272 41.176 54.736 41.176C53.2 41.176 51.856 41.752 50.704 42.904C49.6 44.008 48.976 45.112 48.832 46.216L48.544 47.872V48.304C48.544 49.36 48.496 50.152 48.4 50.68C48.352 51.208 48.136 51.808 47.752 52.48C47.032 53.632 45.16 54.208 42.136 54.208C38.776 54.208 36.784 53.296 36.16 51.472C35.92 50.704 35.8 49.48 35.8 47.8C35.8 42.808 37.576 38.344 41.128 34.408C44.728 30.424 49.408 28.432 55.168 28.432C60.976 28.432 65.68 30.448 69.28 34.48C72.88 38.464 74.68 43.024 74.68 48.16C74.68 50.896 74.08 53.488 72.88 55.936C71.68 58.384 70.24 60.352 68.56 61.84C65.008 65.008 61.84 67.144 59.056 68.248L57.256 68.968V69.328H70.432Z" fill="white"/>
                                    </svg>
                                </div>
                                <div className='flex flex-col justify-center ml-2 mr-4'>
                                    <div className="text-xl font-medium"><Trans i18nKey="homePage.step2" /></div>
                                    <div className="text-xl font-medium"><Trans i18nKey="homePage.step2-2" /></div>
                                    <div className={textFont}><Trans i18nKey="homePage.step21" /></div>
                                    <div className={textFont}><Trans i18nKey="homePage.step22" /></div>
                                </div>
                            </div>

                            <div className='flex justify-start lg:justify-center mb-4 lg:mb-0'>
                                <div className='w-3/8'>
                                    {/* <img
                                        alt=""
                                        src={no3}
                                    /> */}
                                    <svg width="96" height="96" viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="55" cy="55" r="55" fill="white" fill-opacity="0.25"/>
                                        <path d="M54.744 28.432C60.648 28.432 65.304 30.112 68.712 33.472C72.12 36.832 73.824 40.624 73.824 44.848C73.824 49.024 71.952 52.048 68.208 53.92V54.424C68.688 54.664 69.384 55.192 70.296 56.008C71.256 56.776 72.024 57.544 72.6 58.312C74.184 60.328 74.976 62.632 74.976 65.224C74.976 70.36 73.056 74.608 69.216 77.968C65.376 81.28 60.552 82.936 54.744 82.936C48.984 82.936 44.184 81.256 40.344 77.896C38.904 76.6 37.632 74.896 36.528 72.784C36.144 72.016 35.88 71.392 35.736 70.912L35.592 70.192C35.064 68.608 34.8 67.312 34.8 66.304C34.8 63.52 37.152 62.128 41.856 62.128C43.776 62.128 45.048 62.368 45.672 62.848C46.488 63.472 47.208 64.72 47.832 66.592C48.312 68.128 49.632 69.28 51.792 70.048C52.704 70.336 53.712 70.48 54.816 70.48C57.36 70.48 59.232 69.976 60.432 68.968C61.632 67.912 62.232 66.736 62.232 65.44C62.232 64.144 61.632 63.016 60.432 62.056C59.28 61.048 57.888 60.544 56.256 60.544C54.672 60.544 53.592 60.496 53.016 60.4C52.44 60.304 51.816 60.064 51.144 59.68C49.848 59.056 49.2 57.208 49.2 54.136C49.2 50.776 50.088 48.784 51.864 48.16C52.68 47.92 53.928 47.8 55.608 47.8C59.256 47.8 61.08 46.864 61.08 44.992C61.08 43.984 60.6 43.024 59.64 42.112C58.68 41.2 57.336 40.744 55.608 40.744C53.928 40.744 52.584 41.032 51.576 41.608C50.568 42.184 49.944 42.76 49.704 43.336L49.272 44.2C48.168 46.6 46.584 47.8 44.52 47.8C43.32 47.8 42 47.368 40.56 46.504C38.16 45.112 36.96 43.504 36.96 41.68C36.96 40.912 37.512 39.28 38.616 36.784C38.808 36.352 39.336 35.608 40.2 34.552C41.064 33.448 42.048 32.488 43.152 31.672C44.304 30.856 45.888 30.112 47.904 29.44C49.968 28.768 52.248 28.432 54.744 28.432Z" fill="white"/>
                                    </svg>
                                </div>
                                <div className='flex flex-col justify-center ml-2'>
                                        <div className="text-xl font-medium "><Trans i18nKey="homePage.step3" /></div>
                                        <div className={textFont}><Trans i18nKey="homePage.step31" /> <Trans i18nKey="homePage.step32" /></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ===========================================================================================End of pink body section================================================================================== */}

                {/* <div className='hidden md:flex md:my-5'> */}
                        <div className='hidden md:flex freetouse container justify-center mt-16 mb-6 mx-auto'>
                            <div className='w-2/5 pl-24'>
                                <h1 className="text-5xl mb-4"><Trans i18nKey="homePage.freetouse" /></h1>
                                <div className={textFont + "text-2xl"}><Trans i18nKey="homePage.freetouse2" /></div>
                            </div>
                            <div className='w-3/5 pl-12'>
                                <a className='py-2 px-6 mr-4 rounded-full free-to-use-pink-btn' onClick={(event) => this.clickButton("Homepage get started button")} href='https://beta.arislab.ai'>GET STARTED</a>
                                <a className='py-2 px-6 rounded-full free-to-use-white-btn'>SUBSCRIBE</a>
                            </div>
                        </div>
                {/* </div> */}

                {/* ===========================================================================================End of start free section================================================================================== */}

                <div className='flex flex-col mt-6 mb-4 md:mt-0 md:flex-row items-center md:justify-between container mx-auto'>
                    <div>
                        <svg className="mb-4 md:mb-0" width="150" height="56" viewBox="0 0 189 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.5019 55.7282C2.00493 44.2312 2.00493 25.5819 13.5019 14.0773C24.9989 2.57276 43.6482 2.58037 55.1527 14.0773L58.5995 10.6305C45.1928 -2.77626 23.4619 -2.77626 10.0551 10.6305C-3.3517 24.0373 -3.3517 45.7682 10.0551 59.175C23.4619 72.5818 45.1928 72.5818 58.5995 59.175L55.1527 55.7282C43.6558 67.2328 25.0065 67.2328 13.5019 55.7282Z" fill="url(#paint0_linear)"/>
                            <path d="M52.2611 16.9686C42.3544 7.06189 26.2998 7.06189 16.393 16.9686C11.4397 21.922 8.9668 28.4123 8.9668 34.9027H12.2234C12.2234 29.2417 14.3843 23.5883 18.6985 19.2741C27.3346 10.6381 41.3272 10.6381 49.9633 19.2741C58.5993 27.9101 58.5993 41.9028 49.9633 50.5389C45.6491 54.8531 39.9881 57.014 34.3271 57.014V60.2706C40.8174 60.2706 47.3078 57.7977 52.2611 52.8443C62.1679 42.9376 62.1679 26.8753 52.2611 16.9686Z" fill="url(#paint1_linear)"/>
                            <path d="M46.4029 34.9027L36.4885 40.6322L26.5742 46.354V34.9027V23.459L36.4885 29.1808L46.4029 34.9027Z" fill="#ED3590"/>
                            <path d="M102.29 16.2991C99.8244 16.2991 97.808 18.2165 97.633 20.6361C94.7645 18.0643 90.709 16.5197 86.5697 16.5197C77.462 16.5197 67.7759 23.3601 67.7759 36.0288C67.7759 41.5757 69.8303 46.6203 73.551 50.2498C77.0054 53.6129 81.7229 55.5379 86.4937 55.5379C90.7013 55.5379 94.7112 53.9553 97.6102 51.2313V51.2389C97.6102 53.8183 99.7102 55.9107 102.282 55.9107C104.861 55.9107 106.954 53.8107 106.954 51.2389V20.9709C106.961 18.3915 104.869 16.2991 102.29 16.2991ZM87.5741 46.8182C81.6849 46.8182 77.0663 42.0474 77.0663 35.9527C77.0663 29.9037 81.6772 25.1634 87.5741 25.1634C93.4634 25.1634 98.0819 29.9037 98.0819 35.9527C98.0819 42.0474 93.4634 46.8182 87.5741 46.8182Z" fill="#ED3590"/>
                            <path d="M147.494 16.2991C144.915 16.2991 142.822 18.3991 142.822 20.9709V51.2313C142.822 53.8107 144.922 55.9031 147.494 55.9031C150.066 55.9031 152.166 53.8031 152.166 51.2313V20.9709C152.166 18.3915 150.073 16.2991 147.494 16.2991Z" fill="#ED3590"/>
                            <path d="M135.647 17.235H134.399H131.279H131.081C131.005 17.235 130.937 17.2426 130.861 17.2426H130.823C127.338 17.3339 124.477 18.5133 122.422 20.6894C122.278 18.2394 120.239 16.2915 117.758 16.2915C115.179 16.2915 113.086 18.3915 113.086 20.9633V51.2237C113.086 53.8031 115.186 55.8956 117.758 55.8956C120.338 55.8956 122.43 53.7955 122.43 51.2237V33.3353C123.008 28.2983 125.238 26.2439 130.123 26.2439H131.028H131.036H131.081H135.639C138.12 26.2439 140.143 24.2275 140.143 21.7394C140.143 19.2513 138.127 17.235 135.647 17.235Z" fill="#ED3590"/>
                            <path d="M152.679 9.67766C152.863 6.81775 150.693 4.35016 147.833 4.16617C144.973 3.98218 142.506 6.15145 142.322 9.01137C142.138 11.8713 144.307 14.3389 147.167 14.5228C150.027 14.7068 152.495 12.5376 152.679 9.67766Z" fill="#ED3590"/>
                            <path d="M175.707 31.6155L175.616 31.5927C170.541 30.4665 167.893 29.7894 167.893 27.9784C167.893 25.9012 170.038 24.5088 173.227 24.5088C176.445 24.5088 179.101 25.8328 180.523 28.1382C181.307 29.66 182.829 30.5883 184.518 30.5883C186.991 30.5883 189 28.5795 189 26.1067C189 25.3077 188.779 24.5164 188.368 23.8164L188.361 23.8012L188.353 23.786C188.307 23.7175 188.155 23.4816 188.049 23.3447C184.921 18.8859 179.664 16.4282 173.234 16.4282H173.059C168.95 16.4282 165.214 17.6761 162.536 19.9359C159.995 22.0816 158.534 25.0643 158.534 28.1154C158.534 36.8656 167.048 38.6689 171.621 39.6352L172.504 39.8178C176.947 40.7233 179.641 41.4005 179.641 43.2646C179.641 45.9582 176.78 47.1604 173.949 47.1604C170.267 47.1604 167.345 45.494 165.496 42.3516C164.682 40.7461 163.061 39.7493 161.265 39.7493C158.648 39.7493 156.518 41.8798 156.518 44.4973C156.518 45.6842 157.065 46.6886 157.537 47.4267C160.832 52.7224 166.386 55.5225 173.592 55.5225H173.752C179.763 55.5225 183.346 53.255 185.287 51.3528C187.569 49.1234 188.931 46.0419 188.931 43.1201C188.931 34.5221 180.653 32.7035 175.707 31.6155Z" fill="#ED3590"/>
                            <defs>
                            <linearGradient id="paint0_linear" x1="0.00517402" y1="34.905" x2="68.6536" y2="34.905" gradientUnits="userSpaceOnUse">
                            <stop stop-color="#FDBA4D"/>
                            <stop offset="0.54" stop-color="#ED1B58"/>
                            <stop offset="1" stop-color="#ED3691"/>
                            </linearGradient>
                            <linearGradient id="paint1_linear" x1="8.96748" y1="34.9049" x2="59.691" y2="34.9049" gradientUnits="userSpaceOnUse">
                            <stop stop-color="#FDBA4D"/>
                            <stop offset="0.54" stop-color="#ED1B58"/>
                            <stop offset="1" stop-color="#ED3691"/>
                            </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    <div className="flex flex-col justify-center text-center md:text-right mb-4 md:mb-0">
                        <div className="text-xl mb-2 font-medium">{i18n.language === "th" ? "ติดต่อเรา ": "Contact us"}</div>
                        <div className={textFont + "flex justify-center md:justify-end mb-2 text-white"}>
                            <a href="https://www.facebook.com/arislablive/"><i className="fab icon-link fa-lg fa-facebook-square mr-2"></i></a>
                            <a href="https://www.instagram.com/arislab_official/"><i className="fab icon-link fa-lg fa-instagram"></i></a>
                        </div>
                        <div className={textFont}>
                            <div>+6661-286-6328 (C)</div>
                            <div>contactus@arislab.ai (E)</div>
                        </div>
                    </div>
                </div>

                {/* ===================================================================================End of bottom navbar========================================================================================= */}

                <div className={textFont + 'copyright flex items-center justify-center text-center text-white'}>
                    <div> &copy; 2020 Aris Company. All rights reserved </div>
                </div>

                {this.state.allowCookie === false ?
                    <div className={textFont + 'cookie-consent flex items-center justify-center text-center text-white'}>
                        <div>
                            <p>
                                Arislab.ai uses cookies to provide you with the best experience. By continuing to use our site, you agree to the use of our cookies, privacy policy and terms of use. &nbsp;
                                <svg class="svg-inline--fa fa-times fa-w-11" onClick={this.doAllowCookie} aria-hidden="true" focusable="false" data-prefix="fa" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512" data-fa-i2svg=""><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path></svg>
                            </p>
                        </div>
                    </div> : ''
                }

            </div>
        )
    }
}

export default withStyles(styles, { withTheme: true })(withTranslation()(HomePage));