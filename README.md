# CattleLens - AI-Powered Cow Breed Recognition

A web-based application that uses machine learning to identify cattle breeds through image recognition. Built with React and TensorFlow.js, integrated with Google Teachable Machine models.

## Features

- **Breed Recognition**: Identify over 36 cattle breeds using three specialized AI models
- **Camera & Upload**: Capture images using device camera or upload from storage
- **Multi-Model Analysis**: Automatically checks all three models for comprehensive results
- **Scan History**: Save and manage your scan history locally in the browser
- **Breed Information**: Access detailed information about identified breeds
- **Mobile Friendly**: Fully responsive design that works on all devices
- **Dark Mode**: Toggle between light and dark themes
- **No Installation**: Works directly in your web browser

## Technology Stack

- **Frontend**: React 19
- **Machine Learning**: TensorFlow.js
- **Models**: Google Teachable Machine (3 specialized models)
- **Routing**: React Router DOM
- **Storage**: LocalStorage & IndexedDB (browser storage)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cattlelens
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
cattlelens/
├── public/                 # Static files
├── src/
│   ├── components/         # React components
│   │   ├── Landing/        # Landing page components
│   │   ├── Scanner/        # Scanner page components
│   │   └── Shared/         # Shared components
│   ├── pages/              # Page components
│   ├── context/            # React Context API
│   ├── utils/              # Utility functions
│   │   └── tensorflowUtils.js  # TensorFlow.js model loading
│   ├── data/               # Data files
│   │   └── breedData.js    # Breed information data
│   ├── App.js              # Main app component
│   └── index.js            # Entry point
├── package.json
└── README.md
```

## Model Integration

The application uses three Google Teachable Machine models:

1. **Model **: Dairy breeds and indigenous varieties
   - URL: `https://teachablemachine.withgoogle.com/models/-DAyHDGxt/`

2. **Model 2**: Commercial and indigenous breeds
   - URL: `https://teachablemachine.withgoogle.com/models/sGHal20G3/`

3. **Model 3**: Indigenous and specialty breeds
   - URL: `https://teachablemachine.withgoogle.com/models/ioUmvwOcg/`

**Note**: Model URLs may need to be updated based on actual Teachable Machine export format. The models might require using the `@teachablemachine/image` library instead of raw TensorFlow.js.

## Usage

1. **Navigate to Scanner**: Click "Start Identifying" or go to `/scan`
2. **Capture or Upload Image**: Use camera capture or upload an image file
3. **View Results**: See predictions from all three models with confidence scores
4. **Access Breed Info**: Click on breed names to view detailed information
5. **View History**: Check your scan history in the History page

## Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers (iOS Safari, Chrome Mobile)

**Requirements**:
- Modern browser with WebRTC support (for camera)
- JavaScript enabled
- HTTPS (required for camera access in production)

## Development

### Available Scripts

- `npm start`: Start development server
- `npm build`: Build for production
- `npm test`: Run tests

### Environment Variables

No environment variables required for basic functionality.

## Future Enhancements

- Backend integration for model updates
- User accounts and cloud sync
- Advanced filtering and search
- Model training feedback loop
- Progressive Web App (PWA) support

## License

This project is licensed under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues or questions:
- Email: support@cattlelens.com
- Feedback: Use the feedback page in the application

## Acknowledgments

- Google Teachable Machine for the ML models
- TensorFlow.js team
- React community
