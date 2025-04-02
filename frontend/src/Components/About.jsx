import React, { useEffect,useRef } from 'react';
import './About.css'; // Ensure this file contains the necessary styles
import ridham from "../assets/members/ridham.jpg"
import milan from "../assets/members/milan.png"
import dhruvik from "../assets/members/dhruvik.png"
import jenish from "../assets/members/jenish.png"
import dishant from "../assets/members/dishant.png"
import rushik  from "../assets/members/rushik.png"

const teamData = [
  {
    name: "Ridham Savaliya",
    role: "Full stack developer",
    description: "John is the visionary behind QuickBites, ensuring the best customer experience and innovative services.",
    img: `${ridham}`,
  },
  {
    name: "Dhruvik Savaliya",
   role: "Full stack developer",
    description: "Jane ensures that every dish we deliver is of the highest quality and made with the finest ingredients.",
    img: `${dhruvik}`,
  },
  {
    name: "Jenish Galani",
    role: "UI/UX Designer",
    description: "Michael brings QuickBites to the world with creative campaigns and social media strategies.",
    img: `${jenish}`,
  },
  {
    name: "Milan Panchani",
    role: "UI/UX Designer",
    description: "Sara ensures that all of our customers' needs are met with the utmost care and attention.",
    img: `${milan}`,
  },
  {
    name: "Rushik Khothiya",
    role: "UI/UX Designer",
    description: "Emily oversees day-to-day operations, ensuring smooth service and customer satisfaction.",
    img: `${rushik}`,
  },
  {
    name: "Dishant Domadiya",
    role: "Brand Designer",
    description: "James handles all financial operations, ensuring our business stays on track and profitable.",
    img: `${dishant}`,
  },
];


const About = () => {
  useEffect(() => {
    // Trigger underline animation on component mount
    const underlineElements = document.querySelectorAll('.underline-animation');
    underlineElements.forEach(element => {
      element.classList.add('active'); // This will trigger the underline effect
    });

    // Slider animation on page load
    const sliders = document.querySelectorAll('.slider');
    sliders.forEach(slider => {
      slider.style.width = '0%'; // Start from 0%
      setTimeout(() => {
        slider.style.width = '100%'; // Animate to 100%
      }, 500); // Short delay to ensure the animation triggers
    });

    const pointers = document.querySelectorAll('.pointer');
    pointers.forEach(pointer => {
      pointer.style.left = '0%'; // Start from 0%
      setTimeout(() => {
        pointer.style.left = '100%'; // Animate to 100%
      }, 500); // Short delay to ensure the animation triggers
    });
  }, []);

  // Our Values Section with Animation
  const values = [
    { label: "Client Delight", side: "left" },
    { label: "Service", side: "right" },
    { label: "Innovation", side: "left" },
    { label: "Quality", side: "right" },
  ];

  useEffect(() => {
    const items = document.querySelectorAll('.value-item');

    // Create an intersection observer to trigger animation
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Add 'visible' class when the item enters the viewport
          entry.target.classList.add('opacity-100', 'transition-transform', 'duration-1000');
          entry.target.classList.add(entry.target.getAttribute('data-side') === 'left' ? 'animate-slide-left' : 'animate-slide-right');
        }
      });
    }, { threshold: 0.5 });

    items.forEach(item => observer.observe(item));

    return () => {
      observer.disconnect();
    };
  }, []);


  // animating the meet our team section
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll('.team-card');
            cards.forEach((card, index) => {
              card.style.animationDelay = `${index * 0.2}s`;
              card.classList.add(
                index < 3 ? 'animate-slide-right' : 'animate-slide-left'
              );
              card.classList.remove('opacity-0');
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);


// animating the our vision section

useEffect(() => {
  const cards = document.querySelectorAll('.vision-card');

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-slide-up', 'opacity-100');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  cards.forEach((card) => observer.observe(card));

  return () => observer.disconnect();
}, []);

  return (
    <div className="bg-[#FFF7ED] min-h-screen text-gray-800 p-8 rounded-lg pt-24">
      <h1 className="text-4xl text-black text-center mb-6">
        <span className="text-orange-500">A</span>bout <span className="text-orange-500">U</span>s
      </h1>
      <p className="text-lg leading-relaxed mb-6">
        Welcome to <b className="underline-animation">QuickBites</b>, where we serve food online. We also serve food at any <b className="underline-animation">Occasion</b>, <b className="underline-animation">Parties</b>, and <b className="underline-animation">Home Service</b>. Our mission is to <b className="underline-animation">provide food online with less effort</b>. We are committed to our loyal <b className="underline-animation">customers</b>.
      </p>

      {/* Our Values Section */}
      <div className="mt-8">
        <h2 className="text-2xl mb-4">
          <span className="text-orange-500">O</span>ur <span className="text-orange-500">V</span>alues
        </h2>
        <ul className="list-none p-0">
          {values.map((value, index) => (
            <li
              key={index}
              data-side={value.side}
              className="value-item opacity-0 transform transition-all mb-4 p-4 rounded-lg flex items-center bg-orange-500 text-white"
            >
              <span className="mr-4">{value.label}</span>
              <div className="flex-grow flex items-center relative">
                <span className="mr-2">0%</span>
                <div className="slider bg-white h-1 flex-grow transition-all duration-700 ease-in-out relative" style={{ overflow: 'visible' }}>
                  <div
                    className="pointer text-green-500 font-extrabold absolute transition-all duration-700 ease-out"
                    style={{
                      fontSize: '1.5rem',
                      top: '-1.0rem',
                      left: '0%',
                      transform: 'translate(-50%, 0)',
                    }}
                  >
                    ✓
                  </div>
                </div>
                <span className="ml-2">100%</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Meet Our Team Section */}
      <div className="mt-8 mb-20" ref={sectionRef}>
      <h2 className="text-2xl mb-4 text-center text-[#FF7A00]">
        M<span className="text-[#000000]">eet</span> O<span className="text-[#000000]">ur</span> T<span className="text-[#000000]">eam</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8 ">
        {teamData.map((member, index) => (
          <div
            key={index}
            className="team-card hover:bg-orange-500 hover:text-white bg-white p-6 rounded-xl shadow-md opacity-0 transform transition-all duration-1000"
          >
            <img
              src={member.img}
              alt={member.name}
              className="w-40 h-40 object-cover rounded-full mx-auto mb-4 border-4 border-[#FF7A00]"
            />
            <h3 className="text-xl font-semibold mb-2 text-center">{member.name}</h3>
            <p className="text-lg font-medium mb-2 text-center">{member.role}</p>
            <p className="text-sm text-center">{member.description}</p>
          </div>
        ))}
      </div>
    </div>

      {/* Our Vision Section */}
      <div className="max-w-7xl mx-auto text-center mt-20">
      <h2 className="text-3xl text-black mb-6 transform transition-transform duration-500 hover:scale-105">
        <span className="text-orange-500">O</span>ur <span className="text-orange-500">V</span>ision
      </h2>
      <p className="text-lg text-black mb-12 max-w-3xl mx-auto opacity-80">
        At <b>QuickBites</b>, we envision revolutionizing the way people experience food. By bringing together the best local eateries and a seamless, user-friendly online platform, we strive to deliver delicious meals to your doorstep in the quickest, most convenient, and innovative way possible.
      </p>

      <div className="flex flex-wrap justify-center gap-12">
        {/* Card 1 */}
        <div className="vision-card bg-white rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:bg-orange-500 hover:text-white max-w-xs w-full group opacity-0">
          <div className="mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-orange-500 mx-auto transition-all duration-300 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h11M9 21V3" />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold mb-2">Innovative Technology</h3>
          <p className="text-lg">Leveraging cutting-edge technology to deliver an unparalleled food delivery experience.</p>
        </div>

        {/* Card 2 */}
        <div className="vision-card bg-white rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:bg-orange-500 hover:text-white max-w-xs w-full group opacity-0">
          <div className="mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-orange-500 mx-auto transition-all duration-300 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c3.866 0 7 3.134 7 7m-7-7c-3.866 0-7 3.134-7 7m14 0a7 7 0 11-14 0" />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold mb-2">Customer Focused</h3>
          <p className="text-lg">Ensuring that each customer receives the best service with every order.</p>
        </div>

        {/* Card 3 */}
        <div className="vision-card bg-white rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:bg-orange-500 hover:text-white max-w-xs w-full group opacity-0">
          <div className="mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-orange-500 mx-auto transition-all duration-300 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-3-3v6m13 1a4 4 0 11-8 0" />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold mb-2">Eco-Friendly Packaging</h3>
          <p className="text-lg">Committed to using sustainable packaging to protect the environment.</p>
        </div>

        {/* Card 4 (New Card) */}
        <div className="vision-card bg-white rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:bg-orange-500 hover:text-white max-w-xs w-full group opacity-0">
          <div className="mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-orange-500 mx-auto transition-all duration-300 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0v5l9-5-9 5z" />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold mb-2">Global Reach</h3>
          <p className="text-lg">Expanding our services to connect with food lovers around the world.</p>
        </div>
      </div>
    </div>

    </div>
  );
};

export default About;
