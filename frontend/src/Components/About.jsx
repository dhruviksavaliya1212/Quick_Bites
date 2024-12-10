import React, { useEffect } from 'react';
import './About.css'; // Ensure this file contains the necessary styles

const teamData = [
  {
    name: "Ridham Savaliya",
    role: "Founder & CEO",
    description: "John is the visionary behind QuickBites, ensuring the best customer experience and innovative services.",
    img: "https://source.unsplash.com/200x200/?person,1",
  },
  {
    name: "Dhruvik Savaliya",
    role: "Head Chef",
    description: "Jane ensures that every dish we deliver is of the highest quality and made with the finest ingredients.",
    img: "https://source.unsplash.com/200x200/?person,2",
  },
  {
    name: "Jenish Galani",
    role: "Marketing Specialist",
    description: "Michael brings QuickBites to the world with creative campaigns and social media strategies.",
    img: "https://source.unsplash.com/200x200/?person,3",
  },
  {
    name: "Milan Panchani",
    role: "Customer Support",
    description: "Sara ensures that all of our customers' needs are met with the utmost care and attention.",
    img: "https://source.unsplash.com/200x200/?person,4",
  },
  {
    name: "Rushik Khothiya",
    role: "Operations Manager",
    description: "Emily oversees day-to-day operations, ensuring smooth service and customer satisfaction.",
    img: "https://source.unsplash.com/200x200/?person,5",
  },
  {
    name: "Dishant Domadiya",
    role: "Finance Director",
    description: "James handles all financial operations, ensuring our business stays on track and profitable.",
    img: "https://source.unsplash.com/200x200/?person,6",
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
      }, 100); // Short delay to ensure the animation triggers
    });

    const pointers = document.querySelectorAll('.pointer');
    pointers.forEach(pointer => {
      pointer.style.left = '0%'; // Start from 0%
      setTimeout(() => {
        pointer.style.left = '100%'; // Animate to 100%
      }, 100); // Short delay to ensure the animation triggers
    });
  }, []);


  return (
    <div className="bg-[#FFF7ED] min-h-screen text-gray-800 p-8 rounded-lg">
      <h1 className="text-4xl text-black text-center mb-6">
        <span className='text-orange-500'>A</span>bout <span className='text-orange-500'>U</span>s
      </h1>
      <p className="text-lg leading-relaxed mb-6">
        Welcome to <b className="underline-animation">QuickBites</b>, where we serve food online. We also serve food at any <b className="underline-animation">Occasion</b>, <b className="underline-animation">Parties</b>, and <b className="underline-animation">Home Service</b>. Our mission is to <b className="underline-animation">provide food online with less effort</b>. We are committed to our loyal <b className="underline-animation">customers</b>.
      </p>

      {/* Our Values Section */}
      <div className="mt-8">
        <h2 className="text-2xl mb-4"><span className='text-orange-500'>O</span>ur <span className='text-orange-500'>V</span>alues</h2>
        <ul className="list-none p-0">
          <li className="bg-orange-500 text-white mb-2 p-4 rounded transition-transform transform hover:scale-105 flex items-center">
            <span className="mr-4">Client Delight</span>
            <div className="flex-grow flex items-center relative">
              <span className="mr-2">0%</span>
              <div className="slider bg-white h-1 flex-grow transition-all duration-2000 ease-in-out relative" style={{ overflow: 'visible' }}>
                <div
                  className="pointer text-green-500 font-bold absolute transition-all duration-2000 ease-in-out"
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
          <li className="bg-orange-500 text-white mb-2 p-4 rounded transition-transform transform hover:scale-105 flex items-center">
            <span className="mr-4">Service</span>
            <div className="flex-grow flex items-center relative">
              <span className="mr-2">0%</span>
              <div className="slider bg-white h-1 flex-grow transition-all duration-2000 ease-in-out relative" style={{ overflow: 'visible' }}>
                <div
                  className="pointer text-green-500 font-bold absolute transition-all duration-2000 ease-in-out"
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
          <li className="bg-orange-500 text-white mb-2 p-4 rounded transition-transform transform hover:scale-105 flex items-center">
            <span className="mr-4">Innovation</span>
            <div className="flex-grow flex items-center relative">
              <span className="mr-2">0%</span>
              <div className="slider bg-white h-1 flex-grow transition-all duration-2000 ease-in-out relative" style={{ overflow: 'visible' }}>
                <div
                  className="pointer text-green-500 font-bold absolute transition-all duration-2000 ease-in-out"
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
          <li className="bg-orange-500 text-white mb-2 p-4 rounded transition-transform transform hover:scale-105 flex items-center">
            <span className="mr-4">Quality</span>
            <div className="flex-grow flex items-center relative">
              <span className="mr-2">0%</span>
              <div className="slider bg-white h-1 flex-grow transition-all duration-2000 ease-in-out relative" style={{ overflow: 'visible' }}>
                <div
                  className="pointer text-green-500 font-bold absolute transition-all duration-2000 ease-in-out"
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
        </ul>
      </div>

      {/* Meet Our Team Section */}
      <div className="mt-8 mb-20">
        <h2 className="text-2xl mb-4 text-center text-[#FF7A00]">M<span className='text-[#000000]'>eet</span> O<span className='text-[#000000]'>ur</span> T<span className='text-[#000000]'>eam</span></h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {teamData.map((member, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-orange-500 hover:text-white"
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

          {/* our vision section */}
          <div class="max-w-7xl mx-auto text-center">
        {/* <!-- Title Section --> */}
          

        {/* <!-- Vision Content (Icon + Text) --> */}
    <div class="max-w-7xl mx-auto text-center">
        {/* <!-- Title Section --> */}
        <h2 class="text-3xl  text-black mb-6 transform transition-transform duration-500 hover:scale-105">
        <span className='text-orange-500'>O</span>ur <span className='text-orange-500'>V</span>ision
        </h2>
        <p class="text-lg text-black mb-12 max-w-3xl mx-auto opacity-80">
            At <b>QuickBites</b>, we envision revolutionizing the way people experience food. By bringing together the best local eateries and a seamless, user-friendly online platform, we strive to deliver delicious meals to your doorstep in the quickest, most convenient, and innovative way possible.
        </p>

        {/* <!-- Vision Content (Icon + Text) --> */}
     <div className="flex flex-wrap justify-center gap-12">
  {/* Vision Item 1 */}
  <div className="bg-white rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:bg-orange-500 hover:text-white max-w-xs w-full group">
    <div className="mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-orange-500 mx-auto transition-all duration-300 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
      </svg>
    </div>
    <h3 className="text-2xl font-semibold text-black mb-4 group-hover:text-white">Convenience at Your Doorstep</h3>
    <p className="text-black opacity-75 group-hover:text-white">
      We bring the best of your city’s food to your home, making it easy to enjoy your favorites anytime, anywhere.
    </p>
  </div>

  {/* Vision Item 2 */}
  <div className="bg-white rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:bg-orange-500 hover:text-white max-w-xs w-full group">
    <div className="mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-orange-500 mx-auto transition-all duration-300 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
      </svg>
    </div>
    <h3 className="text-2xl font-semibold text-black mb-4 group-hover:text-white">Streamlined Ordering</h3>
    <p className="text-black opacity-75 group-hover:text-white">
      Our easy-to-use platform ensures a smooth, seamless experience from browsing to ordering, with no hassle at all.
    </p>
  </div>

  {/* Vision Item 3 */}
  <div className="bg-white rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:bg-orange-500 hover:text-white max-w-xs w-full group">
    <div className="mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-orange-500 mx-auto transition-all duration-300 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2v20m10-10H2"></path>
      </svg>
    </div>
    <h3 className="text-2xl font-semibold text-black mb-4 group-hover:text-white">Empowering Local Restaurants</h3>
    <p className="text-black opacity-75 group-hover:text-white">
      By partnering with local restaurants, we aim to promote and support the culinary businesses in your community.
    </p>
  </div>
</div>
    </div>

    </div>
    </div>
  );
};

export default About;
