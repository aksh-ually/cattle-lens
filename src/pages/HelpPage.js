import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './HelpPage.css';

const HelpPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('getting-started');
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (id) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const categories = {
    'getting-started': {
      title: 'Getting Started',
      items: [
        {
          id: 'how-it-works',
          question: 'How does cow breed recognition work?',
          answer: 'CattleLens uses a advanced deep learning model trained on thousands of cattle images. When you upload an image, our AI analyzes it to identify the breed with high accuracy.',
        },
        {
          id: 'which-breeds',
          question: 'Which breeds can the app identify?',
          answer: 'The app can identify over 36 cattle breeds including Holstein Friesian, Jersey, Gir, Sahiwal, and many more indigenous and commercial breeds. Check the model showcase section on the home page for the complete list.',
        },
        {
          id: 'need-account',
          question: 'Do I need to create an account?',
          answer: 'No account is required! CattleLens works as a guest application. Your scan history is stored locally on your device using browser storage.',
        },
        {
          id: 'is-free',
          question: 'Is this free to use?',
          answer: 'Yes, CattleLens is completely free to use with no hidden costs or subscriptions.',
        },
      ],
    },
    'using-app': {
      title: 'Using the App',
      items: [
        {
          id: 'capture-good-image',
          question: 'How do I capture a good image?',
          answer: 'For best results: Use good lighting, ensure the cow is in focus, try to capture a side view showing the full body, keep the camera steady, and avoid shadows or extreme angles.',
        },
        {
          id: 'which-model',
          question: 'Which model should I choose?',
          answer: 'The app automatically checks all three models for each image. Each model specializes in different breeds, so you get comprehensive results from all models combined.',
        },
        {
          id: 'confidence-scores',
          question: 'What do the confidence scores mean?',
          answer: 'Confidence scores indicate how certain the model is about the prediction: >80% = High confidence, 60-80% = Moderate confidence, <60% = Low confidence. For best results, aim for high confidence predictions.',
        },
        {
          id: 'google-images',
          question: 'Can I use images from Google?',
          answer: 'Yes, you can upload images from anywhere, but for best results, use clear, well-lit images of real cattle. Copyright restrictions may apply to some images.',
        },
      ],
    },
    'troubleshooting': {
      title: 'Troubleshooting',
      items: [
        {
          id: 'model-wont-load',
          question: 'The model won\'t load',
          answer: 'Check your internet connection, clear your browser cache, try a different browser, or wait a few minutes and try again. The models need to be downloaded on first use.',
        },
        {
          id: 'camera-not-working',
          question: 'Camera not working',
          answer: 'Check browser permissions, ensure you\'re using HTTPS (required for camera access), try a different browser, or use the upload feature instead.',
        },
        {
          id: 'prediction-wrong',
          question: 'Prediction seems wrong',
          answer: 'Try a clearer, better-lit image. Crossbreeds may show lower confidence. Use multiple images if possible. Report errors through the feedback page to help improve the models.',
        },
        {
          id: 'app-slow',
          question: 'App is slow or crashes',
          answer: 'Close other browser tabs, clear browser cache, ensure you have a stable internet connection, or try using a different browser. The app requires modern browser capabilities.',
        },
      ],
    },
  };

  const filteredItems = (category) => {
    const items = categories[category]?.items || [];
    if (!searchQuery) return items;
    return items.filter(item =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div className="help-page">
      <div className="container">
        <h1 className="help-title">Help & FAQ</h1>

        <div className="help-search">
          <input
            type="text"
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="help-categories">
          {Object.keys(categories).map((categoryKey) => (
            <button
              key={categoryKey}
              className={`category-tab ${activeCategory === categoryKey ? 'active' : ''}`}
              onClick={() => setActiveCategory(categoryKey)}
            >
              {categories[categoryKey].title}
            </button>
          ))}
        </div>

        <div className="faq-section">
          <h2 className="faq-category-title">
            {categories[activeCategory]?.title}
          </h2>
          <div className="faq-list">
            {filteredItems(activeCategory).map((item) => (
              <div key={item.id} className="faq-item">
                <button
                  className={`faq-question ${openItems[item.id] ? 'open' : ''}`}
                  onClick={() => toggleItem(item.id)}
                >
                  <span>{item.question}</span>
                  <span className="faq-icon">{openItems[item.id] ? '−' : '+'}</span>
                </button>
                {openItems[item.id] && (
                  <div className="faq-answer">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="help-contact">
          <h2>Still need help?</h2>
          <p>Contact us for additional support</p>
          <div className="contact-actions">
            <a href="mailto:support@cattlelens.com" className="btn btn-primary">
              Email Support
            </a>
            <Link to="/feedback" className="btn btn-outline">
              Submit Feedback
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;

