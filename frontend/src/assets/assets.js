import logo from '../assets/logo.png'
import header from '../assets/header.png'
import header2 from '../assets/header2.png'
import header3 from '../assets/header3.png'
import header4 from '../assets/header4.png'
import header5 from '../assets/header5.png'
import quality from '../assets/quality.png'
import delivery from '../assets/delivery.png'
import pay from '../assets/pay.png'
import checkout from '../assets/checkout.png'
import reliable from '../assets/reliable.png'
import checkmark from '../assets/checkmark.png'
import close from '../assets/close.png'
import trash from '../assets/trash.png'
import menu from '../assets/menu.png'
import support from '../assets/support.png'
import peopleimg from '../assets/people.jpeg'
import pizza1 from '../assets/pizza1.png'
import food from '../assets/foodpng.png'
import burger from '../assets/burger.png'
import processing from '../assets/processing.png'
import home from '../assets/house.png'
import office from '../assets/office.png'
import other from '../assets/other.png'
import cashondelivery from '../assets/cash-on-delivery.png'
import fooddelivery from '../assets/food-delivery.png'
import paymentmethod from '../assets/payment-method.png'
import tracking from '../assets/tracking.png'
import orderhistory from '../assets/order-history.png'
import pending from "../assets/pending.png";
import invoice from '../assets/invoice.png'
import kachori from '../assets/kachori.png'
import resto from '../assets/resto.png'
import resto1 from '../assets/resto1.png'
import resto2 from '../assets/resto2.png'
import food1 from '../assets/food1.png'
import food2 from '../assets/food2.png'
import food3 from '../assets/food3.png'
import food4 from '../assets/food4.png'
import food5 from '../assets/food5.png'
import food6 from '../assets/food6.png'
import food7 from '../assets/food7.png'
import food8 from '../assets/food8.png'
import food9 from '../assets/food9.png'
import google from '../assets/google.webp'
import payment from '../assets/payment.webp'
import plainPaper from '../assets/A4.webp'

export const qualities = [
  {
    id: 1,
    img: quality,
    title: "Quality Food",
    desc: "Enjoy fresh, delicious meals made with the finest ingredients, crafted to satisfy your taste buds every time."
  },
  {
    id: 2,
    img: delivery,
    title: "Fast Delivery",
    desc: "Get your food delivered hot and fresh to your door in record time, because we know you’re hungry!"
  },
  {
    id: 3,
    img: pay,
    title: "Online Payment",
    desc: "Pay securely and conveniently with just a few clicks, making your ordering experience smooth and hassle-free."
  },
  {
    id: 4, // Fixed duplicate ID (changed from 1 to 4)
    img: checkout,
    title: "Check Out",
    desc: "Complete your order effortlessly with our streamlined checkout process, designed for speed and simplicity."
  }
];

export const people = [
  {
    id: 1,
    img: reliable,
    title: "Convenient And Reliable",
    desc: "Order with ease and trust us to deliver your meal right on time, every time."
  },
  {
    id: 2,
    img: menu,
    title: "Variety of Options",
    desc: "Explore a wide range of dishes to suit every craving, from comfort food to gourmet delights."
  },
  {
    id: 3,
    img: support,
    title: "Excellent Customer Support",
    desc: "Our friendly team is here to assist you 24/7, ensuring a seamless and satisfying experience."
  }
];

export const bestSeller = [
  {
    id:1,
    img:pizza1,
    name:"Veg Spice Fusion Pizza",
    sellerName : "Lapinoz",
    oldPrice:"256",
    newPrice:"129",
    rating:"4.1",
    ratingCount:"22",
    desc:"[Extra Spicy] Green, red sauce, jalapenos, black olive, sweet corn, red paprika, capsicum and green chilli.",
    bestSeller:true,
    category:"pizza"
  },
  {
    id:2,
    img:burger,
    name:"Veg McCheese Burger",
    sellerName : "Mc Donald",
    oldPrice:"279",
    newPrice:"262",
    rating:"4.5",
    ratingCount:"16",
    desc:"Find pure indulgence in our Veg McCheese Burger, featuring a sinfully oozing cheesy veg patty, roasted chipotle sauce, jalapenos & lettuce.",
    bestSeller:true,
    category:"burger"
  },
  {
    id:3,
    img:kachori,
    name:"Special Raj Kachori",
    sellerName : "Raj Kachori",
    oldPrice:"179",
    newPrice:"149",
    rating:"4.4",
    ratingCount:"175",
    desc:"Serves 1 | Crisp Kachori, filled with potatoes, moong dal, yogurt, dahi vada spices and chutneys. A Royal Treat|serves1|",
    bestSeller:true,
    category:"kachori"
  },
  {
    id:4,
    img:pizza1,
    name:"Veg Spice Fusion Pizza",
    sellerName : "Lapinoz",
    oldPrice:"256",
    newPrice:"129",
    rating:"4.1",
    ratingCount:"22",
    desc:"[Extra Spicy] Green, red sauce, jalapenos, black olive, sweet corn, red paprika, capsicum and green chilli.",
    bestSeller:true,
    category:"chole bhature"
  },

] 

export const topRestuarants = [
  {
    id:1,
    img:resto,
    name:"McDonald's",
    rating:"4.1",
    deliveryTime:"15-20 mins",
    desc:"[Extra Spicy] Green, red sauce, jalapenos, black olive, sweet corn, red paprika, capsicum and green chilli."
  },
  {
    id:2,
    img:resto1,
    name:"Lapino'z pizza",
    rating:"4.4",
    deliveryTime:"15-20 mins",
    desc:"[Extra Spicy] Green, red sauce, jalapenos, black olive, sweet corn, red paprika, capsicum and green chilli."
  },
  {
    id:2,
    img:resto1,
    name:"Lapino'z pizza",
    rating:"4.4",
    deliveryTime:"15-20 mins",
    desc:"[Extra Spicy] Green, red sauce, jalapenos, black olive, sweet corn, red paprika, capsicum and green chilli."
  },
  {
    id:2,
    img:resto1,
    name:"Lapino'z pizza",
    rating:"4.4",
    deliveryTime:"15-20 mins",
    desc:"[Extra Spicy] Green, red sauce, jalapenos, black olive, sweet corn, red paprika, capsicum and green chilli."
  },
  {
    id:3,
    img:resto2,
    name:"Radhe Dhokla",
    rating:"4.6",
    deliveryTime:"25-30 mins",
    desc:"[Extra Spicy] Green, red sauce, jalapenos, black olive, sweet corn, red paprika, capsicum and green chilli.",
  },
]

export const filterFood = [
  {
    id:1,
    img:food1,
    category:"pizza"
  },
  {
    id:2,
    img:food2,
    category:"burger"
  },
  {
    id:3,
    img:food3,
    category:"dosa"
  },
  {
    id:4,
    img:food4,
    category:"chole bhature"
  },
  {
    id:5,
    img:food5,
    category:"cake"
  },
  {
    id:6,
    img:food6,
    category:"pav bhaji"
  },
  {
    id:7,
    img:food7,
    category:"tea"
  },
  {
    id:8,
    img:food8,
    category:"coffee"
  },
  {
    id:9,
    img:food9,
    category:"rolls"
  },
]

export const address = [
  {
    id:1,
    firstName: "prince",
    lastName: "savaliya",
    flatno:"47",
    societyName: "VrundavanDham Society",
    city: "Surat",
    state: "Gujarat",
    zipcode: "394150",
    country:"India",
    phone: "7778031972",
    category: "Home",
  },
  {
    id:2,
    firstName: "dhruvik",
    lastName: "savaliya",
    flatno:"47",
    societyName: "VrundavanDham Society",
    city: "Surat",
    state: "Gujarat",
    zipcode: "394150",
    country:"India",
    phone: "7778031972",
    category: "Home",
  },
  {
    id:3,
    firstName: "dhruvik",
    lastName: "savaliya",
    flatno:"47",
    societyName: "VrundavanDham Society",
    city: "Surat",
    state: "Gujarat",
    zipcode: "394150",
    country:"India",
    phone: "7778031972",
    category: "Home",
  }

]

export const assets = {
  logo,
  header,
  header2,
  header3,
  header4,
  header5,
  peopleimg,
  pizza1,
  google,
  checkmark,
  close,
  payment,
  trash,
  cashondelivery,
  tracking,
  paymentmethod,
  fooddelivery,
  orderhistory,
  invoice,
  food,
  checkout,
  delivery,
  home,
  office,
  other,
  processing,
  pending,
  plainPaper
}
