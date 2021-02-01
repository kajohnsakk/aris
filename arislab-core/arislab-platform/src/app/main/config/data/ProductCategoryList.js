/*
export const PRODUCT_CATEGORY_LIST = {
    "en": [
        { name: "Men's Clothes", level: "Category", parent: [] },
        { name: "Women's Clothes", level: "Category", parent: [] },

        { name: "T-Shirts", level: "Sub Category 1", parent: [{name: "Men's Clothes"}] },
        { name: "Shirts", level: "Sub Category 1", parent: [{name: "Men's Clothes"}] },
        { name: "Polo Shirts", level: "Sub Category 1", parent: [{name: "Men's Clothes"}] },
        { name: "Men's Outerwear", level: "Sub Category 1", parent: [{name: "Men's Clothes"}] },
        { name: "Shorts", level: "Sub Category 1", parent: [{name: "Men's Clothes"}] },
        { name: "Long Pants", level: "Sub Category 1", parent: [{name: "Men's Clothes"}] },
        { name: "Jeans", level: "Sub Category 1", parent: [{name: "Men's Clothes"}] },
        { name: "Underwear", level: "Sub Category 1", parent: [{name: "Men's Clothes"}] },
        { name: "Long Johns", level: "Sub Category 1", parent: [{name: "Men's Clothes"}] },
        { name: "Gloves", level: "Sub Category 1", parent: [{name: "Men's Clothes"}] },

        { name: "Tops", level: "Sub Category 1", parent: [{name: "Women's Clothes"}] },
        { name: "Dresses", level: "Sub Category 1", parent: [{name: "Women's Clothes"}] },
        { name: "Skirts", level: "Sub Category 1", parent: [{name: "Women's Clothes"}] },
        { name: "Pants and Leggings", level: "Sub Category 1", parent: [{name: "Women's Clothes"}] },
        { name: "Women's Outerwear", level: "Sub Category 1", parent: [{name: "Women's Clothes"}] },
        { name: "Jumpsuits / Playsuits", level: "Sub Category 1", parent: [{name: "Women's Clothes"}] },
        { name: "Lingeries", level: "Sub Category 1", parent: [{name: "Women's Clothes"}] },
        { name: "Sleepwear Set", level: "Sub Category 1", parent: [{name: "Women's Clothes"}] },
        { name: "Sleepwear", level: "Sub Category 1", parent: [{name: "Women's Clothes"}] },

        { name: "Plain Color", level: "Sub Category 2", parent: [{name: "T-Shirts"}, {name: "Shirts"}, {name: "Polo Shirts"}] },
        { name: "Pattern Screen", level: "Sub Category 2", parent: [{name: "T-Shirts"}, {name: "Shirts"}, {name: "Polo Shirts"}] },
        { name: "Striped Screen", level: "Sub Category 2", parent: [{name: "T-Shirts"}, {name: "Shirts"}, {name: "Polo Shirts"}] },
        { name: "Alphabet Screen", level: "Sub Category 2", parent: [{name: "T-Shirts"}] },
        { name: "Graphic Screen", level: "Sub Category 2", parent: [{name: "T-Shirts"}] },
        { name: "Sleeveless", level: "Sub Category 2", parent: [{name: "T-Shirts"}] },
        { name: "Sweater and Cardigan", level: "Sub Category 2", parent: [{name: "Men's Outerwear"}] },
        { name: "Jacket and Coat", level: "Sub Category 2", parent: [{name: "Men's Outerwear"}] },
        { name: "Hoodie", level: "Sub Category 2", parent: [{name: "Men's Outerwear"}] },
        { name: "Suit", level: "Sub Category 2", parent: [{name: "Men's Outerwear"}] },
        { name: "Denim Jacket", level: "Sub Category 2", parent: [{name: "Men's Outerwear"}] },
        { name: "Elastic Waist Shorts", level: "Sub Category 2", parent: [{name: "Shorts"}] },
        { name: "Fabric Shorts", level: "Sub Category 2", parent: [{name: "Shorts"}] },
        { name: "Shorts", level: "Sub Category 2", parent: [{name: "Shorts"}, {name: "Jeans"}] },
        { name: "Straight Leg", level: "Sub Category 2", parent: [{name: "Long Pants"}, {name: "Jeans"}] },
        { name: "Skinny Leg", level: "Sub Category 2", parent: [{name: "Long Pants"}, {name: "Jeans"}] },
        { name: "Jogger", level: "Sub Category 2", parent: [{name: "Long Pants"}] },
        { name: "Vest", level: "Sub Category 2", parent: [{name: "Underwear"}] },
        { name: "Briefs", level: "Sub Category 2", parent: [{name: "Underwear"}] },
        { name: "Boxer", level: "Sub Category 2", parent: [{name: "Underwear"}] },

        { name: "Sets", level: "Sub Category 2", parent: [{name: "Tops"}] },
        { name: "T-Shirt", level: "Sub Category 2", parent: [{name: "Tops"}] },
        { name: "Shoulder Shirts", level: "Sub Category 2", parent: [{name: "Tops"}] },
        { name: "Crop Top", level: "Sub Category 2", parent: [{name: "Tops"}] },
        { name: "Oversize", level: "Sub Category 2", parent: [{name: "Tops"}] },
        { name: "Strapless", level: "Sub Category 2", parent: [{name: "Tops"}] },
        { name: "Vest/Spaghetti Strap", level: "Sub Category 2", parent: [{name: "Tops"}] },
        { name: "Shirt", level: "Sub Category 2", parent: [{name: "Tops"}] },
        { name: "Polo Shirt", level: "Sub Category 2", parent: [{name: "Tops"}] },
        { name: "Short Dress", level: "Sub Category 2", parent: [{name: "Dresses"}] },
        { name: "Long Dress", level: "Sub Category 2", parent: [{name: "Dresses"}] },
        { name: "Mini Skirt", level: "Sub Category 2", parent: [{name: "Skirts"}] },
        { name: "Maxi Skirt", level: "Sub Category 2", parent: [{name: "Skirts"}] },
        { name: "Denim Skirt", level: "Sub Category 2", parent: [{name: "Skirts"}] },
        { name: "Divided Skirt", level: "Sub Category 2", parent: [{name: "Skirts"}] },
        { name: "Shorts", level: "Sub Category 2", parent: [{name: "Pants and Leggings"}] },
        { name: "Trousers", level: "Sub Category 2", parent: [{name: "Pants and Leggings"}] },
        { name: "Legging", level: "Sub Category 2", parent: [{name: "Pants and Leggings"}] },
        { name: "Jeans", level: "Sub Category 2", parent: [{name: "Pants and Leggings"}] },
        { name: "Cardigan", level: "Sub Category 2", parent: [{name: "Women's Outerwear"}] },
        { name: "Sweater", level: "Sub Category 2", parent: [{name: "Women's Outerwear"}] },
        { name: "Jacket", level: "Sub Category 2", parent: [{name: "Women's Outerwear"}] },
        { name: "Sweater Vest", level: "Sub Category 2", parent: [{name: "Women's Outerwear"}] },
        { name: "Coat", level: "Sub Category 2", parent: [{name: "Women's Outerwear"}] },
        { name: "Hoodie", level: "Sub Category 2", parent: [{name: "Women's Outerwear"}] },
        { name: "Suit", level: "Sub Category 2", parent: [{name: "Women's Outerwear"}] },
        { name: "Short Jumpsuit", level: "Sub Category 2", parent: [{name: "Jumpsuits / Playsuits"}] },
        { name: "Long Jumpsuit", level: "Sub Category 2", parent: [{name: "Jumpsuits / Playsuits"}] },
        { name: "Jumper", level: "Sub Category 2", parent: [{name: "Jumpsuits / Playsuits"}] },
        { name: "Brassiere", level: "Sub Category 2", parent: [{name: "Lingeries"}] },
        { name: "Panties", level: "Sub Category 2", parent: [{name: "Lingeries"}] },
        { name: "Shapewear", level: "Sub Category 2", parent: [{name: "Lingeries"}] },
        { name: "Lingerie", level: "Sub Category 2", parent: [{name: "Lingeries"}] },
        { name: "Outfit", level: "Sub Category 2", parent: [{name: "Sleepwear Set"}] },
        { name: "Shirt", level: "Sub Category 2", parent: [{name: "Sleepwear"}] },
        { name: "Pants", level: "Sub Category 2", parent: [{name: "Sleepwear"}] },
        { name: "Dress", level: "Sub Category 2", parent: [{name: "Sleepwear"}] },
        { name: "Sexy", level: "Sub Category 2", parent: [{name: "Sleepwear"}] },
    ],
    "th": [
        { name: "เสื้อผ้าแฟชั่นผู้ชาย", level: "Category", parent: [] },
        { name: "เสื้อผ้าแฟชั่นผู้หญิง", level: "Category", parent: [] },

        { name: "เสื้อยืด", level: "Sub Category 1", parent: [{name: "เสื้อผ้าแฟชั่นผู้ชาย"}] },
        { name: "เสื้อเชิ้ต", level: "Sub Category 1", parent: [{name: "เสื้อผ้าแฟชั่นผู้ชาย"}] },
        { name: "เสื้อโปโล", level: "Sub Category 1", parent: [{name: "เสื้อผ้าแฟชั่นผู้ชาย"}] },
        { name: "เสื้อคลุมตัวนอก", level: "Sub Category 1", parent: [{name: "เสื้อผ้าแฟชั่นผู้ชาย"}] },
        { name: "กางเกงขาสั้น", level: "Sub Category 1", parent: [{name: "เสื้อผ้าแฟชั่นผู้ชาย"}] },
        { name: "กางเกงขายาว", level: "Sub Category 1", parent: [{name: "เสื้อผ้าแฟชั่นผู้ชาย"}] },
        { name: "กางเกงยีนส์", level: "Sub Category 1", parent: [{name: "เสื้อผ้าแฟชั่นผู้ชาย"}] },
        { name: "ชุดชั้นในชาย", level: "Sub Category 1", parent: [{name: "เสื้อผ้าแฟชั่นผู้ชาย"}] },
        { name: "ลองจอน", level: "Sub Category 1", parent: [{name: "เสื้อผ้าแฟชั่นผู้ชาย"}] },
        { name: "ถุงมือ", level: "Sub Category 1", parent: [{name: "เสื้อผ้าแฟชั่นผู้ชาย"}] },

        { name: "เสื้อ", level: "Sub Category 1", parent: [{name: "เสื้อผ้าแฟชั่นผู้หญิง"}] },
        { name: "เดรส", level: "Sub Category 1", parent: [{name: "เสื้อผ้าแฟชั่นผู้หญิง"}] },
        { name: "กระโปรง", level: "Sub Category 1", parent: [{name: "เสื้อผ้าแฟชั่นผู้หญิง"}] },
        { name: "กางเกง", level: "Sub Category 1", parent: [{name: "เสื้อผ้าแฟชั่นผู้หญิง"}] },
        { name: "แจ็คเก็ตและโค้ด", level: "Sub Category 1", parent: [{name: "เสื้อผ้าแฟชั่นผู้หญิง"}] },
        { name: "จั๊มสูท", level: "Sub Category 1", parent: [{name: "เสื้อผ้าแฟชั่นผู้หญิง"}] },
        { name: "ชุดชั้นในผู้หญิง", level: "Sub Category 1", parent: [{name: "เสื้อผ้าแฟชั่นผู้หญิง"}] },
        { name: "ชุดนอน", level: "Sub Category 1", parent: [{name: "เสื้อผ้าแฟชั่นผู้หญิง"}] },
        { name: "ชุดนอน", level: "Sub Category 1", parent: [{name: "เสื้อผ้าแฟชั่นผู้หญิง"}] },

        { name: "สีพื้น", level: "Sub Category 2", parent: [{name: "เสื้อยืด"}, {name: "เสื้อเชิ้ต"}, {name: "เสื้อโปโล"}] },
        { name: "มีลาย", level: "Sub Category 2", parent: [{name: "เสื้อยืด"}, {name: "เสื้อเชิ้ต"}, {name: "เสื้อโปโล"}] },
        { name: "ลายทาง", level: "Sub Category 2", parent: [{name: "เสื้อยืด"}, {name: "เสื้อเชิ้ต"}, {name: "เสื้อโปโล"}] },
        { name: "สกรีนตัวหนังสือ", level: "Sub Category 2", parent: [{name: "เสื้อยืด"}] },
        { name: "ลายการ์ตูน", level: "Sub Category 2", parent: [{name: "เสื้อยืด"}] },
        { name: "เสื้อแขนกุด", level: "Sub Category 2", parent: [{name: "เสื้อยืด"}] },
        { name: "สเว็ตเตอร์และคาร์ดิแกน", level: "Sub Category 2", parent: [{name: "เสื้อคลุมตัวนอก"}] },
        { name: "แจ็คเก็ตและโค้ด", level: "Sub Category 2", parent: [{name: "เสื้อคลุมตัวนอก"}] },
        { name: "เสื้อฮู้ด", level: "Sub Category 2", parent: [{name: "เสื้อคลุมตัวนอก"}] },
        { name: "เสื้อสูท", level: "Sub Category 2", parent: [{name: "เสื้อคลุมตัวนอก"}] },
        { name: "แจ็คเก็ตยีนส์", level: "Sub Category 2", parent: [{name: "เสื้อคลุมตัวนอก"}] },
        { name: "กางเกงขาสั้นเอวยางยืด", level: "Sub Category 2", parent: [{name: "กางเกงขาสั้น"}] },
        { name: "กางเกงขาสั้นผ้า", level: "Sub Category 2", parent: [{name: "กางเกงขาสั้น"}] },
        { name: "กางเกงขาสั้น", level: "Sub Category 2", parent: [{name: "กางเกงขาสั้น"}, {name: "กางเกงยีนส์"}] },
        { name: "ขากระบอก", level: "Sub Category 2", parent: [{name: "กางเกงขายาว"}, {name: "กางเกงยีนส์"}] },
        { name: "ขาเดฟ", level: "Sub Category 2", parent: [{name: "กางเกงขายาว"}, {name: "กางเกงยีนส์"}] },
        { name: "กางเกงจ็อกเกอร์", level: "Sub Category 2", parent: [{name: "กางเกงขายาว"}] },
        { name: "เสื้อกล้าม", level: "Sub Category 2", parent: [{name: "ชุดชั้นในชาย"}] },
        { name: "กางเกงใน", level: "Sub Category 2", parent: [{name: "ชุดชั้นในชาย"}] },
        { name: "บ็อกเซอร์", level: "Sub Category 2", parent: [{name: "ชุดชั้นในชาย"}] },

        { name: "ชุดเข้าเซ็ท", level: "Sub Category 2", parent: [{name: "เสื้อ"}] },
        { name: "เสื้อยืด", level: "Sub Category 2", parent: [{name: "เสื้อ"}] },
        { name: "เสื้อปาดไหล่", level: "Sub Category 2", parent: [{name: "เสื้อ"}] },
        { name: "เสื้อครอป ท็อป", level: "Sub Category 2", parent: [{name: "เสื้อ"}] },
        { name: "เสื้อทรงใหญ่", level: "Sub Category 2", parent: [{name: "เสื้อ"}] },
        { name: "เกาะอก", level: "Sub Category 2", parent: [{name: "เสื้อ"}] },
        { name: "เสื้อกล้าม/สายเดี่ยว", level: "Sub Category 2", parent: [{name: "เสื้อ"}] },
        { name: "เสื้อเชิ้ต", level: "Sub Category 2", parent: [{name: "เสื้อ"}] },
        { name: "เสื้อโปโล", level: "Sub Category 2", parent: [{name: "เสื้อ"}] },
        { name: "เดรสสั้น", level: "Sub Category 2", parent: [{name: "เดรส"}] },
        { name: "เดรสยาว", level: "Sub Category 2", parent: [{name: "เดรส"}] },
        { name: "กระโปรงสั้น", level: "Sub Category 2", parent: [{name: "กระโปรง"}] },
        { name: "กระโปรงยาว", level: "Sub Category 2", parent: [{name: "กระโปรง"}] },
        { name: "กระโปรงยีนส์", level: "Sub Category 2", parent: [{name: "กระโปรง"}] },
        { name: "กระโปรงกางเกง", level: "Sub Category 2", parent: [{name: "กระโปรง"}] },
        { name: "กางเกงขาสั้น", level: "Sub Category 2", parent: [{name: "กางเกง"}] },
        { name: "กางเกงขายาว", level: "Sub Category 2", parent: [{name: "กางเกง"}] },
        { name: "เลกกิ้ง", level: "Sub Category 2", parent: [{name: "กางเกง"}] },
        { name: "กางเกงยีนส์", level: "Sub Category 2", parent: [{name: "กางเกง"}] },
        { name: "เสื้อคาร์ดิแกน", level: "Sub Category 2", parent: [{name: "แจ็คเก็ตและโค้ด"}] },
        { name: "เสื้อสเวตเตอร์", level: "Sub Category 2", parent: [{name: "แจ็คเก็ตและโค้ด"}] },
        { name: "เสื้อแจ็คเก็ต", level: "Sub Category 2", parent: [{name: "แจ็คเก็ตและโค้ด"}] },
        { name: "เสื้อกั๊ก", level: "Sub Category 2", parent: [{name: "แจ็คเก็ตและโค้ด"}] },
        { name: "เสื้อโค้ด", level: "Sub Category 2", parent: [{name: "แจ็คเก็ตและโค้ด"}] },
        { name: "เสื้อฮู้ด", level: "Sub Category 2", parent: [{name: "แจ็คเก็ตและโค้ด"}] },
        { name: "เสื้อสูท", level: "Sub Category 2", parent: [{name: "แจ็คเก็ตและโค้ด"}] },
        { name: "จั๊มสูทขาสั้น", level: "Sub Category 2", parent: [{name: "จั๊มสูท"}] },
        { name: "จั๊มสูทขายาว", level: "Sub Category 2", parent: [{name: "จั๊มสูท"}] },
        { name: "เอี๊ยม", level: "Sub Category 2", parent: [{name: "จั๊มสูท"}] },
        { name: "เสื้อชั้นใน", level: "Sub Category 2", parent: [{name: "ชุดชั้นในผู้หญิง"}] },
        { name: "กางเกงชั้นใน", level: "Sub Category 2", parent: [{name: "ชุดชั้นในผู้หญิง"}] },
        { name: "ชุดกระชับสัดส่วน", level: "Sub Category 2", parent: [{name: "ชุดชั้นในผู้หญิง"}] },
        { name: "เสื้อและกางเกงซับใน", level: "Sub Category 2", parent: [{name: "ชุดชั้นในผู้หญิง"}] },
        { name: "ทั้งชุด", level: "Sub Category 2", parent: [{name: "ชุดนอน"}] },
        { name: "เสื้อนอน", level: "Sub Category 2", parent: [{name: "ชุดนอน"}] },
        { name: "กางเกงนอน", level: "Sub Category 2", parent: [{name: "ชุดนอน"}] },
        { name: "ชุดนอนเดรส", level: "Sub Category 2", parent: [{name: "ชุดนอน"}] },
        { name: "ชุดนอนเซ็กซี่", level: "Sub Category 2", parent: [{name: "ชุดนอน"}] },
    ]
};
*/



















export const PRODUCT_CATEGORY_LIST = [
    {   name: "Men's Clothes",
        value: "products:clothes.men",
        children: [
            {
                name: "T-Shirts",
                value: "products:clothes.t-shirts",
                available: true,
                children: [
                    { 
                        name: "Plain T-Shirts", 
                        value: "products:clothes.t-shirts-plain", 
                        available: true, 
                        children: [] 
                    },
                    {
                        name: "Patterned T-Shirts",
                        value: "products:clothes.t-shirts-patterned",
                        available: true,
                        children: []
                    },
                    { 
                        name: "Striped Shirts",
                        value: "products:clothes.t-shirts-striped",
                        available: true,
                        children: []
                    },
                    {
                        name: "Text T-Shirts",
                        value: "products:clothes.t-shirts-text",
                        available: true,
                        children: []
                    },
                    {
                        name: "Cartoon T-Shirts",
                        value: "products:clothes.t-shirts-cartoon",
                        available: true,
                        children: []
                    },
                    {
                        name: "Sleeveless T-Shirts",
                        value: "products:clothes.t-shirts-sleeveless",
                        available: true,
                        children: []
                    }
                ],
                attributes: [
                    {
                        name: "Color",
                        stateName: "color",
                        value: "attributes:color",
                        type: "select",
                        multiple: true,
                        required: true,
                        option: "MEN_SHIRT_COLOR_LIST"
                    },
                    {
                        name: "Washing Method",
                        stateName: "washingMethod",
                        value: "attributes:clothes.washing-method",
                        type: "select",
                        multiple: false,
                        required: false,
                        option: "CLOTHES_WASHING_METHOD_LIST"
                    },
                    {
                        name: "Pocket",
                        stateName: "pocket",
                        value: "attributes:clothes.pocket",
                        type: "select",
                        multiple: false,
                        required: true,
                        option: "CLOTHES_POCKET_LIST"
                    },
                    {
                        name: "Size",
                        stateName: "size",
                        value: "attributes:size",
                        type: "select",
                        multiple: true,
                        required: true,
                        option: "CLOTHES_SIZE_LIST"
                    },
                    {
                        name: "Neck Type",
                        stateName: "neckType",
                        value: "attributes:clothes.neck-type",
                        type: "select",
                        multiple: false,
                        required: false,
                        option: "SHIRT_NECK_TYPE_LIST"
                    },
                    {
                        name: "Shape",
                        stateName: "shape",
                        value: "attributes:clothes.shirt-shape",
                        type: "select",
                        multiple: false,
                        required: false,
                        option: "SHIRT_SHAPE_LIST"
                    },
                    {
                        name: "Sleeves Type",
                        stateName: "sleevesType",
                        value: "attributes:clothes.sleeves-type",
                        type: "select",
                        multiple: false,
                        required: false,
                        option: "SLEEVES_TYPE_LIST"
                    },
                    {
                        name: "Texture",
                        stateName: "texture",
                        value: "attributes:clothes.texture",
                        type: "select",
                        multiple: false,
                        required: false,
                        option: "MEN_CLOTHES_TEXTURE_LIST"
                    }
                ]
            },
            {
                name: "Shirts",
                value: "products:clothes.shirts",
                available: true,
                children: [
                    { 
                        name: "Plain Shirts", 
                        value: "products:clothes.shirts-plain", 
                        available: true, 
                        children: [] 
                    },
                    {
                        name: "Patterned Shirts",
                        value: "products:clothes.shirts-patterned",
                        available: true,
                        children: []
                    },
                    { 
                        name: "Checkered Shirts",
                        value: "products:clothes.shirts-checkered",
                        available: true,
                        children: []
                    },
                ],
                attributes: [
                    {
                        name: "Color",
                        stateName: "color",
                        value: "attributes:color",
                        type: "select",
                        multiple: true,
                        required: true,
                        option: "MEN_SHIRT_COLOR_LIST"
                    },
                    {
                        name: "Washing Method",
                        stateName: "washingMethod",
                        value: "attributes:clothes.washing-method",
                        type: "select",
                        multiple: false,
                        required: false,
                        option: "CLOTHES_WASHING_METHOD_LIST"
                    },
                    {
                        name: "Pocket",
                        stateName: "pocket",
                        value: "attributes:clothes.pocket",
                        type: "select",
                        multiple: false,
                        required: true,
                        option: "CLOTHES_POCKET_LIST"
                    },
                    {
                        name: "Size",
                        stateName: "size",
                        value: "attributes:size",
                        type: "select",
                        multiple: true,
                        required: true,
                        option: "CLOTHES_SIZE_LIST"
                    },
                    {
                        name: "Collor Type",
                        stateName: "collarType",
                        value: "attributes:clothes.collor-type",
                        type: "select",
                        multiple: false,
                        required: false,
                        option: "SHIRT_COLLAR_TYPE_LIST"
                    },
                    {
                        name: "Neck Type",
                        stateName: "neckType",
                        value: "attributes:clothes.neck-type",
                        type: "select",
                        multiple: false,
                        required: false,
                        option: "SHIRT_NECK_TYPE_LIST"
                    },
                    {
                        name: "Shape",
                        stateName: "shape",
                        value: "attributes:clothes.shirt-shape",
                        type: "select",
                        multiple: false,
                        required: false,
                        option: "SHIRT_SHAPE_LIST"
                    },
                    {
                        name: "Sleeves Type",
                        stateName: "sleevesType",
                        value: "attributes:clothes.sleeves-type",
                        type: "select",
                        multiple: false,
                        required: false,
                        option: "SLEEVES_TYPE_LIST"
                    },
                    {
                        name: "Texture",
                        stateName: "texture",
                        value: "attributes:clothes.texture",
                        type: "select",
                        multiple: false,
                        required: false,
                        option: "MEN_CLOTHES_TEXTURE_LIST"
                    }
                ]
            },
            {
                name: "Polo Shirts",
                value: "products:clothes.polo-shirts",
                available: true,
                children: [
                    { 
                        name: "Plain Polo", 
                        value: "products:clothes.polo-plain", 
                        available: true, 
                        children: [] 
                    },
                    {
                        name: "Patterned Polo",
                        value: "products:clothes.polo-patterned",
                        available: true,
                        children: []
                    },
                    { 
                        name: "Striped Polo",
                        value: "products:clothes.polo-striped",
                        available: true,
                        children: []
                    }
                ],
                attributes: [
                    {
                        name: "Color",
                        stateName: "color",
                        value: "attributes:color",
                        type: "select",
                        multiple: true,
                        required: true,
                        option: "MEN_SHIRT_COLOR_LIST"
                    },
                    {
                        name: "Washing Method",
                        stateName: "washingMethod",
                        value: "attributes:clothes.washing-method",
                        type: "select",
                        multiple: false,
                        required: false,
                        option: "CLOTHES_WASHING_METHOD_LIST"
                    },
                    {
                        name: "Pocket",
                        stateName: "pocket",
                        value: "attributes:clothes.pocket",
                        type: "select",
                        multiple: false,
                        required: true,
                        option: "CLOTHES_POCKET_LIST"
                    },
                    {
                        name: "Size",
                        stateName: "size",
                        value: "attributes:size",
                        type: "select",
                        multiple: true,
                        required: true,
                        option: "CLOTHES_SIZE_LIST"
                    },
                    {
                        name: "Neck Type",
                        stateName: "neckType",
                        value: "attributes:clothes.neck-type",
                        type: "select",
                        multiple: false,
                        required: false,
                        option: "SHIRT_NECK_TYPE_LIST"
                    },
                    {
                        name: "Shape",
                        stateName: "shape",
                        value: "attributes:clothes.shirt-shape",
                        type: "select",
                        multiple: false,
                        required: false,
                        option: "SHIRT_SHAPE_LIST"
                    },
                    {
                        name: "Sleeves Type",
                        stateName: "sleevesType",
                        value: "attributes:clothes.sleeves-type",
                        type: "select",
                        multiple: false,
                        required: false,
                        option: "SLEEVES_TYPE_LIST"
                    },
                    {
                        name: "Texture",
                        stateName: "texture",
                        value: "attributes:clothes.texture",
                        type: "select",
                        multiple: false,
                        required: false,
                        option: "MEN_CLOTHES_TEXTURE_LIST"
                    }
                ]
            },
            {
                name: "Outerwear",
                value: "products:clothes.men-outerwear",
                available: true,
                children: [
                    { 
                        name: "Sweaters and Cardigans", 
                        value: "products:clothes.sweaters-and-cardigans", 
                        available: true, 
                        children: [] 
                    },
                    {
                        name: "Jackets and Coats",
                        value: "products:clothes.jackets-and-coats",
                        available: true,
                        children: []
                    },
                    { 
                        name: "Hoodies",
                        value: "products:clothes.hoodies",
                        available: true,
                        children: []
                    },
					{ 
                        name: "Suits",
                        value: "products:clothes.suits",
                        available: true,
                        children: []
                    },
					{ 
                        name: "Denim",
                        value: "products:clothes.denim",
                        available: true,
                        children: []
                    }
                ],
                attributes: [
                    {
                        name: "Color",
                        stateName: "color",
                        value: "attributes:color",
                        type: "select",
                        multiple: true,
                        required: true,
                        option: "MEN_SHIRT_COLOR_LIST"
                    },
                    {
                        name: "Washing Method",
                        stateName: "washingMethod",
                        value: "attributes:clothes.washing-method",
                        type: "select",
                        multiple: false,
                        required: false,
                        option: "CLOTHES_WASHING_METHOD_LIST"
                    },
                    {
                        name: "Size",
                        stateName: "size",
                        value: "attributes:size",
                        type: "select",
                        multiple: true,
                        required: true,
                        option: "CLOTHES_SIZE_LIST"
                    },
                    {
                        name: "Shape",
                        stateName: "shape",
                        value: "attributes:clothes.shirt-shape",
                        type: "select",
                        multiple: false,
                        required: false,
                        option: "SHIRT_SHAPE_LIST"
                    },
                    {
                        name: "Texture",
                        stateName: "texture",
                        value: "attributes:clothes.texture",
                        type: "select",
                        multiple: false,
                        required: false,
                        option: "MEN_CLOTHES_TEXTURE_LIST"
                    }
                ]
            },
            {
                name: "Shorts",
                value: "products:clothes.shorts",
                available: true,
                children: [
                    { 
                        name: "Elastic Waist Shorts", 
                        value: "products:clothes.elastic-waist-shorts", 
                        available: true, 
                        children: [] 
                    },
                    {
                        name: "Chino Shorts",
                        value: "products:clothes.chino-shorts",
                        available: true,
                        children: []
                    },
                    { 
                        name: "Cargo Shorts",
                        value: "products:clothes.cargo-shorts",
                        available: true,
                        children: []
                    }
                ],
                attributes: [
                    {
                        name: "Color",
                        stateName: "color",
                        value: "attributes:color",
                        type: "select",
                        multiple: true,
                        required: true,
                        option: "COLOR_LIST"
                    },
                    {
                        name: "Washing Method",
                        stateName: "washingMethod",
                        value: "attributes:clothes.washing-method",
                        type: "select",
                        multiple: false,
                        required: false,
                        option: "CLOTHES_WASHING_METHOD_LIST"
                    },
                    {
                        name: "Shape",
                        stateName: "shape",
                        value: "attributes:clothes.pants-shape",
                        type: "select",
                        multiple: false,
                        required: false,
                        option: "PANTS_SHAPE_LIST"
                    },
                    {
                        name: "Waist Height",
                        stateName: "size",
                        value: "attributes:clothes.waist-height",
                        type: "select",
                        multiple: false,
                        required: false,
                        option: "WAIST_HEIGHT_LIST"
                    },
                    {
                        name: "Size",
                        stateName: "size",
                        value: "attributes:size",
                        type: "select",
                        multiple: true,
                        required: true,
                        option: "CLOTHES_SIZE_LIST"
                    },
                    {
                        name: "Texture",
                        stateName: "texture",
                        value: "attributes:clothes.texture",
                        type: "select",
                        multiple: false,
                        required: false,
                        option: "MEN_CLOTHES_TEXTURE_LIST"
                    }
                ]
            },
            {
                name: "Long Pants",
                value: "products:clothes.long-pants",
                available: true,
                children: [
                    { 
                        name: "Straight Leg Pants", 
                        value: "products:clothes.straight-leg-pants", 
                        available: true, 
                        children: [] 
                    },
                    {
                        name: "Tapered Pants",
                        value: "products:clothes.tapered-pants",
                        available: true,
                        children: []
                    },
                    { 
                        name: "Jogger Pants",
                        value: "products:clothes.jogger-pants",
                        available: true,
                        children: []
                    }
                ],
                attributes: [
                    {
                        name: "Color",
                        stateName: "color",
                        value: "attributes:color",
                        type: "select",
                        multiple: true,
                        required: true,
                        option: "COLOR_LIST"
                    },
                    {
                        name: "Washing Method",
                        stateName: "washingMethod",
                        value: "attributes:clothes.washing-method",
                        type: "select",
                        multiple: false,
                        required: false,
                        option: "CLOTHES_WASHING_METHOD_LIST"
                    },
					{
						name: "Leg Length Type",
						stateName: "legLengthType",
						value: "attributes:clothes.leg-length-type",
                        type: "select",
                        multiple: false,
                        required: false,
                        option: "LEG_LENGTH_TYPE_LIST"
					},
					{
                        name: "Waist Height",
                        stateName: "size",
                        value: "attributes:clothes.waist-height",
                        type: "select",
                        multiple: false,
                        required: false,
                        option: "WAIST_HEIGHT_LIST"
                    },
					{
                        name: "Size",
                        stateName: "size",
                        value: "attributes:size",
                        type: "select",
                        multiple: true,
                        required: true,
                        option: "CLOTHES_SIZE_LIST"
                    },
					{
                        name: "Pant Style",
                        stateName: "pantStyle",
                        value: "attributes:clothes.pant-style",
                        type: "select",
                        multiple: false,
                        required: false,
                        option: "PANT_STYLE_LIST"
                    },
                    {
                        name: "Shape",
                        stateName: "shape",
                        value: "attributes:clothes.pants-shape",
                        type: "select",
                        multiple: false,
                        required: false,
                        option: "PANTS_SHAPE_LIST"
                    },
                    {
                        name: "Texture",
                        stateName: "texture",
                        value: "attributes:clothes.texture",
                        type: "select",
                        multiple: false,
                        required: false,
                        option: "MEN_CLOTHES_TEXTURE_LIST"
                    }
                ]
            },
            {
                name: "Jeans",
                value: "products:clothes.jeans",
                available: true,
                children: [
                    { 
                        name: "Tapered Jeans", 
                        value: "products:clothes.tapered-jeans", 
                        available: true, 
                        children: [] 
                    },
                    {
                        name: "Straight Leg Jeans",
                        value: "products:clothes.straight-leg-jeans",
                        available: true,
                        children: []
                    },
                    { 
                        name: "Short Jeans",
                        value: "products:clothes.short-jeans",
                        available: true,
                        children: []
                    }
                ],
                attributes: [
                    {
                        name: "Color",
                        stateName: "color",
                        value: "attributes:color",
                        type: "select",
                        multiple: true,
                        required: true,
                        option: "COLOR_LIST"
                    },
                    {
                        name: "Washing Method",
                        stateName: "washingMethod",
                        value: "attributes:clothes.washing-method",
                        type: "select",
                        multiple: false,
                        required: false,
                        option: "CLOTHES_WASHING_METHOD_LIST"
                    },
					{
						name: "Leg Length Type",
						stateName: "legLengthType",
						value: "attributes:clothes.leg-length-type",
                        type: "select",
                        multiple: false,
                        required: false,
                        option: "LEG_LENGTH_TYPE_LIST"
					},
					{
                        name: "Waist Height",
                        stateName: "size",
                        value: "attributes:clothes.waist-height",
                        type: "select",
                        multiple: false,
                        required: false,
                        option: "WAIST_HEIGHT_LIST"
                    },
					{
                        name: "Size",
                        stateName: "size",
                        value: "attributes:size",
                        type: "select",
                        multiple: true,
                        required: true,
                        option: "CLOTHES_SIZE_LIST"
                    },
                    {
                        name: "Shape",
                        stateName: "shape",
                        value: "attributes:clothes.pants-shape",
                        type: "select",
                        multiple: false,
                        required: false,
                        option: "PANTS_SHAPE_LIST"
                    },
                    {
                        name: "Texture",
                        stateName: "texture",
                        value: "attributes:clothes.texture",
                        type: "select",
                        multiple: false,
                        required: false,
                        option: "MEN_CLOTHES_TEXTURE_LIST"
                    }
                ]
            },
            {
                name: "Men's Underwear",
                value: "products:clothes.men-underwear",
                available: true,
                children: [
                    { 
                        name: "Undershirts", 
                        value: "products:clothes.undershirts", 
                        available: true, 
                        children: [] 
                    },
                    {
                        name: "Underwear",
                        value: "products:clothes.underwear",
                        available: true,
                        children: []
                    },
                    { 
                        name: "Boxers",
                        value: "products:clothes.boxers",
                        available: true,
                        children: []
                    }
                ],
                attributes: [
                    {
                        name: "Color",
                        stateName: "color",
                        value: "attributes:color",
                        type: "select",
                        multiple: true,
                        required: true,
                        option: "COLOR_LIST"
                    },
                    {
                        name: "Washing Method",
                        stateName: "washingMethod",
                        value: "attributes:clothes.washing-method",
                        type: "select",
                        multiple: false,
                        required: false,
                        option: "CLOTHES_WASHING_METHOD_LIST"
                    },
					{
                        name: "Size",
                        stateName: "size",
                        value: "attributes:size",
                        type: "select",
                        multiple: true,
                        required: true,
                        option: "CLOTHES_SIZE_LIST"
                    },
                    {
                        name: "Texture",
                        stateName: "texture",
                        value: "attributes:clothes.texture",
                        type: "select",
                        multiple: false,
                        required: false,
                        option: "MEN_CLOTHES_TEXTURE_LIST"
                    }
                ]
            },
            {
                name: "Long Johns",
                value: "products:clothes.long-johns",
                available: true,
                children: [],
                attributes: [
                    {
                        name: "Texture",
                        stateName: "texture",
                        value: "attributes:clothes.texture",
                        type: "select",
                        multiple: false,
                        required: false,
                        option: "MEN_CLOTHES_TEXTURE_LIST"
                    },
					{
                        name: "Warmth",
                        stateName: "warmth",
                        value: "attributes:clothes.warmth",
                        type: "select",
                        multiple: false,
                        required: false,
                        option: "WARMTH_LIST"
                    }
                ]
            },
            {
                name: "Gloves",
                value: "products:clothes.gloves",
                available: true,
                children: [],
                attributes: [
                    {
                        name: "Texture",
                        stateName: "texture",
                        value: "attributes:clothes.texture",
                        type: "select",
                        multiple: false,
                        required: false,
                        option: "MEN_CLOTHES_TEXTURE_LIST"
                    }
                ]
            },
        ]
    },
    {
        name: "Women's Clothes",
        value: "products:clothes.women", 
        children: [
            {
                name: "Tops",
                value: "products:clothes.tops",
                available: true,
                children: [
                    { 
                        name: "Bodysuits", 
                        value: "products:clothes.bodysuits", 
                        available: true, 
                        children: [] 
                    },
                    {
                        name: "T-Shirts",
                        value: "products:clothes.t-shirt",
                        available: true,
                        children: []
                    },
                    { 
                        name: "Off-Shoulder Tops",
                        value: "products:clothes.off-shoulder-tops",
                        available: true,
                        children: []
                    },
                    {
                        name: "Crop Tops",
                        value: "products:clothes.crop-tops",
                        available: true,
                        children: []
                    },
                    {
                        name: "Oversized",
                        value: "products:clothes.oversized",
                        available: true,
                        children: []
                    },
                    {
                        name: "Tube Tops",
                        value: "products:clothes.tube-tops",
                        available: true,
                        children: []
                    },
                    {
                        name: "Tank Tops",
                        value: "products:clothes.tank-tops",
                        available: true,
                        children: []
                    },
                    {
                        name: "Shirts",
                        value: "products:clothes.shirts",
                        available: true,
                        children: []
                    },
                    {
                        name: "Polo Shirts",
                        value: "products:clothes.polo-shirts",
                        available: true,
                        children: []
                    }
                ],
                attributes: [
					{
                        name: "Texture",
                        stateName: "texture",
                        value: "attributes:clothes.texture",
                        type: "select",
                        multiple: false,
                        required: false,
                        option: "WOMEN_CLOTHES_TEXTURE_LIST"
                    },
                    {
                        name: "Color",
                        stateName: "color",
                        value: "attributes:color",
                        type: "select",
                        multiple: true,
                        required: true,
                        option: "COLOR_LIST"
                    },
                    {
                        name: "Pattern",
                        stateName: "pattern",
                        value: "attributes:clothes.pattern",
                        type: "select",
                        multiple: false,
                        required: false,
                        option: "CLOTHES_PATTERN_LIST"
                    },
                    {
                        name: "Sleeve Type",
                        stateName: "sleevesType",
                        value: "attributes:clothes.sleeve-type",
                        type: "select",
                        multiple: false,
                        required: false,
                        option: "SLEEVE_TYPE_LIST"
                    },
                    {
                        name: "Occasion",
                        stateName: "occasion",
                        value: "attributes:clothes.occasion",
                        type: "select",
                        multiple: false,
                        required: false,
                        option: "OCCASION_LIST"
                    }
                ]
            },
            {
                name: "Dresses",
                value: "products:clothes.dresses",
                available: true,
                children: [
                    { 
                        name: "Mini Dresses", 
                        value: "products:clothes.mini-dresses", 
                        available: true, 
                        children: [] 
                    },
                    {
                        name: "Maxi Dresses",
                        value: "products:clothes.maxi-dresses",
                        available: true,
                        children: []
                    },
                    { 
                        name: "Mid-length Dresses",
                        value: "products:clothes.mid-length-dresses",
                        available: true,
                        children: []
                    }
                ],
                attributes: [
					{
                        name: "Texture",
                        stateName: "texture",
                        value: "attributes:clothes.texture",
                        type: "select",
                        multiple: false,
                        required: false,
                        option: "WOMEN_CLOTHES_TEXTURE_LIST"
                    },
                    {
                        name: "Color",
                        stateName: "color",
                        value: "attributes:color",
                        type: "select",
                        multiple: true,
                        required: true,
                        option: "COLOR_LIST"
                    },
                    {
                        name: "Pattern",
                        stateName: "pattern",
                        value: "attributes:clothes.pattern",
                        type: "select",
                        multiple: false,
                        required: false,
                        option: "CLOTHES_PATTERN_LIST"
                    },
                    {
                        name: "Dress Type",
                        stateName: "dressType",
                        value: "attributes:clothes.dress-type",
                        type: "select",
                        multiple: false,
                        required: false,
                        option: "DRESS_TYPE_LIST"
                    },
                    {
                        name: "Sleeve Type",
                        stateName: "sleevesType",
                        value: "attributes:clothes.sleeve-type",
                        type: "select",
                        multiple: false,
                        required: false,
                        option: "SLEEVE_TYPE_LIST"
                    },
                    {
                        name: "Occasion",
                        stateName: "occasion",
                        value: "attributes:clothes.occasion",
                        type: "select",
                        multiple: false,
                        required: false,
                        option: "OCCASION_LIST"
                    }
                ]
            },
            {
                name: "Skirts",
                value: "products:clothes.skirts",
                available: true,
                children: [
                    { 
                        name: "Mini Skirts", 
                        value: "products:clothes.mini-skirts", 
                        available: true, 
                        children: [] 
                    },
                    {
                        name: "Long Skirts",
                        value: "products:clothes.long-skirts",
                        available: true,
                        children: []
                    },
                    { 
                        name: "Jean Skirts",
                        value: "products:clothes.jean-skirts",
                        available: true,
                        children: []
                    },
                    {
                        name: "Skirt Pants",
                        value: "products:clothes.skirt-pants",
                        available: true,
                        children: []
                    },
                    { 
                        name: "Mid-length Skirts",
                        value: "products:clothes.mid-length-skirts",
                        available: true,
                        children: []
                    }
                ],
                attributes: [
					{
                        name: "Texture",
                        stateName: "texture",
                        value: "attributes:clothes.texture",
                        type: "select",
                        multiple: false,
                        required: false,
                        option: "WOMEN_CLOTHES_TEXTURE_LIST"
                    },
                    {
                        name: "Color",
                        stateName: "color",
                        value: "attributes:color",
                        type: "select",
                        multiple: true,
                        required: true,
                        option: "COLOR_LIST"
                    },
                    {
                        name: "Pattern",
                        stateName: "pattern",
                        value: "attributes:clothes.pattern",
                        type: "select",
                        multiple: false,
                        required: false,
                        option: "CLOTHES_PATTERN_LIST"
                    },
                    {
                        name: "Skirt Type",
                        stateName: "skirtType",
                        value: "attributes:clothes.skirt-type",
                        type: "select",
                        multiple: false,
                        required: false,
                        option: "SKIRT_TYPE_LIST"
                    },
                    {
                        name: "Waist Height",
                        stateName: "waistHeight",
                        value: "attributes:clothes.waist-height",
                        type: "select",
                        multiple: false,
                        required: false,
                        option: "WAIST_HEIGHT_LIST"
                    },
                    {
                        name: "Occasion",
                        stateName: "occasion",
                        value: "attributes:clothes.occasion",
                        type: "select",
                        multiple: false,
                        required: false,
                        option: "OCCASION_LIST"
                    }
                ]
            },
            {
                name: "Pants and Leggings",
                value: "products:clothes.pants-and-leggings",
                available: true,
                children: [
                    { 
                        name: "Shorts", 
                        value: "products:clothes.shorts", 
                        available: true, 
                        children: [] 
                    },
                    {
                        name: "Long Pants",
                        value: "products:clothes.long-pants",
                        available: true,
                        children: []
                    },
                    { 
                        name: "Leggings",
                        value: "products:clothes.leggings",
                        available: true,
                        children: []
                    },
                    {
                        name: "Jeans",
                        value: "products:clothes.jeans",
                        available: true,
                        children: []
                    }
                ],
                attributes: [
					{
                        name: "Texture",
                        stateName: "texture",
                        value: "attributes:clothes.texture",
                        type: "select",
                        multiple: false,
                        required: false,
                        option: "WOMEN_CLOTHES_TEXTURE_LIST"
                    },
                    {
                        name: "Color",
                        stateName: "color",
                        value: "attributes:color",
                        type: "select",
                        multiple: true,
                        required: true,
                        option: "COLOR_LIST"
                    },
                    {
                        name: "Pattern",
                        stateName: "pattern",
                        value: "attributes:clothes.pattern",
                        type: "select",
                        multiple: false,
                        required: false,
                        option: "CLOTHES_PATTERN_LIST"
                    },
                    {
                        name: "Waist Height",
                        stateName: "waistHeight",
                        value: "attributes:clothes.waist-height",
                        type: "select",
                        multiple: false,
                        required: false,
                        option: "WAIST_HEIGHT_LIST"
                    },
                    {
                        name: "Occasion",
                        stateName: "occasion",
                        value: "attributes:clothes.occasion",
                        type: "select",
                        multiple: false,
                        required: false,
                        option: "OCCASION_LIST"
                    }
                ]
            },
            {
                name: "Outerwear",
                value: "products:clothes.women-outerwear",
                available: true,
                children: [
                    { 
                        name: "Cardigans", 
                        value: "products:clothes.cardigans", 
                        available: true, 
                        children: [] 
                    },
                    {
                        name: "Sweaters",
                        value: "products:clothes.sweaters",
                        available: true,
                        children: []
                    },
                    { 
                        name: "Jackets",
                        value: "products:clothes.jackets",
                        available: true,
                        children: []
                    },
                    {
                        name: "Vests",
                        value: "products:clothes.vests",
                        available: true,
                        children: []
                    },
					{ 
                        name: "Coats", 
                        value: "products:clothes.coats", 
                        available: true, 
                        children: [] 
                    },
                    {
                        name: "Hoodies",
                        value: "products:clothes.hoodies",
                        available: true,
                        children: []
                    },
                    { 
                        name: "Suits",
                        value: "products:clothes.suits",
                        available: true,
                        children: []
                    },
                    {
                        name: "Kimono",
                        value: "products:clothes.kimono",
                        available: true,
                        children: []
                    },
                    {
                        name: "Raincoat",
                        value: "products:clothes.raincoat",
                        available: true,
                        children: []
                    }
                ],
                attributes: [
					{
                        name: "Texture",
                        stateName: "texture",
                        value: "attributes:clothes.texture",
                        type: "select",
                        multiple: false,
                        required: false,
                        option: "WOMEN_CLOTHES_TEXTURE_LIST"
                    },
                    {
                        name: "Color",
                        stateName: "color",
                        value: "attributes:color",
                        type: "select",
                        multiple: true,
                        required: true,
                        option: "COLOR_LIST"
                    },
                    {
                        name: "Pattern",
                        stateName: "pattern",
                        value: "attributes:clothes.pattern",
                        type: "select",
                        multiple: false,
                        required: false,
                        option: "CLOTHES_PATTERN_LIST"
                    },
                    {
                        name: "Occasion",
                        stateName: "occasion",
                        value: "attributes:clothes.occasion",
                        type: "select",
                        multiple: false,
                        required: false,
                        option: "OCCASION_LIST"
                    }
                ]
            },
            {
                name: "Jumpsuits / Playsuits",
                value: "products:clothes.jumpsuits-playsuits",
                available: true,
                children: [
                    { 
                        name: "Playsuits", 
                        value: "products:clothes.playsuits", 
                        available: true, 
                        children: [] 
                    },
                    {
                        name: "Jumpsuits",
                        value: "products:clothes.jumpsuits",
                        available: true,
                        children: []
                    },
                    { 
                        name: "Bib Dresses",
                        value: "products:clothes.bib-dresses",
                        available: true,
                        children: []
                    }
                ],
                attributes: [
					{
                        name: "Texture",
                        stateName: "texture",
                        value: "attributes:clothes.texture",
                        type: "select",
                        multiple: false,
                        required: false,
                        option: "WOMEN_CLOTHES_TEXTURE_LIST"
                    },
                    {
                        name: "Color",
                        stateName: "color",
                        value: "attributes:color",
                        type: "select",
                        multiple: true,
                        required: true,
                        option: "COLOR_LIST"
                    },
                    {
                        name: "Pattern",
                        stateName: "pattern",
                        value: "attributes:clothes.pattern",
                        type: "select",
                        multiple: false,
                        required: false,
                        option: "CLOTHES_PATTERN_LIST"
                    },
                    {
                        name: "Sleeve Type",
                        stateName: "sleevesType",
                        value: "attributes:clothes.sleeve-type",
                        type: "select",
                        multiple: false,
                        required: false,
                        option: "SLEEVE_LENGTH_LIST"
                    },
					{
                        name: "Occasion",
                        stateName: "occasion",
                        value: "attributes:clothes.occasion",
                        type: "select",
                        multiple: false,
                        required: false,
                        option: "OCCASION_LIST"
                    }
                ]
            },
            {
                name: "Lingeries",
                value: "products:clothes.lingeries",
                available: true,
                children: [
                    { 
                        name: "Bras", 
                        value: "products:clothes.bras", 
                        available: true, 
                        children: [] 
                    },
                    {
                        name: "Panties",
                        value: "products:clothes.panties",
                        available: true,
                        children: []
                    },
                    { 
                        name: "Shapewear",
                        value: "products:clothes.shapewear",
                        available: true,
                        children: []
                    },
                    { 
                        name: "Sets",
                        value: "products:clothes.set-lingeries",
                        available: true,
                        children: []
                    }
                ],
                attributes: [
					{
                        name: "Texture",
                        stateName: "texture",
                        value: "attributes:clothes.texture",
                        type: "select",
                        multiple: false,
                        required: false,
                        option: "WOMEN_CLOTHES_TEXTURE_LIST"
                    },
                    {
                        name: "Color",
                        stateName: "color",
                        value: "attributes:color",
                        type: "select",
                        multiple: true,
                        required: true,
                        option: "COLOR_LIST"
                    },
                    {
                        name: "Pattern",
                        stateName: "pattern",
                        value: "attributes:clothes.pattern",
                        type: "select",
                        multiple: false,
                        required: false,
                        option: "CLOTHES_PATTERN_LIST"
                    }
                ]
            },
            {
                name: "Sleepwear",
                value: "products:clothes.sleepwear",
                available: true,
                children: [
                    { 
                        name: "Pyjamas Shirt", 
                        value: "products:clothes.pyjamas-shirt", 
                        available: true, 
                        children: [] 
                    },
                    {
                        name: "Pants",
                        value: "products:clothes.pants",
                        available: true,
                        children: []
                    },
                    { 
                        name: "Dresses",
                        value: "products:clothes.dresses",
                        available: true,
                        children: []
                    },
                    { 
                        name: "Sexy Sleepwears",
                        value: "products:clothes.sexy-sleepwears",
                        available: true,
                        children: []
                    }
                ],
                attributes: [
					{
                        name: "Texture",
                        stateName: "texture",
                        value: "attributes:clothes.texture",
                        type: "select",
                        multiple: false,
                        required: false,
                        option: "WOMEN_CLOTHES_TEXTURE_LIST"
                    },
                    {
                        name: "Color",
                        stateName: "color",
                        value: "attributes:color",
                        type: "select",
                        multiple: true,
                        required: true,
                        option: "COLOR_LIST"
                    },
                    {
                        name: "Pattern",
                        stateName: "pattern",
                        value: "attributes:clothes.pattern",
                        type: "select",
                        multiple: false,
                        required: false,
                        option: "CLOTHES_PATTERN_LIST"
                    }
                ]
            }
        ] 
    },

];