
import React from 'react';

const ContactPage: React.FC = () => {

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you for your message! We will get back to you shortly. (This is a demo)");
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="py-16">
      <div className="container mx-auto px-6">
        <div className="text-center">
            <h1 className="text-5xl font-extrabold mb-4">Get In Touch</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Have questions? We'd love to hear from you. Reach out to us, and we'll respond as soon as we can.
            </p>
        </div>
        
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12 bg-gray-50 dark:bg-gray-900 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800">
            {/* Contact Form */}
            <div>
                <h2 className="text-3xl font-bold mb-6">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="sr-only">Name</label>
                        <input type="text" id="name" placeholder="Your Name" required className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-byd-red focus:border-byd-red" />
                    </div>
                    <div>
                        <label htmlFor="email" className="sr-only">Email</label>
                        <input type="email" id="email" placeholder="Your Email" required className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-byd-red focus:border-byd-red" />
                    </div>
                    <div>
                        <label htmlFor="message" className="sr-only">Message</label>
                        <textarea id="message" placeholder="Your Message" rows={5} required className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-byd-red focus:border-byd-red"></textarea>
                    </div>
                    <button type="submit" className="w-full bg-byd-red text-white py-3 px-6 rounded-lg font-semibold hover:bg-byd-red-dark transition-colors duration-300">
                        Submit
                    </button>
                </form>
            </div>
            
            {/* Contact Info & Map */}
            <div className="space-y-6">
                <h2 className="text-3xl font-bold">Contact Information</h2>
                <div className="space-y-4 text-lg text-gray-700 dark:text-gray-300">
                    <div className="flex items-start space-x-4">
                        {/* Fix: Replaced 'class' with 'className' for the ion-icon custom element. */}
                        <ion-icon name="location-outline" className="text-byd-red text-2xl mt-1"></ion-icon>
                        <span>No. 888, BYD Avenue, Xishan District, Wuxi, Jiangsu, China</span>
                    </div>
                     <div className="flex items-center space-x-4">
                        {/* Fix: Replaced 'class' with 'className' for the ion-icon custom element. */}
                        <ion-icon name="call-outline" className="text-byd-red text-2xl"></ion-icon>
                        <span>+86-510-1234-5678</span>
                    </div>
                     <div className="flex items-center space-x-4">
                        {/* Fix: Replaced 'class' with 'className' for the ion-icon custom element. */}
                        <ion-icon name="mail-outline" className="text-byd-red text-2xl"></ion-icon>
                        <a href="mailto:sales@wuxibyd.com" className="hover:text-byd-red hover:underline transition-colors">sales@wuxibyd.com</a>
                    </div>
                </div>
                
                <div className="h-64 rounded-lg overflow-hidden shadow-md">
                   <img src="https://picsum.photos/seed/map/800/400" alt="Map to dealership" className="w-full h-full object-cover"/>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
