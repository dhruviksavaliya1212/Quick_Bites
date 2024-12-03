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
import menu from '../assets/menu.png'
import support from '../assets/support.png'
import peopleimg from '../assets/people.jpeg'
import pizza1 from '../assets/pizza1.png'
import burger from '../assets/burger.png'
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

export const qualities = [
  {
    id:1,
    img:quality,
    title: "Quality Food",
    desc: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Libero, non!"
  },
  {
    id:2,
    img:delivery,
    title: "Fast Delivery",
    desc: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Libero, non!"
  },
  {
    id:3,
    img:pay,
    title: "Online payment",
    desc: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Libero, non!"
  },
  {
    id:1,
    img:checkout,
    title: "Check Out",
    desc: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Libero, non!"
  }
]

export const people = [
  {
    id:1,
    img:reliable,
    title: "Convenient And Reliable",
    desc:"Lorem ipsum dolor sit, amet consectetur adipisicing elit. Libero, non!"
  },
  {
    id:2,
    img:menu,
    title: "Variety of Options",
    desc:"Lorem ipsum dolor sit, amet consectetur adipisicing elit. Libero, non!"
  },
  {
    id:3,
    img:support,
    title: "Excellent Customer Support",
    desc:"Lorem ipsum dolor sit, amet consectetur adipisicing elit. Libero, non!"
  }
]

export const bestSeller = [
  {
    id:1,
    img:pizza1,
    name:"Veg Spice Fusion Pizza",
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
    oldPrice:"179",
    newPrice:"149",
    rating:"4.4",
    ratingCount:"175",
    desc:"Serves 1 | Crisp Kachori, filled with potatoes, moong dal, yogurt, dahi vada spices and chutneys. A Royal Treat|serves1|",
    bestSeller:true,
    category:"kachori"
  },
  {
    id:1,
    img:pizza1,
    name:"Veg Spice Fusion Pizza",
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

export const assets = {
  logo,
  header,
  header2,
  header3,
  header4,
  header5,
  peopleimg,
  pizza1
}
