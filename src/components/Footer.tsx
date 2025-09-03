export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Event Details</h3>
            <p className="text-gray-300">
              September 27th, 2024<br />
              5:00 PM - 10:00 PM<br />
              Pickleball HQ, NJ
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Partners</h3>
            <p className="text-gray-300">
              American Cancer Society<br />
              Prostate Cancer Awareness
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-gray-300">
              Questions? Contact Mark Dawod<br />
              <a href="mailto:markrdawod@gmail.com" className="text-green-300 hover:text-white transition-colors">
                markrdawod@gmail.com
              </a>
            </p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Pickleball for Prostate Cancer Awareness</p>
        </div>
      </div>
    </footer>
  );
}