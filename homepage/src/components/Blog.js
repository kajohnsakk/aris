import React from "react";
import Cookies from "js-cookie";
import Axios from "axios";
import TagManager from "react-gtm-module";
import { withTranslation } from "react-i18next";

class Blog extends React.Component {
    state = {
        email: ""
    };

    async componentDidMount() {
        if (Cookies.get("isLoggedIn") === "true") {
            let cookieValue = Cookies.get("email");
            let res = await Axios.get("https://beta.arislab.ai/api/utility/emailDecoder/encodedEmail/" + cookieValue);
            // let res = await Axios.get('https://beta.arislab.ai/api/utility/emailDecoder/encodedEmail/6cb31edb6194bae2f23cc5a9345252c998e962c9e96c502cdc9a90c34be8a8f77f04cad73a')
            let email = res.data.result;
            this.setState({
                email: email
            });
        }
        const tagManagerArgs = {
            dataLayer: {
                event: "ARIS",
                pageCategory: "Homepage",
                pageAction: "View",
                pageLabel: "Aris Homepage",
                pageUser: this.state.email || "Anonymous"
            }
        };
        TagManager.dataLayer(tagManagerArgs);

        const tagManagerArgs1 = {
            dataLayer: {
                event: "ARIS",
                pageCategory: "Homepage",
                pageAction: "View",
                pageLabel: "1. Visit Homepage",
                pageUser: this.state.email || "Anonymous"
            }
        };
        TagManager.dataLayer(tagManagerArgs1);
    }

    render() {
        return (
            <React.Fragment>
                <div className="flex leading-normal blog">
                    <div className="md:w-1/4"></div>
                    <div className="md:w-1/2 content-center align-center">
                        {/* Blog number 1 */}
                        <div className=" rounded overflow-hidden shadow-lg mb-4 mt-12">
                            <img
                                className="w-full"
                                src="https://scontent.fbkk22-1.fna.fbcdn.net/v/t1.0-9/81809246_2536905249888154_3634845511392952320_o.jpg?_nc_cat=108&_nc_eui2=AeEyIbUBNQmJL52SjBJmsPfGVkdD6LMP5lTjyFwgv4hY_RYuB58HKAslXXpdMhRiKTJo6ideviMxpBBvBglEZZ2eiIjUECUABUlywgaDiApdeg&_nc_oc=AQlauXJSdHTJC0h0JxQW67H2uvokqogh4Z95JolLqhHrxfHPKdKhOX6SL2XFEFjDszU&_nc_ht=scontent.fbkk22-1.fna&oh=f3d281cb8ee53646864544e018126e51&oe=5EFC9ECB"
                                alt=""
                            ></img>
                            <div className="px-6 py-4">
                                <div className="font-bold text-xl mb-2">หลักสำคัญของการขายสินค้าออนไลน์</div>
                                <div className="text-gray-700 text-base">
                                    <p>ที่สุดของการขายขายออนไลน์ ทุกอย่างต้องเร็ว ทันใจ ใครไหวก็ไปก่อนนน ใครช้าก็ไม่ทันเค้า</p>
                                    <br />
                                    <p>
                                        กล้าพูดได้เต็มปากเลยว่าในปัจจุบันถ้าธุรกิจไหนไม่มีการเคลื่อนไหว
                                        หรือขายสินค้าผ่านโลกออนไลน์เลยก็เท่ากับรอวันเจ๊ง ไม่ได้แรงแต่นี้คือเรื่องจริงงนะแม่ เพราะธุรกิจไหนที่ขายสินค้า
                                        หรือมีการเคลื่อนไหวผ่านโลกออนไลน์จะมีโอกาสสามารถเข้าถึงลูกค้าได้มากว่าอย่างแน่นอนนนนน <br />{" "}
                                        ทีนี้เรามาดูกันดีกว่าว่าการขายสินค้าผ่านโลกออนไลน์มันสำคัญอย่างไรบ้าง
                                    </p>
                                    <br />
                                    <p>
                                        1.เข้าถึงผู้คนได้มากกว่า -
                                        การขายสินค้าบนโลกออนไลน์จะทำให้สินค้าของเราเข้าถึงผู้คนได้มากกว่าสื่อแบบเก่าในยุคปัจจุบัน
                                        แถมยังสามารถเข้าถึงกลุ่มเป้าหมายของสินค้าได้อย่างแม่นยำผ่านการใช้ระบบต่างๆ ในการทำการตลาดออนไลน์อีกด้วย
                                        ยิ่งไปกว่านั้นตลาดอีคอมเมิร์ชยังมีการสำรวจว่าเติบโตขึ้นในทุกๆ ปี ซึ่งพี่ไทยอย่างเราก็ไม่แพ้ชาติใดในโลก
                                        ติดเป็นอันดับที่ 3 ของโลกที่ช้อปแหลกช้อปกระจายกันอยู่ในโลกออนไลน์นาจาาา
                                    </p>
                                    <br />
                                    <p>
                                        2.ช่วยเพิ่มยอดขาย - อย่างที่บอกไปในข้อแรกว่าการขายสินค้าบนโลกออนไลน์จะทำให้เราสามารถเข้าถึงผู้คนได้มากเว่อออ
                                        ยิ่งถ้าเพื่อนๆ มีหน้าร้านและขายสินค้าผ่านทางช่องทางออนไลน์ไปด้วยก็จะยิ่งช่วยให้เพื่อนๆ
                                        มียอดขายที่ดีและเติมโตขึ้นไปได้อีกกกกจ้า
                                    </p>
                                    <p>
                                        3.ช่วยสร้างตัวตนให้กับแบรนด์ของเรา - เมื่อเราสามารถเข้าถึงผู้คนได้มากขึ้น
                                        เราก็มีโอกาสในการสร้างการจดจำให้ลูกค้าจำแบรนด์ของเราได้ เพื่อเป็นการสร้างฐานลูกค้าให้เพิ่มมากขึ้น
                                        และให้มีคนคอยติดตามร้านของเรามากขึ้นด้วย คราวนี้ก็ขายของเก๋ๆ ไปพร้อมกันการเป็นตัวของตัวเองสวยๆ
                                    </p>
                                    <br />
                                    <a href="https://www.facebook.com/arislablive/photos/a.2351555585089789/2536905239888155/?type=3&__tn__=-R">
                                        ขัอมูลเพิ่มเติมที่นี่..
                                    </a>
                                </div>
                            </div>
                            <div className="px-6 pb-4">
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                                    #aris
                                </span>
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                                    #ไลฟ์สดขายของ
                                </span>
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                                    #AIChatbot
                                </span>
                            </div>
                        </div>

                        {/* Blog number 1 */}
                        <div className=" rounded overflow-hidden shadow-lg mb-4 mt-12">
                            <img
                                className="w-full"
                                src="https://scontent.fbkk22-2.fna.fbcdn.net/v/t1.0-9/81889508_2532105783701434_4918925687902961664_o.jpg?_nc_cat=107&_nc_eui2=AeFDueqVS5XBj0saXQYy_izIRyCxeY3sVlAU8lab92dwZRW2GWC-wwA7WpL2oVFbW6BHGfuV4CNk32Hg-CBtJFrLKKLd52-4nMzJU_NJXjoNiA&_nc_oc=AQnYg3DHlSf11hGFMWdOHMmfJ0rJrdjkA1rQVQrYKDuwQCJLavD67N_XJUB_bM02NlY&_nc_ht=scontent.fbkk22-2.fna&oh=41de3d547dc900c6595070ab9441ce9f&oe=5F0217A2"
                                alt=""
                            ></img>
                            <div className="px-6 py-4">
                                <div className="font-bold text-xl mb-2">ทำยอดขายถล่มทลายด้วย ARIS</div>
                                <div className="text-gray-700 text-base">
                                    <p>
                                        เชื่อว่าพ่อค้า แม่ค้าหลายๆ คน หวังอยากสร้างรายได้ ให้ปังๆ ทำยอดรัวๆจากการขายของออนไลน์ แต่หลายๆ
                                        ครั้งเรื่องมันก็ไม่ได้เป็นอย่างที่เราคิดไว้ มีเรื่องราว มีปัญหาต่างๆ ตามมาให้เราปวดหัวอยู่ตลอด
                                    </p>
                                    <br />
                                    <p>
                                        โดยเฉพาะการไล่ตอบแชทของลูกค้าให้ครบทุกคน ไม่ไหวก็บอก ต้องไหว!!!
                                        บางวันลูดค้าออเดอร์เข้ามาหลายสิบคนก็ต้องไล่ตอบให้ทันทุกคน ตอบช้าก็อด อาจโดนแคนเซิลอีก โอ้ย
                                        ขายของมันวุ่นวายกว่าที่คิด
                                    </p>
                                    <br />
                                    <p>
                                        แต่ถ้าเรานำ ARIS เข้ามาช่วยก็จะทำให้การขายของออนไลน์ของเราง่ายขึ้น สะดวกขึ้น เหมือนมีเพื่อนรู้ใจมาคอยช่วยเหลือ
                                        ARIS ผู้ช่วย Social-Commerce ตัวแรกที่จะทำให้การทุกการ Live ขายของเป็นระบบยิ่งขึ้น บอกลา การ CF no CC ไปได้เลย
                                        แล้วก็ไม่ต้องมาตามตอบ inbox แบบ Manual ๆ เพราะ ARIS จะทำให้ทุกอย่างเป็นระบบยิ่งขึ้นด้วยฟังค์ชั่นมากมาย
                                    </p>
                                    <br />
                                    <p>
                                        ไม่ใครทำไม่ทำ ไม่ลองไม่รู้ ไม่เชื่อก็ลองก่อนได้เลย วันนี้เราจัดให้ไปใช้กันฟรีๆ อยากใช้ก็คลิ๊กเลย{" "}
                                        <a href="https://arislab.ai">arislab.ai</a>
                                    </p>

                                    <br />
                                    <a href="https://www.facebook.com/arislablive/photos/a.2351555585089789/2532105780368101/?type=3&__tn__=-R">
                                        ขัอมูลเพิ่มเติมที่นี่..
                                    </a>
                                </div>
                            </div>
                            <div className="px-6 pb-4">
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                                    #aris
                                </span>
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                                    #ไลฟ์สดขายของ
                                </span>
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                                    #AIChatbot
                                </span>
                            </div>
                        </div>

                        {/* Blog number 1 */}
                        <div className=" rounded overflow-hidden shadow-lg mb-4 mt-12">
                            <img
                                className="w-full"
                                src="https://scontent.fbkk22-4.fna.fbcdn.net/v/t1.0-9/81874646_2525977270980952_9054404827974467584_o.jpg?_nc_cat=111&_nc_eui2=AeFlrrPpUS886RcnL_kj5gneZs-rbYHfrJ0axzQojVw2KAAUyDJ1R_uLEL2l9lvByAq7qvO4l-FhhzKLJ3pcX2LJok7GKDXIiXXYDoDi-TUdfw&_nc_oc=AQm_yqLQ78yZnjQOohGJVqS8QYbXJ8ipxWvojY3Sx5Zb0cClFETzmg5bEHLTq-vrMFs&_nc_ht=scontent.fbkk22-4.fna&oh=ba186d22be6f5ee7d08227f6ce1a7d4c&oe=5EFAE748"
                                alt=""
                            ></img>
                            <div className="px-6 py-4">
                                <div className="font-bold text-xl mb-2"> Happy New Year 2020!! </div>
                                <div className="text-gray-700 text-base">
                                    <p>
                                        ต้อนรับปี 2020 ได้การทำยอดขายรัวๆ หลังหยุดยาว ซึ่งขายของได้เยอะๆ ออเดอร์ล้นๆมันก็ดีย์
                                        แต่เวลาไลฟ์ขายของอยู่คนเดียวแล้วมีลูกค้า CF สินค้ากันเข้ามาพร้อมๆ กันจนไล่อ่านคอมเมนท์ ไล่ตอบแชทกันไม่ไหว
                                        ก็แสนจะเหนื่อย ของก็อยากขาย แต่ก็ปวดหัว จิ่มโทรศัพท์อยู่นานสองนาน ก็ยังตอบไม่หมดสักที
                                        ยิ่งหากเป็นตอนที่กำลังไลฟ์อยู่ก็คงไม่เป็นอันขายอะไรกันแล้วแต่สวยๆ เริดๆอย่างเรา ไม่จำเป็นต้องทน
                                        ในเมื่อไลฟ์เองขายเองคนเดียวไม่ไหว ก็ยังมีผู้ช่วยแซ่บๆอย่าง ARIS ผู้ช่วยที่จะเข้ามาทำให้การขายสินค้าของเพื่อนๆ
                                        เป็นเรื่องง่าย โดยมีฟีเจอร์ต่างๆ ที่ช่วยในการขาย
                                    </p>
                                    <br />

                                    <a href="https://www.facebook.com/arislablive/posts/2525981594313853?__tn__=-R">ขัอมูลเพิ่มเติมที่นี่..</a>
                                </div>
                            </div>
                            <div className="px-6 pb-4">
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                                    #aris
                                </span>
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                                    #ไลฟ์สดขายของ
                                </span>
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                                    #AIChatbot
                                </span>
                            </div>
                        </div>

                        {/* Blog number 1 */}
                        <div className=" rounded overflow-hidden shadow-lg mb-4 mt-12">
                            <img
                                className="w-full"
                                src="https://scontent.fbkk22-4.fna.fbcdn.net/v/t1.0-9/79675402_2515527382025941_7902357362097258496_o.jpg?_nc_cat=111&_nc_eui2=AeEPUDNp5UcpJhuhj7v3KyT-mPMQIf9t5_oMS0jrtOOjUakGtyR_BnrTQM-e_t-OTX4JcWoc4Kb9I-JO41Xp8Xk53dGNJ7ACqZpwdWVxvk83cQ&_nc_oc=AQlNKWNk0YYd7vXAYTaP6-lRPfjjO_7ev2in0D73XNSjWgN1HXNEOSu_2r-qXd2QR9U&_nc_ht=scontent.fbkk22-4.fna&oh=29d98437cb5937ba8a797d43e05d2865&oe=5ECA6E4A"
                                alt=""
                            ></img>
                            <div className="px-6 py-4">
                                <div className="font-bold text-xl mb-2">เทคนิคในการสร้างความประทับใจให้ลูกค้ากลับมาซื้อ</div>
                                <div className="text-gray-700 text-base">
                                    <p>
                                        ยุคสมัยเปลี่ยน อะไรๆ ก็เปลี่ยนตามไปด้วย การขายของออนไลน์ก็เช่นกัน หากตามไม่ทันเทรนระวังจะตกม้าตายกันนะคะ
                                        หากอยากได้ผู้ช่วยเจ๋งๆ มาช่วยขายสินค้าก็สามารถคลิ๊กลงทะเบียนใช้งานได้ฟรีแล้ววันนี้{" "}
                                        <a href="https://arislab.ai">ที่นี่</a>
                                    </p>
                                    <br />
                                    <p>
                                        ลงทะเบียนกันแล้วใช่ไหมคะ? และในตอนนี้เรามาดูกันดีกว่าว่า 5 เทรนการทำธุรกิจในปี 2020
                                        ที่กำลังจะมาถึงนี้มีเทรนอะไรที่น่าสนใจกันบ้าง
                                    </p>
                                    <br />

                                    <a href="https://www.facebook.com/arislablive/posts/2515529165359096?__tn__=-R">ขัอมูลเพิ่มเติมที่นี่..</a>
                                </div>
                            </div>
                            <div className="px-6 pb-4">
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                                    #aris
                                </span>
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                                    #ไลฟ์สดขายของ
                                </span>
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                                    #AIChatbot
                                </span>
                            </div>
                        </div>

                        {/* Blog number 1 */}
                        <div className=" rounded overflow-hidden shadow-lg mb-4 mt-12">
                            <img
                                className="w-full"
                                src="https://scontent.fbkk22-1.fna.fbcdn.net/v/t1.0-9/s960x960/79442566_2510393625872650_8635016574488543232_o.jpg?_nc_cat=104&_nc_eui2=AeGi5RJpqbHeD2W6gk6F0vaKBDSPnMsOwE36WJcDh_Wt0oowQlvOgvcBZK_MwzuXo7yp4ZjvvJcSslRbbUyPeYBQc0yVggRP-a_WmiNl2svKEQ&_nc_oc=AQmRyLG8is1Atme9p7nS_tTJmSwpTx7MUxciww1gspvP8rJEhTP_Swow-AkITu_kszA&_nc_ht=scontent.fbkk22-1.fna&_nc_tp=7&oh=68cea9c1c4937fd773847e77a115bff1&oe=5ECAD258"
                                alt=""
                            ></img>
                            <div className="px-6 py-4">
                                <div className="font-bold text-xl mb-2">วิธีรับมือวิกฤตในปี 2020</div>
                                <div className="text-gray-700 text-base">
                                    <p>
                                        ตามที่นักเศรษฐศาสตร์ได้คำนวนเอาไว้ว่าในทุกๆ 8-10 ปีจะเศรษฐกิจจะก้าวเข้าสู่ยุควิกฤต
                                        โดยมีตัวอย่างมาให้เราเห็นแล้วในอดีตนับตั้งแต่ปี 2000 ที่เกิดวิกฤติ .com และ 8 ปีต่อมาก็ได้เกิดวิกฤต Subprime
                                        Crisis หรือที่ในประเทศไทยเรียกกันว่าวิกฤตแฮมเบอร์เกอร์ในปี 2008-2010
                                        จนมาถึงปัจจุบันก็กำลังจะครบรอบสิบปีวิกฤตทางเศรษฐกิจที่นักเศรษฐศาสตร์ได้คาดการณ์เอาไว้
                                        จึงทำให้นักธุรกิจทั้งเล็ก และใหญ่ต่างเตรียมตัวรับมือกับสิ่งที่กำลังจะเกิดขึ้นต่อจากนี้
                                        ทีนี้เรามาดูกันดีกว่าค่ะว่าเราจะมีวิธีรับมือกับวิกฤตเศรษฐกิจโลกในครั้งนี้อย่างไรบ้าง
                                    </p>
                                    <br />
                                    <a href="https://www.facebook.com/arislablive/posts/2510395289205817?__tn__=-R">ขัอมูลเพิ่มเติมที่นี่..</a>
                                </div>
                            </div>
                            <div className="px-6 pb-4">
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                                    #aris
                                </span>
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                                    #ไลฟ์สดขายของ
                                </span>
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                                    #AIChatbot
                                </span>
                            </div>
                        </div>

                        {/* Blog number 1 */}
                        <div className=" rounded overflow-hidden shadow-lg mb-4 mt-12">
                            <img
                                className="w-full"
                                src="https://scontent.fbkk22-1.fna.fbcdn.net/v/t1.0-9/79376468_2505211569724189_7905021753649266688_o.jpg?_nc_cat=100&_nc_eui2=AeEAWJHrI0yzqjUJOMJt51uMMxPPTMoYa5uvorE1t3TEvSTPnOWR-kQCa-muhwO0ZH6H6Y1nL-rNf1nlbP-nIRFbImz5FzYmKlyhJfo4WvLPng&_nc_oc=AQn_CvBmApVqC-Fu6PKMiygZLD50icIwDZdWDKYsSDppVbzX3ZeWYUkY7uVqWK825DA&_nc_ht=scontent.fbkk22-1.fna&oh=5529812c876ee813d92b908092ade0a5&oe=5EFBE23C"
                                alt=""
                            ></img>
                            <div className="px-6 py-4">
                                <div className="font-bold text-xl mb-2">เทคนิคในการสร้างความประทับใจให้ลูกค้ากลับมาซื้อ</div>
                                <div className="text-gray-700 text-base">
                                    <p>
                                        เพื่อนๆ รู้หรือไม่ว่าลูกค้าที่สั่งซื้อสินค้าผ่านช่องทางออนไลน์จากเรานั้น เขาต้องการอะไรบ้าง? ซึ่งในวันนี้ ARIS
                                        จะมาเล่าในฟังเองค่ะว่า จริงๆ แล้วลูกค้าทุกๆ คนต้องการอะไรจากผู้ขายสินค้าบ้าง หากเพื่อนๆ
                                        ให้สิ่งเหล่านี้กับพวกเขาได้ พวกเขาก็พร้อมที่จะกลับมาเป็นลูกค้าของเพื่อนๆ อีกครั้งอย่างแน่นอน
                                    </p>
                                    <br />
                                    <p>
                                        1.ความสะดวก ลูกค้าที่สั่งซื้อสินค้าผ่านช่องทางออนไลน์ต่างก็อยากได้อะไรที่มันสะดวก ไม่ยุ่งยาก
                                        อย่างการสั่งซื้อสินค้าในแต่ละครั้ง หากเพื่อนๆ
                                        สามารถอำนวยความสะดวกให้กับลูกค้าได้ตั้งแต่ขั้นตอนการสั่งซื้อไปจนถึงขั้นตอนสุดท้ายในการขนส่งสินค้า เช่น
                                        การส่งเลขเช็คพัสดุให้ลูกค้าเองโดยที่ลูกค้าไม่ต้องร้องขอ
                                        เพียงเท่านี้ไม่ว่าใครก็ต้องอยากกลับมาซื้อของกับเราอีกแน่นอน
                                    </p>
                                    <br />
                                    <p>
                                        2.ความรวดเร็ว นอกจากความสะดวกแล้วสิ่งที่สำคัญเลยยิ่งกว่าก็คือความรวดเร็วในการให้บริการ ทั้งการตอบแชทลูกค้า
                                        และการขนส่งสินค้า หากลูกค้ารู้สึกว่าต้องรอนานก็อาจเปลี่ยนใจไปซื้อสินค้ากับร้านอื่น
                                        แล้วไม่กลับมาที่ร้านของเราอีกเลยก็ได้ และเพื่อไม่ให้พลาดโอกาส ทำแชทของลูกค้าตกหล่น ไล่ตอบได้ไม่ทัน เพื่อนๆ
                                        ก็สามารถใช้ผู้ช่วยในการขายอย่าง ARIS ได้ ใช้งานฟรี เพียงลงทะเบียน <a href="https://arislab.ai/">คลิ๊ก</a>{" "}
                                    </p>
                                    <br />
                                    <p>
                                        3.คุณภาพที่ดี ลูกค้าทุกๆ คนเวลาสั่งซื้อสินค้าก็ล้วนหวังอยากได้สินค้าที่ดี รวมถึงบริการหลังการขายที่ดี
                                        หากสินค้าเกิดมีปัญหาเวลาที่ส่งถึงมือของลูกค้า ผู้ขายจะต้องรับผิดชอบได้ และหากเพื่อนๆ
                                        สามารถรับผิดชอบหรือรับประกันสินค้าให้กับลูกค้าได้ ลูกค้าก็จะมีความเชื่อมั่น
                                        และกลับมาซื้อของกับเราในท้ายที่สุดอีกแน่นอน
                                    </p>

                                    <br />
                                    <a href="https://www.facebook.com/arislablive/photos/a.2351555585089789/2505211566390856/?type=3&__tn__=-R">
                                        ขัอมูลเพิ่มเติมที่นี่..
                                    </a>
                                </div>
                            </div>
                            <div className="px-6 pb-4">
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                                    #aris
                                </span>
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                                    #ไลฟ์สดขายของ
                                </span>
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                                    #AIChatbot
                                </span>
                            </div>
                        </div>

                        {/* Blog number 1 */}
                        <div className=" rounded overflow-hidden shadow-lg mb-4 mt-12">
                            <img
                                className="w-full"
                                src="https://scontent.fbkk22-2.fna.fbcdn.net/v/t1.0-9/79807143_2501015143477165_5885466919196164096_o.jpg?_nc_cat=109&_nc_eui2=AeGmUDmZNJVBSOVY0h7YcoT4WN_OVg-seXO9eHhvh2FL7A6bPtJbgjZcTU7qfKf0YXYLxi38nok0P7INVNiSbH8v12CA8yH4UhLlsikmdW-krw&_nc_oc=AQkB7QgTS4JpPQZdVOsw2GNbVwwLcHp6M_UfIUodazX0zimGORGgMMWI-w2akZy3mV4&_nc_ht=scontent.fbkk22-2.fna&oh=cf1a259e487373e3cfed0ee6df4b7163&oe=5EFEE5A5"
                                alt=""
                            ></img>
                            <div className="px-6 py-4">
                                <div className="font-bold text-xl mb-2">3 เทคนิคง่ายๆ พูดอย่างไรให่คนต้องซื้อ</div>
                                <div className="text-gray-700 text-base">
                                    <p>
                                        การที่คุณจะขายสินค้าได้ หรือไม่ได้นั้นขึ้นอยู่กับหลายๆ ปัจจัย
                                        ไม่ว่าจะเป็นในเรื่องของความน่าสนใจของตัวสินค้าที่นำมาขาย ราคา และโปรโมชั่นต่างๆ
                                    </p>
                                    <br />
                                    <p>
                                        1.สวัสดี ทักทาย พูกคุยกับลูกค้าบ้างในขณะที่กำลังทำการขายสินค้า
                                        เพราะการทำอย่างนี้จะทำให้ลูกค้ารู้สึกว่าเรากำลังสนใจเขาอยู่ เรากำลังพูดกับเขาอยู่นะ
                                        ลูกค้าจะรู้สึกว่าเรามีประติสัมพันธ์กับเขา ทำให้การขายของเราไม่น่าเบื่อและน่าติดตามดูจนจบ
                                    </p>
                                    <br />
                                    <p>
                                        2.แชร์ความประทับใจข้อดีของสินค้า - เช่น หากคุณขายสิค้าจำพวกเสื้อผ้า
                                        ก็สามารถเล่าให้ลูกค้าฟังได้ว่าชุดนี้ใส่แล้วออกมาดูน่ารัก ดูสวยอย่างไร เนื้อผ้าเวลาสวมใส่แล้วรู้สึกสบายขนาดไหน
                                        เหมาะกับคนรูปร่างอย่างไร การเล่าประสบการณ์ที่มีต่อสินค้าให้ลูกค้าฟังจะช่วยให้ลูกค้านึกภาพตามได้ง่าย
                                        และตัดสินใจซื้อสินค้าของเราได้ง่ายขึ้นอีกด้วย
                                    </p>
                                    <br />
                                    <p>
                                        3.เอ็นจอยกับการขาย เคล็ดลับสำคัญที่ทำผู้ขายหลายๆ คนประสบความสำเร็จมีลูกค้าเยอะก็คือ การสนุกไปกับการขาย
                                        เพราะมันจะทำให้ลูกค้าที่เข้ามาชมการขายของคุณไม่รู้สึกเบื่อ และรู้สึกสนุกตามไปกับน้ำเสียง และท่าทางของคุณด้วย
                                        มีหยอดมุข เล่นมุขบ้าง มีคอนเทนท์อะไรใหม่ๆ ให้ลูกค้าของคุณได้มาร่วมสนุก
                                        รับรองได้เลยว่าลูกค้าของคุณจะต้องรอซื้อสินค้าของคุณทุกครั้งที่มีโอกาสอย่างแน่นอน
                                    </p>

                                    <br />
                                    <p>
                                        นอกจากจะมีเทคนิคการพูดที่ดีในระหว่างที่ทำการ Live ขายของแล้ว สิ่งสำคัญที่ขาดไม่ได้เลยก็คือ
                                        ผู้ช่วยที่ดีในการขายสินค้าอย่าง Aris เพื่อให้คุณสามารถขายของได้อย่างต่อเนื่องไม่มีสดุด
                                        พร้อมช่วยเพิ่มยอดขายให้ได้มากขึ้น สนใจสามารถลงทะเบียนใช้งานได้ฟรีแล้ววันนี้ คลิ๊กเลย!!
                                    </p>
                                    <a href="https://arislab.ai">https://arislab.ai</a>
                                    <br />
                                    <a href="https://www.facebook.com/arislablive/photos/a.2351555585089789/2501015140143832/?type=3&__tn__=-R">
                                        ขัอมูลเพิ่มเติมที่นี่..
                                    </a>
                                </div>
                            </div>
                            <div className="px-6 pb-4">
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                                    #aris
                                </span>
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                                    #ไลฟ์สดขายของ
                                </span>
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                                    #AIChatbot
                                </span>
                            </div>
                        </div>

                        {/* Blog number 1 */}
                        <div className=" rounded overflow-hidden shadow-lg mb-4 mt-12">
                            <img
                                className="w-full"
                                src="https://scontent.fbkk22-4.fna.fbcdn.net/v/t1.0-9/78085350_2496668903911789_981367935140364288_o.jpg?_nc_cat=111&_nc_eui2=AeFxbfemz2VvmeESoOTO0T_OSJ6reejUiBEZ5q9gkZFZH0K09JBODRZEm847yg_s-00Vw6mOEGJ5SwsIHoaf5hIEBeX_fQGMNS04prDwwl4jDw&_nc_oc=AQkBCu2blvzxI0Jh_3MB4CLgDWW6ZVOxx8usSK-enLj9OBZpF5EkGzq46y9sTIypnmw&_nc_ht=scontent.fbkk22-4.fna&oh=7eb5af04f97916192ab815790f48c7a2&oe=5EBC1F2C"
                                alt=""
                            ></img>
                            <div className="px-6 py-4">
                                <div className="font-bold text-xl mb-2">ขายของออนไลน์คนเดียว</div>
                                <div className="text-gray-700 text-base">
                                    <p>
                                        เชื่อว่าหลายๆ คนคงกำลังคิดว่าการขายของเป็นเรื่องที่ง่าย ใครๆ ก็สามารถทำได้
                                        แค่มาไลฟ์สดกับโพสต์สินค้าลงเว็บไซต์ต่างๆ มันยากตรงไหน? ซึ่งเพื่อนๆ คิดถูกว่าการขายของออนไลน์มันไม่ได้ยาก
                                        แต่มันก็ไม่ได้ง่ายอย่างที่คิดเสมอไป
                                    </p>
                                    <br />
                                    <p>
                                        หากเพื่อนๆ ต้องทำทุกอย่างด้วยตัวคนเดียว ตั้งแต่กับจัดหาสินค้าที่จะนำมาขาย ไลฟ์สดคอยตอบแชท
                                        รับออเดอร์ลูกค้าให้ครบทุกคน จนไปถึงการเช็คสต๊อกเพื่อทำการจัดส่ง มันคงเป็นอะไรที่โหดหินเอามากๆ
                                        เพราะผู้ขายออนไลน์คนอื่นๆ ส่วนใหญ่มักมีผู้ช่วยมาช่วยขายในขณะที่ทำการไลฟ์สดอยู่เสมอ แล้วถ้าเพื่อนๆ
                                        ต้องไลฟ์คนเดียว ไม่มีใครช่วยละ จะทำยังไงดี?
                                    </p>
                                    <br />
                                    <p>
                                        คำตอบคือใช้ระบบจัดการร้านค้าเข้ามาช่วยแทนคนยังไงละ ซึ่งในปัจจุบันมีให้เลือกใช้บริการมากมาย หนึ่งในนั้นก็คือ
                                        ARIS ผู้ช่วยการขายอัจฉริยะที่มีความสามารถต่างๆ ดังต่อไปนี้
                                    </p>
                                    <br />
                                    <p>
                                        1.ช่วยรับออเดอร์ลูกค้าให้กับเพื่อนๆ ได้ในขณะที่กำลังทำการไลฟ์ขายของ เพียงให้ลูกค้ากรอกหรัสสินค้าบนช่องแชท
                                        เท่านี้ลูกค้าของเพื่อนๆ ก็จะสามารถทำรายการสั่งซื้อเองได้โดยที่เราไม่จำเป็นต้องเข้าไปตอบแชทเองให้การขายสดุด
                                        และไม่พลาดทุกออเดอร์
                                    </p>
                                    <br />
                                    <p>
                                        2.ช่วยโชว์สินค้า ทำให้เราไม่จำเป็นต้องถือสินค้าขึ้นมาโชว์ตลอดเวลาให้เมื่อย
                                        แถมลูกค้าของเรายังสามารถเห็นแบบของสินค้าได้ชัดเจนขึ้น
                                        ช่วยให้เราขายของสบายขึ้นแถมยังทำให้ลูกค้าตัดสินใจซื้อได้ง่ายขึ้นอีกด้วย
                                    </p>
                                    <br />
                                    <p>
                                        ต้องปวดหัวมานั่งตรวจนับออเดอร์เองทุกๆ ครั้งหลังการขาย นอกจากนี้ยังมีฟีเจอที่ช่วยในการจัดส่งสินค้า
                                        และวิเคราะห์ข้อมูลในการซื้อขายเพื่อให้เราสามารถนำข้อมูลนี้ไปวางแผนการขายในครั้งถัดไปได้
                                    </p>
                                    <br />
                                    <p>หากเพื่อนๆ คนไหนสนใจ ตอนนี้ ARIS เปิดให้ลงทะเบียนใช้งานได้ฟรีแล้ว คลิ๊ก</p>
                                    <a href="https://arislab.ai">https://arislab.ai</a>
                                    <br />
                                    <a href="https://www.facebook.com/arislablive/photos/a.2351555585089789/2496668900578456/?type=3&__tn__=-R">
                                        ขัอมูลเพิ่มเติมที่นี่..
                                    </a>
                                </div>
                            </div>
                            <div className="px-6 pb-4">
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                                    #aris
                                </span>
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                                    #ไลฟ์สดขายของ
                                </span>
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                                    #AIChatbot
                                </span>
                            </div>
                        </div>

                        {/* Blog number 1 */}
                        <div className=" rounded overflow-hidden shadow-lg mb-4 mt-12">
                            <img
                                className="w-full"
                                src="https://scontent.fbkk22-1.fna.fbcdn.net/v/t1.0-9/76911432_2488936451351701_7216577460043776000_o.jpg?_nc_cat=101&_nc_eui2=AeHL_O-uZ9fGRX12-55xGQo_7sV_tVKLZWzAUMpRexDqpyC-QNMK2d9z2LmAYYfA6U7dcPLQ7S9YYhgdhL2t55pjBjDE5TJijWnXYG23KjQCKQ&_nc_oc=AQnOvzSsXogN2Zv5DkJQkWKsfWshtz8cTSLcAXrXLtZ0RHRiGUOLct-NUSAaKh-xAFM&_nc_ht=scontent.fbkk22-1.fna&oh=fd065e4c00baa853325c29428a08b9a2&oe=5EBAC21E"
                                alt=""
                            ></img>
                            <div className="px-6 py-4">
                                <div className="font-bold text-xl mb-2">AI - ผู้ช่วยสำคัญ</div>
                                <div className="text-gray-700 text-base">
                                    <p>
                                        ทำไงดีเมื่อกำลัง Live ขายของอยู่คนเดียว แต่ลูกค้าเยอะจนไล่ตอบแชทกันไม่หวาดไม่ไหว Ai
                                        จะเป็นผู้ช่วยอัจฉริยะคนสำคัญที่ทำให้การขายสินค้าของคุณสะดวก และง่ายขึ้นเยอะ
                                    </p>
                                    <br />
                                    <p>ภายใน Aris มีระบบ Ai chat ที่ช่วยให้การขายสินค้าของคุณกลายเป็นเรื่องที่ง่ายแสนง่าย</p>
                                    <br />
                                    <p>- ไม่ต้องไล่อ่านแชทลูกค้าให้ปวดตา</p>
                                    <br />
                                    <p>- ไม่จำเป็นต้องปิดการขายเอง ลูกค้าสามารถกดหรัสสินค้าและเข้าสู่ขั้นตอนการสั่งซื้อได้เองโดยอัตโนมัติ</p>
                                    <br />
                                    <p>- ไม่จำเป็นต้องไล่ตอบแชทลูกค้าเป็นร้อยเป็นพันข้อความ</p>
                                    <br />
                                    <p>- ช่วยรับออเดอร์ลูกค้า และปิดการขายได้พร้อมกันหลายๆ คน</p>
                                    <br />
                                    <p>
                                        นอกจากนี้ Aris ยังมีฟีเจอร์อื่นๆ ที่ช่วยอำนวยความสะดวก และเพิ่มความน่าสนใจในการ Live
                                        ขายสินค้าให้กับคุณอีกหลายอย่าง หากสนใจสามารถลงทะเบียนใช้งานได้ฟรีแล้ววันนี้ คลิ๊ก!!
                                    </p>
                                    <a href="https://arislab.ai">https://arislab.ai</a>
                                    <br />
                                    <a href="https://www.facebook.com/arislablive/photos/a.2351555585089789/2488936444685035/?type=3&__tn__=-R">
                                        ขัอมูลเพิ่มเติมที่นี่..
                                    </a>
                                </div>
                            </div>
                            <div className="px-6 pb-4">
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                                    #aris
                                </span>
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                                    #ไลฟ์สดขายของ
                                </span>
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                                    #AIChatbot
                                </span>
                            </div>
                        </div>

                        {/* Blog number 1 */}
                        <div className=" rounded overflow-hidden shadow-lg mb-4 mt-12">
                            <img
                                className="w-full"
                                src="https://scontent.fbkk13-1.fna.fbcdn.net/v/t1.0-9/76756963_2486934558218557_2881856749910884352_o.jpg?_nc_cat=108&_nc_eui2=AeGz143g0t_m_nIc1DGpiFT7nIcZeOlqdUK-7dALyVQBbQiKCHVzrOWK8A9H_5b4HeEVxMxy8dpubhIPYx2rz4VlsIlUQoQZWa92ff1r-AabLg&_nc_oc=AQmjnpUVJ8TnlMlOZF4MTnMZkbYNK5jf9LwBdwRW6MkSJsqFlcM_VY2usPT1oxvPigL3VS10q37LN-hWnff3VGLg&_nc_ht=scontent.fbkk13-1.fna&oh=341bf6b1386ddf61baef5e1ec245db4f&oe=5EC793CB"
                                alt=""
                            ></img>
                            <div className="px-6 py-4">
                                <div className="font-bold text-xl mb-2">5 อันดับสินค้าขายดีบนโลกออนไลน์</div>
                                <div className="text-gray-700 text-base">
                                    <p>
                                        จากการวิเคราะห์ข้อมูลพฤติกรรมของผู้บริโภคในปีที่ผ่านมาของแพลตฟอร์มอีคอมเมิร์ชอย่าง Picodi พบว่า
                                        คนไทยสินค้าช๊อปออนไลน์สูงเป็นอันดับที่ 3 ของโลก โดยเฉลี่ยช๊อปผ่านสมาร์ทโฟน 56% ผ่านคอมพิวเตอร์ 40%
                                        และแท็บเล็ตอีก 4% ซึ่งสินค้าที่ได้รับความนิยมจากคนไทยผ่านการช๊อปออนไลน์นั้นได้แก่
                                    </p>
                                    <br />
                                    <p><span role="img" aria-label="correct">✔️</span> เสื้อผ้าแฟชั่น</p>
                                    <br />
                                    <p><span role="img" aria-label="correct">✔️</span> ของตกแต่งบ้านและสวน</p>
                                    <br />
                                    <p><span role="img" aria-label="correct">✔️</span> การท่องเที่ยว</p>
                                    <br />
                                    <p><span role="img" aria-label="correct">✔️</span> เครื่องสำอาง</p>
                                    <br />
                                    <p><span role="img" aria-label="correct">✔️</span> อุปกรณ์กีฬา</p>
                                    <br />
                                    <a href="https://www.facebook.com/arislablive/posts/2486935401551806?__tn__=-R">ขัอมูลเพิ่มเติมที่นี่..</a>
                                </div>
                            </div>
                            <div className="px-6 pb-4">
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                                    #aris
                                </span>
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                                    #ไลฟ์สดขายของ
                                </span>
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                                    #AIChatbot
                                </span>
                            </div>
                        </div>

                        {/* Blog number 1 */}
                        <div className=" rounded overflow-hidden shadow-lg mb-4 mt-12">
                            <img
                                className="w-full"
                                src="https://scontent.fbkk12-2.fna.fbcdn.net/v/t1.0-9/74456656_2481264442118902_850926217832955904_o.jpg?_nc_cat=104&_nc_eui2=AeF5eaBtTNPLF5tMziu_o1jE581-zyfzHmiSTNE-UHoLp0E4i6UceFJSAI8hpCSlyXyoB5Caq6VLt4ATjknsDeB_3pONVQ88Zl9TJNNjQzab6g&_nc_oc=AQkqCp6wVbvbzwUPZi-iuFUT25_nPxxxKW73_nKR4WPXzwIV5IYQQ-59rkyGR24Ewy8JKSbDvW7ag9D46sUy25rO&_nc_ht=scontent.fbkk12-2.fna&oh=bcf98bfe041025172c51e39e8c0cf4b7&oe=5EF944E4"
                                alt=""
                            ></img>
                            <div className="px-6 py-4">
                                <div className="font-bold text-xl mb-2">ไลฟ์ไม่สดุด ขายของต่อเนื่องไม่มีหยุุด</div>
                                <div className="text-gray-700 text-base">
                                    <p>
                                        เชื่อว่าหลายๆ คนเวลา Live ขายสินค้าจะต้องคอยหยุดอ่าน และรอให้ลูกค้าแค๊ปหน้าจอ InBox
                                        เข้ามาคอนเฟิร์มสั่งซื้อสินค้าตัวนั้นเสร็จก่อนถึงจะเริ่มไปขายสินค้าชิ้นอื่นๆ ต่อไปได้
                                        ซึ่งมันมักจะทำให้การขายของเราเกิดสดุด หยุดไปหลายวินาที และหากนำเวลาที่สดุดไปเหล่านั้นมารวมๆ กัน
                                        ก็จะเห็นได้ว่าในการ Live ครั้งหนึ่งเราสูญเสียเวลาในการขายไปหลายนาทีเลยทีเดียว
                                        ดังนั้นมันจะดีกว่าไปหากคุณนำเวลาที่สูญเสียไปเหล่านั้นมา Live ขายของเพื่อเพิ่มยอดขายในแต่ละวันให้มากขึ้น
                                        โดยการใช้ผู้ช่วยคนเก่งอย่าง Aris ที่จะช่วยทำให้การขายสินค้าของคุณไหลลื่น ไม่มีสะดุด ไม่หยุดกลางคัน
                                    </p>
                                    <br />
                                    <p><span role="img" aria-label="correct">✔️</span> ไม่ต้องคอยมาไล่ตอบแชทของลูกค้าเองให้เหนื่อย สามารถ Live ขายของได้อย่างต่อเนื่อง</p>
                                    <br />
                                    <p><span role="img" aria-label="correct">✔️</span> ไม่ต้องถือสินค้าโชว์เองอยู่ตลอดเวลา สามารถขายสินค้าชิ้นอื่นๆ ต่อไปได้เลย</p>
                                    <br />
                                    <p><span role="img" aria-label="correct">✔️</span> รับออเดอร์ลูกค้าได้อย่างรวดเร็วไม่เสียลูกค้าในขณะที่ Live</p>
                                    <br />
                                    <p><span role="img" aria-label="correct">✔️</span> ขายง่าย สะดวก รวดเร็ว มียอดขายเพิ่มขึ้น <span role="img" aria-label="thumb-up">👍</span></p>
                                    <br />
                                    <p>
                                        สามารถลงทะเบียนใช้งานได้ ฟรี!! แล้ววันนี้ที่ <a href="http://arislab.ai/">www.arislab.ai</a>
                                    </p>
                                    <br />
                                    <a href="https://www.facebook.com/arislablive/photos/a.2351555585089789/2481264435452236/?type=3&theater">
                                        ขัอมูลเพิ่มเติมที่นี่..
                                    </a>
                                </div>
                            </div>
                            <div className="px-6 pb-4">
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                                    #aris
                                </span>
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                                    #ไลฟ์สดขายของ
                                </span>
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                                    #AIChatbot
                                </span>
                            </div>
                        </div>

                        {/* Blog number 1 */}
                        <div className=" rounded overflow-hidden shadow-lg mb-4 mt-12">
                            <img
                                className="w-full"
                                src="https://scontent.fbkk13-1.fna.fbcdn.net/v/t1.0-9/73197312_2478391355739544_3743149970824364032_o.jpg?_nc_cat=108&_nc_eui2=AeESzWTFBFHrGyqYwjKFA9ZspwbAWSyxa-WhF3VieJ-KUzAq-clnDeZVcebphCC5AQaa92BvAPquy-BnEZLdE63JdsWNwmpiGPIZh20wWtahgw&_nc_oc=AQmPTmicN3SOr3WlnzN1WLPwGrzhiIFYLIYHnOuKeK7hNR5Srz8vo9fTmlnnIIkmlourYb9Emobod_Wg4jlCa91a&_nc_ht=scontent.fbkk13-1.fna&oh=2a3d9dd4fb1c74ffbdb06ba2c13b73cc&oe=5EC8F012"
                                alt=""
                            ></img>
                            <div className="px-6 py-4">
                                <div className="font-bold text-xl mb-2">การตั้งชื่อร้าน - สำคัญกว่าที่คุณคิด</div>
                                <div className="text-gray-700 text-base">
                                    <p>
                                        การตั้งชื่อร้าน เป็นการตั้งเพื่อให้ร้านของเรามีชื่อเรียกและเป็นที่จดจำของลูกค้าได้
                                        ดั้งนั้นการตั้งชื่อร้านจึงเป็นสิ่งสำคัญที่เราไม่ควรมองข้าม ซึ่งในปัจจุบันหลายๆ
                                        คนที่ขายของออนไลน์ก็พยายามสรรหาชื่อแปลกๆ มาตั้งชื่อร้านเพื่อไม่ให้เหมือนใคร
                                    </p>
                                    <br />
                                    <p>
                                        บางคนถึงขั้นเปิดดิกชันนารีในการหาชื่อเพราะๆ ความหมายดีๆ มาตั้งเป็นชื่อร้านกันเลยทีเดียว
                                        ซึ่งหลักการในการตั้งชื่อร้านค้าออนไลน์นั้นมีอยู่ด้วยกันเพียง 3 อย่าง คือ
                                    </p>
                                    <br />
                                    <p>
                                        1.ต้องอ่านง่าย เพราะหากเขียนด้วยภาษาที่อ่านยากๆ ก็จะทำให้ลูกค้าไม่สนใจชื่อของร้าน
                                        และไม่กลายเป็นที่พูดถึงหรือจดจำไปในที่สุด
                                    </p>
                                    <br />
                                    <p>
                                        2.ชื่อต้องจำง่าย คุ้นหู พูดได้คล่องปาก เพื่อให้พอลูกค้าได้ยินชื่อของร้านเราปุ๊บ ก็สามารถจดจำได้เลย
                                        และสามารถนำไปบอกต่อๆ กันได้ง่าย
                                    </p>
                                    <br />
                                    <p>
                                        {" "}
                                        3.ชื่อต้องสามารถค้นหาเจอได้ง่าย
                                        เพราะในปัจจุบันการจะหาร้านค้าสักร้านเพื่อชื่อของผ่านช่องทางออนไลน์ล้วนต้องผ่านการเสิร์ชเท่านั้น ดังนั้น
                                        ก่อนจะตั้งชื่อร้านว่าอะไร แนะนำให้เช็คก่อนให้ดีว่าบนแพลตฟอร์มนั้นมีชื่อที่เหมือนกันอยู่มากหรือเปล่า
                                        หากมีเราก็สามารถสร้างความแตกต่างได้ง่ายๆ เช่น หากคุณขายนาฬิกา ก็อาจจะเติมคำว่า Watch
                                        ต่อท้ายชื่อเพื่อให้ร้านของคุณสามารถค้นหาเจอได้ง่ายขึ้นด้วย
                                    </p>
                                    <br />
                                    <a href="https://www.facebook.com/arislablive/photos/a.2351555585089789/2478391349072878/?type=3&theater">
                                        ขัอมูลเพิ่มเติมที่นี่..
                                    </a>
                                </div>
                            </div>
                            <div className="px-6 pb-4">
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                                    #aris
                                </span>
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                                    #ไลฟ์สดขายของ
                                </span>
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                                    #AIChatbot
                                </span>
                            </div>
                        </div>

                        {/* Blog number 1 */}
                        <div className=" rounded overflow-hidden shadow-lg mb-4 mt-12">
                            <img
                                className="w-full"
                                src="https://scontent.fbkk9-2.fna.fbcdn.net/v/t1.0-0/p600x600/74272994_2472235123021834_6801296711416283136_o.jpg?_nc_cat=109&_nc_eui2=AeEybRth5Wgh6LmYloZ9mP2xe7MMNJwNu5lb2-htpMLPLGc3i1IhXkxNXbKzuYxWiwcX-qCWazpgKAJrwuZzzEuTO6cRAxPzD8CX6uByn_0Weg&_nc_oc=AQlyeMtfBlFQ9oecuM71FEx4wx5ddPTdBIydwN2tTLlZ2xLKXaB2TkbV3UFfALEt0esn_8YgCjC6tgPgUr-vch3X&_nc_ht=scontent.fbkk9-2.fna&_nc_tp=6&oh=ad382d3ca8acd8c7ab04afdfcdb6cb82&oe=5EC3C811"
                                alt=""
                            ></img>
                            <div className="px-6 py-4">
                                <div className="font-bold text-xl mb-2">แจกไอเดียแต่งสตอรี่ IG ให้สวยปัง</div>
                                <div className="text-gray-700 text-base">
                                    <p>
                                        เป็นมั้ยว่าเวลาลงสตอรี่ทีไรแล้ว พยายามจะแต่งให้สวยๆแต่ก็ไม่รู้จะแต่งยังไง จะลงเป็นภาพอย่างเดียวก็ดูแข็งๆ
                                        ไม่น่าสนใจเอาซะเลย
                                    </p>
                                    <br />
                                    <p>
                                        วันนี้ ARIS ได้รวบรวมไอเดียจาก Pininterest ในการตกแต่งสตอรี่ของเราให้ออกมาสวย น่ารัก
                                        ใครผ่านเข้ามาเห็นก็ต้องเป็นสะดุด หยุดดูโดยเฉพาะร้านค้าออนไลน์ ถ้าแต่งสตอรี่สวยๆ
                                        สามารถเรียกความสนใจให้กับคนเห็นได้อย่างแน่นอน
                                    </p>
                                    <br />
                                    <p>ไปดูกันเลยดีกว่าว่ามีไอเดียอะไรสวยๆในการแต่งสตอรี่ให้สวยในแบบที่เรานึกไม่ถึงมาก่อนบ้าง</p>
                                    <br />
                                    <a href="https://www.facebook.com/arislablive/posts/2472238863021460?__tn__=-R">ขัอมูลเพิ่มเติมที่นี่..</a>
                                </div>
                            </div>
                            <div className="px-6 pb-4">
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                                    #aris
                                </span>
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                                    #ไลฟ์สดขายของ
                                </span>
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                                    #AIChatbot
                                </span>
                            </div>
                        </div>

                        {/* Blog number 1 */}
                        <div className=" rounded overflow-hidden shadow-lg mb-4 mt-12">
                            <img
                                className="w-full"
                                src="https://scontent.fbkk12-3.fna.fbcdn.net/v/t1.0-9/73074555_2462353847343295_7569116501777580032_o.jpg?_nc_cat=102&_nc_eui2=AeF1wm30VM0qlZ4KK9moBDvU6dgh8QHq5pF0tI4068Jt1SGIo8kL5pemMEGnUCFz6hKFPIj3VAdyJsRNhj74rhPED4LxuCbPg4Api77ZR2RoPA&_nc_oc=AQkWt8HfG0NuRF7GNA-4tR0cIe6TbbMhyL8dcjeaRbOoZUJwojwuy9TQgI3jjhoikKF0UxKLXMnooSIxRKTvVxzX&_nc_ht=scontent.fbkk12-3.fna&oh=4db355352b5850b5caa188782ad85529&oe=5EFC4586"
                                alt=""
                            ></img>
                            <div className="px-6 py-4">
                                <div className="font-bold text-xl mb-2">เทคนิคถ่ายรูปสินค้าสวยๆ แบบประหยัดงบ</div>
                                <div className="text-gray-700 text-base">
                                    <p>เทคนิคถ่ายรูปสินค้าสวยๆ แบบประหยัดงบ</p>
                                    <br />
                                    <p>
                                        เป็นที่รู้กันว่า ภาพถ่ายสินค้าสวย ดี มีชัยไปกว่าครึ่งเรื่องที่สำคัญอันดับต้นๆของการขายของออนไลน์นั้น
                                        คือการต้องมีรูปสินค้าสวยๆลงในโซเชียลตลอดเวลา เพื่อให้คนได้เห็นภาพ และ ดึงดูดความสนใจลูกค้า
                                    </p>
                                    <br />
                                    <p>
                                        เชื่อกันว่าเจ้าของร้านออนไลน์ แทบจะทุกคนมักจะมีเรื่องป่วยหัวเกี่ยวกับการถ่ายรูปสินค้า ถ่ายยังไงออกมาให้สวยๆ
                                        จะไปจ้างเค้าถ่ายให้ตลอดก็ดูจะสิ้นเปลืองเกินไป
                                    </p>
                                    <br />
                                    <p>วันนี้ ARIS นำเทคนิคง่ายๆสำหรับการถ่ายรูปสินค้าแบบประหยัดงบ ให้ออกมาสวยๆ ดูดี ลงไอจีแล้วไม่จืดชืด</p>
                                    <br />
                                    <a href="https://www.facebook.com/arislablive/posts/2462355744009772?__tn__=-R">ขัอมูลเพิ่มเติมที่นี่..</a>
                                </div>
                            </div>
                            <div className="px-6 pb-4">
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                                    #aris
                                </span>
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                                    #ไลฟ์สดขายของ
                                </span>
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                                    #AIChatbot
                                </span>
                            </div>
                        </div>

                        {/* Blog number 1 */}
                        <div className=" rounded overflow-hidden shadow-lg mb-4 mt-12">
                            <img
                                className="w-full"
                                src="https://scontent.fbkk12-2.fna.fbcdn.net/v/t1.0-9/72716224_2453327181579295_2686515684464132096_o.jpg?_nc_cat=104&_nc_eui2=AeH94DGol2FmCdEbnSVEiLYSiotvqpb4Q8WEBQm4elCitOasF-3fR-dM5T8SPdeUU8Ib__ZlmrSH73LmcTSP-EShtPkhYRgWiDBh_M-IQl7kSQ&_nc_oc=AQlY6U8QVswEDpX0g0cb5HZE8CFD4vzBZ6-zQGEnjUg5FE-9qmm5a50POA8QaElPaTz--wVC6UXY9IPWwIXTuL71&_nc_ht=scontent.fbkk12-2.fna&oh=5abe7c7545ec77a810b5e29b2cdbd596&oe=5EC69EED"
                                alt=""
                            ></img>
                            <div className="px-6 py-4">
                                <div className="font-bold text-xl mb-2">ARIS - ตัวช่วยใหม่ของแม่ค้าออนไลน์</div>
                                <div className="text-gray-700 text-base">
                                    <p>
                                        ไม่ต้องมาพูดวนๆ ซ้ำๆ กันบ่อยๆ เพราะ Aris จะช่วยโชว์ข้อมูลต่างๆ ที่คุณต้องการ ตลอดการไลฟ์ ไม่ว่าใครจะเข้ามาดู
                                        Live ตอนไหนก็จับใจความได้ทันที
                                    </p>
                                    <br />
                                    <p>
                                        หมดปัญหาการพูดข้อมูลตกหล่นขณะ Live รวมถึง ไม่ต้องขอให้คนดูแคปหน้าจอ แล้วทักเข้ามาใน inbox
                                        เพื่อคอนเฟิร์มให้วุ่นวาย
                                    </p>
                                    <br />
                                    <p>
                                        เพราะระบบ Aris ของเรา เพียงพิมพ์ รหัสสินค้าใต้คอมเม้นท์ Live สด ระบบจะทำการเชื่อมต่อเข้า inbox
                                        ของลูกค้าคนนั้นโดยอัตโนมัติ ทำการขายต่อไปให้คุณได้เลย
                                    </p>
                                    <br />
                                    <p>
                                        ให้การ Live ไม่สะดุด ข้อมูลไม่ตกหล่น ขายของไม่มีติดขัด Aris ตัวช่วยใหม่ของแม่ค้าออนไลน์ทุกคน
                                        ไปลงทะเบียนใช้งานกันได้เลยที่ <a href="https://arislab.ai">https://arislab.ai/</a>
                                    </p>
                                    <br />
                                    <a href="https://www.facebook.com/arislablive/photos/a.2351555585089789/2453327174912629/?type=3&theater">
                                        ขัอมูลเพิ่มเติมที่นี่..
                                    </a>
                                </div>
                            </div>
                            <div className="px-6 pb-4">
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                                    #aris
                                </span>
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                                    #ไลฟ์สดขายของ
                                </span>
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                                    #AIChatbot
                                </span>
                            </div>
                        </div>

                        {/* Blog number 1 */}
                        <div className=" rounded overflow-hidden shadow-lg mb-4 mt-12">
                            <img
                                className="w-full"
                                src="https://scontent.fbkk12-4.fna.fbcdn.net/v/t1.0-0/p640x640/72474496_2450458288532851_718974265470222336_o.jpg?_nc_cat=110&_nc_eui2=AeFTV49HFsx-pXd7OpfM0QQKLf2ugin1FaUg_nlf6clvv238XDBsmsEuzF_HxhDIlDf6LI_p92e5eHZX2d3jzkCjG6f76HwLLkd24bNdkdIn_g&_nc_oc=AQmb3mHGK3PEQEDQ-QDmzYFJQqHMB3CNPj7PinxheYZB_jP4M6k4jXqWJbNPPPpnCqazwDctWy0QMvp1svdonCAY&_nc_ht=scontent.fbkk12-4.fna&_nc_tp=6&oh=f978c5c7bd0b682af4899370b58f4f88&oe=5EF558E5"
                                alt=""
                            ></img>
                            <div className="px-6 py-4">
                                <div className="font-bold text-xl mb-2"> เจาะลึกข้อมูลด้วย Facebook Creator Studio</div>
                                <div className="text-gray-700 text-base">
                                    <p>
                                        รู้หรือไม่ว่า Facebook ได้มีการออกฟังค์ชั่น Creator Studio
                                        เพื่อที่จะอำนวยความสะดวกให้กับเจ้าของเพจธุรกิจออนไลน์ต่างๆ อย่างเราได้ใช้งานกันด้วยนะคะ โดย Facebook Creator
                                        Studio เวอร์ชั่นล่าสุดปี 2019
                                        สามารถช่วยให้เราจัดการกับเพจร้านค้าของเราได้อย่างมากมายชนิดที่ว่าบอกกันไม่หมดเลยล่ะ
                                    </p>
                                    <br />
                                    <p>
                                        สำหรับวันนี้ Aris จะมาขอแนะนำหนึ่งในฟังค์ชั่นหลักๆ ที่น่าสนใจกัน นั้นก็คือ
                                        การดูข้อมูลคนที่เข้ามาชมเพจแบบเจาะลึก https://www.facebook.com/business/m/join-ad-breaks{" "}
                                    </p>
                                    <br />
                                    <p>
                                        โดยเราสามารถ ตรวจสอบข้อมูลของคนที่เข้ามาดูเพจเรา ได้ถึงขนาดที่ว่าใครที่กลับเข้ามาในเพจเราอีกบ้าง จากช่องเมนู
                                        Loyalty insight หรือแม้กระทั้ง การประเมินข้อมูลจากวีดีโอ หรือ Live ก่อนๆ หน้าได้อย่างละเอียดยิบ
                                        จนไปถึงการแจกแจงค่าเปอร์เซนต์เพื่อบ่งบอกประสิทธิภาพของคลิปในแต่ละโพส บอกเลยว่ามีประโยชน์สุดๆ
                                    </p>
                                    <br />
                                    <p>
                                        ฟังค์ชั่น Facebook Creator Studio ยังมีลูกเล่นอีกมากมายที่มีประโยชน์ เช่น การตั้งเวลาโพส,
                                        การจัดการด้านการสื่อสาร ที่รวม Facebook,Instagram และ Messenger เอาไว้ที่เดียว
                                        โดยเราไม่จำเป็นต้องสลัปแอปตอบคอมเมนต์ให้ยุ่งยาก
                                    </p>
                                    <br />
                                    <p>สำหรับใครที่สนใจ อยากเข้าไปลองเล่นเพิ่มเติมสามารถเข้าไปลองได้ตามลิ้งค์ด้านล่างได้เลยนะคะ</p>
                                    <br />
                                    <a href="https://www.facebook.com/arislablive/photos/a.2351555585089789/2450458285199518/?type=3&__tn__=-R">
                                        ขัอมูลเพิ่มเติมที่นี่..
                                    </a>
                                </div>
                            </div>
                            <div className="px-6 pb-4">
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                                    #aris
                                </span>
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                                    #ไลฟ์สดขายของ
                                </span>
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                                    #AIChatbot
                                </span>
                            </div>
                        </div>

                        {/* Blog number 1 */}
                        <div className=" rounded overflow-hidden shadow-lg mb-4 mt-12">
                            <img
                                className="w-full"
                                src="https://scontent.fbkk13-1.fna.fbcdn.net/v/t1.0-9/p960x960/67805015_2399900163588664_3472074815039340544_o.jpg?_nc_cat=108&_nc_eui2=AeEjcKFir7h8r7lw_cdfu_FCh2JUr19KG4PVYfJuKOd1zVtTr3oLDUtaBXLA2xgBbDWMR7OJxn2lh2OmLrDsOiVjFHX8enV8rlaptyzlIS2QzQ&_nc_oc=AQk3xbkUQIp0vHoraejKt2T8wBtrgLM9sWwWLfhNALRjGlw_jlYcqRiHjrEgBX8hSyh5hGmq9nTB0Ve9un9zxVeO&_nc_ht=scontent.fbkk13-1.fna&_nc_tp=6&oh=2adff494047898b5d33d2023ffe8f539&oe=5EBB3C1D"
                                alt=""
                            ></img>
                            <div className="px-6 py-4">
                                <div className="font-bold text-xl mb-2"> ยกระดับการ Live ขายของกับเรา</div>
                                <div className="text-gray-700 text-base">
                                    <p>
                                        ยกระดับการ Live ขายของด้วยฟีเจอร์มากมายที่จะทำให้ การLive ดูมือโปรยิ่งขึ้น รวมไปถึงอำนวยความสะดวกให้คุณในขณะ
                                        Live
                                    </p>
                                    เช่น <br></br>
                                    <ul>
                                        <li>สามารถใส่โลโก้ของร้านคุณลงไปได้ในขณะ Live</li>
                                        <li>
                                            Tag สินค้าขณะ Live สด พร้อมบอกข้อมูลต่างๆของสินค้าได้ เช่น ราคา , Size , สี, โปรโมชั่น หรือ
                                            สามารถรูปภาพเพิ่มเติมได้มากถึง 3 รูป ด้วยฟีเจอร์ที่ดูคลีนไม่รบกวนสายตาคนดู
                                        </li>
                                        <li>และในอนาคตเราจะมีฟีเจอร์ Sound effect ต่างๆที่จะเพิ่มอรรถรสในการ Live ได้มากยิ่งขึ้น</li>
                                    </ul>{" "}
                                    <br></br>
                                    เปิดให้ลงทะเบียนใช้งานฟรีแล้ววันนี้ <br></br>
                                    <a href="https://arislab.ai">www.arislab.ai</a>
                                    <div>
                                        <a href="https://facebook.com/arislablive/photos/a.2351555585089789/2399900156921998/?type=3&theater">
                                            ขัอมูลเพิ่มเติมที่นี่..
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="px-6 pb-4">
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                                    #aris
                                </span>
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                                    #ไลฟ์สดขายของ
                                </span>
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                                    #AIChatbot
                                </span>
                            </div>
                        </div>

                        {/* Blog number 2 */}
                        <div className="rounded overflow-hidden shadow-lg my-4">
                            <img
                                className="w-full"
                                src="https://scontent.fbkk8-3.fna.fbcdn.net/v/t1.0-9/p960x960/67811254_2399900990255248_8054386753265467392_o.jpg?_nc_cat=111&_nc_eui2=AeE0RNJu13dKK1xAVEEvZ2yIhjqFfV7nV2BYm71ApgBNAfLtiX7gk0_QGHVn5_eHHFLBAtDW_t5PhVuw0YxxsSHrTGGNTqBGQzNsZbnucfROQA&_nc_oc=AQniPtWQtZ25G5DDK2BCYpd-X6FUm2Clhm-2u9tI-1mU_ow9n26VlEDpxiSVe4VJ7PP5KYXy3GhcZgUhUluMHuWe&_nc_ht=scontent.fbkk8-3.fna&_nc_tp=6&oh=a5ba7abcc9d550b90499ef719f41ace9&oe=5EC6D2B6"
                                alt=""
                            ></img>
                            <div className="px-6 py-4">
                                <div className="font-bold text-xl mb-2"> Live ด้วยระบบแชท Ai </div>
                                <div className="text-gray-700 text-base">
                                    ให้การขายของคุณไม่ติดขัดในระหว่าง Live ด้วยระบบแชท Ai <br></br>
                                    คอยให้ข้อมูล ตอบคำถาม เช็คสตอค และปิดการขายได้เลย ไม่ต้องให้ลูกค้าแคปภาพแล้วส่งมา ไม่ต้องรอจบLiveแล้วไปตามตอบinbox
                                    ให้วุ่นวาย <br></br> <br></br>
                                    เพียงพิมพ์ รหัสสินค้าลงใต้คอมเมนต์ Live <br></br>
                                    ระบบ ai พร้อมดึงลูกค้าของคุณเข้า inbox ส่วนตัว <br></br>
                                    <br></br>
                                    พร้อมระบบการตอบคำถามเบื้องต้นให้คุณ และปิดการขายได้เลยในขณะที่ยัง Live อยู่ รวมไปถึงการบันทึกข้อมูล ออกใบเสร็จ และ
                                    เช็คสต็อคสินค้าให้คุณได้อีกด้วย<br></br>
                                    เปิดให้ลงทะเบียนใช้งานฟรีแล้ววันนี้<br></br>
                                    <a href="https://arislab.ai">www.arislab.ai</a>
                                    <div>
                                        <a href="https://facebook.com/arislablive/photos/a.2351555585089789/2399900156921998/?type=3&theater">
                                            ขัอมูลเพิ่มเติมที่นี่..
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="px-6 pb-4">
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                                    #aris
                                </span>
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                                    #ไลฟ์สดขายของ
                                </span>
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                                    #AIChatbot
                                </span>
                            </div>
                        </div>

                        {/* Blog number 3 */}
                        <div className="rounded overflow-hidden shadow-lg my-4">
                            <img
                                className="w-full"
                                src="https://scontent.fbkk12-2.fna.fbcdn.net/v/t1.0-0/p640x640/68621497_2404152623163418_7797454576893820928_o.jpg?_nc_cat=105&_nc_eui2=AeHq-3pHLxfohvjA82SkCVmgLX6oI6PuIBCcvaoLBHRoVpiD_TsFJWiREbYieW2QxpOtFweNlIY6xKviowM4sy7KfHYIbJxYsyeAKFUYBJvQIw&_nc_oc=AQkM7U17l-RRipG8uW6kdZ_wSj67cmcQyTHHYRXJ5Ta39vC_lZ1TBESs-0U4svVyA6ZYiKPHhHhkYr6a8TD87YmE&_nc_ht=scontent.fbkk12-2.fna&_nc_tp=6&oh=affde632b9685bc2f4a77df7cd7d0d6c&oe=5EF8F776"
                                alt=""
                            ></img>
                            <div className="px-6 py-4">
                                <div className="font-bold text-xl mb-2"> Facebook news feed รูปแบบใหม่บนมือถือ </div>
                                <div className="text-gray-700 text-base">
                                    วันนี้ ARIS มีอัพเดทจาก Facebook ให้พ่อค้า แม่ค้าออนไลน์ทราบ <br></br>
                                    นับตั้งแต่วันที่ 19 สิงหาคม 2562 เป็นต้นไป Facebook จะมีการปรับเปลี่ยน Mobile News Feed Ads ในรูปแบบใหม่ ดังนี้{" "}
                                    <br></br> <br></br>
                                    <ul>
                                        <li>ปรับสเกลรูปและวีดีโอที่จะใช้ยิง Ads จาก 2:3 เป็น 4:5 </li>
                                        <li>
                                            แสดงข้อความ บนแคปชั่นเหลือเพียง 3 บรรทัด (จาก 7 บรรทัด) โดยนอกเหนือจาก 3 บรรทัด ผู้ชมต้องกด ‘see more หรือ
                                            เพิ่มเติม’ เพื่ออ่านข้อความทั้งหมด
                                        </li>
                                    </ul>
                                    <br></br>
                                    สำหรับใครที่จะยิง Ads บน Facebook อย่าลืมคำนึงถึง รูปภาพ และ ข้อความแคปชั่น รูปแบบใหม่กันด้วยนะคะ เพื่อให้การ ยิง
                                    Ads ออกมาได้อย่างมีประสิทธิภาพที่สุด <br></br>
                                    <br></br>
                                    ที่มา
                                    <a href="https://www.socialmediatoday.com/news/marketers-take-note-facebook-is-changing-its-ad-format-from-next-month/559169/">
                                        https://www.socialmediatoday.com/news/marketers-take-note-facebook-is-changing-its-ad-format-from-next-month/559169/
                                    </a>
                                    <div>
                                        <a href="https://facebook.com/arislablive/photos/a.2351555585089789/2404152616496752/?type=3&theater">
                                            ขัอมูลเพิ่มเติมที่นี่..
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="px-6 pb-4">
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                                    #aris
                                </span>
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                                    #ไลฟ์สดขายของ
                                </span>
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                                    #AIChatbot
                                </span>
                            </div>
                        </div>

                        {/* Blog number 4 */}
                        <div className="rounded overflow-hidden shadow-lg my-4">
                            <img
                                className="w-full"
                                src="https://scontent.fbkk12-2.fna.fbcdn.net/v/t1.0-9/p960x960/68380861_2405528686359145_4318427317903818752_o.jpg?_nc_cat=105&_nc_eui2=AeH-92YPLnXMb5GbCbko9LFrRQLUzKT3q_ZLUFCRvxMBulcFXs3zGkMaOQHSJzCfIyoailZoV0C6NNlUQ3mnM8Xmm2AW8qw9iZMWTAmCyE6_VQ&_nc_oc=AQnOKYU8Rq21wADHdjBmmh2hNI8oi4yxEbbcNmfLpSO-M4PNg8Ahvrfc49EMT2jTL-5gi_WCLdVoXiDMLFKK3OL1&_nc_ht=scontent.fbkk12-2.fna&_nc_tp=6&oh=3398628fbb761d2c93ed53775f836d18&oe=5EC20937"
                                alt=""
                            ></img>
                            <div className="px-6 py-4">
                                <div className="font-bold text-xl mb-2">LIVE แล้ว เน็ตก็เร็วทำไมยังดีเลย์ ?</div>
                                <div className="text-gray-700 text-base">
                                    เคยสงสัยมั้ยว่า ทำไมเวลาเรา LIVE แล้ว ภาพที่ถ่ายทอดสด ยังช้ากว่าความเป็นจริงอยู่ประมาณ 10-12 วินาที
                                    จนอดคิดไม่ได้ว่าเป็นเพราะ อินเตอร์เนต หรือ อุปกรณ์รับสัญญาณเราไม่ดีรึเปล่านะ <br></br> <br></br>
                                    แท้จริงแล้วนั่นไม่ใช่ การ LIVE ดีเลย์ 10-12 วินาที นั้น เป็นเรื่องปกติ ซึ่งเป็นความตั้งใจของ Facebook นั้นเอง
                                    โดยทางฝั่งผู้ส่งสัญญาณ จะได้หยุดการ LIVE ได้ทัน หากมีเหตุสุดวิสัยต่างๆ เกิดขึ้นขณะ LIVE เพราะบางครั้งการ LIVE แบบ
                                    Real time อาจทำให้เกิดภาพ หรือ เสียงที่ไม่เหมาะสม โดยที่ คน LIVE ไม่ได้ตั้งใจ หรือ ควบคุมไม่ทัน
                                    แต่ดันออกอากาศและมีคนรับชมไปแล้ว เช่น การเกิดอุบัติเหตุขณะ LIVE จนได้รับบาดเจ็บ <br></br> <br></br>
                                    ดังนั้น มีเดียแพลตฟอร์ทั้งหลายที่มีฟังก์ชั่นการ LIVE เช่น Facebook หรือ YouTube จึงออกกฎการหน่วงเวลาภาพขณะ LIVE
                                    ให้ช้ากว่าความเป็นจริงอยู่ประมาณ 10-12 วินาที <br></br>
                                    <br></br>
                                    ให้ทุกการ LIVE ของคุณเป็นเรื่องง่าย เพิ่มช่องทางขยายธุรกิจของคุณมากยิ่งขึ้น<br></br>
                                    เปิดให้ลงทะเบียนใช้งานฟรีแล้ววันนี้<br></br>
                                    <a href="https://arislab.ai">www.arislab.ai</a>
                                    <div>
                                        <a href="https://facebook.com/arislablive/photos/a.2351555585089789/2405528683025812/?type=3&theater">
                                            ขัอมูลเพิ่มเติมที่นี่..
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="px-6 pb-4">
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                                    #aris
                                </span>
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                                    #ไลฟ์สดขายของ
                                </span>
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                                    #AIChatbot
                                </span>
                            </div>
                        </div>

                        {/* Blog number 5 */}
                        <div className="rounded overflow-hidden shadow-lg my-4">
                            <img
                                className="w-full"
                                src="https://scontent.fbkk9-2.fna.fbcdn.net/v/t1.0-0/p640x640/68935578_2412956685616345_7009852613843746816_o.jpg?_nc_cat=109&_nc_eui2=AeFtU-_WtqLMolWD3rZG0LC4_gQaNS1hL4ULPgXkHqNZPB83jk1asjq_hA-2R-tUPZc5GtOvlLBlbsolXYoJQ607-Gnja5973zPpJjyyoJJBIQ&_nc_oc=AQnue2PPChZROJJ6JOz1BMQ7DEl-6hk5aa0vzBnuvg2aUer3pBf89Hd7Sv1mNA3u_7LPlhSaJkC1PVvIHc0RWr-P&_nc_ht=scontent.fbkk9-2.fna&_nc_tp=6&oh=95b5f2b5a72013d2075126f9676a6d55&oe=5EBD9C19"
                                alt=""
                            ></img>
                            <div className="px-6 py-4">
                                <div className="font-bold text-xl mb-2">ลง Storeis ขายของอย่างไรให้คนสนใจ</div>
                                <div className="text-gray-700 text-base">
                                    ฟังก์ชั่น Stories บน Instagram และ Facebook เป็นฟังก์ชั่นที่ออกแบบมาเป็นพิเศษ เพื่อให้ User
                                    คนอื่นเข้าถึงเราและสนใจเราได้ง่ายมากกว่าบรรดาฟังก์ชั่นอื่นๆ จากสถิติพบว่า ต่อวันมีผู้ใช้งาน Stories มากกว่า 500
                                    ล้านคนทั่วโลก และ Facebook ยังพบว่า 58% คนที่ดู Stories มีโอกาสสนใจสินค้า หรือเกิดความต้องการได้อีกด้วย
                                    <br></br> <br></br>
                                    เรียกได้ว่า เราจะมีโอกาสเพิ่มยอดขาย หรือ เพิ่มค่าการมองเห็นได้อย่างมีประสิทธิภาพเลยทีเดียว
                                    วันนี้เรามาดูกันว่าการลง Stories ขายของต้องอาศัยปัจจัยอะไรบ้างที่จะทำให้โพสของเราเป็นที่น่าสนใจ
                                    <br></br>
                                    <br></br>
                                    แหล่งข้อมูล<br></br>
                                    <a href="https://www.socialmediatoday.com/…/what-makes-a-hig…/559991/">
                                        https://www.socialmediatoday.com/…/what-makes-a-hig…/559991/
                                    </a>
                                    <div>
                                        <a href="https://facebook.com/arislablive/posts/2412958775616136">
                                            ขัอมูลเพิ่มเติมที่นี่..
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="px-6 pb-4">
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                                    #aris
                                </span>
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                                    #ไลฟ์สดขายของ
                                </span>
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                                    #AIChatbot
                                </span>
                            </div>
                        </div>

                        {/* Blog number 6*/}
                        <div className="rounded overflow-hidden shadow-lg my-4">
                            <img
                                className="w-full"
                                src="https://scontent.fbkk12-1.fna.fbcdn.net/v/t1.0-9/69458845_2412964388948908_8182442697844326400_o.jpg?_nc_cat=101&_nc_eui2=AeEh2jdwmUMkUsYL4W07a54_iFcgJYRPlqjr3qSNvKTl82GkI6Co68iNlSEk80y7ndXHF0cO7Q2lJRd144Wh8cdy5cvxOvpE6b-HsYJ1gDfFSQ&_nc_oc=AQnDfu9Bcf4YNp6DrbXbGYc_Law__4nH5MqzRdqP0QjRAH1vfJ_fQKhuWPDylZFr64rAudx-9wX97hEv7Hn0J7g6&_nc_ht=scontent.fbkk12-1.fna&oh=4662fb80b56405a0a04c82f91811b592&oe=5EC99A1F"
                                alt=""
                            ></img>
                            <div className="px-6 py-4">
                                <div className="font-bold text-xl mb-2">ก่อนไลฟ์ต้องเตรียมตัวยังไงบ้าง</div>
                                <div className="text-gray-700 text-base">
                                    จริงอยู่ที่ การLIVE ขายของแต่ละครั้งสามารถกระตุ้นยอดขายสูงขึ้นถึง 70-80% จึงไม่แปลกที่ผู้ประกอบการส่วนใหญ่หันมา
                                    LIVE ขายของกันมากมายผ่านทางโซเชียล แต่การ LIVE ขายของแต่ละครั้งไม่ใช่เรื่องง่ายเลย <br></br>
                                    <br></br>
                                    เพราะออกอากาศแบบเรียลไทม์ทำให้เราต้องเตรียมทุกอย่างให้พร้อมเป๊ะๆ ทั้งหน้ากล้องและหลังกล้อง <br></br>
                                    <br></br>
                                    วันนี้เราจึงทำแนวทางมาเสนอให้ได้นำไปคิดและปรับใช้ว่าก่อนจะ LIVE เราควรที่จะเตรียมตัวเรื่องใดบ้าง <br></br>
                                    <br></br>
                                    {/* สามารถติดตามข่าวสารหรือเทคนิกเจ๋งๆ ได้ที่  */}
                                    ยังมี trick เจ๋งๆ เทคนิกโดนๆ อีกมากมายรออยู่ที่ <br></br>
                                    <a href="https://www.facebook.com/arislablive/">Fanpage ARIS</a>
                                    <div>
                                        <a href="https://facebook.com/arislablive/posts/2412966015615412">
                                            ขัอมูลเพิ่มเติมที่นี่..
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="px-6 pb-4">
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                                    #aris
                                </span>
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                                    #ไลฟ์สดขายของ
                                </span>
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                                    #AIChatbot
                                </span>
                            </div>
                        </div>

                        {/* Blog number 7*/}
                        <div className="rounded overflow-hidden shadow-lg my-4">
                            <img
                                className="w-full"
                                src="https://scontent.fbkk8-4.fna.fbcdn.net/v/t1.0-9/69551115_2420348601543820_6627743521140899840_o.jpg?_nc_cat=100&_nc_eui2=AeGLceojxOxjgNnkbPX0ia20i0GqeRkgSN7m0wuTsgwOJiCmmLbXKn-a60daK-sh_fQLpUQNxanF-T5nuGRxop2fohrMXMYqgsJ61JYjanP__w&_nc_oc=AQnHXn2TxzhHiePQeSavrTs9F9x7MLY_kDTUah-os7ERqRfYLrvO4WBVSBTG_3667sFG8Y00jAda6pXj1lGM85vs&_nc_ht=scontent.fbkk8-4.fna&oh=08158582f57d7aad345dd1758cdc1951&oe=5F02E226"
                                alt=""
                            ></img>
                            <div className="px-6 py-4">
                                <div className="font-bold text-xl mb-2"> Aris x Zaap on Sale Page x Workpoint LIVE </div>
                                <div className="text-gray-700 text-base">
                                    จบกันไปแล้วกับ การจับมือระหว่าง Aris x Zaap on Sale Page x Workpoint LIVE กับการ LIVE
                                    สดขายของจากร้านเสื้อผ้าออนไลน์ชื่อดังอย่าง <br></br>
                                    <br></br>
                                    CHAMNII และ LOONNY STORE ที่ทำให้การ LIVE ของเราคึกคักกันมากๆ ได้รับความสนใจมากมายจนมียอดเข้าชมทะลุ 100k views
                                    กันไปเลยสำหรับวันที่ 20 สิงหาคมที่ผ่านมา มีคน inbox สนใจสินค้าเข้ามากันนับไม่ถ้วนกันเลยทีเดียว
                                    <br></br>
                                    <br></br>
                                    และแน่นอนว่า ตัวช่วยการขายที่ทำให้การ LIVE ครั้งนี้ไม่วุ่ยวายก็คือ ARIS นั้นเอง ให้ทั้งผู้ซื้อและผู้ขาย
                                    เปิดประสบการณ์ใหม่ LIVE แบบใหม่ที่ทำได้อย่างมืออาชีพสุด ทั้งใส่โลโก้ มีภาพสินค้าโชว์ระหว่าง LIVE และ ระบบ AI
                                    คอยตอบinbox แบบ REAL TIME <br></br>
                                    <br></br>
                                    ต้องขอบคุณ Zaap on Sale Page Workpoint LIVE CHAMNII และ LOONNY STORE ที่ไว้ใจ และให้เรามีส่วนร่วมกับการ LIVE
                                    ครั้งนี้ <br></br>
                                    <br></br>
                                    ไม่ว่าใครก็สามารถ LIVE สดกับได้อย่างมืออาชีพกันได้แล้ววันนี้ กับ ARIS เครื่องมือที่จะช่วยให้เรื่อง LIVE
                                    เป็นเรื่องง่าย ครบ จบทุกการขาย <br></br>
                                    <br></br>
                                    เปิดให้ลงทะเบียนใช้งานฟรีแล้ววันนี้<br></br>
                                    <a href="https://arislab.ai">www.arislab.ai</a>
                                    <div>
                                        <a href="https://facebook.com/arislablive/photos/a.2351555585089789/2420348594877154/?type=3&theater">
                                            ขัอมูลเพิ่มเติมที่นี่..
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="px-6 pb-4">
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                                    #aris
                                </span>
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                                    #ไลฟ์สดขายของ
                                </span>
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                                    #AIChatbot
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default withTranslation()(Blog);
